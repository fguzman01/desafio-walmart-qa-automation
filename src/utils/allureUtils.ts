import { Page } from '@playwright/test';
import { allure } from 'allure-playwright';

/**
 * Ejecuta un paso de Allure con nombre y función.
 * Si la función lanza error, el paso queda como fallido automáticamente.
 */
export async function paso<T>(nombre: string, fn: () => Promise<T>): Promise<T> {
  let result: T;
  await allure.step(nombre, async () => {
    result = await fn();
  });
  // @ts-expect-error: result is always assigned
  return result;
}

/**
 * Adjunta una captura de pantalla PNG a Allure.
 * @param page Playwright page
 * @param nombre Nombre del adjunto en el reporte
 * @param fullPage Capturar página completa (por defecto true)
 */
export async function adjuntarCaptura(page: Page, nombre: string, fullPage: boolean = true): Promise<void> {
  const buffer = await page.screenshot({ fullPage });
  await allure.attachment(nombre, buffer, 'image/png');
}
