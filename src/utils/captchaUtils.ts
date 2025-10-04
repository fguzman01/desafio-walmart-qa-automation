/**
 * Detecta si aparece un captcha tipo "Robot or human?".
 * Si lo encuentra, toma screenshot y lanza un error controlado.
 */
import { Page, BrowserContext, expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { adjuntarCaptura } from './allureUtils';


// Modo de manejo al detectar captcha
type CaptchaMode = 'throw' | 'skip' | 'log';

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

async function anyVisible(page: Page, selectors: string[], timeout = 1500): Promise<boolean> {
  const start = Date.now();
  for (;;) {
    for (const s of selectors) {
      const vis = await page.locator(s).first().isVisible().catch(() => false);
      if (vis) return true;
    }
    if (Date.now() - start > timeout) return false;
    await sleep(100);
  }
}


async function saveDiskScreenshot(page: Page, contexto: string) {
  const dir = path.resolve('reports/screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const safe = contexto.replace(/\s+/g, '-').toLowerCase();
  const file = path.join(dir, `captcha-${safe}-${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

/**
 * Check captcha 
*  Según 'mode': throw | skip | log
 */

export async function checkCaptcha(
  page: Page,
  contexto: string,
  mode: CaptchaMode = 'throw',
  alsoSaveToDisk = true
): Promise<boolean> {

  try { await page.waitForLoadState('domcontentloaded', { timeout: 3000 }); } catch {}

  // Señales
  let titleHit = false;
  try {
    const t = (await page.title()) || '';
    titleHit = /robot or human\?|before we continue/i.test(t);
  } catch {}

  const textHit = await anyVisible(page, [
    'text=/Robot or human\\?/i',
    'text=/Activate and hold/i',
    'text=/Before we continue/i',
  ], 1500);

  const pxHit = await anyVisible(page, [
    '#px-captcha',
    '#px-captcha iframe[title*="Human verification"]',
  ], 1500);

  const detected = titleHit || textHit || pxHit;

  if (detected) {
    console.warn(`Captcha detectado (${contexto}). title=${titleHit} text=${textHit} px=${pxHit}`);

    // Adjunta captura reporte allure
    await adjuntarCaptura(page, `Captcha detectado - ${contexto}`);

    // Opcionde guardar captura en el disco
    if (alsoSaveToDisk) {
      const pathSaved = await saveDiskScreenshot(page, contexto);
      console.warn(`📸 Captura guardada: ${pathSaved}`);
    }

    // Modos de acción (seleccionar en test)
    if (mode === 'throw') {
      throw new Error(`Captcha bloqueó el flujo en: ${contexto}`);
    }
    if (mode === 'skip') {
      test.skip(true, `Captcha bloqueó el flujo en: ${contexto}`);
    }
    return true;
  }

  return false;
}




