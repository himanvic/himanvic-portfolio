// File Name: HoloCore3D.jsx
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3D Holographic Singularity Core
 * Combines a counter-rotating Icosahedron wireframe lattice,
 * an inner glowing Octahedron crystal, and an orbiting energy ring.
 */
const CoreMesh = ({ isHovered }) => {
  const outerRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointer = (e) => {
      // Localized parallax based on screen position
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  useFrame((state, delta) => {
    const speedMultiplier = isHovered ? 2.5 : 1.0;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // 1. Outer Icosahedron: slow rotation + mouse tilt
    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.4 * speedMultiplier;
      outerRef.current.rotation.y += delta * 0.6 * speedMultiplier;
      // Parallax tilt
      outerRef.current.rotation.z = THREE.MathUtils.lerp(
        outerRef.current.rotation.z,
        mx * 0.4,
        0.05
      );
    }

    // 2. Inner Octahedron: reverse gyroscopic spin
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.5 * speedMultiplier;
      innerRef.current.rotation.y -= delta * 0.8 * speedMultiplier;
      innerRef.current.rotation.z += delta * 0.3 * speedMultiplier;
    }

    // 3. Orbital Energy Ring: precession wave
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.2 * speedMultiplier;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.3 + my * 0.3;
    }
  });

  return (
    <group scale={isHovered ? 1.15 : 1.0}>
      {/* 1. Outer Glowing Electric Cyan Wireframe Icosahedron */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={isHovered ? 0.95 : 0.75}
        />
      </mesh>

      {/* 2. Inner Dual-Tone Solar Amber & Cyan Gem Crystal */}
      <mesh ref={innerRef}>
        <octahedronGeometry args={[0.82, 0]} />
        <meshBasicMaterial
          color="#facc15"
          wireframe
          transparent
          opacity={isHovered ? 0.85 : 0.6}
        />
      </mesh>

      {/* 3. Translucent Crystal Heart with Additive Glow */}
      <mesh>
        <octahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Precessing Orbital Energy Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[1.6, 1.66, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          side={THREE.DoubleSide}
          transparent
          opacity={isHovered ? 0.8 : 0.45}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

export const HoloCore3D = ({ isHovered }) => {
  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <CoreMesh isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

export default HoloCore3D;
