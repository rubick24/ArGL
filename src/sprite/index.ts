import vs from './sprite.vert'
import fs from './sprite.frag'
import Shader from '../shader'
import { mat4 } from 'gl-matrix'

export const sprite = async (
  gl: WebGL2RenderingContext,
  options: {
    texture: string
    scale: number
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

  const [img, texture] = await (async () => {
    const img = new Image()
    img.src = options.texture
    await new Promise(r => (img.onload = r))
    const texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, WebGL2RenderingContext.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, WebGL2RenderingContext.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    return [img, texture]
  })()

  const mvp = mat4.create()

  const render = ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
    gl.bindVertexArray(vao)
    shader.use()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    mat4.scale(mvp, modelMatrix, [
      img.naturalWidth * options.scale,
      img.naturalHeight * options.scale,
      1
    ])
    mat4.mul(mvp, viewProjection, mvp)
    shader.setUniform('mvp_matrix', 'MAT4', mvp)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  return {
    render
  }
}
