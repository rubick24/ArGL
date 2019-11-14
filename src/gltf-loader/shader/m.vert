#version 300 es
precision highp float;

in vec4 a_POSITION;
in vec4 a_NORMAL;
in vec4 a_TANGENT;
in vec2 a_TEXCOORD_0;

uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;

out vec3 v_POSITION;
out vec2 v_TEXCOORD_0;

out mat3 v_TBN;
out vec3 v_NORMAL;

void main()
{
  vec4 pos = u_ModelMatrix * a_POSITION;
  v_POSITION = vec3(pos.xyz) / pos.w;

  vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(a_NORMAL.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(a_TANGENT.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * a_TANGENT.w;
  v_TBN = mat3(tangentW, bitangentW, normalW);

  v_TEXCOORD_0 = a_TEXCOORD_0;

  gl_Position = u_MVPMatrix * a_POSITION; // needs w for proper perspective correction
}
