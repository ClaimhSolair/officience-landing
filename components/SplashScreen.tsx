import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const DESKTOP_IMAGE = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Banner%20splash%20web%2020th%201157x750.png";
const MOBILE_IMAGE = "https://pub-e3bac769bc084adbae54275f1413ca66.r2.dev/Banner%20splash%2020th%20mobi%20341x316.png";
const STORAGE_KEY = "officience_splash_20th";
const SPLASH_DURATION_DESKTOP = 5000; // 5 seconds for desktop
const SPLASH_DURATION_MOBILE = 4000; // 4 seconds for mobile

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative max-w-[90vw] max-h-[85vh] md:max-w-[80vw] md:max-h-[80vh]"
            style={{ aspectRatio: isMobile ? '682/632' : '2314/1500' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Image */}
            <img
              src={DESKTOP_IMAGE}
              alt="Welcome to Officience"
              width={2314}
              height={1500}
              className={`hidden md:block w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl ${isMobile ? 'hidden' : ''}`}
              loading="eager"
            />

            {/* Mobile Image */}
            <img
              src={MOBILE_IMAGE}
              alt="Welcome to Officience"
              width={682}
              height={632}
              className="md:hidden w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              loading="eager"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
