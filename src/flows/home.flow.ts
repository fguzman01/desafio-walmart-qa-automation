
import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { safeStep } from '../utils/stepUtils';
import { checkCaptcha } from '../utils/captchaUtils';

/**
 * Flow: Asegurar que el home está cargado
 * Navega al home y valida que todos los elementos clave estén visibles
 */

export async function asegurarHomeCargado(page: Page): Promise<void> {
  // Valida que el home esté cargado correctamente
  console.log('Flow.asegurarHomeCargado: validar home cargado');
  const home = new HomePage(page);

  // Step Allure
  await safeStep(page, 'Ir al Home', async () => {await home.irA(); }, 'always');
  
  await checkCaptcha(page, 'home-loaded', 'skip');

  // Step Allure
  await safeStep(page, 'Esperar header cargado', async () => {await home.esperarCargado();}, 'always');
}


/**
 * Flow: Abrir el login desde el header
 * Click en "Ingresar Cuenta" → Click en "sign-in"
 */
export async function abrirLoginDesdeHeader(page: Page): Promise<void> {
  // Abre el login desde el header
  console.log('Flow.abrirLoginDesdeHeader: ingresar al login desde el header');
  const home = new HomePage(page);

  // Step Allure
  await safeStep(page, "Click 'Ingresar Cuenta'", async () => {await home.clickIngresarCuenta();}, 'always');
  
  await checkCaptcha(page, 'abrir-login', 'skip');
  
  // Step Allure
  await safeStep(page, "Click opción 'Iniciar sesión'", async () => {await home.clickOpcionIniciarSesion();}, 'always');
  
  await checkCaptcha(page, 'page-login', 'skip');
}


/**
 * Flow: Buscar un término en el home
 */

export async function buscarEnHome(page: Page, termino: string): Promise<void> {
  // Realiza la búsqueda en el home con el término indicado
  console.log(`Flow.buscarEnHome: buscar término "${termino}"`);
  const home = new HomePage(page);

  // Step Allure
  await safeStep(page, 'Escribir término en búsqueda', async () => {await home.escribirEnBusqueda(termino);}, 'always');
  
  await checkCaptcha(page, 'search-loaded', 'skip');
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
