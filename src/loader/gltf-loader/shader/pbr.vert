// https://github.com/KhronosGroup/glTF-WebGL-PBR/blob/master/shaders/pbr-vert.glsl

in vec4 a_POSITION;
#ifdef HAS_NORMAL
in vec4 a_NORMAL;
#endif
#ifdef HAS_TANGENT
in vec4 a_TANGENT;
#endif
#ifdef HAS_TEXCOORD_0
in vec2 a_TEXCOORD_0;
#endif
#ifdef HAS_COLOR_0
in vec3 a_COLOR_0;
#endif

uniform mat4 u_MVPMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_NormalMatrix;

out vec3 v_POSITION;
out vec2 v_TEXCOORD_0;

#ifdef HAS_NORMAL
#ifdef HAS_TANGENT
out mat3 v_TBN;
#else
out vec3 v_NORMAL;
#endif
#endif

#ifdef HAS_COLOR_0
out vec3 v_COLOR_0;
#endif

void main()
{
  vec4 pos = u_ModelMatrix * a_POSITION;
  v_POSITION = vec3(pos.xyz) / pos.w;

  #ifdef HAS_NORMAL
  #ifdef HAS_TANGENT
  vec3 normalW = normalize(vec3(u_NormalMatrix * vec4(a_NORMAL.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(u_ModelMatrix * vec4(a_TANGENT.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * a_TANGENT.w;
  v_TBN = mat3(tangentW, bitangentW, normalW);
  #else // HAS_TANGENT != 1
  v_NORMAL = normalize(vec3(u_ModelMatrix * vec4(a_NORMAL.xyz, 0.0)));
  #endif
  #endif

  #ifdef HAS_TEXCOORD_0
  v_TEXCOORD_0 = a_TEXCOORD_0;
  #else
  v_TEXCOORD_0 = vec2(0.,0.);
  #endif

  #ifdef HAS_COLOR_0
  v_COLOR_0 = a_COLOR_0;
  #endif
  gl_Position = u_MVPMatrix * a_POSITION; // needs w for proper perspective correction
}
