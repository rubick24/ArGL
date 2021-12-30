#version 300 es
precision mediump float;

uniform sampler2D spirte_texture;

uniform vec4 sprite_position;

in vec3 position;

out vec4 fragColor;

void main() {
  vec2 uv = (position.xy + 1.) / 2.;
  uv.y = 1. - uv.y;
  vec2 suv = sprite_position.xy + uv * sprite_position.zw;
  // fragColor = vec4(uv, 1.);
  fragColor = texture(spirte_texture, suv);
  fragColor = clamp(fragColor + pow(length(uv - 0.5), 2.), 0., 1.);
}
