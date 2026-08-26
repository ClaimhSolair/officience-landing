import { useEffect, useRef, type RefObject } from 'react';

/**
 * Shared modal plumbing for every overlay surface (menu, survey, splash):
 * a scroll lock that also works on iOS, plus focus containment.
 */

/**
 * Every `:not([tabindex="-1"])` is load-bearing: an element the author has taken
 * out of the tab order must not become the initial focus target either. The
 * survey's honeypot is an off-screen `<input tabindex="-1">`, and without these
 * clauses it is the first match in the dialog — so opening the survey would send
 * focus 9999px off the left edge of the page.
 */
const FOCUSABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

// --- Body scroll lock -------------------------------------------------------

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: Partial<CSSStyleDeclaration> = {};

/**
 * `overflow: hidden` on the body does not hold on iOS Safari — the page still
 * rubber-bands and scrolls behind the overlay. Pinning the body with
 * `position: fixed` at a negative offset does, at the cost of having to restore
 * the scroll position by hand afterwards.
 *
 * Reference-counted, so an overlay opened on top of another doesn't release the
 * lock when only it closes.
 */
export const lockBodyScroll = () => {
  if (++lockCount > 1) return;
  const { body } = document;
  savedScrollY = window.scrollY;
  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
  };
  body.style.position = 'fixed';
  body.style.top = `-${savedScrollY}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
};

export const unlockBodyScroll = () => {
  if (lockCount === 0) return;
  if (--lockCount > 0) return;
  const { body } = document;
  body.style.position = savedStyles.position ?? '';
  body.style.top = savedStyles.top ?? '';
  body.style.left = savedStyles.left ?? '';
  body.style.right = savedStyles.right ?? '';
  body.style.width = savedStyles.width ?? '';
  // Jump straight back — an animated restore reads as the page scrolling itself.
  window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' as ScrollBehavior });
};

// --- Background inertness ---------------------------------------------------

/**
 * React 18 has no `inert` prop, so the attribute goes on directly. This keeps
 * screen readers and Tab out of the page behind an open overlay.
 */
export const setInert = (el: HTMLElement | null, inert: boolean) => {
  if (!el) return;
  if (inert) el.setAttribute('inert', '');
  else el.removeAttribute('inert');
};

// --- Hook -------------------------------------------------------------------

interface ModalA11yOptions {
  isOpen: boolean;
  onClose: () => void;
  /** The dialog element. Focus is trapped inside it and moved into it on open. */
  containerRef: RefObject<HTMLElement>;
  /** Everything behind the dialog, made inert while it is open. */
  backgroundRef?: RefObject<HTMLElement>;
  /** Set false for a surface that should not be dismissable with Escape. */
  closeOnEscape?: boolean;
}

/**
 * Locks background scroll, traps Tab inside the dialog, closes on Escape, and
 * returns focus to whatever opened it.
 */
export const useModalA11y = ({
  isOpen,
  onClose,
  containerRef,
  backgroundRef,
  closeOnEscape = true,
}: ModalA11yOptions) => {
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    const background = backgroundRef?.current ?? null;
    setInert(background, true);

    // Move focus into the dialog; the container itself is the fallback target.
    const container = containerRef.current;
    const first = container?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? container)?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const node = containerRef.current;
      if (!node) return;
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === firstEl || !node.contains(active))) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && (active === lastEl || !node.contains(active))) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      setInert(background, false);
      unlockBodyScroll();
      restoreFocusTo.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, containerRef, backgroundRef, closeOnEscape]);
};
