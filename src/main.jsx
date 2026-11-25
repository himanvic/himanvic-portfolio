// main.jsx
import React, { Component, useEffect, useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import CommandPalette from './components/sub/CommandPalette';

// Defer heavy WebGL starfield & sub-routes so First Paint completes immediately
const StarsCanvas = lazy(() => import('./components/GlobalStarfield'));
const Projects = lazy(() => import('./pages/Projects'));
const AlgorithmVisualizer = lazy(() => import('./components/sub/AlgorithmVisualizer'));

class SafeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-gray-200 px-6 text-center gap-4">
          <p className="font-mono text-sm text-cyan-300">A runtime view reset is required.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-mono hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auto-recover once if an open tab requests rotated hashed chunks after a fresh deployment
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    const key = 'himanvic_chunk_reload_once';
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1');
      event.preventDefault();
      window.location.reload();
    }
  });
}

const GlobalShell = () => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [showStars, setShowStars] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const mountStars = () => {
      if (!cancelled) setShowStars(true);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(mountStars, { timeout: 600 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timer = setTimeout(mountStars, 150);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeErrorBoundary>
      {showStars && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}

      <CommandPalette onOpenVisualizer={() => setIsVisualizerOpen(true)} />

      <Suspense fallback={null}>
        {isVisualizerOpen && (
          <AlgorithmVisualizer
            isOpen={isVisualizerOpen}
            onClose={() => setIsVisualizerOpen(false)}
          />
        )}
      </Suspense>

      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center bg-black text-cyan-400 font-mono text-xs select-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-2" />
            <span>Loading systems archive...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </Suspense>
    </SafeErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalShell />
    </BrowserRouter>
  </React.StrictMode>
);
