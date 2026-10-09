import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header';
import Footer from './components/Footer';
import MenuOverlay from './components/MenuOverlay';
import Survey from './components/Survey';
import CookieConsent from './components/CookieConsent';
import ScrollManager from './components/ScrollManager';
import SmoothScroll from './components/SmoothScroll';
import ErrorBoundary from './components/ErrorBoundary';
import { ROUTES } from './components/navigation';
import HomePage from './pages/HomePage';
import type { SurveyBranch } from './types';
import { MOTION_FORCED } from './lib/motion';

// Legal copy is long and rarely read — it leaves the home bundle.
const LegalPage = React.lazy(() => import('./pages/LegalPage'));

// About Us carries its own photography and two interactive sections. It is a
// second landing surface, not part of the home page, so it ships as its own
// chunk.
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

// The DIY Jam story carries about thirty photos of its own, so it is a chunk of
// its own too.
const DiyJamStoryPage = React.lazy(() => import('./pages/DiyJamStoryPage'));

// The seven service pages share one template and one chunk. Their pictures come
// from the bucket, so the chunk holds only the copy.
const ServicePage = React.lazy(() => import('./pages/ServicePage'));

// The Services hub, which points to the seven service pages.
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));

// The Work listing and the case studies. Each is a chunk of its own.
const WorkPage = React.lazy(() => import('./pages/WorkPage'));
const WorkCasePage = React.lazy(() => import('./pages/WorkCasePage'));

// The Career hub and the job pages. Each is a chunk of its own.
const CareerPage = React.lazy(() => import('./pages/CareerPage'));
const JobPage = React.lazy(() => import('./pages/JobPage'));
const ApplyModal = React.lazy(() => import('./components/career/ApplyModal'));

export interface LayoutContext {
  openSurvey: (branch?: SurveyBranch) => void;
  /** Opens the Career apply form. A job slug selects that job's role chip. */
  openApply: (jobSlug?: string) => void;
}

/**
 * The shell every route renders inside: header, footer, and the overlays that
 * must survive navigation (survey, cookie banner, analytics).
 */
const Layout: React.FC = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [surveyBranch, setSurveyBranch] = useState<SurveyBranch>('work');
  const [, setSurveyData] = useState<Record<string, string> | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // The apply form mounts on the first open only, so its chunk stays out of
  // every page load until a visitor asks for it. `form` keys the form. It stays
  // the same while the visitor reopens the form for the same job, so the
  // entries stay. It changes for a different job and after a successful send,
  // so that open mounts a clean form. A reset after mount would swap the
  // content under the focus that the modal hook has just placed.
  const [apply, setApply] = useState<{ open: boolean; mounted: boolean; form: number; sent: boolean; jobSlug?: string }>({
    open: false,
    mounted: false,
    form: 0,
    sent: false,
  });
  const pageRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // A route change while an overlay is open would leave it covering the new
  // page, with the page still locked and inert. On a phone the Back gesture is
  // the normal way to leave a full-screen form, so every overlay closes here.
  // The apply form keeps its `form` key, so its draft stays (ruling 21u).
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSurveyOpen(false);
    setApply((s) => (s.open ? { ...s, open: false } : s));
  }, [pathname]);

  const openSurvey = (branch: SurveyBranch = 'work') => {
    setSurveyBranch(branch);
    setIsSurveyOpen(true);
  };
  const closeSurvey = () => setIsSurveyOpen(false);

  const openApply = (jobSlug?: string) =>
    setApply((s) => ({
      open: true,
      mounted: true,
      form: s.sent || jobSlug !== s.jobSlug ? s.form + 1 : s.form,
      sent: false,
      jobSlug,
    }));
  const closeApply = useCallback(() => setApply((s) => ({ ...s, open: false })), []);
  const applySent = useCallback(() => setApply((s) => ({ ...s, sent: true })), []);

  return (
    <div className="bg-background min-h-screen w-full box-border flex flex-col font-sans text-gray-900 selection:bg-yellow-400 selection:text-black">
      <ScrollManager />


      {/* Stacking context for the whole page; overlays below sit above it. */}
      <div ref={pageRef} className="flex-1 relative isolate flex flex-col min-h-screen">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background" />

        <Header onOpenMenu={() => setIsMenuOpen(true)} isMenuOpen={isMenuOpen} />

        {/* Per-page rhythm lives in the page, not here — see pages/HomePage.tsx. */}
        <main className="relative z-10 flex-grow flex flex-col">
          <ErrorBoundary>
            {/* One full screen tall, so the footer paints below the first screen
                while the page chunk loads. A shorter box showed the footer in
                view and then pushed it down (CLS 0.27-0.32 on every lazy route). */}
            <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
              <Outlet context={{ openSurvey, openApply } satisfies LayoutContext} />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>

      {/* Outside the page wrapper on purpose: the menu marks that wrapper inert
          while it is open, and would disable itself if it lived inside. */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} backgroundRef={pageRef} />

      {/* Same treatment as the menu: rendered outside the page wrapper it makes
          inert, so it cannot disable itself. */}
      <Survey
        isOpen={isSurveyOpen}
        onClose={closeSurvey}
        onComplete={setSurveyData}
        initialBranch={surveyBranch}
        backgroundRef={pageRef}
      />

      {/* The Career apply form. Outside the page wrapper for the same reason
          as the survey, and mounted on the first open only. */}
      {apply.mounted && (
        <Suspense fallback={null}>
          <ApplyModal
            key={apply.form}
            isOpen={apply.open}
            onClose={closeApply}
            onSent={applySent}
            jobSlug={apply.jobSlug}
            backgroundRef={pageRef}
          />
        </Suspense>
      )}

      {/* Cookie consent banner (Google Consent Mode v2) */}
      <CookieConsent />

      <Analytics />
      <SpeedInsights />
    </div>
  );
};

const App = () => (
  // Every framer-motion animation in the tree collapses for visitors who ask
  // their OS for reduced motion — except when motion is forced on (an explicit
  // ?motion=on, or a preview host); see MOTION_FORCED in lib/motion.
  <MotionConfig reducedMotion={MOTION_FORCED ? 'never' : 'user'}>
    {/* Wheel smoothing for every route, so all pages scroll the same. */}
    <SmoothScroll>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.diyJam} element={<DiyJamStoryPage />} />
          <Route path={ROUTES.services} element={<ServicesPage />} />
          <Route path={`${ROUTES.services}/:slug`} element={<ServicePage />} />
          <Route path={ROUTES.work} element={<WorkPage />} />
          <Route path={`${ROUTES.work}/:slug`} element={<WorkCasePage />} />
          <Route path={ROUTES.career} element={<CareerPage />} />
          <Route path={`${ROUTES.career}/:slug`} element={<JobPage />} />
          <Route path={ROUTES.terms} element={<LegalPage doc="terms" />} />
          <Route path={ROUTES.privacy} element={<LegalPage doc="privacy" />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Route>
      </Routes>
    </SmoothScroll>
  </MotionConfig>
);

export default App;
