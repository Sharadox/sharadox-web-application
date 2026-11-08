"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, type ShaderMaterial } from "three";
import { DOT_SHADER } from "../shader/dot";
import { latLngToVector } from "@/utilities/lat-lng-to-vector";
import type { DotsProps } from "./type";

/** Deterministic 0–1 noise per dot, so renders are pure and repeatable. */
const pseudoRandom = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** The land, drawn as twinkling points that fade towards the globe's edge. */
export function Dots({ data }: DotsProps) {
  const { gl } = useThree();
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const n = data.length / 2;
    const position = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const v = latLngToVector(data[i * 2]!, data[i * 2 + 1]!, 1.001);
      position.set([v.x, v.y, v.z], i * 3);
      seed[i] = pseudoRandom(i);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(position, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [data]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixel: { value: 2.6 * Math.min(gl.getPixelRatio(), 2) } }),
    [gl],
  );
  useFrame((_, dt) => {
    if (material.current) material.current.uniforms.uTime!.value += dt;
  });
  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={DOT_SHADER.vertex}
        fragmentShader={DOT_SHADER.fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
