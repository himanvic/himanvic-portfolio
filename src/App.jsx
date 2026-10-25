// File Name: App.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Encryption from './components/sections/Encryption';
import Footer from './components/layout/Footer';

const App = () => {
  const location = useLocation();

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
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Encryption />
      <Footer />
    </div>
  );
};

export default App;
