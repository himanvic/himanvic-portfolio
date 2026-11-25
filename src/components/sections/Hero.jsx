import React, { useEffect, useRef, useState } from "react";
import SolarSystem from "../sub/SolarSystem";
import RotatingTitles from "../sub/RotatingTitles";
import { useDeviceCapabilities } from "@/utils/deviceCapabilities";

const Hero = () => {
  const videoRef = useRef(null);
  const { allowBackgroundVideo } = useDeviceCapabilities();
  const [enableVideo, setEnableVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Defer 14.4 MB hero.mp4 streaming until after First Paint on capable desktops
  useEffect(() => {
    if (!allowBackgroundVideo) {
      setEnableVideo(false);
      setIsVideoReady(false);
      return;
    }

    let cancelled = false;
    const activate = () => {
      if (!cancelled) setEnableVideo(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(activate, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(id);
      };
    }

    const timer = setTimeout(activate, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [allowBackgroundVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enableVideo) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !document.hidden) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [enableVideo]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-20 sm:pb-24"
    >
      {/* Background ambient canopy: instant WebP poster at 0ms, lossless hero.mp4 streams lazily on desktop */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[108%] h-[320px] sm:h-[380px] overflow-hidden pointer-events-none z-0"
        style={{
          perspective: "1000px",
          maskImage: "radial-gradient(ellipse 80% 85% at 50% 0%, black 40%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 85% at 50% 0%, black 40%, transparent 95%)",
        }}
      >
        <img
          src="/assets/images/hero-poster.webp"
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
          style={{
            transform: "rotate(180deg) rotateX(10deg) scale(1.06)",
            transformOrigin: "center center",
          }}
        />

        {enableVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoReady ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "rotate(180deg) rotateX(10deg) scale(1.06)",
              transformOrigin: "center center",
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            onCanPlayThrough={() => setIsVideoReady(true)}
          >
            <source src="/assets/videos/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* Hero content container */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14 lg:gap-8 my-auto">
        <div className="flex-1 text-center lg:text-left px-2 max-w-2xl lg:max-w-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-emerald-300 text-xs sm:text-sm font-mono font-medium tracking-wide shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>ASPIRING DEVELOPER • C++ &amp; PYTHON</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.12]">
            Turning{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 inline-block pb-2">
              Curiosity
            </span>{" "}
            into Code,
            <br />
            <span className="text-gray-100">and Ideas into Experiences.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            Focused on low-level systems in C++ and algorithmic experimentation in Python. Building digital experiences and mastering software engineering from the ground up.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <a
              href="#projects"
              className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-sky-500 text-white font-medium rounded-full shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_32px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Projects</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>

            <a
              href="#about"
              className="px-6 py-3.5 rounded-full border border-cyan-500/20 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-md text-gray-200 hover:text-white font-medium hover:border-cyan-400/50 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>My Journey</span>
              <span className="text-amber-400">⚡</span>
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative px-2 w-full my-auto">
          <SolarSystem />

          <div className="mt-4 sm:mt-5 text-center">
            <div className="text-[11px] uppercase tracking-widest text-cyan-400/80 font-mono mb-1.5 font-semibold">
              Focus &amp; Craft
            </div>
            <RotatingTitles />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
