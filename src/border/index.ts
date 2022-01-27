import { mat4 } from 'gl-matrix'
import Shader from '../shader'
import vs from './border.vert'
import fs from './border.frag'

export const createBorder = async (
  gl: WebGL2RenderingContext,
  options: {
    position: [number, number, number]
    size: [number, number]
  }
) => {
  const shader = new Shader({ gl, vs, fs })
  shader.use()
  const quad = [-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]
  const vao = gl.createVertexArray()
  const vbo = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

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
