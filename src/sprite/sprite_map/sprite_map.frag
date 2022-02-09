#version 300 es
precision mediump float;

uniform sampler2D spirte_texture;

in vec2 suv;
out vec4 fragColor;

void main() {
  fragColor = texture(spirte_texture, suv);
}
