import vs from './sprite.vert'
import fs from './sprite.frag'
import { createShader } from '../shader'
import { vec2, mat4 } from 'gl-matrix'
import { refs } from '../refs'

export const createSprite = async (options: {
  texture: string
  position?: [number, number, number]
  scale?: [number, number]
  repeat?: [number, number]
}) => {
  const { gl } = refs
  const shader = createShader({ gl, vs, fs })
  const quad = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5])
  const vao = gl.createVertexArray()
  const vbo = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

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

  // const model = mat4.create()
  const mvp = mat4.create()

  const size = [img.naturalWidth, img.naturalHeight]
  const scale = options.scale || [1, 1]
  const repeat = options.repeat || [1, 1]
  const position = options.position || [0, 0, 0]
  const uvOffset: vec2 = [0, 0]

  return {
    size,
    scale,
    repeat,
    position,
    get uvOffset() {
      return uvOffset
    },
    set uvOffset(v) {
      uvOffset[0] = v[0]
      uvOffset[1] = v[1]
    },

    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      gl.bindVertexArray(vao)
      shader.use()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      mat4.translate(mvp, modelMatrix, position)
      mat4.scale(mvp, mvp, [size[0] * scale[0] * repeat[0], size[1] * scale[1] * repeat[1], 1])
      mat4.mul(mvp, viewProjection, mvp)
      shader.setUniform('mvp_matrix', 'MAT4', mvp)
      shader.setUniform('uv_offset', 'VEC2', uvOffset)
      shader.setUniform('repeat', 'VEC2', repeat)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }
}
