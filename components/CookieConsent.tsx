import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { focusTarget } from '../lib/focus';
import { ROUTES } from './navigation';

// Persisted visitor choice; index.html reads the same key on load to set
// Consent Mode defaults and decide whether Clarity may load.
const CONSENT_KEY = 'officience_cookie_consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __loadClarity?: () => void;
    __loadMatomo?: () => void;
  }
}

const readStored = (): string | null => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  // The control that reopened the banner ("Cookie Settings"). The focus goes
  // into the banner on a reopen and comes back here after the choice. A first
  // visit does not take the focus: the banner is not modal.
  const opener = useRef<HTMLElement | null>(null);
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    if (readStored() === null) setVisible(true);
    // Footer "Cookie Settings" re-opens the banner so consent can be withdrawn.
    const reopen = () => {
      opener.current = document.activeElement as HTMLElement | null;
      setReopened(true);
      setVisible(true);
    };
    window.addEventListener('officience:cookie-settings', reopen);
    return () => window.removeEventListener('officience:cookie-settings', reopen);
  }, []);

  // The banner is last in the tab order, so a reopen moved nothing for a
  // keyboard user. Move the focus to its first button.
  useEffect(() => {
    if (visible && reopened) bannerRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [visible, reopened]);

  const choose = useCallback((granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
    } catch {
      /* private mode — consent simply won't persist */
    }
    window.gtag?.('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
    if (granted) {
      window.__loadClarity?.();
      window.__loadMatomo?.();
    }
    // The choice removes the focused button, and the focus then fell to the
    // body. Return it to the opener, or to the page content.
    if (bannerRef.current?.contains(document.activeElement)) {
      const back = opener.current;
      if (back?.isConnected) back.focus({ preventScroll: true });
      else focusTarget(document.querySelector<HTMLElement>('main'));
    }
    opener.current = null;
    setReopened(false);
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={bannerRef}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-8 md:bottom-8 md:max-w-[480px] z-[90] bg-surface rounded-fig-m border border-gray-fig-100 shadow-[0_8px_40px_rgba(15,18,25,0.18)] p-fig-20 md:p-fig-32"
        >
          <h2 className="font-sans font-semibold text-[18px] text-text-default">
            Cookies &amp; privacy
          </h2>
          <p className="font-body text-[14px] leading-[22px] text-text-muted mt-fig-8">
            We use analytics cookies to understand how visitors use our site
            and to improve your experience. They are only set if you accept.
            Learn more in our{' '}
            <Link
              to={ROUTES.privacy}
              className="underline text-text-primary hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-fig-8 mt-fig-16">
            <button
              onClick={() => choose(false)}
              className="min-h-[44px] px-fig-20 rounded-fig-xs border border-gray-fig-100 font-sans font-medium text-[14px] text-text-default hover:bg-bg-secondary transition-colors"
            >
              Decline
            </button>
            <button
              onClick={() => choose(true)}
              className="min-h-[44px] px-fig-20 rounded-fig-xs bg-bg-primary font-sans font-medium text-[14px] text-white hover:bg-[#000086] transition-colors"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
