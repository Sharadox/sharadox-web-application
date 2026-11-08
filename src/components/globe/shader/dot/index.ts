/** Land dots: facing dots are bright, edge dots fade, a few twinkle. */
export const DOT_SHADER = {
  vertex: /* glsl */ `
    attribute float aSeed;
    uniform float uTime;
    uniform float uPixel;
    varying float vAlpha;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vec3 n = normalize(normalMatrix * position);
      float facing = dot(n, vec3(0.0, 0.0, 1.0));
      float twinkle = 0.75 + 0.25 * sin(uTime * 1.6 + aSeed * 40.0);
      vAlpha = smoothstep(-0.05, 0.55, facing) * twinkle;
      gl_PointSize = uPixel * (0.9 + 0.5 * aSeed) * (3.2 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragment: /* glsl */ `
    varying float vAlpha;
    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.1, d) * vAlpha;
      gl_FragColor = vec4(vec3(1.0), a);
    }
  `,
};
