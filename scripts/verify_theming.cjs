const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\kishu\\.gemini\\antigravity\\brain\\8f711fb8-d06d-45e3-b409-21f775b2d8b3';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('Launching headless Chrome for Theme & Micro-interaction Verification...');
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

    // 1. Capture Upgraded Dark Theme Depth (canvas radial gradient, frosted cards, sparklines, badge glows)
    console.log('1. Capturing Dark Theme Depth...');
    const pathDark = path.join(ARTIFACT_DIR, 'dark_theme_depth.png');
    await page.screenshot({ path: pathDark });
    console.log('Saved:', pathDark);

    // 2. Click Theme Switcher (Sun icon) to switch to Light Theme
    console.log('2. Clicking Theme Switcher toggle to activate Light Theme...');
    const themeToggleBtn = await page.evaluateHandle(() => {
      return document.querySelector('button[aria-label*="Switch to Light"]') ||
             document.querySelector('button[title*="Switch to Light"]');
    });

    if (themeToggleBtn) {
      await themeToggleBtn.click();
      console.log('Clicked theme toggle button. Waiting 600ms for smooth 0.3s transition...');
      await new Promise(r => setTimeout(r, 600));

      // Capture Premium Light Theme
      const pathLight = path.join(ARTIFACT_DIR, 'light_theme_overview.png');
      await page.screenshot({ path: pathLight });
      console.log('Saved:', pathLight);

      // Open WT-04 drawer in Light Theme
      console.log('3. Opening WT-04 slide-out drawer in Light Theme...');
      const wt04CardLight = await page.evaluateHandle(() => {
        const cards = Array.from(document.querySelectorAll('[role="button"]'));
        return cards.find(c => c.textContent && c.textContent.includes('WT-04'));
      });
      if (wt04CardLight) {
        await wt04CardLight.click();
        await new Promise(r => setTimeout(r, 800));
        const pathLightDrawer = path.join(ARTIFACT_DIR, 'light_theme_drawer.png');
        await page.screenshot({ path: pathLightDrawer });
        console.log('Saved:', pathLightDrawer);

        // Close drawer (press Escape)
        await page.keyboard.press('Escape');
        await new Promise(r => setTimeout(r, 400));
      }

      // Switch back to Dark Theme
      console.log('4. Switching back to Dark Theme...');
      const switchBackBtn = await page.evaluateHandle(() => {
        return document.querySelector('button[aria-label*="Switch to Dark"]') ||
               document.querySelector('button[title*="Switch to Dark"]');
      });
      if (switchBackBtn) {
        await switchBackBtn.click();
        await new Promise(r => setTimeout(r, 600));

        // Open WT-04 drawer in Dark Theme
        const wt04CardDark = await page.evaluateHandle(() => {
          const cards = Array.from(document.querySelectorAll('[role="button"]'));
          return cards.find(c => c.textContent && c.textContent.includes('WT-04'));
        });
        if (wt04CardDark) {
          await wt04CardDark.click();
          await new Promise(r => setTimeout(r, 800));
          const pathDarkDrawer = path.join(ARTIFACT_DIR, 'dark_theme_drawer.png');
          await page.screenshot({ path: pathDarkDrawer });
          console.log('Saved:', pathDarkDrawer);
        }
      }
      // Open Maintenance Queue in Light Theme
      console.log('5. Navigating to Maintenance Queue in Light Theme...');
      const queueTab = await page.evaluateHandle(() => {
        const tabs = Array.from(document.querySelectorAll('nav button'));
        return tabs.find(t => t.textContent && t.textContent.includes('Maintenance Queue'));
      });
      if (queueTab) {
        await queueTab.click();
        await new Promise(r => setTimeout(r, 600));
        const pathLightQueue = path.join(ARTIFACT_DIR, 'light_theme_queue.png');
        await page.screenshot({ path: pathLightQueue });
        console.log('Saved:', pathLightQueue);
      }

      // Open Sensor Inspector in Light Theme
      console.log('6. Navigating to Sensor Inspector in Light Theme...');
      const inspectorTab = await page.evaluateHandle(() => {
        const tabs = Array.from(document.querySelectorAll('nav button'));
        return tabs.find(t => t.textContent && t.textContent.includes('Sensor Inspector'));
      });
      if (inspectorTab) {
        await inspectorTab.click();
        await new Promise(r => setTimeout(r, 600));
        const pathLightInspector = path.join(ARTIFACT_DIR, 'light_theme_inspector.png');
        await page.screenshot({ path: pathLightInspector });
        console.log('Saved:', pathLightInspector);
      }

      // Switch back to Fleet Overview tab
      const overviewTab = await page.evaluateHandle(() => {
        const tabs = Array.from(document.querySelectorAll('nav button'));
        return tabs.find(t => t.textContent && t.textContent.includes('Fleet Overview'));
      });
      if (overviewTab) {
        await overviewTab.click();
        await new Promise(r => setTimeout(r, 400));
      }
    } else {
      console.warn('Theme toggle button not found!');
    }

    console.log('Theme verification complete!');
  } catch (err) {
    console.error('Error during theme verification:', err);
  } finally {
    await browser.close();
  }
}

run();
