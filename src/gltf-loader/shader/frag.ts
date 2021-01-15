export default (props?: any) => `#version 300 es
precision mediump float;

uniform sampler2D u_BaseColorSampler;
uniform vec4 u_BaseColorFactor;

in vec2 v_TEXCOORD_0;
in vec3 v_NORMAL;
// in vec3 v_POSITION;
//in mat3 v_TBN;
${ props?.in || ''}

out vec4 FragColor;

void main()
{
  // vec3 ld = normalize(vec3(3., 4., 5.));
  // vec3 lc = vec3(1., 1., 1.);

  vec4 baseColor = texture(u_BaseColorSampler, v_TEXCOORD_0) * u_BaseColorFactor;
  // vec3 diffuse = max(dot(v_NORMAL, ld), 0.0) * lc;
  // FragColor = vec4(baseColor.rgb * (0.3 + diffuse), 1.);
  FragColor = baseColor;
}
`
