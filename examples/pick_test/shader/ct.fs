#version 300 es

precision mediump float;

out vec4 FragColor;
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;

uniform bool u_hover;

void main()
{
    vec4 red = vec4(1, 0.1, 0.2, 1);
    vec4 blue = vec4(0, 0.5, 1.0, 1);
    FragColor = u_hover?red:blue;
}
