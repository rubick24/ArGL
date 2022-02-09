#version 300 es
precision mediump float;

uniform sampler2D spirte_texture;

uniform vec4 sprite_position;
uniform vec4 sprite_box;
uniform vec2 end_pixel;

in vec2 position;
out vec4 fragColor;

void main() {
  vec2 uv = position + 0.5 - end_pixel;
  uv.y = 1. - uv.y;
  if(uv.x < sprite_box.x || uv.x > (sprite_box.x + sprite_box.z) || uv.y < sprite_box.y || uv.y > (sprite_box.y + sprite_box.w)) {
    // fragColor = vec4(0.0, 0.4, 0.5, 1.0);
    discard;
  } else {
    vec2 luv = (uv - sprite_box.xy) / sprite_box.zw;
    vec2 suv = sprite_position.xy + luv * sprite_position.zw;
    fragColor = texture(spirte_texture, suv);
  }
}
