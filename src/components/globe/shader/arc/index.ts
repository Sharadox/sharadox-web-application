/** Arcs: a faint path plus a bright pulse travelling along it. */
export const ARC_SHADER = {
  vertex: /* glsl */ `
    varying float vU;
    void main() {
      vU = uv.x;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
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
  `,
};
