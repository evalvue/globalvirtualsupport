import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Wireframe() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });

  // Generate connection points on the globe
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(-1 + (2 * i) / 40);
      const theta = Math.sqrt(40 * Math.PI) * phi;
      const r = 2.02;
      pts.push([
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  // Connection arcs
  const arcs = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < 18; i++) {
      const a = points[Math.floor(Math.random() * points.length)];
      const b = points[Math.floor(Math.random() * points.length)];
      const start = new THREE.Vector3(...a);
      const end = new THREE.Vector3(...b);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(3.2);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      lines.push(curve.getPoints(40));
    }
    return lines;
  }, [points]);

  return (
    <group ref={ref}>
      {/* Glowing core */}
      <Sphere args={[1.95, 64, 64]}>
        <meshBasicMaterial color="#0a1530" transparent opacity={0.85} />
      </Sphere>
      {/* Wireframe sphere */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.35} />
      </Sphere>
      {/* Outer glow shell */}
      <Sphere args={[2.1, 32, 32]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.12} />
      </Sphere>

      {/* Node points */}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      ))}

      {/* Arcs */}
      {arcs.map((line, i) => {
        const geom = new THREE.BufferGeometry().setFromPoints(line);
        return (
          <line key={i}>
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial color="#00d4ff" transparent opacity={0.5} />
          </line>
        );
      })}
    </group>
  );
}

function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      const r = 8 + Math.random() * 12;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(p) * Math.cos(t);
      arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      arr[i * 3 + 2] = r * Math.cos(p);
    }
    return arr;
  }, []);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={800} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

const Globe3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -5, -5]} intensity={0.6} color="#8b5cf6" />
      <Stars />
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <Wireframe />
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
};

export default Globe3D;