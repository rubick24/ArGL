#version 300 es
precision highp float;

uniform sampler2D u_BaseColorSampler;
uniform vec4 u_BaseColorFactor;

in vec3 v_POSITION;
in vec2 v_TEXCOORD_0;
in mat3 v_TBN;
// in vec4 v_COLOR;

out vec4 FragColor;

void main()
{
  vec3 ld = normalize(vec3(3., 4., 5.));
  vec3 lc = vec3(1., 1., 1.);

  vec4 baseColor = texture(u_BaseColorSampler, v_TEXCOORD_0) * u_BaseColorFactor;
  vec3 diffuse = max(dot(v_TBN[2], ld), 0.0) * lc;
  // FragColor = vec4(baseColor.rgb * (0.3 + diffuse), 1.);
  FragColor = baseColor;
}
