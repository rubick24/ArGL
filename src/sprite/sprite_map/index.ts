import Shader from '../../shader'
import { refs } from '../../refs'
import vs from './sprite_map.vert'
import fs from './sprite_map.frag'
import { SpriteAtlasHashJson } from '../atlas'
import { mat4 } from 'gl-matrix'

type GridData = {
  position: [number, number]
  tile: string
  flip?: 0 | 1 | 2 | 3 // 0: none, 1: horizontal, 2: vertical, 3: both
  rotate?: 0 | 1 | 2 | 3 // 0: none, 1: 90, 2: 180, 3: 270
}

export const createSpriteMap = async (options: {
  texture: string
  atlas: string
  tileSize: [number, number]
  gridData: GridData[]
  position?: [number, number, number]
  scale?: [number, number]
}) => {
  const { gl } = refs
  const shader = new Shader({ gl, vs, fs })
  const { tileSize, gridData } = options
  const quad = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5])

  // const gridData = new Float32Array(gridSize[0] * gridSize[1])

  const [texture, atlas] = await Promise.all([
    (async () => {
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
      return texture
    })(),
    fetch(options.atlas).then(r => r.json()) as Promise<SpriteAtlasHashJson>
  ])

  const spriteSize = atlas.meta.size
  const data = new Float32Array(8 * gridData.length)
  for (let i = 0; i < gridData.length; i++) {
    const { position, tile, flip, rotate } = gridData[i]
    // tile pos
    data[i * 8 + 0] = position[0]
    data[i * 8 + 1] = position[1]

    const { frame } = atlas.frames[tile]
    // sprite pos
    data[i * 8 + 2] = frame.x / spriteSize.w
    data[i * 8 + 3] = frame.y / spriteSize.h
    data[i * 8 + 4] = frame.w / spriteSize.w
    data[i * 8 + 5] = frame.h / spriteSize.h

    // flip and rotate
    data[i * 8 + 6] = flip || 0
    data[i * 8 + 7] = rotate || 0
  }

  const vao = gl.createVertexArray()

  gl.bindVertexArray(vao)
  const quadBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)

  const gridBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, gridBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(1)
  gl.vertexAttribPointer(1, 2, gl.FLOAT, true, 32, 0)
  gl.vertexAttribDivisor(1, 1)

  gl.enableVertexAttribArray(2)
  gl.vertexAttribPointer(2, 4, gl.FLOAT, true, 32, 8)
  gl.vertexAttribDivisor(2, 1)

  gl.enableVertexAttribArray(3)
  gl.vertexAttribPointer(3, 2, gl.FLOAT, true, 32, 24)
  gl.vertexAttribDivisor(3, 1)

  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindVertexArray(null)

  const model = mat4.create()

  const position = options.position || [0, 0, 0]
  const scale = options.scale || [1, 1]

  const endPixel = [0.01 / (tileSize[0] * scale[0]), 0.01 / (tileSize[1] * scale[1])]
  shader.use()
  shader.setUniform('end_pixel', 'VEC2', endPixel)

  const render = ({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) => {
    gl.bindVertexArray(vao)
    shader.use()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    mat4.translate(model, modelMatrix, position)
    mat4.scale(model, model, [tileSize[0] * scale[0], tileSize[1] * scale[1], 1])
    shader.setUniform('model_matrix', 'MAT4', model)
    shader.setUniform('view_projection', 'MAT4', viewProjection)
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, gridData.length)
  }
  const r = { position, render }
  Object.defineProperties(r, {
    position: {
      get() {
        return position
      },
      set(v) {
        position[0] = v[0]
        position[1] = v[1]
      }
    }
  })
  return r
}
