import { test } from '@playwright/test';
import { asegurarHomeCargado, abrirLoginDesdeHeader } from '../../src/flows/home.flow';

/**
 * Test de entrada a cuenta usando SOLO flows
 * Hasta que aparesca el captcha
 */
test.describe('Entrada a cuenta', () => {
  test('header: Ingresar Cuenta', async ({ page }) => {
    await asegurarHomeCargado(page);
    await abrirLoginDesdeHeader(page);
   
  });
});
