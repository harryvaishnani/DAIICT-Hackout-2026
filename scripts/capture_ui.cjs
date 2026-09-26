const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\8f711fb8-d06d-45e3-b409-21f775b2d8b3';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching headless Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1500, height: 950 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    console.log('Navigating to http://localhost:5174...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // 1. Capture Decluttered Fleet Grid View
    console.log('Capturing Decluttered Fleet Grid View...');
    const path1 = path.join(ARTIFACT_DIR, 'fleet_grid_decluttered.png');
    await page.screenshot({ path: path1 });
    console.log('Saved:', path1);

    // 2. Open Demo Tools Dropdown
    console.log('Opening Demo Tools dropdown...');
    const demoBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Demo Tools'));
    });
    if (demoBtn) {
      await demoBtn.click();
      await new Promise(r => setTimeout(r, 600));
      const path2 = path.join(ARTIFACT_DIR, 'demo_tools_dropdown.png');
      await page.screenshot({ path: path2 });
      console.log('Saved:', path2);
    }

    // 3. Click on WT-04 card to open Slide-Out Drawer
    console.log('Clicking on WT-04 card to open Slide-Out Drawer...');
    const wt04Card = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('[role="button"]'));
      return cards.find(c => c.textContent && c.textContent.includes('WT-04'));
    });
    if (wt04Card) {
      await wt04Card.click();
      await new Promise(r => setTimeout(r, 1000));
      const path3 = path.join(ARTIFACT_DIR, 'slide_out_drawer.png');
      await page.screenshot({ path: path3 });
      console.log('Saved:', path3);
    } else {
      console.warn('WT-04 card not found');
    }

    console.log('Verification capture complete!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
