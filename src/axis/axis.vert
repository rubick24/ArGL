#version 300 es
precision mediump float;

layout (location = 0) in vec3 i_Position;
layout (location = 1) in vec3 i_Color;

uniform mat4 u_MVPMatrix;

out vec3 v_Position;
out vec3 v_Color;

void main() {
  v_Position = i_Position * 1000.;
  v_Color = i_Color;
  gl_Position = u_MVPMatrix * vec4(v_Position, 1.);
}
