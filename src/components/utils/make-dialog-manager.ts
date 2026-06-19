import type { LitElement } from "lit";
import type { HomeAssistant } from "../../types/home-assistant";

interface ShowDialogParams<T> {
  dialogTag: string;
  dialogImport: () => Promise<any>;
  dialogParams: T;
}

interface DialogElement extends HTMLElement {
  showDialog(params: any): void;
  closeDialog?(): void;
}

// Keep track of active dialogs
const activeDialogs = new Map<string, DialogElement>();

let dialogManagerInitialized = false;
let hassUpdateInterval: number | undefined;

export const makeDialogManager = (
  element: LitElement & { hass: HomeAssistant }
) => {
  // Prevent multiple event listeners
  if (dialogManagerInitialized) return;
  dialogManagerInitialized = true;

  const showDialogHandler = async (e: Event) => {
    const event = e as CustomEvent<ShowDialogParams<unknown>>;
    event.stopPropagation();
    event.stopImmediatePropagation();

    const { dialogTag, dialogImport, dialogParams } = event.detail;

    // Check if dialog already exists
    if (activeDialogs.has(dialogTag)) {
      console.warn(`Dialog ${dialogTag} is already open`);
      return;
    }

    // Load the dialog module
    await dialogImport();

    // Remove any existing dialog element with same tag
    const existingDialog = document.querySelector(dialogTag);
    if (existingDialog) {
      existingDialog.remove();
    }

    // Create the dialog element
    const dialog = document.createElement(dialogTag) as DialogElement & { hass: HomeAssistant };
    dialog.hass = element.hass;

    // Store reference to active dialog
    activeDialogs.set(dialogTag, dialog);

    // Always add dialog to document body
    document.body.appendChild(dialog);

    // Show the dialog after a tick
    requestAnimationFrame(() => {
      dialog.showDialog(dialogParams);
    });

    // Clean up when dialog closes
    const cleanup = () => {
      activeDialogs.delete(dialogTag);
      if (document.body.contains(dialog)) {
        dialog.remove();
      }

      // Stop hass updates if no more dialogs
      if (activeDialogs.size === 0 && hassUpdateInterval) {
        clearInterval(hassUpdateInterval);
        hassUpdateInterval = undefined;
      }
    };

    dialog.addEventListener("dialog-closed", cleanup, { once: true });

    // Start hass update interval if this is the first dialog
    if (activeDialogs.size === 1 && !hassUpdateInterval) {
      startHassUpdates();
    }
  };

  // Function to update all active dialogs with current hass
  const updateActiveDialogs = () => {
    activeDialogs.forEach((dialog) => {
      if (dialog && 'hass' in dialog) {
        (dialog as any).hass = element.hass;
      }
    });
  };

  // Start monitoring hass updates
  const startHassUpdates = () => {
    hassUpdateInterval = window.setInterval(() => {
      if (activeDialogs.size > 0) {
        updateActiveDialogs();
      } else {
        // Safety cleanup
        if (hassUpdateInterval) {
          clearInterval(hassUpdateInterval);
          hassUpdateInterval = undefined;
        }
      }
    }, 100); // Update every 100ms
  };

  element.addEventListener("show-dialog", showDialogHandler, { capture: true });
};