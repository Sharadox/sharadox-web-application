"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, QuadraticBezierCurve3, TubeGeometry, type ShaderMaterial } from "three";
import { ARC_SHADER } from "../shader/arc";
import { latitudeLongitudeToVector } from "@sharadox/sharadox-web-application/utility/latitude-longitude-to-vector";
import type { ArcProperties } from "./type";

/** A light arc lifting off the surface between two places, with a pulse running along it. */
export function Arc({ from, to, offset }: ArcProperties) {
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const start = latitudeLongitudeToVector(from.latitude, from.longitude, 1.002);
    const end = latitudeLongitudeToVector(to[0], to[1], 1.002);
    const middle = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1 + start.distanceTo(end) * 0.38);
    return new TubeGeometry(new QuadraticBezierCurve3(start, middle, end), 90, 0.0032, 6, false);
  }, [from, to]);
  const uniforms = useMemo(() => ({ time: { value: 0 }, offset: { value: offset } }), [offset]);
  useFrame((_, deltaSeconds) => {
    if (material.current) material.current.uniforms.time!.value += deltaSeconds;
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
