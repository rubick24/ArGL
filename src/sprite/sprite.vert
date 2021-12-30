#version 300 es
precision mediump float;

layout(location = 0) in vec3 i_position;

uniform mat4 mvp_matrix;

out vec3 position;

void main() {
  position = i_position;
  gl_Position = mvp_matrix * vec4(position, 1.);
}
