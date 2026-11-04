// main.jsx
import React, { useState, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // Homepage layout
import './index.css';
import { StarsCanvas } from './components/GlobalStarfield';
import CommandPalette from './components/sub/CommandPalette';

// Route-Based Code Splitting: heavy sub-pages and modal tools loaded on demand
const Projects = lazy(() => import('./pages/Projects'));
const AlgorithmVisualizer = lazy(() => import('./components/sub/AlgorithmVisualizer'));

const GlobalShell = () => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  return (
    <>
      {/* 3D WebGL Starfield with Mouse Gravity & Hyperspace Warp */}
      <StarsCanvas />

      {/* Developer Cyber Terminal & Command Palette (Ctrl + K) */}
      <CommandPalette onOpenVisualizer={() => setIsVisualizerOpen(true)} />

      {/* Interactive Algorithmic Workbench (C++ & Python) - Lazy Loaded */}
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
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalShell />
    </BrowserRouter>
  </React.StrictMode>,
);
