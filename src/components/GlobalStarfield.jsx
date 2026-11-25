import React, { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useDeviceCapabilities } from "@/utils/deviceCapabilities";
import { initCppEngine, getCppEngineSync } from "@/utils/cppEngine";

const BASE_DISTANT_STARS = 2200;
const BASE_CYAN_SPARKS = 450;
const BASE_AMBER_SPARKS = 200;

/**
 * Generates uniform 3D spherical star coordinates via C++20 WASM when ready,
 * with identical inline Archimedes spherical fallback before instantiation.
 */
const generateSpherePoints = (count, radius, seed = 1337) => {
  const wasm = getCppEngineSync();
  if (wasm && count <= 3072) {
    wasm.exports.fill_sphere_points(count, radius, seed);
    return new Float32Array(wasm.starXyz.subarray(0, count * 3));
  }
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2 * Math.PI;
    const z = 2 * v - 1;
    const rXY = Math.sqrt(Math.max(0, 1 - z * z));
    const r = radius * Math.cbrt(Math.random());
    const offset = i * 3;
    arr[offset] = r * rXY * Math.cos(theta);
    arr[offset + 1] = r * rXY * Math.sin(theta);
    arr[offset + 2] = r * z;
  }
  return arr;
};

const StarFieldMesh = ({ starScale, isCoarsePointer }) => {
  const groupRef = useRef();
  const distantRef = useRef();
  const cyanRef = useRef();
  const amberRef = useRef();

  const [isPaused, setIsPaused] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const shockwaveRef = useRef(0);
  const warpSpeedRef = useRef(0);

  const distantPositions = useMemo(
    () => generateSpherePoints(Math.round(BASE_DISTANT_STARS * starScale), 1.25, 1337),
    [starScale]
  );
  const cyanPositions = useMemo(
    () => generateSpherePoints(Math.round(BASE_CYAN_SPARKS * starScale), 1.1, 4242),
    [starScale]
  );
  const amberPositions = useMemo(
    () => generateSpherePoints(Math.round(BASE_AMBER_SPARKS * starScale), 0.95, 7919),
    [starScale]
  );

  useEffect(() => {
    initCppEngine();
  }, []);

  useEffect(() => {
    const handlePointerMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handlePointerDown = () => {
      shockwaveRef.current = 1.0;
    };

    const handleWarp = () => {
      warpSpeedRef.current = 3.5;
    };

    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };

    const handleEarthActive = (e) => {
      setIsPaused(!!(e.detail && e.detail.active));
    };

    if (!isCoarsePointer) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("hyperspace-warp", handleWarp);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("toggle-earth-core", handleEarthActive);

    return () => {
      if (!isCoarsePointer) {
        window.removeEventListener("pointermove", handlePointerMove);
      }
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("hyperspace-warp", handleWarp);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("toggle-earth-core", handleEarthActive);
    };
  }, [isCoarsePointer]);

  useFrame((_state, delta) => {
    if (isPaused) return;

    const m = mouseRef.current;
    m.x += (m.targetX - m.x) * 0.05;
    m.y += (m.targetY - m.y) * 0.05;

    if (shockwaveRef.current > 0) {
      shockwaveRef.current = Math.max(0, shockwaveRef.current - delta * 2.8);
    }

    if (warpSpeedRef.current > 0) {
      warpSpeedRef.current = Math.max(0, warpSpeedRef.current - delta * 1.4);
    }

    const shockPulse = Math.sin(shockwaveRef.current * Math.PI) * 0.12;
    const warpBoost = warpSpeedRef.current * 4.5;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + shockPulse);
      groupRef.current.rotation.z += delta * warpBoost * 0.3;
    }

    if (distantRef.current) {
      distantRef.current.rotation.x -= delta * (1 / 22 + warpBoost * 0.2);
      distantRef.current.rotation.y -= delta * (1 / 30 + warpBoost * 0.3);
      distantRef.current.position.x = m.x * 0.06;
      distantRef.current.position.y = -m.y * 0.06;
      distantRef.current.position.z = shockPulse * 0.3;
    }

    if (cyanRef.current) {
      cyanRef.current.rotation.x += delta * (1 / 18 + warpBoost * 0.25);
      cyanRef.current.rotation.y += delta * (1 / 24 + warpBoost * 0.35);
      cyanRef.current.position.x = m.x * 0.12;
      cyanRef.current.position.y = -m.y * 0.12;
      cyanRef.current.scale.setScalar(1 + shockPulse * 1.5);
    }

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
      <Points ref={distantRef} stride={3} positions={distantPositions} frustumCulled>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.0018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>

      <Points ref={cyanRef} stride={3} positions={cyanPositions} frustumCulled>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.0032}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>

      <Points ref={amberRef} stride={3} positions={amberPositions} frustumCulled>
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

export const StarsCanvas = () => {
  const { tier, starScale, maxDpr, isCoarsePointer } = useDeviceCapabilities();

  if (tier === "lite") {
    return (
      <div
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(6,182,212,0.06) 0%, transparent 45%), radial-gradient(circle at 75% 70%, rgba(250,204,21,0.04) 0%, transparent 45%), #000000",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={maxDpr === 1 ? 1 : [1, maxDpr]}
        gl={{
          preserveDrawingBuffer: false,
          antialias: false,
          powerPreference: "low-power",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <StarFieldMesh starScale={starScale} isCoarsePointer={isCoarsePointer} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
