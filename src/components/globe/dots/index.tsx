"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, type ShaderMaterial } from "three";
import { DOT_SHADER } from "../shader/dot";
import { latitudeLongitudeToVector } from "@/utilities/latitude-longitude-to-vector";
import type { DotsProperties } from "./type";

/** Deterministic 0–1 noise per dot, so renders are pure and repeatable. */
const pseudoRandom = (index: number) => {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

/** The land, drawn as twinkling points that fade towards the globe's edge. */
export function Dots({ data }: DotsProperties) {
  const { gl } = useThree();
  const material = useRef<ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const count = data.length / 2;
    const position = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let index = 0; index < count; index++) {
      const point = latitudeLongitudeToVector(data[index * 2]!, data[index * 2 + 1]!, 1.001);
      position.set([point.x, point.y, point.z], index * 3);
      seed[index] = pseudoRandom(index);
    }
    const points = new BufferGeometry();
    points.setAttribute("position", new BufferAttribute(position, 3));
    points.setAttribute("seed", new BufferAttribute(seed, 1));
    return points;
  }, [data]);
  const uniforms = useMemo(
    () => ({ time: { value: 0 }, pointSize: { value: 2.6 * Math.min(gl.getPixelRatio(), 2) } }),
    [gl],
  );
  useFrame((_, deltaSeconds) => {
    if (material.current) material.current.uniforms.time!.value += deltaSeconds;
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
