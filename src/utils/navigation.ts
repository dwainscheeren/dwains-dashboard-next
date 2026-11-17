/** Allows dashboard editors to confirm before navigation initiated by DD Next. */
export const DASHBOARD_NAVIGATION_REQUEST_EVENT = 'dwains-dashboard-next-navigation-request';

export function navigateHomeAssistant(path: string, replace = false): void {
  const nextPath = path.startsWith('/') ? path : `/${path}`;
  const navigate = () => {
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
  };

  if (window.dispatchEvent(new CustomEvent(DASHBOARD_NAVIGATION_REQUEST_EVENT, {
    cancelable: true,
    detail: { navigate },
  }))) navigate();
}

export function openHomeAssistantProfile(): void {
  // Use the same route as HA's sidebar and let HA choose its default profile page.
  navigateHomeAssistant('/profile');
}
