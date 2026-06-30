import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { routePrivateCameraImages } from './privacy-camera-route.mjs';

const baseUrl = (process.env.DD_SCREENSHOT_BASE_URL || 'http://localhost:8123').replace(/\/$/, '');
let dashboardRoot = process.env.DD_SCREENSHOT_DASHBOARD_PATH
  ? normalizeDashboardRoot(process.env.DD_SCREENSHOT_DASHBOARD_PATH)
  : '';
const outputDir = process.env.DD_SCREENSHOT_OUTPUT_DIR || 'screenshots/generated';
const username = process.env.DD_SCREENSHOT_USERNAME || process.env.HA_USERNAME || '';
const password = process.env.DD_SCREENSHOT_PASSWORD || process.env.HA_PASSWORD || '';
const areaId = process.env.DD_SCREENSHOT_AREA_ID || '';
const fullPage = process.env.DD_SCREENSHOT_FULL_PAGE === 'true';
const screenshotThemes = parseScreenshotThemes(process.env.DD_SCREENSHOT_THEMES || 'light,dark');
const injectLocalBuild = process.env.DD_SCREENSHOT_INJECT_LOCAL_BUILD !== 'false';
const preloadLocalBuild = process.env.DD_SCREENSHOT_PRELOAD_LOCAL_BUILD === 'true';
const collapseSidebar = process.env.DD_SCREENSHOT_COLLAPSE_HA_SIDEBAR !== 'false';
const privacyCameras = process.env.DD_SCREENSHOT_PRIVACY_CAMERAS !== 'false';
const privacyCameraAssetDir = path.resolve(process.env.DD_SCREENSHOT_PRIVACY_CAMERA_DIR || 'assets/demo-cameras');
const localBuildPath = path.resolve(process.env.DD_SCREENSHOT_LOCAL_BUILD || 'dist/dwains-dashboard-next.js');
const localBuildUrl = process.env.DD_SCREENSHOT_LOCAL_BUILD_URL || '/local/dwains-dashboard-next/dwains-dashboard-next.js?screenshot=1';
let localBuildRequests = 0;

const viewports = [
  {
    name: 'desktop',
    options: {
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    },
  },
  {
    name: 'mobile',
    options: {
      viewport: { width: 430, height: 932 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
  },
];

const scenarios = [
  { name: 'home', path: 'home' },
  { name: 'devices', path: 'devices' },
  { name: 'settings', path: 'settings' },
  { name: 'settings-home-page', path: 'settings:Home page' },
  { name: 'settings-devices-page', path: 'settings:Devices page' },
  { name: 'settings-areas', path: 'settings:Areas' },
  ...(areaId ? [{ name: `area-${safeFileName(areaId)}`, path: `home?dd_area=${encodeURIComponent(areaId)}` }] : []),
  ...parseExtraScenarios(process.env.DD_SCREENSHOT_EXTRA_PATHS || ''),
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: process.env.DD_SCREENSHOT_HEADLESS !== 'false',
});

try {
  for (const theme of screenshotThemes) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        ...viewport.options,
        colorScheme: theme,
      });
      await context.addInitScript((themeMode) => {
        try {
          localStorage.setItem('selectedTheme', JSON.stringify({ dark: themeMode === 'dark' }));
        } catch {
          /* ignore storage errors */
        }
      }, theme);
      await routeLocalDashboardBuild(context);
      await routePrivateCameraImages(context, {
        enabled: privacyCameras,
        assetDir: privacyCameraAssetDir,
      });
      const page = await context.newPage();

      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await loginIfNeeded(page);
      await applyTheme(page, theme);
      if (!dashboardRoot) {
        dashboardRoot = await discoverDashboardRoot(page);
        console.log(`Using dashboard path ${dashboardRoot}`);
      }

      for (const scenario of scenarios) {
        await openScenario(page, scenario, viewport.name, theme);
        await waitForDashboard(page, theme, viewport.name, scenario.name);
        await applyTheme(page, theme);
        await closeTransientUi(page);
        await collapseHomeAssistantSidebar(page, viewport.name);

        const file = path.join(outputDir, theme, viewport.name, `${safeFileName(scenario.name)}.png`);
        await mkdir(path.dirname(file), { recursive: true });
        await page.screenshot({ path: file, fullPage });
        console.log(`Saved ${file}`);
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

async function openScenario(page, scenario, viewportName, theme) {
  if (scenario.path === 'settings' || scenario.path.startsWith('settings:')) {
    const sectionLabel = scenario.path.includes(':') ? scenario.path.split(':').slice(1).join(':') : '';
    await openSettingsScenario(page, sectionLabel, viewportName, theme);
    return;
  }

  if (scenario.path === 'devices') {
    const currentPath = new URL(page.url()).pathname.replace(/\/$/, '');
    if (currentPath !== `${dashboardRoot}/home`) {
      await page.goto(toDashboardUrl('home'), { waitUntil: 'domcontentloaded' });
      await loginIfNeeded(page);
      await applyTheme(page, theme);
      await waitForDashboard(page, theme, viewportName, `${scenario.name}-home-start`);
    }

    const devicesPath = `${dashboardRoot}/devices`;
    const navigated = await page.evaluate((targetPath) => {
      const deepFind = (root, predicate) => {
        if (!root?.querySelectorAll) {
          return null;
        }
        for (const node of root.querySelectorAll('*')) {
          if (predicate(node)) {
            return node;
          }
          const nested = deepFind(node.shadowRoot, predicate);
          if (nested) {
            return nested;
          }
        }
        return null;
      };
      const nav = deepFind(document, (node) => node.localName === 'dwains-dashboard-next-bottom-nav');
      if (typeof nav?._go === 'function') {
        nav._go('devices');
        return true;
      }

      window.history.pushState(null, '', targetPath);
      const ev = new Event('location-changed', { bubbles: true, composed: true });
      ev.detail = { replace: false };
      window.dispatchEvent(ev);
      return true;
    }, devicesPath).catch(() => false);

    if (!navigated) {
      await page.waitForTimeout(250);
    }
    await page.waitForLoadState('domcontentloaded').catch(() => {});
    await loginIfNeeded(page);
    await applyTheme(page, theme);
    await page.waitForTimeout(1000);
    return;
  }

  if (scenario.path.startsWith('home?dd_area=')) {
    const currentPath = new URL(page.url()).pathname.replace(/\/$/, '');
    if (currentPath !== `${dashboardRoot}/home`) {
      await page.goto(toDashboardUrl('home'), { waitUntil: 'domcontentloaded' });
      await loginIfNeeded(page);
      await applyTheme(page, theme);
      await waitForDashboard(page, theme, viewportName, `${scenario.name}-home-start`);
    }

    const targetUrl = toDashboardUrl(scenario.path);
    await page.evaluate((url) => {
      window.history.pushState(null, '', url);
      const ev = new Event('location-changed', { bubbles: true, composed: true });
      ev.detail = { replace: false };
      window.dispatchEvent(ev);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, targetUrl).catch(() => {});
    await applyTheme(page, theme);
    await page.waitForTimeout(1000);
    return;
  }

  await page.goto(toDashboardUrl(scenario.path), { waitUntil: 'domcontentloaded' });
  await loginIfNeeded(page);
  await applyTheme(page, theme);
}

async function openSettingsScenario(page, sectionLabel, viewportName, theme) {
  const currentPath = new URL(page.url()).pathname.replace(/\/$/, '');
  if (currentPath !== `${dashboardRoot}/home`) {
    await page.goto(toDashboardUrl('home'), { waitUntil: 'domcontentloaded' });
    await loginIfNeeded(page);
    await applyTheme(page, theme);
    await waitForDashboard(page, theme, viewportName, `settings-${safeFileName(sectionLabel || 'overview')}-home-start`);
  }

  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('dwains-dashboard-next-open-settings'));
  }).catch(() => {});
  await page.waitForTimeout(1000);
  await resetSettingsOverview(page);
  await page.waitForTimeout(250);

  if (!sectionLabel) return;

  const clicked = await page.evaluate((label) => {
    const collectDeep = (root, out = []) => {
      if (!root?.querySelectorAll) return out;
      for (const node of root.querySelectorAll('*')) {
        out.push(node);
        if (node.shadowRoot) collectDeep(node.shadowRoot, out);
      }
      return out;
    };
    const normalizedLabel = label.trim().toLowerCase();
    const candidates = collectDeep(document)
      .filter((node) => {
        if (!node.matches?.('button.settings-nav-item')) return false;
        const title = node.querySelector?.('.settings-nav-title')?.textContent?.trim().toLowerCase() || '';
        return title === normalizedLabel;
      })
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return ar.top - br.top || ar.left - br.left;
      });
    const target = candidates[0];
    if (!target) return false;
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    return true;
  }, sectionLabel).catch(() => false);

  if (!clicked) {
    console.warn(`Could not open settings section "${sectionLabel}"`);
  }
  await page.waitForTimeout(900);
}

async function resetSettingsOverview(page) {
  await page.evaluate(() => {
    const deepFind = (root, predicate) => {
      if (!root?.querySelectorAll) return null;
      for (const node of root.querySelectorAll('*')) {
        if (predicate(node)) return node;
        const nested = deepFind(node.shadowRoot, predicate);
        if (nested) return nested;
      }
      return null;
    };
    const editor = deepFind(document, (node) => node.localName === 'dwains-dashboard-next-strategy-editor');
    if (!editor) return false;
    if (typeof editor._backToSettingsOverview === 'function') {
      editor._backToSettingsOverview();
      return true;
    }
    editor._settingsPage = 'overview';
    editor.requestUpdate?.();
    return true;
  }).catch(() => false);
}

function normalizeDashboardRoot(value) {
  const clean = value.trim() || '/dashboard-dd1';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/(?:home|devices)\/?$/, '').replace(/\/$/, '');
}

function toDashboardUrl(viewPath) {
  const cleanPath = viewPath.startsWith('/') ? viewPath.slice(1) : viewPath;
  return `${baseUrl}${dashboardRoot}/${cleanPath}`;
}

async function routeLocalDashboardBuild(context) {
  if (!injectLocalBuild) {
    return;
  }

  await context.route(/.*dwains-dashboard-next.*\.js.*/, async (route) => {
    localBuildRequests += 1;
    if (localBuildRequests === 1) {
      console.log(`Using local dashboard build ${localBuildPath}`);
    }
    await route.fulfill({
      path: localBuildPath,
      contentType: 'application/javascript',
    });
  });

  if (preloadLocalBuild) {
    await context.addInitScript((url) => {
      const isRegistered = () =>
        customElements.get('ll-strategy-dashboard-dwains-dashboard-next') ||
        customElements.get('dwains-dashboard-next-layout-card') ||
        customElements.get('dwains-dashboard-next-card');
      if (isRegistered()) {
        return;
      }
      import(url).catch((err) => {
        console.warn('Dwains Dashboard Next screenshot preload failed', err);
      });
    }, localBuildUrl);
  }
}

async function discoverDashboardRoot(page) {
  const dashboards = await page.evaluate(async () => {
    const root = document.querySelector('home-assistant');
    const hass = root?.hass;
    if (!hass?.callWS) return [];
    return await hass.callWS({ type: 'lovelace/dashboards/list' });
  }).catch(() => []);

  const dashboard = dashboards.find((item) => {
    const title = String(item.title || '').toLowerCase();
    const urlPath = String(item.url_path || '').toLowerCase();
    return (
      title === 'dd next' ||
      title.includes('dwains dashboard next') ||
      urlPath === 'dd-next' ||
      urlPath.includes('dwains-dashboard-next')
    );
  });

  if (!dashboard?.url_path) {
    throw new Error(
      'Could not auto-detect Dwains Dashboard Next. Set DD_SCREENSHOT_DASHBOARD_PATH, for example /dd-next.'
    );
  }

  return normalizeDashboardRoot(`/${dashboard.url_path}`);
}

function parseExtraScenarios(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [name, ...rest] = item.split('=');
      const scenarioPath = rest.join('=');
      return scenarioPath
        ? { name: name.trim(), path: scenarioPath.trim() }
        : { name: safeFileName(item), path: item };
    });
}

function parseScreenshotThemes(value) {
  const themes = value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  const validThemes = themes.filter((theme) => theme === 'light' || theme === 'dark');
  return validThemes.length ? [...new Set(validThemes)] : ['light', 'dark'];
}

async function applyTheme(page, theme) {
  await page.emulateMedia({ colorScheme: theme }).catch(() => {});
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.evaluate(async (themeMode) => {
        const dark = themeMode === 'dark';
        try {
          localStorage.setItem('selectedTheme', JSON.stringify({ dark }));
        } catch {
          /* ignore storage errors */
        }

        const apply = () => {
          const root = document.querySelector('home-assistant');
          if (!root) {
            return false;
          }

          root._updateHass?.({ selectedTheme: { dark } });
          root._applyTheme?.(dark);

          const hass = root.hass;
          if (hass) {
            hass.selectedTheme = { ...(hass.selectedTheme || {}), dark };
            if (hass.themes) {
              hass.themes = { ...hass.themes, darkMode: dark };
            }
          }

          return true;
        };

        if (apply()) {
          return;
        }

        await new Promise((resolve) => {
          let tries = 0;
          const timer = window.setInterval(() => {
            tries += 1;
            if (apply() || tries > 40) {
              window.clearInterval(timer);
              resolve();
            }
          }, 50);
        });
      }, theme);
      await page.waitForTimeout(250);
      return;
    } catch (err) {
      const message = String(err?.message || err);
      if (!message.includes('Execution context was destroyed') || attempt === 2) {
        throw err;
      }
      await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(250);
    }
  }
}

async function collapseHomeAssistantSidebar(page, viewportName) {
  if (!collapseSidebar || viewportName !== 'desktop') {
    return;
  }

  const toggled = await page.evaluate(() => {
    const deepFind = (root, predicate) => {
      if (!root?.querySelectorAll) {
        return null;
      }
      for (const node of root.querySelectorAll('*')) {
        if (predicate(node)) {
          return node;
        }
        const nested = deepFind(node.shadowRoot, predicate);
        if (nested) {
          return nested;
        }
      }
      return null;
    };

    const sidebar = deepFind(document, (node) => node.localName === 'ha-sidebar');
    const sidebarWidth = sidebar?.getBoundingClientRect?.().width || 0;
    if (sidebarWidth > 0 && sidebarWidth < 100) {
      return false;
    }

    const target =
      deepFind(document, (node) => node.localName === 'home-assistant-main') ||
      document.querySelector('home-assistant');
    if (!target) {
      return false;
    }

    target.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {
        bubbles: true,
        composed: true,
      })
    );
    return true;
  }).catch(() => false);

  if (toggled) {
    await page.waitForTimeout(500);
  }
}

async function loginIfNeeded(page) {
  const usernameInput = page.locator(
    'input[name="username"], input[autocomplete="username"]'
  ).first();
  try {
    await usernameInput.waitFor({ state: 'visible', timeout: 12000 });
  } catch {
    return;
  }

  if (!username || !password) {
    throw new Error(
      'Home Assistant login is required. Set DD_SCREENSHOT_USERNAME and DD_SCREENSHOT_PASSWORD.'
    );
  }

  await usernameInput.fill(username);

  const passwordInput = page.locator(
    'input[name="password"], input[autocomplete="current-password"], input[type="password"]'
  ).first();
  await passwordInput.waitFor({ state: 'visible', timeout: 5000 });
  await passwordInput.fill(password);

  const submit = page.getByRole('button', { name: /log in|sign in/i }).first();

  if (await submit.isVisible({ timeout: 1500 }).catch(() => false)) {
    await submit.click();
  } else {
    await passwordInput.press('Enter');
  }

  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1000);

  if (page.url().includes('/auth/')) {
    throw new Error('Home Assistant login did not complete. Check the screenshot username/password.');
  }
}

async function waitForDashboard(page, themeName, viewportName, scenarioName) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const loginVisible = await page.locator(
    'input[name="username"]:visible, input[autocomplete="username"]:visible'
  ).first().isVisible({ timeout: 1000 }).catch(() => false);

  if (loginVisible || page.url().includes('/auth/')) {
    throw new Error('Still on the Home Assistant login page. Screenshot run stopped.');
  }

  const loaded = page.waitForFunction(
    () => {
      const findDeep = (root) => {
        if (!root?.querySelectorAll) return false;
        if (
          root.querySelector('dwains-dashboard-next-layout-card') ||
          root.querySelector('dwains-dashboard-next-devices-card') ||
          root.querySelector('dwains-dashboard-next-card')
        ) {
          return true;
        }
        return [...root.querySelectorAll('*')].some((node) => node.shadowRoot && findDeep(node.shadowRoot));
      };
      return findDeep(document) || document.body.textContent?.includes('Dwains Dashboard');
    },
    null,
    { timeout: 45000 }
  ).then(() => 'loaded').catch(() => 'timeout');
  const failed = page
    .getByText(/Error loading the dashboard strategy/i)
    .first()
    .waitFor({ state: 'visible', timeout: 45000 })
    .then(() => 'failed')
    .catch(() => new Promise(() => {}));
  const result = await Promise.race([loaded, failed]);

  if (result === 'failed') {
    const debugFile = path.join(outputDir, themeName, viewportName, `${safeFileName(scenarioName)}-error.png`);
    await mkdir(path.dirname(debugFile), { recursive: true });
    await page.screenshot({ path: debugFile, fullPage: true }).catch(() => {});
    const bodyText = await page.locator('body').innerText().catch(() => '');
    throw new Error(`Dwains Dashboard Next did not load. Debug screenshot: ${debugFile}\n${bodyText.slice(0, 1000)}`);
  }
  if (result === 'timeout') {
    const debugFile = path.join(outputDir, themeName, viewportName, `${safeFileName(scenarioName)}-timeout.png`);
    await mkdir(path.dirname(debugFile), { recursive: true });
    await page.screenshot({ path: debugFile, fullPage: true }).catch(() => {});
    throw new Error(`Timed out waiting for Dwains Dashboard Next. Debug screenshot: ${debugFile}`);
  }
  await page.waitForTimeout(Number(process.env.DD_SCREENSHOT_SETTLE_MS || 1500));
}

async function closeTransientUi(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(() => {
    const visit = (root) => {
      const found = [];
      const nodes = root?.querySelectorAll?.('*') || [];
      for (const node of nodes) {
        if (
          node.tagName === 'DWAINS-DASHBOARD-NEXT-LAYOUT-CARD' ||
          node.tagName === 'DWAINS-DASHBOARD-NEXT-DEVICES-CARD' ||
          node.tagName === 'DWAINS-DASHBOARD-NEXT-BOTTOM-NAV'
        ) {
          found.push(node);
        }
        if (node.shadowRoot) {
          found.push(...visit(node.shadowRoot));
        }
      }
      return found;
    };

    for (const element of visit(document)) {
      if ('_mobileNavOpen' in element) {
        element._mobileNavOpen = false;
      }
      if ('_mobileDomainMenuOpen' in element) {
        element._mobileDomainMenuOpen = false;
      }
      if ('_restrictedMenuOpen' in element) {
        element._restrictedMenuOpen = false;
      }
      if ('_pagesOpen' in element) {
        element._pagesOpen = false;
      }
      if (element.tagName === 'DWAINS-DASHBOARD-NEXT-BOTTOM-NAV' && element.shadowRoot) {
        let style = element.shadowRoot.querySelector('style[data-dd-screenshot-cleanup]');
        if (!style) {
          style = document.createElement('style');
          style.setAttribute('data-dd-screenshot-cleanup', '');
          element.shadowRoot.appendChild(style);
        }
        style.textContent = `
          .pages-sheet,
          .pages-backdrop {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
      }
      if (
        (element.tagName === 'DWAINS-DASHBOARD-NEXT-LAYOUT-CARD' ||
          element.tagName === 'DWAINS-DASHBOARD-NEXT-DEVICES-CARD') &&
        element.shadowRoot
      ) {
        let style = element.shadowRoot.querySelector('style[data-dd-screenshot-cleanup]');
        if (!style) {
          style = document.createElement('style');
          style.setAttribute('data-dd-screenshot-cleanup', '');
          element.shadowRoot.appendChild(style);
        }
        style.textContent = `
          .mobile-nav-overlay {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
      }
      element.requestUpdate?.();
    }
  }).catch(() => {});
  await page.waitForTimeout(250);
}

function safeFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'screenshot';
}
