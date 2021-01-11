import { vec3, mat4 } from 'gl-matrix'
import { IMesh } from './interfaces'

const temp = mat4.create()

export default (gl: WebGL2RenderingContext) => (
  mesh: IMesh,
  modelMatrix: mat4,
  viewMatrix: mat4,
  projectionMatrix: mat4,
  cameraPosition: vec3
) => {
  mat4.multiply(temp, viewMatrix, modelMatrix)
  const mvpMatrix = mat4.multiply(mat4.create(), projectionMatrix, temp)
  mat4.invert(temp, modelMatrix)
  const normalMatrix = mat4.transpose(mat4.create(), temp)
  mesh.primitives.forEach((primitive, i) => {
    const shader = primitive.material.shader
    shader.use()
    primitive.material.textures.forEach((texture, i) => {
      gl.activeTexture(gl.TEXTURE0 + i)
      gl.bindTexture(gl.TEXTURE_2D, texture)
    })
    // TODO: may use cache
    primitive.material.uniforms.forEach(u => {
      shader.setUniform(u.name, u.type, u.value)
    })

    shader.setUniform('u_Camera', 'VEC3', cameraPosition)
    shader.setUniform('u_MVPMatrix', 'MAT4', mvpMatrix)
    shader.setUniform('u_ModelMatrix', 'MAT4', modelMatrix)
    shader.setUniform('u_NormalMatrix', 'MAT4', normalMatrix)

    gl.bindVertexArray(primitive.vao)
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, primitive.indices)
    gl.drawElements(
      primitive.mode,
      primitive.indices.accessor.count,
      primitive.indices.accessor.componentType,
      0
    )
    gl.bindVertexArray(null)
  })
}
