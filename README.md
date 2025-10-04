# 🛠️ Desafío Técnico QA Automation – Walmart Chile

Este proyecto fue desarrollado como parte del **Desafío Técnico para QA Automation Engineer en Walmart Chile**.

El objetivo fue demostrar la capacidad para diseñar, implementar y ejecutar **pruebas E2E reales sobre el sitio [Lider.cl](https://www.lider.cl/)**, aplicando buenas prácticas de automatización, control de errores (captcha) y reportes Allure para evidenciar los resultados.


**Características principales:**
- Arquitectura modular: separación clara en Pages, Flows y Data Providers.
- Reporter Allure con capturas automáticas por paso y por captcha.
- Mecanismo inteligente de detección de captcha (sin dependencias externas).
- Ejecución multi-navegador y soporte para CI/CD.

---

## 📂 Estructura del proyecto

El proyecto sigue una arquitectura modular basada en el patrón Page Object Model, separando responsabilidades por capas para mantener escalabilidad y fácil mantenimiento

```text
src/
├── pages/      # Page Objects (representan secciones del sitio)
├── flows/      # Flujos reutilizables (login, búsqueda, categorías)
├── utils/      # Funciones de soporte (esperas, safeSteps, captcha)
├── data/       # Data providers y modelos
tests/
└── e2e/        # Pruebas E2E organizadas por flujo
reports/        # Reportes Allure y capturas de pantalla
```

- **Pages:** encapsulan la lógica de interacción con cada sección relevante del sitio.
- **Flows:** orquestan pasos de negocio reutilizables y robustos.
- **Utils:** helpers para esperas, manejo de captchas, screenshots y steps seguros.
- **Data:** modelos y providers para pruebas data-driven.
- **Tests/E2E:** specs claros y enfocados en validar flujos reales.
- **Reports:** evidencia visual y reportes Allure listos para revisión.

---

## 🚦 Flujos automatizados

Los siguientes flujos fueron seleccionados por representar interacciones clave del usuario final dentro del sitio:

| Flujo                        | Archivo                    | Descripción breve                                              | Data Provider         |
|------------------------------|----------------------------|----------------------------------------------------------------|-----------------------|
| 🔐 Entrada a cuenta          | entrada-cuenta.spec.ts     | Acceso al módulo de login del sitio.                           | —                     |
| 🛒 Búsqueda por SKU          | busqueda-sku.spec.ts       | Validación del buscador mediante códigos SKU.                  | skuData.ts            |
| 📂 Categorías – “Tecno”      | categorias.spec.ts         | Navegación al módulo de categorías y selección “Tecno”.        | categoriasData.ts     |

En todos los casos, si aparece un captcha, el test se captura automáticamente y se marca como skipped (amarillo en Allure) para mantener estabilidad.

---

## ⚙️ Configuración y ejecución

Para ejecutar las pruebas localmente, sigue los pasos en orden:

1. Instala dependencias y Playwright:
	```bash
	npm install
	npx playwright install
	```

2. Ejecuta todos los tests:
	```bash
	npx playwright test
	```

3. Ejecuta un test específico:
	```bash
	npx playwright test tests/e2e/entrada-cuenta.spec.ts
	```

4. Ejecución visual (headed):
	```bash
	npx playwright test --headed
	```

5. Modo interactivo UI:
	```bash
	npm run test:ui
	```

Puedes especificar el navegador con `--project=firefox` o `--project=chromium` según u preferencia.
Todos los comandos son compatibles con Windows, macOS y Linux.

---

## 🛡️ Manejo del Captcha

El sitio Lider.cl puede activar un captcha tipo “Press & Hold” en cualquier flujo. El framework detecta automáticamente los siguientes elementos:

- Texto: “Robot or human?”
- Texto: “Activate and hold the button...”
- Elementos con ID `px-captcha` o `message`

Cuando se detecta un captcha:
- Se guarda una captura automática en `reports/screenshots/`.
- El test se marca como skipped (amarillo en Allure).


---

## 📊 Reportes y evidencias

Genera y visualiza los reportes Allure con:

```bash
npm run allure:generate
npm run allure:serve
```

- Los resultados sin procesar se guardan en `reports/allure-results/`.
- El reporte HTML se genera en `reports/allure-report/`.
- Las capturas automáticas (por paso y por captcha) se guardan en `reports/screenshots/`.

### 📊 Cómo interpretar el reporte Allure

- Tests en verde: exitosos.
- Skipped (amarillo): bloqueos por captcha.
- Cada test muestra los pasos ejecutados (safeStep) y las capturas asociadas.
- El reporte incluye métricas por duración, navegador y escenario.

