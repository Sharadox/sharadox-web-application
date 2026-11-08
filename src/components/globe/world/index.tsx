"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, MathUtils, ShaderMaterial, type Group } from "three";
import { CITIES, HOME } from "@/content/globe";
import { ATMOSPHERE_SHADER } from "../shader/atmosphere";
import { BODY_SHADER } from "../shader/body";
import { Arc } from "../arc";
import { Dots } from "../dots";
import { Marker } from "../marker";
import type { WorldProps } from "./type";

/** The planet scene: body, atmosphere, land, arcs and markers. Rotation comes from the drag controller. */
export function World({ data, drag }: WorldProps) {
  const group = useRef<Group>(null);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const target = drag.step(dt);
    g.rotation.y = MathUtils.damp(g.rotation.y, target.y, 6, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, target.x, 6, dt);
  });

  const body = useMemo(
    () => new ShaderMaterial({ vertexShader: BODY_SHADER.vertex, fragmentShader: BODY_SHADER.fragment }),
    [],
  );
  const atmosphere = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: ATMOSPHERE_SHADER.vertex,
        fragmentShader: ATMOSPHERE_SHADER.fragment,
        uniforms: { uStrength: { value: 0.42 } },
        side: BackSide,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  return (
    <>
      <mesh scale={1.16} material={atmosphere}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <group ref={group}>
        <mesh material={body}>
          <sphereGeometry args={[0.995, 96, 96]} />
        </mesh>
        <Dots data={data} />
        {CITIES.map((c, i) => (
          <Arc key={i} from={HOME} to={c} offset={i / CITIES.length} />
        ))}
        {CITIES.map((c, i) => (
          <Marker key={`m${i}`} lat={c[0]} lng={c[1]} />
        ))}
        <Marker lat={HOME.lat} lng={HOME.lng} home />
      </group>
    </>
  );
}
