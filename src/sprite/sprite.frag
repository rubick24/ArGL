#version 300 es
precision mediump float;

uniform sampler2D spirte_texture;
uniform vec2 repeat;
uniform vec2 uv_offset;
uniform vec2 end_pixel;

in vec2 position;
out vec4 fragColor;

void main() {
  vec2 uv = position + 0.5 - end_pixel;
  uv.y = 1. - uv.y;
  uv = fract(fract(uv * repeat) + uv_offset);
  fragColor = texture(spirte_texture, uv);
  // fragColor = vec4(uv, 0.5, 1.);
}
