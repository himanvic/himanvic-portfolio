import puppeteer from 'puppeteer-core';
import path from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_DIR = 'C:\\Users\\himan\\Downloads\\portfolio-website-main\\portfolio-website-main';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  console.log('Navigating to Mausam India...');
  await page.goto('https://mausam-india.pages.dev/', { waitUntil: 'networkidle2', timeout: 30000 });

  console.log('Selecting Bengaluru...');
  await page.evaluate(() => {
    // If the page function 'go' is available in window scope or via click:
    const btns = Array.from(document.querySelectorAll('button'));
    const bglrBtn = btns.find(b => b.textContent.includes('Bengaluru'));
    if (bglrBtn) {
      bglrBtn.click();
    } else if (typeof go === 'function') {
      go('Bengaluru', 12.97, 77.59);
    }
  });

  console.log('Waiting for weather data to load...');
  // Wait for loading class to disappear or temperature element to populate
  await page.waitForFunction(() => {
    const bodyLoaded = !document.body.classList.contains('ld');
    const hasTemp = document.body.innerText.includes('°');
    const hasBengaluru = document.body.innerText.includes('Bengaluru');
    return bodyLoaded && hasTemp && hasBengaluru;
  }, { timeout: 15000 }).catch(e => console.log('Wait timeout or check condition:', e.message));

  // Small delay for smooth entry animations
  await new Promise(r => setTimeout(r, 3000));

  const mausamPath = path.join(BASE_DIR, 'public', 'assets', 'images', 'project-1.png');
  await page.screenshot({ path: mausamPath, fullPage: false });
  console.log('Saved Mausam India (Bengaluru) screenshot to:', mausamPath);

  // Render the 3 custom cards for Himanvic's GitHub projects (bottelneck, sanskode, quantum)
  const cards = [
    { html: 'card-bottelneck.html', out: 'bottelneck.png' },
    { html: 'card-sanskode.html', out: 'sanskode.png' },
    { html: 'card-quantum.html', out: 'quantum.png' }
  ];

  for (const c of cards) {
    const fileUrl = `file:///${path.join(BASE_DIR, 'public', 'assets', 'images', c.html).replace(/\\/g, '/')}`;
    await page.setViewport({ width: 680, height: 384, deviceScaleFactor: 2 });
    await page.goto(fileUrl, { waitUntil: 'load' });
    const outPath = path.join(BASE_DIR, 'public', 'assets', 'images', 'project-gallery', 'himanvic', c.out);
    await page.screenshot({ path: outPath });
    console.log(`Rendered ${c.out} to: ${outPath}`);
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
