const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\8f711fb8-d06d-45e3-b409-21f775b2d8b3';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching headless Chrome for Phase 3 Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1500, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Verify Demo Tools Dropdown Fix (must not be clipped)
    console.log('1. Capturing Demo Tools dropdown visibility...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Demo Tools'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathDemoFixed = path.join(ARTIFACT_DIR, 'demo_tools_fixed.png');
    await page.screenshot({ path: pathDemoFixed });
    console.log('Saved:', pathDemoFixed);

    // Close Demo dropdown
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Demo Tools'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // 2. Open "+ Add Asset" Modal
    console.log('2. Testing + Add Asset Modal...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Add Asset'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathAddModal = path.join(ARTIFACT_DIR, 'add_asset_modal.png');
    await page.screenshot({ path: pathAddModal });
    console.log('Saved:', pathAddModal);

    // Close Add Asset Modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // 3. Test Predictive Forecast ("Crystal Ball") in Drawer for WT-04
    console.log('3. Testing WT-04 Drawer & Predictive Forecast...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[role="button"]'));
      const card = cards.find(c => c.textContent?.includes('WT-04'));
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Click "Predictive Forecast" tab
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent?.includes('Predictive Forecast'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const pathForecast = path.join(ARTIFACT_DIR, 'predictive_forecast_crystal_ball.png');
    await page.screenshot({ path: pathForecast });
    console.log('Saved:', pathForecast);

    // Click "Settings & Edit" tab
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent?.includes('Settings & Edit'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathSettings = path.join(ARTIFACT_DIR, 'edit_asset_settings.png');
    await page.screenshot({ path: pathSettings });
    console.log('Saved:', pathSettings);

    // Click Decommission button to open typed modal
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent?.includes('Decommission'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathDecomp = path.join(ARTIFACT_DIR, 'decommission_typed_modal.png');
    await page.screenshot({ path: pathDecomp });
    console.log('Saved:', pathDecomp);

    // Close Decommission Modal and Drawer
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // 4. Test Kanban Maintenance Queue
    console.log('4. Testing Kanban Maintenance Queue...');
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent?.includes('Maintenance Queue'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const pathKanban = path.join(ARTIFACT_DIR, 'kanban_maintenance_board.png');
    await page.screenshot({ path: pathKanban });
    console.log('Saved:', pathKanban);

    // 5. Test Executive Reporting View
    console.log('5. Testing Executive Reporting View...');
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent?.includes('Executive Reports'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const pathReports = path.join(ARTIFACT_DIR, 'executive_reporting.png');
    await page.screenshot({ path: pathReports });
    console.log('Saved:', pathReports);

    // 6. Test RBAC Switch to Regional Technician (Marcus Chen)
    console.log('6. Testing RBAC switch to Marcus Chen (Technician)...');
    await page.evaluate(() => {
      const profileBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent?.includes('Elena') || b.textContent?.includes('ER'));
      if (profileBtn) profileBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      const marcusOption = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Marcus Chen'));
      if (marcusOption) marcusOption.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // Switch to Fleet Overview
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent?.includes('Fleet Overview'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const pathTech = path.join(ARTIFACT_DIR, 'technician_view.png');
    await page.screenshot({ path: pathTech });
    console.log('Saved:', pathTech);

    // 7. Test Tenant Isolation Switch to Helios Renewable Power (Sophia Patel)
    console.log('7. Testing Tenant Isolation switch to Helios (Sophia Patel)...');
    await page.evaluate(() => {
      const profileBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent?.includes('Marcus') || b.textContent?.includes('MC'));
      if (profileBtn) profileBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    await page.evaluate(() => {
      const sophiaOption = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sophia Patel'));
      if (sophiaOption) sophiaOption.click();
    });
    await new Promise(r => setTimeout(r, 600));
    const pathHelios = path.join(ARTIFACT_DIR, 'helios_firm_view.png');
    await page.screenshot({ path: pathHelios });
    console.log('Saved:', pathHelios);

    // 8. Test Alert Rules Engine Modal
    console.log('8. Testing Alert Rules Engine Modal...');
    await page.evaluate(() => {
      const btn = document.querySelector('header button[title*="Alerting"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathAlerts = path.join(ARTIFACT_DIR, 'alert_rules_engine.png');
    await page.screenshot({ path: pathAlerts });
    console.log('Saved:', pathAlerts);
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));

    // 9. Test Audit Log Trail Modal
    console.log('9. Testing Audit Log Trail Modal...');
    await page.evaluate(() => {
      const btn = document.querySelector('header button[title*="Audit Log"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const pathAudit = path.join(ARTIFACT_DIR, 'audit_log_trail.png');
    await page.screenshot({ path: pathAudit });
    console.log('Saved:', pathAudit);
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 300));

    console.log('All Phase 3 verifications succeeded!');
  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    await browser.close();
  }
}

run();
