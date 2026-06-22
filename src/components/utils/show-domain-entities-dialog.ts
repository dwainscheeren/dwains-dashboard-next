import { fireEvent } from "./fire-event";
import type { DomainEntitiesDialogParams } from "../dwains-domain-entities-dialog";

export const loadDomainEntitiesDialog = () =>
  import("../dwains-domain-entities-dialog");

let isDialogOpen = false;

export const showDomainEntitiesDialog = (
  element: HTMLElement,
  dialogParams: DomainEntitiesDialogParams
): void => {
  // Prevent multiple dialogs
  if (isDialogOpen) {
    console.warn("Domain entities dialog is already open");
    return;
  }

  isDialogOpen = true;

  // Listen for dialog close
  const dialogClosedHandler = (e: Event) => {
    if ((e as CustomEvent).detail?.dialog === "dwains-dashboard-next-domain-entities-dialog") {
      isDialogOpen = false;
      element.removeEventListener("dialog-closed", dialogClosedHandler);
    }
  };

  element.addEventListener("dialog-closed", dialogClosedHandler);

  fireEvent(element, "show-dialog", {
    dialogTag: "dwains-dashboard-next-domain-entities-dialog",
    dialogImport: loadDomainEntitiesDialog,
    dialogParams,
  });

  // Fallback timeout in case dialog close event doesn't fire
  setTimeout(() => {
    if (isDialogOpen) {
      isDialogOpen = false;
      element.removeEventListener("dialog-closed", dialogClosedHandler);
    }
  }, 2000);
};