#version 300 es
precision highp float;

in vec3 a_POSITION;
in vec3 a_NORMAL;
in vec4 a_TANGENT;
in vec2 a_TEXCOORD_0;

uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;

out vec3 v_POSITION;
out vec2 v_TEXCOORD_0;
out mat3 v_TBN;
// out vec4 v_COLOR;

uniform sampler2D u_BaseColorSampler;
uniform vec4 u_BaseColorFactor;

void main()
{
  vec4 pos = u_ModelMatrix * vec4(a_POSITION, 1.);
  v_POSITION = vec3(pos.xyz) / pos.w;

  vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(a_NORMAL.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(a_TANGENT.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * a_TANGENT.w;
  v_TBN = mat3(tangentW, bitangentW, normalW);
  v_TEXCOORD_0 = a_TEXCOORD_0;

  // vec3 lp = vec3(2., 1., 1.);
  // vec3 ld = normalize(lp - pos.xyz);
  // vec3 lc = vec3(1., 1., 1.);

  // vec4 baseColor = texture(u_BaseColorSampler, a_TEXCOORD_0) * u_BaseColorFactor;
  // float dist = length(lp - pos.xyz);
  // float attenuation = 1. / (1. + 0.22 * dist + 0.20 * dist * dist);
  // vec3 diffuse = max(dot(normalW, ld), 0.0) * lc * attenuation;

  // v_COLOR = vec4(baseColor.rgb * (0.3 + diffuse), 1.);

  gl_Position = u_MVPMatrix * vec4(a_POSITION, 1.);
}
