#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

in vec2 fragCoord;
out vec4 fragColor;

const float PI = 3.1415926;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

void main() {
  vec2 uv = fragCoord / iResolution;
  vec2 p = (-iResolution + 2. * fragCoord) / iResolution.y; // -1 <> 1 by height
  fragColor = vec4(vec3(p, 0.5), 1. - sdCircle(p, 0.));
}
