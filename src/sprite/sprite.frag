#version 300 es
precision mediump float;

uniform sampler2D spirte_texture;
in vec2 position;
out vec4 fragColor;

void main() {
  vec2 uv = position + 0.5;
  uv.y = 1. - uv.y;
  fragColor = texture(spirte_texture, uv);
  // fragColor = vec4(uv, 0.5, 1.);
}
