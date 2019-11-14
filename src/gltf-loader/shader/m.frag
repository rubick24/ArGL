#version 300 es
precision highp float;

uniform sampler2D u_BaseColorSampler;
uniform vec4 u_BaseColorFactor;

in vec2 v_TEXCOORD_0;

out vec4 FragColor;

void main()
{
  vec4 baseColor = texture(u_BaseColorSampler, v_TEXCOORD_0) * u_BaseColorFactor;
  FragColor = baseColor;
}
