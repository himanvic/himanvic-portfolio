// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App'; // Homepage layout
import Projects from './pages/Projects'; // Full project gallery page
import './index.css';
import { StarsCanvas } from './components/GlobalStarfield';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StarsCanvas /> {/* ✅ Shared background: rendered ONCE across all routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
