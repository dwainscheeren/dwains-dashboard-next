import { fireEvent } from "./fire-event";
import type { CardEditorDialogParams } from "../dwains-card-editor-dialog";

export const loadCardEditorDialog = () => import("../dwains-card-editor-dialog");

export const showCardEditorDialog = (
  element: HTMLElement,
  dialogParams: CardEditorDialogParams
): void => {
  fireEvent(element, "show-dialog", {
    dialogTag: "dwains-card-editor-dialog",
    dialogImport: loadCardEditorDialog,
    dialogParams,
  });
};
