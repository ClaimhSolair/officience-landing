import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DESKTOP_IMAGE = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Banner%20web%20popup%201157x750.webp";
const MOBILE_IMAGE = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Banner%20mobile%20popup%20341x316.webp";
const SPLASH_ALT = "Celebrate 2/9 — Vietnam's National Day. Freedom, Unity, Prosperity. Officience 20 Years Anniversary.";
// Bump this key whenever the splash artwork changes, so returning visitors see the new banner once.
const STORAGE_KEY = "officience_splash_national_day_2026";
const SPLASH_DURATION_DESKTOP = 8000; // 8 seconds for desktop
const SPLASH_DURATION_MOBILE = 7000; // 7 seconds for mobile

const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if splash was shown today
    const lastShown = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (lastShown !== today) {
      // Show splash screen
      setIsVisible(true);
      // Store today's date
      localStorage.setItem(STORAGE_KEY, today);

      // Set duration based on device
      const duration = window.innerWidth < 768 ? SPLASH_DURATION_MOBILE : SPLASH_DURATION_DESKTOP;

      // Auto-hide after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Close Button - Top right of splash image */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            onClick={handleClose}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-2 md:p-2.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
            aria-label="Close splash screen"
          >
            <X size={20} className="md:w-6 md:h-6" />
          </motion.button>

          {/* Image Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-[90vw] max-h-[85vh] md:max-w-[80vw] md:max-h-[80vh]"
            style={{ aspectRatio: isMobile ? '682/632' : '2314/1500' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only the matching image is mounted, so a phone never downloads the desktop banner */}
            <img
              src={isMobile ? MOBILE_IMAGE : DESKTOP_IMAGE}
              alt={SPLASH_ALT}
              width={isMobile ? 682 : 2314}
              height={isMobile ? 632 : 1500}
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
