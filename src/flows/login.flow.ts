import { Page } from '@playwright/test';
import { asegurarHomeCargado, abrirLoginDesdeHeader } from './home.flow';
import { checkCaptcha } from '../utils/captchaUtils';
import { safeStep } from '../utils/stepUtils';

export async function iniciarLoginDesdeHome(page: Page): Promise<void> {
  // Navega al home y abre el login
  console.log('Flow.iniciarLoginDesdeHome: navegar home y abrir login');
  await asegurarHomeCargado(page);
  await abrirLoginDesdeHeader(page);
  await checkCaptcha(page, 'login-page', 'log');
  await safeStep(page, 'Login iniciado desde Home', async () => {}, 'always');
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
