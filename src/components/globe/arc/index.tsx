"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, QuadraticBezierCurve3, TubeGeometry, type ShaderMaterial } from "three";
import { ARC_SHADER } from "../shader/arc";
import { latLngToVector } from "@/utilities/lat-lng-to-vector";
import type { ArcProps } from "./type";

/** A light arc lifting off the surface between two places, with a pulse running along it. */
export function Arc({ from, to, offset }: ArcProps) {
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const a = latLngToVector(from.lat, from.lng, 1.002);
    const b = latLngToVector(to[0], to[1], 1.002);
    const mid = a
      .clone()
      .add(b)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1 + a.distanceTo(b) * 0.38);
    return new TubeGeometry(new QuadraticBezierCurve3(a, mid, b), 90, 0.0032, 6, false);
  }, [from, to]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOffset: { value: offset } }), [offset]);
  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime!.value += dt;
  });
  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={ARC_SHADER.vertex}
        fragmentShader={ARC_SHADER.fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
