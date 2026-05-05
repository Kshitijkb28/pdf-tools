import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Hero3DContent({ reducedMotion }: { reducedMotion: boolean }) {
  const mainRef = useRef<THREE.Mesh>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, state.pointer.x, 0.06);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, state.pointer.y, 0.06);

    if (mainRef.current) {
      mainRef.current.rotation.y += delta * 0.2;
      mainRef.current.rotation.x = mouse.current.y * 0.4;
      mainRef.current.position.x = 2.4 + mouse.current.x * 0.4;
      mainRef.current.position.y = 0.2 + mouse.current.y * 0.2;
    }
    if (knotRef.current) {
      knotRef.current.rotation.x += delta * 0.3;
      knotRef.current.rotation.y += delta * 0.4;
    }
  });

  const spheres = useMemo(
    () => [
      { pos: [-4.8, -1.4, -2] as [number, number, number], size: 0.12, color: '#6D6D6D' },
      { pos: [4.2, -2.8, -1.5] as [number, number, number], size: 0.1, color: '#9E9E9E' },
      { pos: [2.8, 2.6, -3] as [number, number, number], size: 0.16, color: '#333333' },
      { pos: [-4.6, -2.8, -2] as [number, number, number], size: 0.12, color: '#0F376E' },
      { pos: [-1.6, 2.8, -3.5] as [number, number, number], size: 0.09, color: '#E27500' },
    ],
    [],
  );

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -3, 2]} intensity={0.6} color="#E27500" />
      <pointLight position={[-3, 2, 3]} intensity={0.4} color="#0F376E" />

      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={mainRef} position={[2.4, 0.2, 0]}>
          <sphereGeometry args={[1.25, reducedMotion ? 32 : 96, reducedMotion ? 32 : 96]} />
          <MeshDistortMaterial
            color="#E27500"
            distort={reducedMotion ? 0 : 0.38}
            speed={reducedMotion ? 0 : 1.8}
            roughness={0.2}
            metalness={0.15}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.8} floatIntensity={0.6}>
        <mesh ref={knotRef} position={[-4.2, 2.4, -2.5]}>
          <torusKnotGeometry args={[0.22, 0.065, 128, 16]} />
          <meshStandardMaterial color="#0F376E" roughness={0.25} metalness={0.6} />
        </mesh>
      </Float>

      {spheres.map((s, i) => (
        <Float key={i} speed={1 + i * 0.15} rotationIntensity={0.4} floatIntensity={1.4}>
          <mesh position={s.pos}>
            <sphereGeometry args={[s.size, 32, 32]} />
            <meshStandardMaterial color={s.color} roughness={0.3} metalness={0.35} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function Scene3D() {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ background: 'transparent' }}
    >
      <Hero3DContent reducedMotion={reducedMotion} />
    </Canvas>
  );
}
