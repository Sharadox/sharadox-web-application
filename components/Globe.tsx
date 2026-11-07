"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ----------------------------------------------------------------------------
 * Interactive dot globe.
 * Convention: lng 0 faces the camera (+z); rotation.y = -lng brings a longitude
 * to the front, rotation.x = lat tilts a latitude to the centre.
 * ------------------------------------------------------------------------- */

const HOME = { lat: 37.08, lng: -8.03 }; // Almancil, Algarve
const CITIES: [number, number][] = [
  [51.51, -0.13],   // London
  [40.71, -74.0],   // New York
  [-23.55, -46.63], // São Paulo
  [25.2, 55.27],    // Dubai
  [1.35, 103.82],   // Singapore
  [35.68, 139.69],  // Tokyo
  [37.77, -122.42], // San Francisco
  [52.52, 13.4],    // Berlin
  [-33.92, 18.42],  // Cape Town
  [19.43, -99.13],  // Mexico City
  [-33.87, 151.21], // Sydney
  [55.75, 37.62],   // Moscow
];

const rad = (d: number) => (d * Math.PI) / 180;
function toVec(lat: number, lng: number, r = 1) {
  const la = rad(lat), ln = rad(lng);
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(ln), r * Math.sin(la), r * Math.cos(la) * Math.cos(ln));
}

/* Land dots: facing dots are bright, edge dots fade, a few twinkle. */
const dotVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixel;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    float facing = dot(n, vec3(0.0, 0.0, 1.0));
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.6 + aSeed * 40.0);
    vAlpha = smoothstep(-0.05, 0.55, facing) * twinkle;
    gl_PointSize = uPixel * (0.9 + 0.5 * aSeed) * (3.2 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const dotFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.1, d) * vAlpha;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`;

/* Fresnel glow used for the body rim and the outer atmosphere. */
const glowVertex = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const bodyFragment = /* glsl */ `
  varying vec3 vN;
  void main() {
    float rim = pow(1.0 - abs(vN.z), 3.0);
    gl_FragColor = vec4(vec3(0.02) + vec3(0.32) * rim, 1.0);
  }
`;
const atmoFragment = /* glsl */ `
  varying vec3 vN;
  uniform float uStrength;
  void main() {
    // Back faces: strongest just outside the globe's edge, fading to zero at the outer rim.
    float i = smoothstep(0.0, 0.55, -vN.z);
    gl_FragColor = vec4(vec3(1.0), i * i * uStrength);
  }
`;

/* Arcs: a faint path plus a bright pulse travelling along it. */
const arcVertex = /* glsl */ `
  varying float vU;
  void main() {
    vU = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  varying float vU;
  void main() {
    float t = fract(uTime * 0.16 + uOffset);
    float head = smoothstep(0.0, 0.16, 0.16 - abs(vU - t * 1.3 + 0.15));
    float base = 0.10;
    float ends = smoothstep(0.0, 0.04, vU) * smoothstep(1.0, 0.96, vU);
    gl_FragColor = vec4(vec3(1.0), (base + head * 0.95) * ends);
  }
`;

function useLand() {
  const [pts, setPts] = useState<Float32Array | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/globe/land.bin")
      .then((r) => r.arrayBuffer())
      .then((b) => live && setPts(new Float32Array(b)));
    return () => {
      live = false;
    };
  }, []);
  return pts;
}

function Dots({ data }: { data: Float32Array }) {
  const { gl } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const n = data.length / 2;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = toVec(data[i * 2], data[i * 2 + 1], 1.001);
      pos.set([v.x, v.y, v.z], i * 3);
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [data]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixel: { value: 2.6 * Math.min(gl.getPixelRatio(), 2) } }), [gl]);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <points geometry={geo}>
      <shaderMaterial ref={mat} vertexShader={dotVertex} fragmentShader={dotFragment} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}

function Arc({ to, offset }: { to: [number, number]; offset: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const a = toVec(HOME.lat, HOME.lng, 1.002);
    const b = toVec(to[0], to[1], 1.002);
    const dist = a.distanceTo(b);
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1 + dist * 0.38);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return new THREE.TubeGeometry(curve, 90, 0.0032, 6, false);
  }, [to]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOffset: { value: offset } }), [offset]);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh geometry={geo}>
      <shaderMaterial ref={mat} vertexShader={arcVertex} fragmentShader={arcFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Marker({ lat, lng, home = false }: { lat: number; lng: number; home?: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const p = useMemo(() => toVec(lat, lng, 1.004), [lat, lng]);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), p.clone().normalize()), [p]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.6) % 1;
    ring.current.scale.setScalar(1 + t * 5);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8;
  });
  return (
    <group position={p} quaternion={q}>
      <mesh>
        <circleGeometry args={[home ? 0.014 : 0.008, 20]} />
        <meshBasicMaterial color="#fff" transparent opacity={home ? 1 : 0.85} />
      </mesh>
      {home && (
        <mesh ref={ring}>
          <ringGeometry args={[0.014, 0.018, 40]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function World({ data, reduced }: { data: Float32Array; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { gl, size } = useThree();
  const st = useRef({
    rotY: -rad(HOME.lng) - 0.5, // start over Europe/Africa; auto-rotation drifts west
    rotX: rad(HOME.lat) * 0.62,
    velY: 0,
    velX: 0,
    drag: false,
    lastX: 0,
    lastY: 0,
    idle: 0,
    tiltX: 0,
    tiltY: 0,
  });

  useEffect(() => {
    const el = gl.domElement;
    const s = st.current;
    const down = (e: PointerEvent) => {
      s.drag = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.18;
      s.tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.18;
      if (!s.drag) return;
      const dx = e.clientX - s.lastX, dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      const k = 2.6 / Math.max(size.width, 1);
      s.velY = dx * k;
      s.velX = dy * k;
      s.rotY += s.velY;
      s.rotX = THREE.MathUtils.clamp(s.rotX + s.velX, -0.9, 1.1);
      s.idle = 0;
    };
    const up = (e: PointerEvent) => {
      s.drag = false;
      el.style.cursor = "grab";
      try { el.releasePointerCapture(e.pointerId); } catch {}
    };
    const leave = () => { s.tiltX = 0; s.tiltY = 0; };
    el.style.cursor = "grab";
    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
    };
  }, [gl, size.width]);

  useFrame((_, dt) => {
    const s = st.current;
    const g = group.current;
    if (!g) return;
    if (!s.drag) {
      // momentum, then a gentle auto-rotation
      s.rotY += s.velY;
      s.rotX = THREE.MathUtils.clamp(s.rotX + s.velX, -0.9, 1.1);
      s.velY *= 0.94;
      s.velX *= 0.9;
      s.idle += dt;
      if (!reduced) s.rotY += dt * 0.06 * Math.min(1, s.idle / 2);
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, s.rotY + s.tiltY, 6, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, s.rotX + s.tiltX, 6, dt);
  });

  const bodyMat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: glowVertex, fragmentShader: bodyFragment }), []);
  const atmoMat = useMemo(
    () => new THREE.ShaderMaterial({
      vertexShader: glowVertex, fragmentShader: atmoFragment, uniforms: { uStrength: { value: 0.42 } },
      side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }),
    [],
  );

  return (
    <>
      <mesh scale={1.16} material={atmoMat}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <group ref={group}>
        <mesh material={bodyMat}>
          <sphereGeometry args={[0.995, 96, 96]} />
        </mesh>
        <Dots data={data} />
        {CITIES.map((c, i) => (
          <Arc key={i} to={c} offset={i / CITIES.length} />
        ))}
        {CITIES.map((c, i) => (
          <Marker key={`m${i}`} lat={c[0]} lng={c[1]} />
        ))}
        <Marker lat={HOME.lat} lng={HOME.lng} home />
      </group>
    </>
  );
}

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Globe() {
  const data = useLand();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [ok, setOk] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setOk(webglOK());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`globe ${data ? "is-ready" : ""}`}>
      <div className="globe-halo" aria-hidden />
      {ok && data ? (
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.7], fov: 38 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={visible ? "always" : "never"}
          aria-label="Interactive globe"
        >
          <World data={data} reduced={reduced} />
        </Canvas>
      ) : (
        <div className="globe-fallback" aria-hidden />
      )}
    </div>
  );
}
