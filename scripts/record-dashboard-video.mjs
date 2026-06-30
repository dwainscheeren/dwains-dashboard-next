import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, rm, rename } from 'node:fs/promises';
import path from 'node:path';
import { routePrivateCameraImages } from './privacy-camera-route.mjs';

const baseUrl = (process.env.DD_VIDEO_BASE_URL || process.env.DD_SCREENSHOT_BASE_URL || 'http://localhost:8123').replace(/\/$/, '');
let dashboardRoot = process.env.DD_VIDEO_DASHBOARD_PATH || process.env.DD_SCREENSHOT_DASHBOARD_PATH
  ? normalizeDashboardRoot(process.env.DD_VIDEO_DASHBOARD_PATH || process.env.DD_SCREENSHOT_DASHBOARD_PATH)
  : '';
const outputDir = process.env.DD_VIDEO_OUTPUT_DIR || 'videos/generated';
const username = process.env.DD_VIDEO_USERNAME || process.env.DD_SCREENSHOT_USERNAME || process.env.HA_USERNAME || '';
const password = process.env.DD_VIDEO_PASSWORD || process.env.DD_SCREENSHOT_PASSWORD || process.env.HA_PASSWORD || '';
const areaId = process.env.DD_VIDEO_AREA_ID || process.env.DD_SCREENSHOT_AREA_ID || '';
const themes = parseList(process.env.DD_VIDEO_THEMES || 'light', ['light', 'dark']);
const viewportNames = parseList(process.env.DD_VIDEO_VIEWPORTS || 'mobile', ['desktop', 'mobile']);
const injectLocalBuild = process.env.DD_VIDEO_INJECT_LOCAL_BUILD !== 'false';
const collapseSidebar = process.env.DD_VIDEO_COLLAPSE_HA_SIDEBAR !== 'false';
const privacyCameras = (process.env.DD_VIDEO_PRIVACY_CAMERAS || process.env.DD_SCREENSHOT_PRIVACY_CAMERAS || '') !== 'false';
const privacyCameraAssetDir = path.resolve(process.env.DD_VIDEO_PRIVACY_CAMERA_DIR || process.env.DD_SCREENSHOT_PRIVACY_CAMERA_DIR || 'assets/demo-cameras');
const localBuildPath = path.resolve(process.env.DD_VIDEO_LOCAL_BUILD || process.env.DD_SCREENSHOT_LOCAL_BUILD || 'dist/dwains-dashboard-next.js');
const stepDelay = Number(process.env.DD_VIDEO_STEP_MS || 900);
const settleDelay = Number(process.env.DD_VIDEO_SETTLE_MS || 1200);
const trimStartSeconds = Math.max(0, Number(process.env.DD_VIDEO_TRIM_START_SECONDS ?? 6) || 0);
let localBuildRequests = 0;

const viewports = {
  desktop: {
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  },
  mobile: {
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
};

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: process.env.DD_VIDEO_HEADLESS !== 'false',
});

try {
  for (const theme of themes) {
    for (const viewportName of viewportNames) {
      const tempDir = path.join(outputDir, '.tmp', `${theme}-${viewportName}`);
      await rm(tempDir, { recursive: true, force: true });
      await mkdir(tempDir, { recursive: true });

      const context = await browser.newContext({
        ...viewports[viewportName],
        colorScheme: theme,
        recordVideo: {
          dir: tempDir,
          size: viewports[viewportName].viewport,
        },
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
      page.on('console', (message) => {
        if (['error', 'warning'].includes(message.type())) {
          console.log(`[browser:${message.type()}] ${message.text()}`);
        }
      });
      page.on('pageerror', (error) => {
        console.log(`[browser:pageerror] ${error.stack || error.message}`);
      });
      const video = page.video();

      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await loginIfNeeded(page);
      await applyTheme(page, theme);
      if (!dashboardRoot) {
        dashboardRoot = await discoverDashboardRoot(page);
        console.log(`Using dashboard path ${dashboardRoot}`);
      }
      await waitForStrategyRegistration(page);

      await recordDashboardTour(page, theme, viewportName);

      await context.close();
      const tempVideoPath = await video.path();
      const outputPath = path.join(outputDir, theme, `${viewportName}-tour.webm`);
      await writeFinalVideo(tempVideoPath, outputPath);
      await rm(tempDir, { recursive: true, force: true });
      console.log(`Saved ${outputPath}`);
    }
  }
} finally {
  await browser.close();
}

async function recordDashboardTour(page, theme, viewportName) {
  await openDashboardPath(page, 'home', theme);
  await waitForDashboard(page, `${theme}-${viewportName}-home`);
  await closeTransientUi(page);
  await collapseHomeAssistantSidebar(page, viewportName);
  await pause();

  await smoothScroll(page, viewportName === 'mobile' ? 700 : 500);
  await pause(500);
  await smoothScroll(page, 0);
  await pause();

  const selectedAreaId = areaId || await findFirstAreaId(page);
  const clickedArea = await clickFirstHomeArea(page);
  if (clickedArea) {
    await waitForDashboard(page, `${theme}-${viewportName}-area-click`);
    await closeTransientUi(page);
    await collapseHomeAssistantSidebar(page, viewportName);
    await pause();
  } else if (selectedAreaId) {
    await openDashboardPath(page, `home?dd_area=${encodeURIComponent(selectedAreaId)}`, theme);
    await waitForDashboard(page, `${theme}-${viewportName}-area`);
    await closeTransientUi(page);
    await collapseHomeAssistantSidebar(page, viewportName);
    await pause();
  }

  if (clickedArea || selectedAreaId) {
    await smoothScroll(page, viewportName === 'mobile' ? 850 : 650);
    await pause(500);
    await smoothScroll(page, 0);
    await pause(400);
    if (await clickFirstAreaEntity(page)) {
      await pause(900);
      await closeEntityDialog(page);
      await pause(500);
    }
  }

  await openDevicesView(page, theme);
  await waitForDashboard(page, `${theme}-${viewportName}-devices`);
  await closeTransientUi(page);
  await collapseHomeAssistantSidebar(page, viewportName);
  await pause();
  await smoothScroll(page, viewportName === 'mobile' ? 650 : 450);
  await pause(500);
  await smoothScroll(page, 0);
  await pause(400);

  if (await clickFirstDeviceGroup(page)) {
    await waitForDashboard(page, `${theme}-${viewportName}-device-group`);
    await closeTransientUi(page);
    await pause(500);
    await smoothScroll(page, viewportName === 'mobile' ? 900 : 650);
    await pause(500);
    await smoothScroll(page, 0);
    await pause(400);
    if (await clickFirstDeviceEntity(page)) {
      await pause(900);
      await closeEntityDialog(page);
      await pause(500);
    }
  }

  await openDashboardPath(page, 'home', theme);
  await waitForDashboard(page, `${theme}-${viewportName}-home-return`);
  await closeTransientUi(page);
  await collapseHomeAssistantSidebar(page, viewportName);
  await pause(500);

  await openSettingsView(page);
  await waitForDashboard(page, `${theme}-${viewportName}-settings`);
  await pause();
  await smoothScroll(page, viewportName === 'mobile' ? 500 : 350);
  await pause();
}

async function openDashboardPath(page, viewPath, theme) {
  const targetUrl = toDashboardUrl(viewPath);
  const canUseSpaNavigation = await page.evaluate(() => {
    const root = document.querySelector('home-assistant');
    return Boolean(root?.hass && !location.pathname.startsWith('/auth/'));
  }).catch(() => false);

  if (canUseSpaNavigation) {
    await waitForStrategyRegistration(page);
    await page.evaluate((url) => {
      window.history.pushState(null, '', url);
      const ev = new Event('location-changed', { bubbles: true, composed: true });
      ev.detail = { replace: false };
      window.dispatchEvent(ev);
    }, targetUrl);
  } else {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await loginIfNeeded(page);
  }
  await applyTheme(page, theme);
  await page.waitForTimeout(settleDelay);
}

async function openDevicesView(page, theme) {
  const currentPath = new URL(page.url()).pathname.replace(/\/$/, '');
  if (currentPath !== `${dashboardRoot}/home`) {
    await openDashboardPath(page, 'home', theme);
    await waitForDashboard(page, 'devices-home-start');
  }

  await page.evaluate((targetPath) => {
    const deepFind = (root, predicate) => {
      if (!root?.querySelectorAll) return null;
      for (const node of root.querySelectorAll('*')) {
        if (predicate(node)) return node;
        const nested = deepFind(node.shadowRoot, predicate);
        if (nested) return nested;
      }
      return null;
    };

    const nav = deepFind(document, (node) => node.localName === 'dwains-dashboard-next-bottom-nav');
    if (typeof nav?._go === 'function') {
      nav._go('devices');
      return;
    }

    window.history.pushState(null, '', targetPath);
    const ev = new Event('location-changed', { bubbles: true, composed: true });
    ev.detail = { replace: false };
    window.dispatchEvent(ev);
  }, `${dashboardRoot}/devices`).catch(async () => {
    await page.goto(toDashboardUrl('devices'), { waitUntil: 'domcontentloaded' });
  });
  await applyTheme(page, theme);
  await page.waitForTimeout(settleDelay);
}

async function openSettingsView(page) {
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('dwains-dashboard-next-open-settings'));
  }).catch(() => {});
  await page.waitForTimeout(settleDelay);
}

async function smoothScroll(page, targetY) {
  await page.evaluate(async (nextY) => {
    const collectDeep = (root, out = []) => {
      if (!root?.querySelectorAll) return out;
      for (const node of root.querySelectorAll('*')) {
        out.push(node);
        if (node.shadowRoot) collectDeep(node.shadowRoot, out);
      }
      return out;
    };
    const scrollRoot = collectDeep(document)
      .filter((node) => {
        const style = getComputedStyle(node);
        return (
          node.scrollHeight > node.clientHeight + 24 &&
          node.clientHeight > 120 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden'
        );
      })
      .sort((a, b) => {
        const aScore = a.matches?.('.content-area, .home-view, .area-view, .device-view, .settings-view') ? 1 : 0;
        const bScore = b.matches?.('.content-area, .home-view, .area-view, .device-view, .settings-view') ? 1 : 0;
        return bScore - aScore || b.scrollHeight - a.scrollHeight;
      })[0] ||
      document.scrollingElement ||
      document.documentElement ||
      document.body;
    const startY = scrollRoot.scrollTop;
    const maxY = Math.max(0, scrollRoot.scrollHeight - scrollRoot.clientHeight);
    const finalY = Math.max(0, Math.min(maxY, nextY));
    const distance = finalY - startY;
    const duration = 900;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    await new Promise((resolve) => {
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        scrollRoot.scrollTop = startY + distance * ease(progress);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }, targetY).catch(async () => {
    await page.mouse.wheel(0, targetY);
  });
}

async function pause(ms = stepDelay) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function writeFinalVideo(inputPath, outputPath) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await rm(outputPath, { force: true });

  if (trimStartSeconds <= 0) {
    await rename(inputPath, outputPath);
    return;
  }

  const trimmedPath = `${outputPath}.trimmed.webm`;
  await rm(trimmedPath, { force: true });

  const trimmed = await runFfmpeg([
    '-hide_banner',
    '-loglevel',
    'error',
    '-y',
    '-ss',
    String(trimStartSeconds),
    '-i',
    inputPath,
    '-c',
    'copy',
    trimmedPath,
  ]);

  if (trimmed) {
    await rename(trimmedPath, outputPath);
    return;
  }

  await rm(trimmedPath, { force: true });
  console.log(`Could not trim the first ${trimStartSeconds}s from ${outputPath}; saving the untrimmed recording.`);
  await rename(inputPath, outputPath);
}

async function runFfmpeg(args) {
  return await new Promise((resolve) => {
    const child = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', () => resolve(false));
    child.on('close', (code) => {
      if (code !== 0 && stderr.trim()) {
        console.log(stderr.trim());
      }
      resolve(code === 0);
    });
  });
}

async function clickFirstHomeArea(page) {
  const clicked = await clickDeepElement(page, {
    selectors: ['button.mobile-area-card', '.mobile-area-card', '.area-card'],
    rejectText: /^home\b/i,
    minWidth: 90,
    minHeight: 70,
  });
  if (clicked) await page.waitForTimeout(settleDelay);
  return clicked;
}

async function clickFirstAreaEntity(page) {
  const clicked = await clickDeepElement(page, {
    selectors: ['article.mobile-entity-card', '.mobile-entity-card', '.entity-card-wrapper'],
    rejectSelector: 'button, .mobile-entity-action, .mobile-cover-actions, .dd-domain-add-card',
    minWidth: 80,
    minHeight: 60,
  });
  if (clicked) await page.waitForTimeout(500);
  return clicked;
}

async function clickFirstDeviceGroup(page) {
  const clicked = await clickDeepElement(page, {
    selectors: ['button.devices-overview-card', 'button.area-button'],
    rejectText: /^(overview|new devices|maintenance|energy)\b/i,
    minWidth: 120,
    minHeight: 48,
  });
  if (clicked) await page.waitForTimeout(settleDelay);
  return clicked;
}

async function clickFirstDeviceEntity(page) {
  const clicked = await clickDeepElement(page, {
    selectors: ['.entity-card-wrapper', 'article.mobile-entity-card'],
    rejectSelector: 'button, .mobile-entity-action, .mobile-cover-actions',
    minWidth: 80,
    minHeight: 60,
  });
  if (clicked) await page.waitForTimeout(500);
  return clicked;
}

async function clickDeepElement(page, options) {
  return await page.evaluate(async (config) => {
    const collectDeep = (root, out = []) => {
      if (!root?.querySelectorAll) return out;
      for (const node of root.querySelectorAll('*')) {
        out.push(node);
        if (node.shadowRoot) collectDeep(node.shadowRoot, out);
      }
      return out;
    };
    const isVisible = (node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return (
        rect.width >= config.minWidth &&
        rect.height >= config.minHeight &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight &&
        rect.right > 0 &&
        rect.left < window.innerWidth &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity || 1) > 0.05
      );
    };
    const matchesSelector = (node) => config.selectors.some((selector) => node.matches?.(selector));
    const candidates = collectDeep(document)
      .filter((node) => {
        if (!matchesSelector(node) || !isVisible(node)) return false;
        if (config.rejectSelector && node.matches?.(config.rejectSelector)) return false;
        const text = (node.textContent || '').trim();
        if (!text) return false;
        if (config.rejectText && new RegExp(config.rejectText.source, config.rejectText.flags).test(text)) return false;
        return true;
      })
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return ar.top - br.top || ar.left - br.left;
      });

    const target = candidates[0];
    if (!target) return '';
    target.scrollIntoView({ block: 'center', inline: 'center' });
    await new Promise((resolve) => setTimeout(resolve, 120));
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    return (target.textContent || '').trim().slice(0, 120);
  }, {
    ...options,
    rejectText: options.rejectText ? { source: options.rejectText.source, flags: options.rejectText.flags } : null,
  }).catch(() => '');
}

async function closeEntityDialog(page) {
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(200);
  const closed = await page.evaluate(() => {
    const collectDeep = (root, out = []) => {
      if (!root?.querySelectorAll) return out;
      for (const node of root.querySelectorAll('*')) {
        out.push(node);
        if (node.shadowRoot) collectDeep(node.shadowRoot, out);
      }
      return out;
    };
    const buttons = collectDeep(document).filter((node) => {
      const label = String(node.getAttribute?.('aria-label') || node.getAttribute?.('title') || '').toLowerCase();
      return (
        node.matches?.('ha-icon-button, mwc-icon-button, button') &&
        (label.includes('close') || label.includes('sluiten') || label.includes('cancel') || node.getAttribute?.('dialogaction') === 'cancel')
      );
    });
    const target = buttons[0];
    if (!target) return false;
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));
    return true;
  }).catch(() => false);
  if (!closed) {
    await page.keyboard.press('Escape').catch(() => {});
  }
  await page.waitForTimeout(500);
}

function normalizeDashboardRoot(value) {
  const clean = (value || '').trim() || '/dashboard-dd1';
  const withSlash = clean.startsWith('/') ? clean : `/${clean}`;
  return withSlash.replace(/\/(?:home|devices)\/?$/, '').replace(/\/$/, '');
}

function toDashboardUrl(viewPath) {
  const cleanPath = viewPath.startsWith('/') ? viewPath.slice(1) : viewPath;
  return `${baseUrl}${dashboardRoot}/${cleanPath}`;
}

async function routeLocalDashboardBuild(context) {
  if (!injectLocalBuild) return;

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
    throw new Error('Could not auto-detect Dwains Dashboard Next. Set DD_VIDEO_DASHBOARD_PATH, for example /dd-next.');
  }

  return normalizeDashboardRoot(`/${dashboard.url_path}`);
}

async function findFirstAreaId(page) {
  const areas = await page.evaluate(async () => {
    const root = document.querySelector('home-assistant');
    const hass = root?.hass;
    if (!hass?.callWS) return [];
    const areaRegistry = await hass.callWS({ type: 'config/area_registry/list' });
    const deviceRegistry = await hass.callWS({ type: 'config/device_registry/list' }).catch(() => []);
    const deviceAreaIds = new Set(deviceRegistry.map((device) => device.area_id).filter(Boolean));
    return areaRegistry
      .filter((area) => deviceAreaIds.has(area.area_id))
      .map((area) => area.area_id);
  }).catch(() => []);

  return areas[0] || '';
}

async function applyTheme(page, theme) {
  await page.emulateMedia({ colorScheme: theme }).catch(() => {});
  await page.evaluate(async (themeMode) => {
    const dark = themeMode === 'dark';
    try {
      localStorage.setItem('selectedTheme', JSON.stringify({ dark }));
    } catch {
      /* ignore storage errors */
    }
    const root = document.querySelector('home-assistant');
    root?._updateHass?.({ selectedTheme: { dark } });
    root?._applyTheme?.(dark);
    const hass = root?.hass;
    if (hass) {
      hass.selectedTheme = { ...(hass.selectedTheme || {}), dark };
      if (hass.themes) {
        hass.themes = { ...hass.themes, darkMode: dark };
      }
    }
  }, theme).catch(() => {});
  await page.waitForTimeout(250);
}

async function collapseHomeAssistantSidebar(page, viewportName) {
  if (!collapseSidebar || viewportName !== 'desktop') return;

  const toggled = await page.evaluate(() => {
    const deepFind = (root, predicate) => {
      if (!root?.querySelectorAll) return null;
      for (const node of root.querySelectorAll('*')) {
        if (predicate(node)) return node;
        const nested = deepFind(node.shadowRoot, predicate);
        if (nested) return nested;
      }
      return null;
    };

    const sidebar = deepFind(document, (node) => node.localName === 'ha-sidebar');
    const sidebarWidth = sidebar?.getBoundingClientRect?.().width || 0;
    if (sidebarWidth > 0 && sidebarWidth < 100) return false;

    const target =
      deepFind(document, (node) => node.localName === 'home-assistant-main') ||
      document.querySelector('home-assistant');
    if (!target) return false;

    target.dispatchEvent(new CustomEvent('hass-toggle-menu', { bubbles: true, composed: true }));
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
    throw new Error('Home Assistant login is required. Set DD_VIDEO_USERNAME and DD_VIDEO_PASSWORD.');
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
    throw new Error('Home Assistant login did not complete. Check the username/password.');
  }
}

async function waitForDashboard(page, scenarioName) {
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  const loaded = await page.waitForFunction(
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
  ).then(() => true).catch(() => false);

  if (!loaded) {
    const debugFile = path.join(outputDir, `debug-${safeFileName(scenarioName)}.png`);
    await mkdir(path.dirname(debugFile), { recursive: true });
    await page.screenshot({ path: debugFile, fullPage: true }).catch(() => {});
    const bodyText = await page.locator('body').innerText().catch(() => '');
    throw new Error(
      `Timed out waiting for Dwains Dashboard Next while recording ${scenarioName}. Debug screenshot: ${debugFile}\n${bodyText.slice(0, 1000)}`
    );
  }
  await page.waitForTimeout(settleDelay);
}

async function waitForStrategyRegistration(page) {
  const registered = await page.waitForFunction(
    () => customElements.get('ll-strategy-dashboard-dwains-dashboard-next'),
    null,
    { timeout: 20000 }
  ).then(() => true).catch(() => false);

  if (!registered) {
    throw new Error('Timed out waiting for the Dwains Dashboard Next strategy element to be registered.');
  }
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
        if (node.shadowRoot) found.push(...visit(node.shadowRoot));
      }
      return found;
    };

    for (const element of visit(document)) {
      if ('_mobileNavOpen' in element) element._mobileNavOpen = false;
      if ('_mobileDomainMenuOpen' in element) element._mobileDomainMenuOpen = false;
      if ('_restrictedMenuOpen' in element) element._restrictedMenuOpen = false;
      if ('_pagesOpen' in element) element._pagesOpen = false;
      element.requestUpdate?.();
    }
  }).catch(() => {});
  await page.waitForTimeout(250);
}

function parseList(value, allowed) {
  const valid = value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => allowed.includes(item));
  return valid.length ? [...new Set(valid)] : [allowed[0]];
}

function safeFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'video';
}
