"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BackSide, MathUtils, ShaderMaterial, type Group } from "three";
import { CITIES, HOME } from "@sharadox/sharadox-web-application/content/globe";
import { ATMOSPHERE_SHADER } from "../shader/atmosphere";
import { BODY_SHADER } from "../shader/body";
import { Arc } from "../arc";
import { Dots } from "../dots";
import { Marker } from "../marker";
import type { WorldProperties } from "./type";

/** The planet scene: body, atmosphere, land, arcs and markers. Rotation comes from the drag controller. */
export function World({ data, drag }: WorldProperties) {
  const group = useRef<Group>(null);

  useFrame((_, deltaSeconds) => {
    const planet = group.current;
    if (!planet) return;
    const target = drag.step(deltaSeconds);
    planet.rotation.y = MathUtils.damp(planet.rotation.y, target.y, 6, deltaSeconds);
    planet.rotation.x = MathUtils.damp(planet.rotation.x, target.x, 6, deltaSeconds);
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
        uniforms: { strength: { value: 0.42 } },
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
        {CITIES.map((city, index) => (
          <Arc key={index} from={HOME} to={city} offset={index / CITIES.length} />
        ))}
        {CITIES.map((city, index) => (
          <Marker key={`marker${index}`} latitude={city[0]} longitude={city[1]} />
        ))}
        <Marker latitude={HOME.latitude} longitude={HOME.longitude} home />
      </group>
    </>
  );
}
