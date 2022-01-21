#version 300 es
precision mediump float;

layout(location = 0) in vec2 i_position;

uniform mat4 mvp_matrix;

out vec2 position;

void main() {
  position = i_position;
  gl_Position = mvp_matrix * vec4(position, 0., 1.);
}
