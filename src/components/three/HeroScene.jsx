import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Cinematic hero object: a liquid-chrome torus knot with iridescent clearcoat,
// orbited by glass pebbles, lit by a procedural studio environment of glowing
// light strips baked through PMREM (no HDR download, no helper libraries). Follows the cursor with damped rotation; `progress` (0..1, the
// hero's scroll-out progress, written by Hero.jsx) dollies the camera in and
// sinks/fades the object. Rendering pauses when `active` is false.

const BLUE = '#2997ff';
const VIOLET = '#a78bfa';

function damp(cur, tgt, lambda, dt) {
  return THREE.MathUtils.damp(cur, tgt, lambda, dt);
}

function layout(compact) {
  return compact ? { x: 0, y: 1.05, s: 0.68 } : { x: 1.55, y: 0, s: 1 };
}

function Knot({ progress, compact }) {
  const group = useRef();
  const mesh = useRef();
  const start = layout(compact);

  useFrame((state, dt) => {
    const p = progress.current || 0;
    const g = group.current;
    if (!g) return;
    const L = layout(compact);
    // cursor-follow tilt
    g.rotation.y = damp(g.rotation.y, state.pointer.x * 0.55, 3, dt);
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.35, 3, dt);
    // scroll choreography
    g.position.x = damp(g.position.x, L.x - p * (compact ? 0 : 1.2), 4, dt);
    g.position.y = damp(g.position.y, L.y - p * 1.4, 4, dt);
    g.scale.setScalar(damp(g.scale.x, L.s * (1 + p * 0.35), 4, dt));
    if (mesh.current) mesh.current.rotation.z += dt * 0.12;
    state.camera.position.z = damp(state.camera.position.z, 7 - p * 2.2, 4, dt);
  });

  return (
    <group ref={group} position={[start.x, start.y, 0]} scale={start.s}>
      <Float>
        <mesh ref={mesh} rotation={[0.4, 0.2, 0]}>
          <torusKnotGeometry args={[1.05, 0.34, 320, 64, 2, 3]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={1}
            roughness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.05}
            iridescence={0.9}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[120, 520]}
            envMapIntensity={1.35}
          />
        </mesh>
      </Float>
      <Pebbles />
    </group>
  );
}

function Pebbles() {
  const ref = useRef();
  const items = useMemo(
    () => [
      { r: 2.35, s: 0.22, speed: 0.35, phase: 0, y: 0.6 },
      { r: 2.7, s: 0.14, speed: -0.28, phase: 2.1, y: -0.8 },
      { r: 2.1, s: 0.1, speed: 0.5, phase: 4.2, y: 0.1 },
    ],
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current?.children.forEach((m, i) => {
      const it = items[i];
      const a = t * it.speed + it.phase;
      m.position.set(Math.cos(a) * it.r, it.y + Math.sin(t * 0.8 + i) * 0.2, Math.sin(a) * it.r * 0.6);
    });
  });

  return (
    <group ref={ref}>
      {items.map((it, i) => (
        <mesh key={i} scale={it.s}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial
            color={i === 1 ? VIOLET : '#ffffff'}
            metalness={0.1}
            roughness={0.02}
            transmission={1}
            thickness={1.2}
            ior={1.45}
            clearcoat={1}
            envMapIntensity={1.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Gentle bob + sway, like a product floating on a plinth.
function Float({ children, speed = 1.4, amp = 0.18 }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * 100, []);
  useFrame((state) => {
    const t = (state.clock.elapsedTime + offset) * speed;
    if (!ref.current) return;
    ref.current.position.y = Math.sin(t) * amp;
    ref.current.rotation.x = Math.cos(t / 2) * 0.12;
    ref.current.rotation.z = Math.sin(t / 3) * 0.08;
  });
  return <group ref={ref}>{children}</group>;
}

// Drifting blue dust.
function Sparkles({ count = 70 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 12;
      a[i * 3 + 1] = (Math.random() - 0.5) * 7;
      a[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return a;
  }, [count]);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.position.y = Math.sin(performance.now() / 4000) * 0.15;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color={BLUE} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

// Procedural studio lighting: emissive strips/discs/rings around the origin,
// baked once into a PMREM environment map.
const STRIPS = [
  { form: 'circle', color: '#ffffff', i: 4, pos: [0, 5, -9],  scale: [2, 2] },
  { form: 'circle', color: '#ffffff', i: 2, pos: [-5, 1, -1], scale: [2, 2] },
  { form: 'rect',   color: '#ffffff', i: 2, pos: [2, -1, -6], scale: [8, 2] },
  { form: 'ring',   color: BLUE,      i: 6, pos: [-4, -2, 4], scale: [4, 4] },
  { form: 'rect',   color: VIOLET,    i: 3, pos: [6, 3, 2],   scale: [2, 8] },
  { form: 'rect',   color: BLUE,      i: 5, pos: [0, -6, 2],  scale: [12, 1.2] },
];

function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const env = new THREE.Scene();
    const group = new THREE.Group();
    const disposables = [];
    const geos = {
      rect: new THREE.PlaneGeometry(1, 1),
      circle: new THREE.CircleGeometry(0.5, 48),
      ring: new THREE.RingGeometry(0.25, 0.5, 48),
    };
    Object.values(geos).forEach((g) => disposables.push(g));

    STRIPS.forEach(({ form, color, i, pos, scale }) => {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(i),
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      disposables.push(mat);
      const m = new THREE.Mesh(geos[form], mat);
      m.position.set(...pos);
      m.scale.set(scale[0], scale[1], 1);
      m.lookAt(0, 0, 0);
      group.add(m);
    });
    group.rotation.set(-Math.PI / 3, 0, 1);
    env.add(group);

    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(env, 0.02);
    scene.environment = rt.texture;

    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [gl, scene]);

  return null;
}

export default function HeroScene({ progress, active = true, compact = false }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    >
      <Knot progress={progress} compact={compact} />
      <Sparkles count={compact ? 40 : 80} />
      <StudioEnvironment />
    </Canvas>
  );
}
