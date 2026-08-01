/**
 * The command palette is mounted once near the root, but anything on the page
 * may want to open it. A window event keeps that decoupled — no context
 * provider wrapping the whole tree just to expose one boolean.
 */
export const PALETTE_OPEN_EVENT = "palette:open";

export function openPalette() {
  window.dispatchEvent(new CustomEvent(PALETTE_OPEN_EVENT));
}
