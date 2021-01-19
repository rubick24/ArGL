#version 300 es
precision mediump float;

in vec3 v_Position;
in vec3 v_Color;

out vec4 o_FragColor;

void main() {
  o_FragColor = vec4(v_Color * pow(0.75, length(v_Position)), 1.);
}
