import { GLOW_VERTEX } from "../glow-vertex";

/** Outer atmosphere, drawn on back faces: strongest just outside the edge, fading to zero at the rim. */
export const ATMOSPHERE_SHADER = {
  vertex: GLOW_VERTEX,
  fragment: /* glsl */ `
    varying vec3 vN;
    uniform float uStrength;
    void main() {
      float i = smoothstep(0.0, 0.55, -vN.z);
      gl_FragColor = vec4(vec3(1.0), i * i * uStrength);
    }
  `,
};
