import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface CookieConsentProps {
  onOpenPrivacy: () => void;
}

const readStored = (): string | null => {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
};

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readStored() === null) setVisible(true);
    // Footer "Cookie Settings" re-opens the banner so consent can be withdrawn.
    const reopen = () => setVisible(true);
    window.addEventListener('officience:cookie-settings', reopen);
    return () => window.removeEventListener('officience:cookie-settings', reopen);
  }, []);

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
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
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
            <button
              onClick={onOpenPrivacy}
              className="underline text-text-primary hover:opacity-80 transition-opacity"
            >
              Privacy Policy
            </button>
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
