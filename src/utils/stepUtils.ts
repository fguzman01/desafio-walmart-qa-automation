import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

export type CaptureMode = 'always' | 'on-fail' | 'never';

async function attachScreen(page: Page, name: string) {
  const buf = await page.screenshot({ fullPage: true });
  await allure.attachment(name, buf, 'image/png');
}

/**
 * Ejecuta una acción como "step" de Allure y maneja screenshots.
 * - capture: 'always' (default), 'on-fail' o 'never'
 * - Adjunta screenshot con nombre del step (y en error agrega " (error)")
 */
export async function safeStep(
  page: Page,
  name: string,
  fn: () => Promise<void>,
  capture: CaptureMode = 'always'
): Promise<void> {
  return allure.step(name, async () => {
    try {
      await fn();
      if (capture === 'always') {
        await attachScreen(page, `📸 ${name}`);
      }
    } catch (err) {
      if (capture !== 'never') {
        await attachScreen(page, `❌ ${name} (error)`);
      }
      throw err;
    }
  });
}
