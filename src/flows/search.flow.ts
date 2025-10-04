import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { checkCaptcha } from '../utils/captchaUtils';
import { safeStep } from '../utils/stepUtils';

/**
 * Flow: Buscar producto por SKU (usando HomePage)
 * Valida captcha antes y después de cada acción clave
*/

export async function buscarPorSKU(page: Page, sku: string): Promise<void> {
  // Realiza la búsqueda por SKU
  console.log(`Flow.buscarPorSKU: "${sku}"`);
  const home = new HomePage(page);

  // Step Allure 
  await safeStep(page, 'Ir al Home', async () => {await home.irA();}, 'always');
  
  await checkCaptcha(page, 'search-home', 'log');

  // Step Allure
  await safeStep(page, 'Esperar header', async () => {await home.esperarCargado();}, 'always');
  await safeStep(page, `Escribir SKU ${sku}`, async () => {await home.escribirEnBusqueda(sku);}, 'always');
  
  await checkCaptcha(page, 'search-after-input', 'log');
    
  // Step Allure
  await safeStep(page, 'Click buscar', async () => {await home.clickIconoBuscar();}, 'always');
  
  await checkCaptcha(page, 'search-after-click', 'log');
  await takeStepScreenshot(page, 'buscarPorSKU');
}



/**
 * Helper para tomar screenshot con nombre único por contexto.
*/

async function takeStepScreenshot(page: Page, nombre: string) {
  const safeName = nombre.replace(/\s+/g, '-').toLowerCase();
  await page.screenshot({
    path: `reports/screenshots/${Date.now()}-${safeName}.png`,
    fullPage: true,
  });
  // Guarda el screenshot con el nombre indicado
  console.log(`Screenshot guardado: ${nombre}`);
}
