const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\8f711fb8-d06d-45e3-b409-21f775b2d8b3';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1500, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Open Demo Tools and click Reset Fleet Healthy
    console.log('Resetting fleet to all healthy...');
    const demoBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Demo Tools'));
    });
    if (demoBtn) {
      await demoBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const resetBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Reset Fleet Healthy'));
      });
      if (resetBtn) {
        await resetBtn.click();
        await new Promise(r => setTimeout(r, 800));
        const path1 = path.join(ARTIFACT_DIR, 'fleet_all_healthy.png');
        await page.screenshot({ path: path1 });
        console.log('Saved:', path1);
      }
    }

    // 2. Open Demo Tools and simulate bearing fault on WT-04
    console.log('Simulating bearing fault on WT-04...');
    const demoBtn2 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Demo Tools'));
    });
    if (demoBtn2) {
      await demoBtn2.click();
      await new Promise(r => setTimeout(r, 400));
      const faultBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Bearing Fault'));
      });
      if (faultBtn) {
        await faultBtn.click();
        await new Promise(r => setTimeout(r, 800));
        const path2 = path.join(ARTIFACT_DIR, 'fleet_fault_simulated.png');
        await page.screenshot({ path: path2 });
        console.log('Saved:', path2);
      }
    }

    console.log('Interactive lifecycle test completed successfully!');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

run();
