import React from 'react';

const RELOAD_FLAG = 'officience_chunk_reload';

/**
 * A stale lazy chunk is the failure this exists for. Every deploy renames the
 * hashed chunk files, and `vercel.json` rewrites unknown paths to index.html —
 * so a tab left open across a deploy asks for a chunk that no longer exists,
 * gets HTML back, and the dynamic import throws. Without a boundary that error
 * unmounts the whole tree and the visitor sees a blank page.
 */
const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? `${error.name} ${error.message}` : String(error);
  return /Loading chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
    message,
  );
};

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (!isChunkLoadError(error)) return;
    // Reload once to pick up the current chunk names. The session flag stops a
    // reload loop when the import fails for some other reason (offline, 500).
    let alreadyReloaded = false;
    try {
      alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1';
      if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      // Private-mode Safari throws on sessionStorage; fall through to the message.
      alreadyReloaded = true;
    }
    if (!alreadyReloaded) window.location.reload();
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    // Recovered — let a future stale chunk trigger its own reload.
    if (prevState.error && !this.state.error) {
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        /* nothing to clear */
      }
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-[16px] px-[24px] text-center">
        <h1 className="font-sans text-h2 text-text-default">This page didn&apos;t load</h1>
        <p className="max-w-[480px] font-body text-body-lg text-text-muted">
          Something went wrong while loading this part of the site. Reloading usually fixes it.
        </p>
        <div className="flex flex-wrap gap-[12px] justify-center">
          <button
            onClick={() => window.location.reload()}
            className="h-[48px] px-[24px] rounded-fig-xs bg-primary text-white font-sans font-medium text-[16px] hover:bg-[#000086] active:bg-[#000050] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Reload
          </button>
          <a
            href="/"
            className="h-[48px] px-[24px] inline-flex items-center rounded-fig-xs border border-primary text-text-primary font-sans font-medium text-[16px] hover:bg-pri-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Back to home
          </a>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
