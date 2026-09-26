const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'presentation_assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching Puppeteer to capture presentation screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1600, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Capture SCADA Auth Modal
    console.log('1. Capturing SCADA Auth Modal...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_scada_auth_modal.png') });

    // Click Authorize Role for Priya
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Authorize Role'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 2200));

    // 2. Capture Fleet Command Center with WT-04 Alert Active
    console.log('2. Capturing Fleet Command Center with Active Anomaly...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, '02_fleet_command_center.png') });

    // 3. Capture Demo Tools Dropdown with Glassmorphic frame
    console.log('3. Capturing Demo Tools Glassmorphic Dropdown...');
    await page.evaluate(() => {
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Demo Tools'));
      if (demoBtn) demoBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '03_demo_tools_dropdown.png') });

    // Close Demo Tools
    await page.evaluate(() => {
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Demo Tools'));
      if (demoBtn) demoBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // 4. Open Asset Detail Drawer for WT-04
    console.log('4. Capturing WT-04 Asset Detail Drawer & Vibration FFT...');
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('[role="button"]')).find(c => c.textContent && c.textContent.includes('WT-04'));
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_asset_detail_telemetry.png') });

    // 5. Open Predictive Forecast ("Crystal Ball")
    console.log('5. Capturing Predictive Forecast Tab...');
    await page.evaluate(() => {
      const tab = Array.from(document.querySelectorAll('aside button')).find(b => b.textContent && b.textContent.includes('Predictive Forecast'));
      if (tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_predictive_forecast_crystal_ball.png') });

    // Close Drawer
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));

    // 6. Navigate to What-If Simulator
    console.log('6. Capturing What-If Simulator View...');
    await page.evaluate(() => {
      const navBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('What-If Simulator'));
      if (navBtn) navBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_what_if_simulator.png') });

    // 7. Navigate to Maintenance Queue / Kanban
    console.log('7. Capturing Maintenance Queue...');
    await page.evaluate(() => {
      const navBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('Maintenance'));
      if (navBtn) navBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_autonomous_maintenance_queue.png') });

    // 8. Navigate to Executive Reports & Insights
    console.log('8. Capturing Executive Reporting View...');
    await page.evaluate(() => {
      const navBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('Reports'));
      if (navBtn) navBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_executive_reporting_insights.png') });

    // 9. Reset Fleet Healthy & Capture Baseline
    console.log('9. Capturing Healthy Baseline Fleet Overview...');
    await page.evaluate(() => {
      const navBtn = Array.from(document.querySelectorAll('nav button')).find(b => b.textContent && b.textContent.includes('Fleet Overview'));
      if (navBtn) navBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Demo Tools'));
      if (demoBtn) demoBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Reset Fleet Healthy'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_fleet_overview_healthy.png') });

    console.log('All presentation screenshots captured successfully in:', OUTPUT_DIR);
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();


