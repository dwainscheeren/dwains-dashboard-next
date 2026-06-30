import { existsSync } from 'node:fs';
import path from 'node:path';

const CAMERA_ASSETS = ['garage.svg', 'driveway.svg', 'patio.svg', 'kitchen.svg'];

export async function routePrivateCameraImages(context, options = {}) {
  const {
    enabled = true,
    assetDir = path.resolve('assets/demo-cameras'),
  } = options;

  if (!enabled) return;

  await context.route(/.*\/api\/camera_proxy.*/, async (route) => {
    const requestUrl = route.request().url();
    const fileName = CAMERA_ASSETS[hashString(requestUrl) % CAMERA_ASSETS.length];
    const assetPath = path.join(assetDir, fileName);

    if (existsSync(assetPath)) {
      await route.fulfill({
        status: 200,
        path: assetPath,
        contentType: 'image/svg+xml',
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: fallbackCameraSvg(),
    });
  });
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

function fallbackCameraSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#2f3b42"/>
      <stop offset="100%" stop-color="#111519"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="110" y="130" width="420" height="330" rx="28" fill="rgba(255,255,255,.16)"/>
  <rect x="710" y="170" width="340" height="260" rx="24" fill="rgba(255,255,255,.12)"/>
  <rect y="440" width="1280" height="280" fill="rgba(255,255,255,.08)"/>
  <circle cx="32" cy="30" r="5" fill="#fff" opacity=".75"/>
</svg>`;
}
