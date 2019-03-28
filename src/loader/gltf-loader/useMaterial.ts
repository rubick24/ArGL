import Shader, { UNIFORM_TYPES } from '../../shader'
import GLTFLoader from '.'

export default function useMaterial(
  this: GLTFLoader,
  shader: Shader,
  materialIndex: number
) {
  const gl = this.gl
  const material = this.json.materials[materialIndex]
  if (material.doubleSided) {
    gl.disable(gl.CULL_FACE)
  } else {
    gl.enable(gl.CULL_FACE)
  }
  const loadedMaterial = this.loadedMaterials[materialIndex]

  shader.use()
  loadedMaterial.textures.forEach((texture, i) => {
    gl.activeTexture(gl.TEXTURE0 + i)
    gl.bindTexture(gl.TEXTURE_2D, texture)
  })
  loadedMaterial.uniforms.forEach(u => {
    shader.setUniform(u.name, u.type as UNIFORM_TYPES, u.value)
  })
  return shader
}
