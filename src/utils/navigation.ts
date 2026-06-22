export function navigateHomeAssistant(path: string, replace = false): void {
  const nextPath = path.startsWith('/') ? path : `/${path}`;

  if (replace) {
    window.history.replaceState(null, '', nextPath);
  } else {
    window.history.pushState(null, '', nextPath);
  }

  window.dispatchEvent(
    new CustomEvent('location-changed', {
      bubbles: true,
      composed: true,
      detail: { replace },
    })
  );
}
