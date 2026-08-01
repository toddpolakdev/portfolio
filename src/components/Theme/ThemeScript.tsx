/**
 * Applies the stored theme before first paint so a light-mode visitor never
 * sees a flash of the dark palette. Runs blocking and inline on purpose.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
