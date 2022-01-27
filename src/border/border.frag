#version 300 es
precision mediump float;

in vec2 position;
out vec4 fragColor;

void main() {
    vec2 uv = position + 0.5;
    fragColor = vec4(uv, 0., 1.);
}
