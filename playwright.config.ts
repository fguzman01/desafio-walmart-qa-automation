import { defineConfig } from '@playwright/test';

const HEADLESS = process.env.HEADLESS !== 'false';
const SLOWMO_MS = Number(process.env.SLOWMO_MS ?? '0') || 0;

export default defineConfig({
  testDir: './tests/e2e',  // Solo tests e2e, excluye bdd
  timeout: 30 * 1000,
  retries: 0,
  workers: 1,
  fullyParallel: false,
  reporter: [
    ['line'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'reports/allure-results',
      suiteTitle: false
    }]
  ],
  globalTimeout: 999999999, // Sin límite global para depuración
  projects: [
    /*{
      name: 'chromium',
      use: { 
        browserName: 'chromium',
      }
    },*/
    {
    name: 'firefox',
    use: { browserName: 'firefox', headless: false },
  },
  ],
  use: {
    headless: true,
    launchOptions: { 
      slowMo: SLOWMO_MS,
    },
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    baseURL: 'https://www.lider.cl/',
  },
});
