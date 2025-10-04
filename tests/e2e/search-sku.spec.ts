import { test } from '@playwright/test';
import { buscarPorSKU } from '../../src/flows/search.flow';
import { sku, getSkus } from '../../src/data/providers/searchProvider';

test.describe('Búsqueda por SKU - data provider', () => {
  test('Buscar SKU por alias "detergente_concentrado"', async ({ page }) => {
    await buscarPorSKU(page, sku('detergente_concentrado'));
  });

  // Ejemplo de parametrización dinámica (table-driven)
  for (const item of getSkus()) {
    test(`Buscar SKU: ${item.alias}`, async ({ page }) => {
      await buscarPorSKU(page, item.sku);
    });
  }
});
