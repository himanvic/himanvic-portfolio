import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";

const TOTAL_DISTANT_STARS = 7000;
const TOTAL_CYAN_SPARKS = 1200;
const TOTAL_AMBER_SPARKS = 500;

/**
 * 3D Deep Space Starfield with Interactive Mouse Gravity,
 * Click Gravitational Shockwaves, and Hyperspace Warp Speed.
 */
const StarFieldMesh = () => {
  const groupRef = useRef();
  const distantRef = useRef();
  const cyanRef = useRef();
  const amberRef = useRef();

  // Mouse tracker with smooth lerp damping
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Gravitational pulse & warp speed multipliers
  const shockwaveRef = useRef(0);
  const warpSpeedRef = useRef(0);

  // Generate sphere particle coordinates once
  const distantPositions = useRef(
    random.inSphere(new Float32Array(TOTAL_DISTANT_STARS * 3), { radius: 1.25 })
  );
  const cyanPositions = useRef(
    random.inSphere(new Float32Array(TOTAL_CYAN_SPARKS * 3), { radius: 1.1 })
  );
  const amberPositions = useRef(
    random.inSphere(new Float32Array(TOTAL_AMBER_SPARKS * 3), { radius: 0.95 })
  );

  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handlePointerDown = () => {
      // Trigger a gravitational compression shockwave on click
      shockwaveRef.current = 1.0;
    };

    const handleWarp = () => {
      // Trigger hyperspace acceleration burst
      warpSpeedRef.current = 3.5;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("hyperspace-warp", handleWarp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("hyperspace-warp", handleWarp);
    };
  }, []);

  useFrame((_state, delta) => {
    const m = mouseRef.current;
    // Smooth inertial spring damping
    m.x += (m.targetX - m.x) * 0.05;
    m.y += (m.targetY - m.y) * 0.05;

    // Decay shockwave pulse
    if (shockwaveRef.current > 0) {
      shockwaveRef.current = Math.max(0, shockwaveRef.current - delta * 2.8);
    }

    // Decay warp speed
    if (warpSpeedRef.current > 0) {
      warpSpeedRef.current = Math.max(0, warpSpeedRef.current - delta * 1.4);
    }

    const shockPulse = Math.sin(shockwaveRef.current * Math.PI) * 0.12;
    const warpBoost = warpSpeedRef.current * 4.5;

    // 1. Group-level pulse & warp
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + shockPulse);
      groupRef.current.rotation.z += delta * warpBoost * 0.3;
    }

    // 2. Distant Starfield: Background drift + warp acceleration
    if (distantRef.current) {
      distantRef.current.rotation.x -= delta * (1 / 22 + warpBoost * 0.2);
      distantRef.current.rotation.y -= delta * (1 / 30 + warpBoost * 0.3);
      distantRef.current.position.x = m.x * 0.06;
      distantRef.current.position.y = -m.y * 0.06;
      distantRef.current.position.z = shockPulse * 0.3;
    }

    // 3. Cyan Cosmic Sparks: Higher sensitivity + radial expansion
    if (cyanRef.current) {
      cyanRef.current.rotation.x += delta * (1 / 18 + warpBoost * 0.25);
      cyanRef.current.rotation.y += delta * (1 / 24 + warpBoost * 0.35);
      cyanRef.current.position.x = m.x * 0.12;
      cyanRef.current.position.y = -m.y * 0.12;
      cyanRef.current.scale.setScalar(1 + shockPulse * 1.5);
    }

    // 4. Solar Amber Sparks: Orbital harmonic oscillation
    if (amberRef.current) {
      amberRef.current.rotation.x -= delta * (1 / 15 + warpBoost * 0.2);
      amberRef.current.rotation.y += delta * (1 / 20 + warpBoost * 0.3);
      amberRef.current.position.x = -m.x * 0.08;
      amberRef.current.position.y = m.y * 0.08;
      amberRef.current.scale.setScalar(1 + shockPulse * 1.2);
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      {/* 1. Deep Celestial White Stars */}
      <Points ref={distantRef} stride={3} positions={distantPositions.current} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>

      {/* 2. Electric Cyan Cosmic Sparks */}
      <Points ref={cyanRef} stride={3} positions={cyanPositions.current} frustumCulled>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.0032}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>

      {/* 3. Solar Amber Harmonic Sparks */}
      <Points ref={amberRef} stride={3} positions={amberPositions.current} frustumCulled>
        <PointMaterial
          transparent
          color="#facc15"
          size={0.0028}
          sizeAttenuation
          depthWrite={false}
          opacity={0.75}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => (
  <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
    <Canvas
      camera={{ position: [0, 0, 1] }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <StarFieldMesh />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;
