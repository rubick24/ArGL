import { mat4 } from 'gl-matrix'
import { createShader } from '../shader'
import vs from './border.vert'
import fs from './border.frag'
import { refs } from '../refs'

export const createBorder = async (options: {
  position: [number, number, number]
  size: [number, number]
}) => {
  const { gl } = refs
  const shader = createShader({ gl, vs, fs })
  shader.use()
  const quad = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5])
  const vao = gl.createVertexArray()
  const vbo = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const mvp = mat4.create()

  return {
    position: options.position,
    size: options.size,
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      mat4.translate(mvp, modelMatrix, this.position)
      mat4.scale(mvp, mvp, [this.size[0], this.size[1], 1])
      mat4.mul(mvp, viewProjection, mvp)
      gl.bindVertexArray(vao)
      shader.use()
      shader.setUniform('mvp_matrix', 'MAT4', mvp)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }
}
