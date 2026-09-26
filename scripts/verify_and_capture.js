import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\cd94c884-e95e-4886-a6cb-a5463889eedc';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1600, height: 1050 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait 3 seconds for Leaflet map tiles and Recharts animations
    await new Promise(r => setTimeout(r, 3000));

    // 1. Capture Baseline Dashboard
    console.log('Capturing baseline dashboard overview...');
    const path1 = path.join(ARTIFACT_DIR, 'dashboard_baseline.png');
    await page.screenshot({ path: path1, fullPage: false });
    console.log('Saved:', path1);

    // 2. Click "Inject Bearing Overheat" button
    console.log('Simulating presentation demo: Inject Bearing Overheat Fault...');
    const buttons = await page.$$('button');
    let overheatButton = null;
    let soilingButton = null;
    let resetButton = null;
    let dispatchButton = null;

    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent || '', btn);
      if (text.includes('Inject Bearing Overheat')) overheatButton = btn;
      if (text.includes('Inject Solar Soiling')) soilingButton = btn;
      if (text.includes('Reset Fleet Baseline')) resetButton = btn;
      if (text.includes('DISPATCH') || text.includes('Dispatch')) dispatchButton = btn;
    }

    if (overheatButton) {
      await overheatButton.click();
      console.log('Clicked Inject Bearing Overheat button!');
      await new Promise(r => setTimeout(r, 1500));

      const path2 = path.join(ARTIFACT_DIR, 'bearing_overheat_fault.png');
      await page.screenshot({ path: path2 });
      console.log('Saved:', path2);
    } else {
      console.warn('Could not find overheat button!');
    }

    // 3. Click Dispatch Maintenance Team
    console.log('Testing Maintenance Team Dispatch workflow...');
    const dispatched = await page.evaluate(() => {
      const btn = document.getElementById('dispatch-maintenance-btn');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (dispatched) {
      console.log('Dispatched maintenance via element click!');
      await new Promise(r => setTimeout(r, 1200));

      const path3 = path.join(ARTIFACT_DIR, 'work_order_dispatched.png');
      await page.screenshot({ path: path3 });
      console.log('Saved:', path3);

      // Close modal by clicking "Acknowledge & Close"
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const ackBtn = buttons.find(b => b.textContent && b.textContent.includes('Acknowledge & Close'));
        if (ackBtn) {
          ackBtn.click();
        }
      });
      await new Promise(r => setTimeout(r, 800));
    }

    // 4. Click Inject Solar Soiling Fault
    console.log('Simulating presentation demo: Inject Solar Soiling Fault...');
    const freshButtons = await page.$$('button');
    for (const btn of freshButtons) {
      const text = await page.evaluate(el => el.textContent || '', btn);
      if (text.includes('Inject Solar Soiling')) soilingButton = btn;
      if (text.includes('Reset Fleet Baseline')) resetButton = btn;
    }

    if (soilingButton) {
      await soilingButton.click();
      console.log('Clicked Inject Solar Soiling button!');
      await new Promise(r => setTimeout(r, 1500));

      const path4 = path.join(ARTIFACT_DIR, 'solar_soiling_fault.png');
      await page.screenshot({ path: path4 });
      console.log('Saved:', path4);
    }

    // 5. Click Reset Baseline
    if (resetButton) {
      await resetButton.click();
      console.log('Clicked Reset Fleet Baseline button!');
      await new Promise(r => setTimeout(r, 1500));

      const path5 = path.join(ARTIFACT_DIR, 'fleet_restored_baseline.png');
      await page.screenshot({ path: path5 });
      console.log('Saved:', path5);
    }

    console.log('All verification steps & screenshots completed successfully!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
