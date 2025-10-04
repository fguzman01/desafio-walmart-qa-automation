import { test } from '@playwright/test';
import { asegurarHomeCargado } from '../../src/flows/home.flow';

/**
 * TEST DE LIDER.CL CON PATRÓN ESTÁNDAR - BROWSER VIVO
 * Usa SOLO flows, nunca importa Pages directamente
 */

test('Lider.cl - validar que home carga correctamente', async ({ page }) => {
  await asegurarHomeCargado(page);
  // Test completado correctamente
  console.log('Test completado - Browser gestionado por Playwright');
});
