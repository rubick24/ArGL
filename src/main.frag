#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

in vec2 fragCoord;
out vec4 fragColor;

const float PI = 3.1415926;

float sd_circle(vec2 p, float r) {
  return length(p) - r;
}

uint seed;

uint pcg_hash(uint seed) {
  uint state = seed * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}

float rand_float() {
  seed = pcg_hash(seed);
  return float(seed) * (1.0 / 4294967296.0);
}

vec2 rand_vec2() {
  float r = rand_float() * 2.0 * PI;
  return vec2(cos(r), sin(r));
}

vec3 rand_vec3() {
  float r = rand_float() * 2. * PI;
  float z = rand_float() * 2. - 1.;
  float z_scale = sqrt(1.0-z*z);
  return vec3(cos(r)*z_scale, sin(r)*z_scale, z);
}

void main() {
  vec2 uv = fragCoord / iResolution;
  vec2 p = (-iResolution + 2. * fragCoord) / iResolution.y; // -1 <> 1 by height

  p.x += 1.;
  float scale = 10.;
  vec2 skewed_p = vec2(p.x - p.y * 0.5, p.y);
  vec2 ss_p = fract(skewed_p * scale) * 2. - 1.;
  float c = step(ss_p.x + ss_p.y, 0.);

  seed = pcg_hash(
    pcg_hash(uint(abs(skewed_p.x * scale)))
    + uint(abs(skewed_p.y * scale))
  );

  float r1 = rand_float();
  float r2 = rand_float();
  c = c * r1 + (1. - c) * r2;

  float ft = 1. - iMouse.x / iResolution.x;

  c = (c * 0.4 + 0.15) * floor(skewed_p.x * scale) * ft;

  fragColor = vec4(vec3(c), 1.);

  // fragColor = vec4(vec3(p, 0.5), 1. - sd_circle(p, 0.));
}
