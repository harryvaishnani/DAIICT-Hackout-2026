const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\8f711fb8-d06d-45e3-b409-21f775b2d8b3';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Test port 5174 or 5173
  let targetUrl = 'http://localhost:5174';
  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 5000 });
  } catch {
    targetUrl = 'http://localhost:5173';
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 5000 });
  }
  console.log(`Connected to ${targetUrl}`);

  // Clear stale localStorage so fresh Gujarat fleet & tickets load cleanly
  await page.evaluate(() => {
    localStorage.removeItem('pm_assets_state');
    localStorage.removeItem('pm_work_orders');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Capture Fleet Overview with Gujarat assets
  console.log('1. Capturing Gujarat Fleet Overview...');
  const pathFleet = path.join(ARTIFACTS_DIR, 'gujarat_fleet_overview.png');
  await page.screenshot({ path: pathFleet });
  console.log('Saved:', pathFleet);

  // 2. Navigate to Maintenance Queue (Kanban Board)
  console.log('2. Navigating to Maintenance Queue Kanban...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('nav button'));
    const queueTab = tabs.find(b => b.textContent.includes('Maintenance Queue') || b.textContent.includes('Queue'));
    if (queueTab) queueTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture Kanban with 24h retention notice and countdown
  console.log('Capturing Kanban with 24h Retention...');
  const pathKanban24 = path.join(ARTIFACTS_DIR, 'kanban_24h_retention.png');
  await page.screenshot({ path: pathKanban24 });
  console.log('Saved:', pathKanban24);

  // 3. Click "Simulate +24h" in the Resolved & Restored column
  console.log('3. Clicking Simulate +24h Fast-Forward to trigger auto-purge...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const fastForwardBtn = buttons.find(b => b.textContent.includes('Simulate +24h'));
    if (fastForwardBtn) fastForwardBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture Kanban after auto-removal
  console.log('Capturing Kanban after 24h auto-purge...');
  const pathKanbanPurged = path.join(ARTIFACTS_DIR, 'kanban_after_24h_purge.png');
  await page.screenshot({ path: pathKanbanPurged });
  console.log('Saved:', pathKanbanPurged);

  // 4. Open Supabase Gujarat SQL modal
  console.log('4. Opening Supabase Gujarat SQL Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const supabaseBtn = buttons.find(b => b.textContent.includes('Supabase SQL') || b.title?.includes('Supabase'));
    if (supabaseBtn) supabaseBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Capture Supabase Gujarat SQL Modal
  console.log('Capturing Supabase Gujarat SQL Modal...');
  const pathModal = path.join(ARTIFACTS_DIR, 'supabase_gujarat_sql_modal.png');
  await page.screenshot({ path: pathModal });
  console.log('Saved:', pathModal);

  await browser.close();
  console.log('All verification screenshots captured successfully!');
}

run().catch(err => {
  console.error('Puppeteer verification failed:', err);
  process.exit(1);
});
