import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { safeStep } from '../utils/stepUtils';
import { checkCaptcha } from '../utils/captchaUtils';



import type { Categoria } from '../models/Categoria';

/**
 * Flujo: abrir catálogo de una categoría recibida por parámetro.
 */
export async function irACategoria(page: Page, categoria: Categoria): Promise<void> {
  const home = new HomePage(page);

  // Steps Allure
  await safeStep(page, 'Ir al Home', async () => { await home.irA(); }, 'always');
  
  await checkCaptcha(page, 'home-inicio', 'log');

  // Step Allure
  await safeStep(page, 'Esperar header', async () => { await home.esperarCargado(); }, 'always');
  await safeStep(page, 'Abrir menú Categorías', async () => { await home.clickCategorias(); }, 'always');
  
  await checkCaptcha(page, 'post-click-categorias', 'log');

  // Step Allure
  await safeStep(page, 'Lista de Categorías visible', async () => { await home.esperarListaCategorias(); }, 'always');
  await safeStep(page, `Seleccionar categoría "${categoria.nombre}"`, async () => { await home.seleccionarCategoriaPorNombre(categoria.nombre); }, 'always');
  
  await checkCaptcha(page, `categoria-${categoria.nombre}`, 'log');

  // Step Allure
  await safeStep(page, `Ir a la categoría (id=${categoria.id})`, async () => { await home.clickIrALaCategoria(categoria.id); }, 'always');
  
  await checkCaptcha(page, `ir-a-categoria-${categoria.nombre}`, 'log');
}
