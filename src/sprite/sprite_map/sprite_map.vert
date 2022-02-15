#version 300 es
precision mediump float;

layout(location = 0) in vec2 i_position;
layout(location = 1) in vec2 i_grid_position;
layout(location = 2) in vec4 i_sprite_position;
layout(location = 3) in vec2 i_flip_rotate;

uniform mat4 model_matrix;
uniform mat4 view_projection;
uniform vec2 half_pixel;
out vec2 suv;

const float PI = 3.1415926535897932384626433832795;
vec2 rotate2d(in vec2 p, in float rad) {
  return vec2(p.x * cos(rad) - p.y * sin(rad), p.x * sin(rad) + p.y * cos(rad));
}

void main() {
  vec2 uv = half_pixel + (i_position + 0.5) * (1. - half_pixel * 2.);
  float flip = i_flip_rotate.x;
  if(flip > 0.5 && flip < 1.5 || flip > 2.5) {
    uv.x = 1.0 - uv.x;
  }
  if(flip < 1.5) {
    uv.y = 1.0 - uv.y;
  }
  float rotate = i_flip_rotate.y;
  if(rotate > 0.5) {
    uv = rotate2d(uv - vec2(0.5), PI * rotate * 0.5) + vec2(0.5);
  }
  suv = i_sprite_position.xy + uv * i_sprite_position.zw;

  // sprite_position = i_sprite_position;
  // flip_rotate = i_flip_rotate;
  gl_Position = view_projection * model_matrix * vec4(i_position + i_grid_position, 0., 1.);
}
