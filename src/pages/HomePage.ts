import { Page, expect } from '@playwright/test';
import { link } from 'fs/promises'
import { safeGoto, waitElement, ensureInteractable, safeClick, safeFill } from '../utils/webUtils';


export class HomePage {
  constructor(private readonly page: Page) {}

  // Selectores en Home
  private readonly searchInputByRole = () => this.page.getByRole('searchbox', { name: 'Buscar' });
  private readonly searchIcon = '[data-automation-id="search-icon"]';
  private readonly ingresarCuentaByRole = () => this.page.getByRole('button', { name: 'Ingresar Cuenta' });
  private readonly signInByTestId = () => this.page.getByTestId('sign-in');
  private readonly categoriasLink = 'a[link-identifier="Departments"]';
  private readonly categoriaItems = '[data-automation-id="header-departmentL1"]'; // botones de la lista (ul>li>button)

  
  
  
  // Acción: click en link de categoría por id (si se entrega)
  async clickIrALaCategoria(categoryId?: string): Promise<void> {
  
  console.log(`HomePage.clickIrALaCategoria: buscando link con id: ${categoryId ?? 'cualquiera'}`);
    let link;
    if (categoryId) {
      link = this.page.locator(`a[link-identifier="Ir a la categoría"][href$="${categoryId}"]`).first();
    } else {
      link = this.page.locator('a[link-identifier="Ir a la categoría"]').first();
    }
    await waitElement(this.page, link, { timeout: 20000, log: 'all', logLabel: 'ir-a-la-categoria' });
    await ensureInteractable(this.page, link, { log: 'all', logLabel: 'ir-a-la-categoria' });
    await safeClick(this.page, link, { log: 'all', logLabel: 'ir-a-la-categoria' });
  }
 
 
 // Click en link de Categorías (header)
  async clickCategorias(): Promise<void> {
  
  console.log("HomePage.clickCategorias: click en 'Categorías'");
    const link = this.page.locator(this.categoriasLink);
    await waitElement(this.page, link, { timeout: 20000, log: 'all', logLabel: 'home-categorias-click' });
    await ensureInteractable(this.page, link, { log: 'all', logLabel: 'home-categorias-click' });
    await safeClick(this.page, link, { log: 'all', logLabel: 'home-categorias-click' });
  }
  /**
   * Espera que la lista de categorías esté visible.
   */
  async esperarListaCategorias(): Promise<void> {
  // Espera que la lista de categorías esté visible
  console.log('HomePage.esperarListaCategorias: esperar ul de categorías');
    const firstItem = this.page.locator(this.categoriaItems).first();
    await waitElement(this.page, firstItem, { timeout: 20000, log: 'all', logLabel: 'lista-categorias' });
  }

  /**
   * Selecciona una categoría por texto visible exacto
   * Ej: "Tecno", "Computación".
   */
  async seleccionarCategoriaPorNombre(nombre: string): Promise<void> {
  // Selecciona la categoría por nombre
  console.log(`HomePage.seleccionarCategoriaPorNombre: "${nombre}"`);
    await this.esperarListaCategorias();
    const btn = this.page.getByRole('button', { name: new RegExp(`^${nombre}$`, 'i') });
    await waitElement(this.page, btn, { timeout: 20000, log: 'all', logLabel: `cat-${nombre}` });
    await ensureInteractable(this.page, btn, { log: 'all', logLabel: `cat-${nombre}` });
    await safeClick(this.page, btn, { log: 'all', logLabel: `cat-${nombre}` });
  }

  /**
   * Selecciona una categoría aleatoria de la lista visible.
   * Devuelve el nombre de la categoría cliqueada para logging/validación.
   */
  async seleccionarCategoriaAleatoria(): Promise<string> {
  // Selecciona una categoría aleatoria
  console.log('HomePage.seleccionarCategoriaAleatoria');
    await this.esperarListaCategorias();
    const items = this.page.locator(this.categoriaItems);
    const total = await items.count();
    if (total === 0) throw new Error('No se encontraron categorías');
    const index = Math.floor(Math.random() * total);
    const chosen = items.nth(index);
    const text = (await chosen.innerText()).trim();
    await ensureInteractable(this.page, chosen, { log: 'all', logLabel: `cat-random-${index}` });
    await safeClick(this.page, chosen, { log: 'all', logLabel: `cat-random-${index}` });
  // Muestra la categoría elegida y su índice
  console.log(`Categoría elegida: "${text}" (idx=${index})`);
    return text;
  }


  /**
   * Acción click en el icono de buscar.
   */
  async clickIconoBuscar(): Promise<void> {
  // Hace click en el icono de búsqueda
  console.log('HomePage.clickIconoBuscar');
    const icon = this.page.locator(this.searchIcon);
    await waitElement(this.page, icon, { timeout: 20000, log: 'all', logLabel: 'search-icon' });
    await ensureInteractable(this.page, icon, { log: 'all', logLabel: 'search-icon' });
    await safeClick(this.page, icon, { log: 'all', logLabel: 'search-icon' });
  }

  // Banners/modales comunes
  private readonly acceptCookiesBtn = '#onetrust-accept-btn-handler, button#onetrust-accept-btn-handler, text=/Aceptar|Aceptar todas|Entendido/i';
  private readonly closeModalBtn = 'button[aria-label="Cerrar"], button[aria-label="Close"], [data-testid*="close"]';

  /**
   * Ir al home
   */
  async irA(): Promise<void> {
  // Navega al home principal
  console.log('HomePage.irA: navegar al home');
    await safeGoto(this.page, 'https://www.lider.cl/', { log: 'all', logLabel: 'goto-home' });
  }

  /**
   * Esperar que cargue el home (regla: validar objetos clave)
   */
  async esperarCargado(): Promise<void> {
  // Espera que los elementos clave del home estén cargados
  console.log('HomePage.esperarCargado: validar objetos clave del home');
    
    try {
      const cookiesBtn = this.page.locator(this.acceptCookiesBtn);
      if (await cookiesBtn.isVisible({ timeout: 1500 })) await cookiesBtn.click({ timeout: 5000 });
    } catch {}
    try {
      const closeBtn = this.page.locator(this.closeModalBtn);
      if (await closeBtn.isVisible({ timeout: 1500 })) await closeBtn.click({ timeout: 5000 });
    } catch {}

    // Validar searchbox visible
    await waitElement(this.page, this.searchInputByRole(), { timeout: 20000, log: 'all', logLabel: 'home-searchbox' });
    // Validar botón Ingresar Cuenta visible
    await waitElement(this.page, this.ingresarCuentaByRole(), { timeout: 20000, log: 'all', logLabel: 'home-ingresar-cuenta' });
    // Validar link Categorías visible
    await waitElement(this.page, this.categoriasLink, { timeout: 20000, log: 'all', logLabel: 'home-categorias' });
  }

  /**
   * Metodo: hacer click en "Ingresar Cuenta"
   */
  async clickIngresarCuenta(): Promise<void> {
  // Hace click en el botón 'Ingresar Cuenta'
  console.log("HomePage.clickIngresarCuenta: click en 'Ingresar Cuenta'");
    const btn = this.ingresarCuentaByRole();
    await waitElement(this.page, btn, { timeout: 20000, log: 'all', logLabel: 'click-ingresar-cuenta' });
    await ensureInteractable(this.page, btn, { log: 'all', logLabel: 'click-ingresar-cuenta' });
    await safeClick(this.page, btn, { log: 'all', logLabel: 'click-ingresar-cuenta' });
  }

  /**
   * Método hacer click en opción "sign-in" del componente desplegado
   */
  async clickOpcionIniciarSesion(): Promise<void> {
  // Hace click en la opción de iniciar sesión
  console.log('HomePage.clickOpcionIniciarSesion: click opción sign-in');
    const opt = this.signInByTestId();
    await waitElement(this.page, opt, { timeout: 20000, log: 'all', logLabel: 'click-sign-in' });
    await ensureInteractable(this.page, opt, { log: 'all', logLabel: 'click-sign-in' });
    const clickPromise = safeClick(this.page, opt, { log: 'all', logLabel: 'click-sign-in' });

  }

  /**
   * Escribir en el buscador siguiendo la regla esperar → acción
   */
  async escribirEnBusqueda(term: string): Promise<void> {
  // Escribe el término de búsqueda
  console.log(`HomePage.escribirEnBusqueda: escribir "${term}"`);
    const input = this.searchInputByRole();
    await waitElement(this.page, input, { timeout: 20000, log: 'all', logLabel: 'search-type' });
    await ensureInteractable(this.page, input, { requireEditable: true, log: 'all', logLabel: 'search-type' });
    await safeFill(this.page, input, term, { clear: true, log: 'all', logLabel: 'search-type' });
  }
}
