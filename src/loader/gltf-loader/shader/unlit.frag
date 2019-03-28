precision highp float;

#ifdef HAS_BASECOLORMAP
uniform sampler2D u_BaseColorSampler;
#endif
uniform vec4 u_BaseColorFactor;

#ifdef HAS_TEXCOORD_0
in vec2 v_TEXCOORD_0;
#else
const vec2 v_TEXCOORD_0 = vec2(0.);
#endif

#ifdef HAS_COLOR_0
in vec3 v_COLOR_0;
#endif

out vec4 FragColor;

void main()
{
#ifdef HAS_BASECOLORMAP
  vec4 baseColor = texture(u_BaseColorSampler, v_TEXCOORD_0) * u_BaseColorFactor;
#else
  vec4 baseColor = u_BaseColorFactor;
#endif

#ifdef HAS_COLOR_0
  baseColor *= vec4(v_COLOR_0, 1.);
#endif
  FragColor = baseColor;
}
