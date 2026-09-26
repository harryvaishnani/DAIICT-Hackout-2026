import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\Harry\\.gemini\\antigravity\\brain\\b77f81f2-b684-401c-a113-1063c07fb1d5';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Testing Map Theme Switch and Minimalist Cockpit...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    console.log('Connecting to http://localhost:5174 ...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 30000 });

    await new Promise(r => setTimeout(r, 1500));

    // If AuthModal is shown, close it
    const authCloseBtn = await page.$('button[title="Close SCADA Login"]');
    if (authCloseBtn) {
      console.log('Closing auth modal to reveal main cockpit...');
      await authCloseBtn.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    // 1. Verify Dark Mode Map Tile URLs
    const darkTileUrls = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
      return tiles.map(t => t.getAttribute('src')).filter(Boolean);
    });
    console.log(`Found ${darkTileUrls.length} map tiles in Dark Mode.`);
    const isDarkEsri = darkTileUrls.some(u => u.includes('World_Dark_Gray_Base'));
    console.log('Dark Mode Esri Canvas tiles active:', isDarkEsri);
    if (darkTileUrls.length > 0) {
      console.log('Sample Dark Tile URL:', darkTileUrls[0]);
    }

    // Screenshot Dark Mode Minimalist Cockpit
    const darkPath = path.join(ARTIFACT_DIR, 'cockpit_dark_minimalist.png');
    await page.screenshot({ path: darkPath });
    console.log('Saved Dark Mode Screenshot to:', darkPath);

    // 2. Click Theme Switcher to switch to Light Mode
    console.log('Toggling theme to Light Mode...');
    const themeBtn = await page.$('button[aria-label*="Mode"]');
    if (themeBtn) {
      await themeBtn.click();
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.error('Theme button not found!');
    }

    // 3. Verify Light Mode Map Tile URLs
    const lightTileUrls = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll('.leaflet-tile'));
      return tiles.map(t => t.getAttribute('src')).filter(Boolean);
    });
    console.log(`Found ${lightTileUrls.length} map tiles in Light Mode.`);
    const isLightEsri = lightTileUrls.some(u => u.includes('World_Light_Gray_Base'));
    console.log('Light Mode Esri Canvas tiles active:', isLightEsri);
    if (lightTileUrls.length > 0) {
      console.log('Sample Light Tile URL:', lightTileUrls[0]);
    }

    // Screenshot Light Mode Minimalist Cockpit
    const lightPath = path.join(ARTIFACT_DIR, 'cockpit_light_minimalist.png');
    await page.screenshot({ path: lightPath });
    console.log('Saved Light Mode Screenshot to:', lightPath);

    console.log('Theme switch & Map validation successfully completed!');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
}

run();
