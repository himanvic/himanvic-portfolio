// File Name: RealTimeEarthModal.jsx
import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FaTimes, FaCompass, FaArrowLeft } from "react-icons/fa";
import { playWarpSound, playCyberBlip } from "@/utils/audio";

/**
 * Convert Latitude & Longitude to 3D Cartesian Coordinates on a Sphere
 */
const _latLongToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

/**
 * 3D Earth Mesh with Real-Time Day/Night Solar Terminator Shader
 */
const EarthModel = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const beaconRef = useRef();

  // Load NASA textures from local public assets
  const [dayMap, nightMap, cloudsMap, specularMap] = useLoader(THREE.TextureLoader, [
    "/assets/textures/earth/earth_day.jpg",
    "/assets/textures/earth/earth_night.jpg",
    "/assets/textures/earth/earth_clouds.png",
    "/assets/textures/earth/earth_specular.jpg",
  ]);

  // Calculate real-time sun directional vector based on actual computer UTC time
  const sunDirection = useMemo(() => {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    // Real-time solar longitude angle around Earth
    const theta = (utcHours / 24) * Math.PI * 2;
    // Local sun direction matching Three.js SphereGeometry coordinates
    return new THREE.Vector3(-Math.cos(theta), 0.25, -Math.sin(theta)).normalize();
  }, []);

  // Custom Day/Night GLSL Shader Material
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayMap },
        nightTexture: { value: nightMap },
        specularMap: { value: specularMap },
        sunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform sampler2D specularMap;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb;
          float spec = texture2D(specularMap, vUv).r;

          // Intensity based on angle to sun in object coordinates
          float intensity = dot(normalize(vNormal), normalize(sunDirection));

          // Smooth twilight / terminator transition
          float dayWeight = smoothstep(-0.12, 0.12, intensity);

          // Specular glint on daylight oceans
          float specGlint = pow(max(intensity, 0.0), 16.0) * spec * 0.8;

          // Day side: illuminated Blue Marble + ocean specularity
          vec3 day = dayColor * max(intensity, 0.18) + vec3(specGlint);

          // Night side: dark terrain with glowing golden 4K NASA city lights
          vec3 night = nightColor * 2.8 + dayColor * 0.03;

          vec3 finalColor = mix(night, day, dayWeight);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });
  }, [dayMap, nightMap, specularMap, sunDirection]);

  // Exact Cartesian coordinates for India on Three.js Sphere (20.59° N, 78.96° E)
  const indiaPos = useMemo(() => new THREE.Vector3(0.188, 0.344, -0.941), []);

  useEffect(() => {
    return () => {
      dayMap?.dispose();
      nightMap?.dispose();
      cloudsMap?.dispose();
      specularMap?.dispose();
      earthMaterial?.dispose();
    };
  }, [dayMap, nightMap, cloudsMap, specularMap, earthMaterial]);

  useFrame((state, delta) => {
    // Gentle axial rotation of Earth
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.02;
    }
    // Atmospheric winds: clouds rotate slightly faster
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.028;
    }
    // Pulse beacon ring
    if (beaconRef.current) {
      beaconRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.25);
    }
  });

  return (
    <group>
      {/* 1. Earth Surface Mesh (Day/Night Shader) */}
      <mesh ref={earthRef} material={earthMaterial}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>

      {/* 2. Floating Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.016, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Atmospheric Electric Cyan Fresnel Glow */}
      <mesh>
        <sphereGeometry args={[1.035, 64, 64]} />
        <shaderMaterial
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
              gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.8;
            }
          `}
        />
      </mesh>

      {/* 4. India Location Beacon (Electric Cyan Pulsing Glow & Amber Core) */}
      <group position={indiaPos}>
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
};

export const RealTimeEarthModal = ({ isOpen, onClose }) => {
  const [deviceTime, setDeviceTime] = useState("");
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    // Signal app that 3D Earth is open so background starfield can pause
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("earth-modal-active", { detail: { active: true } }));
    }

    playWarpSound();

    const updateClock = () => {
      const now = new Date();
      setDeviceTime(now.toLocaleTimeString());
      setUtcTime(now.toUTCString().slice(17, 25) + " UTC");
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("earth-modal-active", { detail: { active: false } }));
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in cursor-pointer select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[88vh] bg-[#030612]/95 border border-cyan-500/40 rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.35)] overflow-hidden flex flex-col cursor-default"
      >
        {/* Top Header HUD */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/50 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playCyberBlip(720, 0.03);
                onClose();
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-950/60 border border-white/10 hover:border-cyan-400 text-gray-300 hover:text-white transition-all text-xs font-mono flex items-center gap-2 cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" />
              <span>Return to Orbit</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Real-Time Solar Terminator</span>
            </div>
          </div>

          {/* Real-Time Clocks HUD */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-gray-400 text-[10px]">DEVICE LOCAL TIME</span>
              <span className="text-cyan-300 font-bold">{deviceTime}</span>
            </div>
            <div className="hidden md:flex flex-col text-right border-l border-white/10 pl-3">
              <span className="text-gray-400 text-[10px]">ASTRONOMICAL UTC</span>
              <span className="text-amber-300 font-bold">{utcTime}</span>
            </div>

            <button
              onClick={() => {
                playCyberBlip(600, 0.03);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Close (ESC)"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Earth Canvas */}
        <div className="relative flex-1 w-full h-full bg-gradient-to-b from-[#02040b] via-[#040817] to-[#010206] overflow-hidden">
          <Suspense
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-cyan-400 font-mono text-xs gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span>Synchronizing 4K NASA Planetary Coordinates...</span>
              </div>
            }
          >
            <Canvas
              camera={{ position: [0.6, 0.4, -2.4], fov: 45 }}
              dpr={[1, 1.25]}
              gl={{
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: "high-performance",
              }}
              style={{ background: "transparent" }}
            >
              <ambientLight intensity={0.15} />
              <EarthModel />
              <OrbitControls
                enableZoom={true}
                minDistance={1.6}
                maxDistance={5.0}
                enablePan={false}
                rotateSpeed={0.6}
                autoRotate={true}
                autoRotateSpeed={0.35}
              />
            </Canvas>
          </Suspense>

          {/* Floating Astronomical Coordinates Pill */}
          <div className="absolute bottom-6 left-6 z-10 p-3.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-cyan-500/25 font-mono text-[11px] text-gray-300 space-y-1 shadow-lg pointer-events-none">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <FaCompass />
              <span>Base Station: India (20.59° N, 78.96° E)</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Drag to rotate globe • Scroll to zoom in/out
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeEarthModal;
