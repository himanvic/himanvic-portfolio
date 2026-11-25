// File Name: RealTimeEarthCore.jsx
import React, { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { initCppEngine, getCppEngineSync } from "@/utils/cppEngine";

const computeUtcSunDirection = () => {
  const now = new Date();
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const wasm = getCppEngineSync();
  if (wasm) {
    wasm.exports.compute_utc_sun_vector(utcHours);
    return new THREE.Vector3(wasm.sunVec[0], wasm.sunVec[1], wasm.sunVec[2]);
  }
  const theta = (utcHours / 24) * Math.PI * 2;
  return new THREE.Vector3(-Math.cos(theta), 0.25, -Math.sin(theta)).normalize();
};

/**
 * 3D Earth Mesh with Real-Time Day/Night Solar Terminator Shader.
 * Surface stays locked to astronomical UTC coordinates while OrbitControls
 * rotates smoothly around it, keeping the India beacon pinned accurately.
 */
const EarthSphereMesh = ({ isHovered, isActive }) => {
  const cloudsRef = useRef();
  const beaconRef = useRef();

  const [dayMap, nightMap, cloudsMap, specularMap] = useLoader(THREE.TextureLoader, [
    "/assets/textures/earth/earth_day.jpg",
    "/assets/textures/earth/earth_night.jpg",
    "/assets/textures/earth/earth_clouds.png",
    "/assets/textures/earth/earth_specular.jpg",
  ]);

  const sunDirection = useMemo(() => computeUtcSunDirection(), []);

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

          float intensity = dot(normalize(vNormal), normalize(sunDirection));
          float dayWeight = smoothstep(-0.12, 0.12, intensity);
          float specGlint = pow(max(intensity, 0.0), 16.0) * spec * 0.8;

          vec3 day = dayColor * max(intensity, 0.18) + vec3(specGlint);
          vec3 night = nightColor * 2.8 + dayColor * 0.03;

          gl_FragColor = vec4(mix(night, day, dayWeight), 1.0);
        }
      `,
    });
  }, [dayMap, nightMap, specularMap, sunDirection]);

  // Refresh solar terminator angle via C++ WASM sun vector calculation
  useEffect(() => {
    initCppEngine().then((wasm) => {
      if (wasm) earthMaterial.uniforms.sunDirection.value.copy(computeUtcSunDirection());
    });
    const timer = setInterval(() => {
      earthMaterial.uniforms.sunDirection.value.copy(computeUtcSunDirection());
    }, 60000);
    return () => clearInterval(timer);
  }, [earthMaterial]);

  // Exact Cartesian coordinates for India on Three.js Sphere (20.59° N, 78.96° E)
  const indiaPos = useMemo(() => new THREE.Vector3(0.188, 0.344, -0.941), []);

  // Cleanup WebGL textures and shaders on unmount to free VRAM
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
    if (!isActive) return;
    const cloudSpeed = isHovered ? 0.032 : 0.014;
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * cloudSpeed;
    }
    if (beaconRef.current) {
      beaconRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4.5) * 0.3);
    }
  });

  return (
    <group scale={0.94}>
      {/* 1. Earth Surface Mesh (Day/Night Shader locked to real UTC coordinates) */}
      <mesh material={earthMaterial}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>

      {/* 2. Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.015, 48, 48]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Atmospheric Cyan Fresnel Glow */}
      <mesh>
        <sphereGeometry args={[1.038, 48, 48]} />
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
              gl_FragColor = vec4(0.0, 0.94, 1.0, 1.0) * intensity * 0.85;
            }
          `}
        />
      </mesh>

      {/* 4. India Location Beacon (Pinned cleanly on India coordinates) */}
      <group position={indiaPos}>
        <mesh ref={beaconRef}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0.85} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.012, 16, 16]} />
          <meshBasicMaterial color="#facc15" />
        </mesh>
      </group>
    </group>
  );
};

export const RealTimeEarthCore = ({ isHovered }) => {
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let isInView = true;
    const syncState = () => setIsActive(isInView && !document.hidden);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
        syncState();
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    document.addEventListener("visibilitychange", syncState);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncState);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          </div>
        }
      >
        <Canvas
          frameloop={isActive ? "always" : "demand"}
          camera={{ position: [0.6, 0.4, -2.9], fov: 45 }}
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.22} />
          <EarthSphereMesh isHovered={isHovered} isActive={isActive} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={isActive}
            autoRotateSpeed={isHovered ? 0.8 : 0.45}
            rotateSpeed={0.55}
          />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default RealTimeEarthCore;
