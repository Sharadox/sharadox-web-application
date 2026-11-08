import { GLOW_VERTEX } from "../glow-vertex";

/** The dark planet body with a fresnel rim. */
export const BODY_SHADER = {
  vertex: GLOW_VERTEX,
  fragment: /* glsl */ `
    varying vec3 vN;
    void main() {
      float rim = pow(1.0 - abs(vN.z), 3.0);
      gl_FragColor = vec4(vec3(0.02) + vec3(0.32) * rim, 1.0);
    }
  `,
};
