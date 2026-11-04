// File Name: App.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Profile from './components/sections/Profile';
import Footer from './components/layout/Footer';

const App = () => {
  const location = useLocation();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // scroll to the section if there's a hash in the URL
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="relative w-full overflow-x-hidden scroll-smooth">
      {/* Top Cyber Laser Scroll Progress Line */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 z-[100] pointer-events-none shadow-[0_0_12px_rgba(6,182,212,0.85)]"
      />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Profile />
      <Footer />
    </div>
  );
};

export default App;
