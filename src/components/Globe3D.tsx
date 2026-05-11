import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

const EARTH_DAY = "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const EARTH_BUMP = "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png";
const EARTH_SPEC = "https://unpkg.com/three-globe@2.31.1/example/img/earth-water.png";
const CLOUDS = "https://unpkg.com/three-globe@2.31.1/example/img/clouds.png";

function Earth() {
  const ref = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const [dayMap, bumpMap, specMap, cloudMap] = useTexture([
    EARTH_DAY,
    EARTH_BUMP,
    EARTH_SPEC,
    CLOUDS,
  ]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.12;
  });

  // Generate connection points on the globe
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 24; i++) {
      const phi = Math.acos(-1 + (2 * i) / 24);
      const theta = Math.sqrt(24 * Math.PI) * phi;
      const r = 2.04;
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
    for (let i = 0; i < 14; i++) {
      const a = points[Math.floor(Math.random() * points.length)];
      const b = points[Math.floor(Math.random() * points.length)];
      const start = new THREE.Vector3(...a);
      const end = new THREE.Vector3(...b);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(3.0);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      lines.push(curve.getPoints(40));
    }
    return lines;
  }, [points]);

  return (
    <group ref={ref}>
      {/* Earth surface */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          map={dayMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={new THREE.Color("#1a3a5a")}
          shininess={12}
        />
      </Sphere>
      {/* Clouds layer */}
      <Sphere ref={cloudRef as never} args={[2.03, 64, 64]}>
        <meshPhongMaterial map={cloudMap} transparent opacity={0.35} depthWrite={false} />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[2.12, 64, 64]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[2.22, 64, 64]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>

      {/* Node points */}
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      ))}

      {/* Arcs */}
      {arcs.map((line, i) => {
        const geom = new THREE.BufferGeometry().setFromPoints(line);
        return (
          <line key={i}>
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial color="#00d4ff" transparent opacity={0.55} />
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
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} color="#ffffff" />
      <pointLight position={[-10, -5, -5]} intensity={0.5} color="#8b5cf6" />
      <Stars />
      <Suspense fallback={null}>
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <Earth />
        </Float>
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
    </Canvas>
  );
};

export default Globe3D;