"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Quaternion, Vector3, type Mesh, type MeshBasicMaterial } from "three";
import { latLngToVector } from "@/utilities/lat-lng-to-vector";
import type { MarkerProps } from "./type";

/** A city dot lying flat on the surface. */
export function Marker({ lat, lng, home = false }: MarkerProps) {
  const ring = useRef<Mesh>(null);
  const position = useMemo(() => latLngToVector(lat, lng, 1.004), [lat, lng]);
  const quaternion = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  );
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.elapsedTime * 0.6) % 1;
    ring.current.scale.setScalar(1 + t * 5);
    (ring.current.material as MeshBasicMaterial).opacity = (1 - t) * 0.8;
  });
  return (
    <group position={position} quaternion={quaternion}>
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
