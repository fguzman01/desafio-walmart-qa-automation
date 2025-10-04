import { Page, expect } from '@playwright/test';
import { safeFill, safeClick, safeGoto, waitElement } from '../utils/webUtils';

export class LoginPage {
  constructor(private readonly page: Page) {}

  // Selectores
  private readonly usernameSelector = '[data-test="username"]';
  private readonly passwordSelector = '[data-test="password"]';
  private readonly loginButtonSelector = '[data-test="login-button"]';
  private readonly inventoryContainerSelector = '[data-test="inventory-container"]';
  private readonly errorSelector = '[data-test="error"]';

  /**
   * Navega a la página de login de SauceDemo.
   */
  async irA(): Promise<void> {
  // Navega a la página de login
  console.log('LoginPage.irA: navegar a la página de login');
    await safeGoto(this.page, 'https://www.saucedemo.com/', { log: 'all', logLabel: 'goto-login' });
  }

  /**
   * Acciones atómicas (micro-métodos)
   */
  async ingresarUsuario(usuario: string): Promise<void> {
  // Ingresa el usuario en el campo correspondiente
  console.log('LoginPage.ingresarUsuario: ingresar usuario');
    await waitElement(this.page, this.usernameSelector, { state: 'visible', expectEnabled: true, log: 'all', logLabel: 'username' });
    await safeFill(this.page, this.usernameSelector, usuario, { clear: true, log: 'all', logLabel: 'username' });
  }

  async ingresarContrasena(contrasena: string): Promise<void> {
  // Ingresa la contraseña
  console.log('LoginPage.ingresarContrasena: ingresar contraseña');
    await waitElement(this.page, this.passwordSelector, { state: 'visible', expectEnabled: true, log: 'all', logLabel: 'password' });
    await safeFill(this.page, this.passwordSelector, contrasena, { log: 'all', logLabel: 'password' });
  }

  async clickIngresar(): Promise<void> {
  // Hace click en el botón de ingresar
  console.log('LoginPage.clickIngresar: click en botón ingresar');
    await waitElement(this.page, this.loginButtonSelector, { state: 'visible', expectEnabled: true, log: 'all', logLabel: 'loginButton' });
    await safeClick(this.page, this.loginButtonSelector, { log: 'all', logLabel: 'loginButton' });
  }

  /**
   * Validaciones (assert* / wait*) - Encapsulan expects y selectores
   */
  
  /**
   * Valida que el login fue exitoso (inventario visible).
   */
  async assertLoginExitoso(): Promise<void> {
  // Valida que el usuario esté autenticado correctamente
  console.log('LoginPage.assertLoginExitoso: validar usuario autenticado');
    await expect(this.page.locator(this.inventoryContainerSelector)).toBeVisible({ timeout: 15000 });
  }

  /**
   * Valida que aparece un mensaje de error de login.
   * @param expectedMsg - Mensaje esperado (parcial o completo)
   */
  async assertLoginError(expectedMsg: string): Promise<void> {
  // Valida que se muestre el mensaje de error esperado
  console.log(`LoginPage.assertLoginError: validar mensaje de error "${expectedMsg}"`);
    const errorLocator = this.page.locator(this.errorSelector);
    await expect(errorLocator).toBeVisible({ timeout: 15000 });
    await expect(errorLocator).toContainText(expectedMsg);
  }

  /**
   * @deprecated Usa assertLoginExitoso() en su lugar
   * Mantener por compatibilidad temporal
   */
  async esperarInventarioVisible(): Promise<void> {
    await expect(this.page.locator(this.inventoryContainerSelector)).toBeVisible();
  }

  /**
   * @deprecated Usa assertLoginError() en su lugar
   * Mantener por compatibilidad temporal
   */
  async getErrorText(): Promise<string> {
    const err = this.page.locator(this.errorSelector);
    await expect(err).toBeVisible();
    return (await err.textContent())?.trim() ?? '';
  }
}
