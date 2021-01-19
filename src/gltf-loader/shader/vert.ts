export default (props?: any) => `#version 300 es
precision mediump float;
${props?.defines || ''}
${props?.attrs || ''}

uniform mat4 u_ModelMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_NormalMatrix;

#ifdef USE_SKINNING
uniform mat4 u_jointMatrices[JOINT_COUNT];
uniform mat4 u_jointNormalMatrices[JOINT_COUNT];
#endif

out vec2 v_TEXCOORD_0;
out vec3 v_NORMAL;
// out vec3 v_POSITION;
// out mat3 v_TBN;

uniform sampler2D u_BaseColorSampler;
uniform vec4 u_BaseColorFactor;

void main()
{
  #ifdef USE_SKINNING
  mat4 skinMat =
    a_WEIGHTS_0.x * u_jointMatrices[int(a_JOINTS_0.x)] +
    a_WEIGHTS_0.y * u_jointMatrices[int(a_JOINTS_0.y)] +
    a_WEIGHTS_0.z * u_jointMatrices[int(a_JOINTS_0.z)] +
    a_WEIGHTS_0.w * u_jointMatrices[int(a_JOINTS_0.w)];

  mat4 skinNormalMat =
    a_WEIGHTS_0.x * u_jointNormalMatrices[int(a_JOINTS_0.x)] +
    a_WEIGHTS_0.y * u_jointNormalMatrices[int(a_JOINTS_0.y)] +
    a_WEIGHTS_0.z * u_jointNormalMatrices[int(a_JOINTS_0.z)] +
    a_WEIGHTS_0.w * u_jointNormalMatrices[int(a_JOINTS_0.w)];

  vec4 pos = u_ModelMatrix * skinMat * vec4(a_POSITION, 1.);
  #else
  vec4 pos = u_ModelMatrix * vec4(a_POSITION, 1.);
  #endif
  // v_POSITION = vec3(pos.xyz) / pos.w;

  // vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(a_NORMAL.xyz, 0.0)));
  // vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(a_TANGENT.xyz, 0.0)));
  // vec3 bitangentW = cross(normalW, tangentW) * a_TANGENT.w;
  // v_TBN = mat3(tangentW, bitangentW, normalW);
  v_NORMAL = vec3(u_NormalMatrix * skinNormalMat * vec4(a_NORMAL, 0.));
  v_TEXCOORD_0 = a_TEXCOORD_0;

  gl_Position = u_ProjectionMatrix * u_ViewMatrix * pos;
}
`
