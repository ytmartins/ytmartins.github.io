import { execFile } from 'node:child_process';
import { watch } from 'node:fs';
import { access, copyFile, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const require = createRequire(import.meta.url);

export const resumeSource = fileURLToPath(new URL('../resume', import.meta.url));
const resumeAssets = [
  'index.html', 'styles.css', 'app.js', 'favicon.png',
  'source-sans-3-regular.woff2', 'source-sans-3-semibold.woff2',
  'source-sans-3-bold.woff2', 'source-sans-3-license.txt'
];

const languages = [
  { button: 'Portuguese', lang: 'pt-BR', title: 'Yuri Tomaz Martins | Currículo', file: 'Yuri-Martins-Curriculo.pdf' },
  { button: 'English', lang: 'en', title: 'Yuri Tomaz Martins | Resume', file: 'Yuri-Martins-Resume.pdf' }
];
export const resumeFiles = [...resumeAssets, ...languages.map(language => language.file)];

const a4Width = 210 * 96 / 25.4;
const a4Height = 297 * 96 / 25.4;

function readSheets(sheets) {
  return sheets.evaluateAll(elements => elements.map(sheet => {
    const box = sheet.getBoundingClientRect();
    const content = sheet.querySelector('.page-content');
    const layout = [sheet, ...sheet.querySelectorAll('*')].map(element => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return [
        rect.x - box.x, rect.y - box.y, rect.width, rect.height,
        style.color, style.backgroundColor, style.borderBottomColor,
        style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight,
        style.letterSpacing, style.textDecorationLine, style.textDecorationColor,
        style.textDecorationThickness, style.textUnderlineOffset,
        element.tagName === 'LI' ? getComputedStyle(element, '::marker').color : ''
      ];
    });
    return {
      text: sheet.innerText,
      width: box.width,
      height: box.height,
      overflow: sheet.scrollWidth > sheet.clientWidth + 1 || sheet.scrollHeight > sheet.clientHeight + 1 ||
        content.scrollWidth > content.clientWidth + 1,
      links: [...sheet.querySelectorAll('a[href]')].map(link => link.href),
      layout
    };
  }));
}

async function renderPdfs(staging) {
  if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
    const cache = fileURLToPath(new URL('../.cache/browsers', import.meta.url));
    if (await access(cache).then(() => true, () => false)) {
      process.env.PLAYWRIGHT_BROWSERS_PATH = cache;
    }
  }

  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1163, height: 1200 } });
    const index = pathToFileURL(join(staging, 'index.html')).href;
    const manifest = [];

    for (const language of languages) {
      await page.goto(index);
      await page.getByRole('button', { name: language.button, exact: true }).click();
      await page.mouse.move(0, 0);

      const faceLoaded = await page.evaluate(async () => {
        const faces = await Promise.all([400, 600, 700].map(weight =>
          document.fonts.load(`${weight} 10pt "Source Sans 3"`)));
        await document.fonts.ready;
        return faces.every(weight => weight.length > 0 && weight.every(face => face.status === 'loaded'));
      });
      if (!faceLoaded) throw Error(`${language.button}: Source Sans 3 did not load.`);

      const download = page.locator('.save-pdf');
      if (await page.locator('html').getAttribute('lang') !== language.lang ||
          await download.getAttribute('download') !== language.file ||
          await download.getAttribute('href') !== language.file) {
        throw Error(`${language.button}: the selected language and PDF must match.`);
      }
      const sheets = page.locator('.resume-document:visible .page');
      const preview = await readSheets(sheets);
      if (preview.length !== 2 || preview.some(sheet => sheet.overflow ||
          Math.abs(sheet.width - a4Width) > 1 || Math.abs(sheet.height - a4Height) > 1)) {
        throw Error(`${language.button}: content exceeds the two-page A4 layout.`);
      }

      await page.evaluate(title => {
        window.document.activeElement?.blur();
        window.document.title = title;
      }, language.title);
      await page.emulateMedia({ media: 'print' });
      const print = await readSheets(sheets);
      if (JSON.stringify(print) !== JSON.stringify(preview)) {
        throw Error(`${language.button}: the print layout differs from the A4 preview.`);
      }
      await page.pdf({
        path: join(staging, language.file),
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        printBackground: true,
        tagged: true
      });
      manifest.push({ ...language, pages: preview.map(({ text, links }) => ({ text, links })) });
      await page.emulateMedia({ media: 'screen' });
    }
    return manifest;
  } finally {
    await browser.close();
  }
}

async function replaceOutput(staging, output) {
  await mkdir(output, { recursive: true });
  const backup = join(staging, 'previous');
  await mkdir(backup);
  const previous = new Set();
  for (const file of resumeFiles) {
    try {
      await copyFile(join(output, file), join(backup, file));
      previous.add(file);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  const replaced = [];
  try {
    for (const file of resumeFiles) {
      await rename(join(staging, file), join(output, file));
      replaced.push(file);
    }
  } catch (error) {
    for (const file of replaced) {
      if (previous.has(file)) await rename(join(backup, file), join(output, file));
      else await rm(join(output, file));
    }
    throw error;
  }
}

export async function buildResume({ output, source = resumeSource }) {
  output = resolve(output);
  if (output === resolve(source)) throw Error('Resume source and output must be separate.');
  await mkdir(dirname(output), { recursive: true });
  const staging = await mkdtemp(join(dirname(output), '.resume-build-'));

  try {
    // Both PDFs are rendered from the same snapshot before the output is updated.
    for (const asset of resumeAssets) {
      await copyFile(join(source, asset), join(staging, asset));
    }
    const manifest = await renderPdfs(staging);
    const manifestPath = join(staging, 'validation.json');
    await writeFile(manifestPath, JSON.stringify(manifest));
    const validator = fileURLToPath(new URL('./validate-resume.py', import.meta.url));
    const { stdout } = await run(process.env.RESUME_PYTHON || 'python', [validator, manifestPath]);
    await replaceOutput(staging, output);
    console.log(stdout.trim());
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

export function watchResume({ output, source = resumeSource }) {
  let timer;
  let isBuilding = false;
  let needsRebuild = false;

  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  }

  async function rebuild() {
    if (isBuilding) {
      needsRebuild = true;
      return;
    }
    isBuilding = true;
    try {
      await buildResume({ output, source });
    } catch (error) {
      console.error(`Resume build failed. Keeping the last validated preview.\n${error.stderr?.trim() || error.message}`);
    } finally {
      isBuilding = false;
      if (needsRebuild) {
        needsRebuild = false;
        schedule();
      }
    }
  }

  const watcher = watch(source, (_event, filename) => {
    if (!filename || resumeAssets.includes(filename)) schedule();
  });
  watcher.on('error', error => console.error(`Cannot watch resume files: ${error.message}`));
  watcher.on('close', () => clearTimeout(timer));
  schedule();
  return watcher;
}
