import { mat4 } from 'gl-matrix'
import Shader from '../shader'
import vsSource from './axis.vert'
import fsSource from './axis.frag'
import { refs } from '../refs'

export default async () => {
  const { gl } = refs
  const lines = new Float32Array([
    0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0,
    1, 0, 0, 1
  ])
  const vao = gl.createVertexArray()
  const vbo = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0)
  gl.enableVertexAttribArray(1)
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  const shader = new Shader({
    gl,
    vs: vsSource,
    fs: fsSource
  })

  // const mvp = mat4.create()
  const renderLoop = ({ viewProjection }: { viewProjection: mat4 }) => {
    gl.bindVertexArray(vao)
    shader.use()
    shader.setUniform('u_MVPMatrix', 'MAT4', viewProjection)
    gl.drawArrays(gl.LINES, 0, 6)
  }
  return renderLoop
}
