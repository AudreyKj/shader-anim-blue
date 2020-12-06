import React from "react";
import "./styles.css";
import glsl from "glslify";

import { ShaderRenderer, ShaderSetupFn } from "./WebGLRenderer";

const sketch: ShaderSetupFn = ({ aspect }) => {
  // Any sketch state and variables can go here!

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    uniforms: {
      // Here we set our uniforms
      // The renderer will autmatically detect their gl type
      // But floats can only be detected if they contain a decimal
      // If auto-detection doesn't work, add `type: "1f"` alongside `value` (for e.g.)
      time: { value: Math.random() * 100 },
      aspect: { value: width / height }
    },
    // And now our shaders (there is a default vertex shader that can be overwritten)
    frag: glsl`
    precision highp float;
    uniform float time;
    uniform float aspect;
      varying vec2 vUv;
    

        void main() {
          vec3 colorA = sin(time) + vec3(1.0, 1.0, 1.0);
          vec3 colorB = vec3(0.2, 0.3, 0.4);

    vec2 center = vUv - 0.5;
    center.x *= aspect;
    float dist = length(center);
    float alpha = smoothstep(0.25, 0.5, dist);
    

  vec3 color = mix(colorA, colorB, vUv.x + sin(time));
          gl_FragColor = vec4(color, alpha);
        }
    `,
    // This onFrame callback (as well as the whole sketch) has access to many props
    // Such as time, fps, mouse position, size, the gl context instance, and uniforms
    onFrame: ({ uniforms, mousePosition }) => {
      uniforms.time.value += 0.008;
    }
  };
};

export default function App() {
  return <ShaderRenderer sketch={sketch} />;
}
