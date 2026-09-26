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

    // Click on WT-01 (Healthy asset)
    const wt01Card = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('[role="button"]'));
      return cards.find(c => c.textContent && c.textContent.includes('WT-01'));
    });
    if (wt01Card) {
      await wt01Card.click();
      await new Promise(r => setTimeout(r, 800));
      const path1 = path.join(ARTIFACT_DIR, 'slide_out_drawer_healthy.png');
      await page.screenshot({ path: path1 });
      console.log('Saved:', path1);
    }
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

run();
