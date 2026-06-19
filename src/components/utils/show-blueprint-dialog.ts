import { fireEvent } from "./fire-event";
import type { BlueprintDialogParams } from "../dwains-blueprint-dialog";

export const loadBlueprintDialog = () => import("../dwains-blueprint-dialog");

export const showBlueprintDialog = (
  element: HTMLElement,
  dialogParams: BlueprintDialogParams
): void => {
  fireEvent(element, "show-dialog", {
    dialogTag: "dwains-blueprint-dialog",
    dialogImport: loadBlueprintDialog,
    dialogParams,
  });
};
