/**
 * Moves the keyboard focus to `el` and does not scroll the page.
 *
 * A route change or a jump to a section moves the view, but the focus stays
 * where it was. The next Tab then starts from the old position, and a screen
 * reader does not announce the new place. This helper moves the focus with the
 * view.
 *
 * An element that cannot take the focus gets `tabindex="-1"` and no outline
 * for that one focus. Both go when the element loses the focus, so a click on
 * the text later does not focus the section.
 */
export const focusTarget = (el: HTMLElement | null) => {
  if (!el) return;
  // A link, a button or a field has a tabIndex of 0 or more without the attribute.
  const added = !el.hasAttribute('tabindex') && el.tabIndex < 0;
  const cleanUp = () => {
    el.removeAttribute('tabindex');
    el.style.removeProperty('outline');
  };
  if (added) {
    el.setAttribute('tabindex', '-1');
    el.style.outline = 'none';
  }
  el.focus({ preventScroll: true });
  if (!added) return;
  // An inert page (an open overlay) refuses the focus. Then remove the attribute now.
  if (document.activeElement !== el) cleanUp();
  else el.addEventListener('blur', cleanUp, { once: true });
};
