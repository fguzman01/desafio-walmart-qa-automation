import { test } from '@playwright/test';
import { irACategoria } from '../../src/flows/categories.flow';
import { categorias } from '../../src/data/categorias-data';

test.describe('Categorías', () => {
  test('Abrir categoría "Tecno"', async ({ page }) => {
    const categoriaTecno = categorias.find(c => c.nombre.toLowerCase() === 'tecno');
    if (!categoriaTecno) throw new Error('Categoría Tecno no encontrada en data provider');
    await irACategoria(page, categoriaTecno);
  });
});
