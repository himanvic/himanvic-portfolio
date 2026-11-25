// File Name: deviceCapabilities.js
import { useState, useEffect } from "react";

/**
 * Evaluates local browser capabilities (zero telemetry, purely client-side)
 * so graphics fidelity, video streaming, and animation rates scale smoothly
 * from budget phones to 4K desktops.
 */
export function getDeviceCapabilities() {
  if (typeof window === "undefined") {
    return {
      tier: "high",
      isCoarsePointer: false,
      isSmallViewport: false,
      prefersReducedMotion: false,
      saveData: false,
      allowBackgroundVideo: true,
      starScale: 1,
      particleCount: 900,
      maxDpr: 1.25,
    };
  }

  const prefersReducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  const isCoarsePointer =
    window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  const isSmallViewport = window.innerWidth < 768;

  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(conn?.saveData);
  const effectiveType = conn?.effectiveType || "4g";
  const isSlowNetwork = effectiveType === "slow-2g" || effectiveType === "2g";

  const memoryGb = typeof navigator.deviceMemory === "number" ? navigator.deviceMemory : 8;
  const cpuCores = typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : 8;
  const isLowEndHardware = memoryGb <= 2 || cpuCores <= 2;

  let tier = "high";
  if (prefersReducedMotion || saveData || isSlowNetwork || isLowEndHardware) {
    tier = "lite";
  } else if (isCoarsePointer || isSmallViewport || memoryGb <= 4) {
    tier = "balanced";
  }

  return {
    tier,
    isCoarsePointer,
    isSmallViewport,
    prefersReducedMotion,
    saveData,
    allowBackgroundVideo: tier === "high" && !isSmallViewport && !isCoarsePointer,
    starScale: tier === "lite" ? 0.35 : tier === "balanced" ? 0.5 : 1,
    particleCount: tier === "lite" ? 420 : tier === "balanced" ? 650 : 900,
    maxDpr: tier === "lite" ? 1 : isCoarsePointer ? 1 : 1.25,
  };
}

export function useDeviceCapabilities() {
  const [caps, setCaps] = useState(getDeviceCapabilities);

  useEffect(() => {
    const sync = () => setCaps(getDeviceCapabilities());
    const mqMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const mqPointer = window.matchMedia?.("(pointer: coarse)");

    mqMotion?.addEventListener?.("change", sync);
    mqPointer?.addEventListener?.("change", sync);
    window.addEventListener("resize", sync, { passive: true });

    return () => {
      mqMotion?.removeEventListener?.("change", sync);
      mqPointer?.removeEventListener?.("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return caps;
}
