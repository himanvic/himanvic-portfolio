// main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // Homepage layout
import Projects from './pages/Projects'; // Full project gallery page
import './index.css';
import { StarsCanvas } from './components/GlobalStarfield';
import CommandPalette from './components/sub/CommandPalette';
import AlgorithmVisualizer from './components/sub/AlgorithmVisualizer';

const GlobalShell = () => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  return (
    <>
      {/* 3D WebGL Starfield with Mouse Gravity & Hyperspace Warp */}
      <StarsCanvas />

      {/* Developer Cyber Terminal & Command Palette (Ctrl + K) */}
      <CommandPalette onOpenVisualizer={() => setIsVisualizerOpen(true)} />

      {/* Interactive Algorithmic Workbench (C++ & Python) */}
      <AlgorithmVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
      />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
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
