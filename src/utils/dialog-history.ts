/**
 * Home Assistant's dialog manager gives an open dialog its own history entry
 * and closes the dialog with history.back(). That back step only finishes
 * later, with a popstate event. A URL pushed before that event is undone by
 * the back step, so the navigation ends up where the dialog was opened.
 */

/** Longest wait for the back step before navigating anyway. */
const BACK_STEP_TIMEOUT_MS = 1000;

type DialogHistoryWindow = Pick<
  Window,
  'history' | 'addEventListener' | 'removeEventListener' | 'setTimeout' | 'clearTimeout'
>;

/**
 * Close a dialog and navigate afterwards: `navigate` runs once the back step
 * of the dialog has landed. Without a history entry for the dialog there is
 * no back step and `navigate` runs right away.
 */
export function closeDialogThenNavigate(
  dialogTag: string,
  close: () => void,
  navigate: () => void,
  win: DialogHistoryWindow = window
): void {
  // Home Assistant only steps back when the dialog owns the current entry.
  const state = win.history.state as { dialog?: unknown } | null;
  const ownsHistoryEntry = state?.dialog === dialogTag;

  close();

  if (!ownsHistoryEntry) {
    navigate();
    return;
  }

  let fallbackTimer = 0;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    win.removeEventListener('popstate', onPopState);
    win.clearTimeout(fallbackTimer);
    navigate();
  };

  const onPopState = () => {
    win.removeEventListener('popstate', onPopState);
    // Let Home Assistant's own popstate listeners finish first.
    win.setTimeout(finish, 0);
  };

  win.addEventListener('popstate', onPopState);
  fallbackTimer = win.setTimeout(finish, BACK_STEP_TIMEOUT_MS);
}
