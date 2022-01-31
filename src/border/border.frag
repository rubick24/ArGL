#version 300 es
precision mediump float;

in vec2 position;
out vec4 fragColor;

void main() {
    vec2 uv = position + 0.5;
    float r =  clamp(pow(length(position * 2.), 10.), 0., 1.);
    fragColor = vec4(vec3(1. - r), r);
}
