import Shader from '../shader'
import { mat4, vec3 } from 'gl-matrix'
import vs from './sprite.vert'
import fs from './sprite.frag'

export default async (
  gl: WebGL2RenderingContext,
  option: {
    texture: string
    atlas: string
    frameDuration?: number
  }
) => {
  if (!option.frameDuration) {
    option.frameDuration = 100
  }

  const shader = new Shader({ gl, vs, fs })
  shader.use()
  const quad = [-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, -1.0]
  const vao = gl.createVertexArray()
  const vbo = gl.createBuffer()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, true, 8, 0)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

  const [texture, atlas] = await Promise.all([
    (async () => {
      const img = new Image()
      img.src = option.texture
      await new Promise(r => (img.onload = r))
      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, WebGL2RenderingContext.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, WebGL2RenderingContext.REPEAT)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, WebGL2RenderingContext.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, WebGL2RenderingContext.NEAREST)
      return texture
    })(),
    fetch(option.atlas).then(r => r.json())
  ])
  console.log(atlas, texture)
  const spriteSize = [atlas.meta.size.w, atlas.meta.size.h]
  const animations: {
    [k: string]: { start: number; length: number }
  } = {}

  for (const tag of atlas.meta.frameTags) {
    animations[tag.name] = { start: tag.from, length: tag.to - tag.from + 1 }
  }

  const frameDuration = 100

  let currentAnimation = atlas.meta.frameTags[0].name
  let currentFrame = 0
  let last = performance.now()

  const mvp = mat4.create()
  const position = [atlas.frames[0].frame.x, atlas.frames[0].frame.y]
  const size = vec3.fromValues(atlas.frames[0].frame.w, atlas.frames[0].frame.h, 1)
  const maxSize = [0, 0]
  for (const frame of atlas.frames) {
    if (frame.frame.w > maxSize[0]) {
      maxSize[0] = frame.frame.w
    }
    if (frame.frame.h > maxSize[1]) {
      maxSize[1] = frame.frame.h
    }
  }

  const render = ({
    modelMatrix,
    viewMatrix,
    projectionMatrix,
    time
  }: {
    modelMatrix: mat4
    viewMatrix: mat4
    projectionMatrix: mat4
    time: number
  }) => {
    gl.bindVertexArray(vao)
    shader.use()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    const animation = animations[currentAnimation]
    if (time > last + frameDuration) {
      last = time
      currentFrame = (currentFrame + 1) % animation.length
      const frame = atlas.frames[animation.start + currentFrame]
      position[0] = frame.frame.x
      position[1] = frame.frame.y
      size[0] = frame.frame.w
      size[1] = frame.frame.h
    }

    mat4.scale(mvp, modelMatrix, size)
    mat4.mul(mvp, viewMatrix, mvp)
    mat4.mul(mvp, projectionMatrix, mvp)
    shader.setUniform('mvp_matrix', 'MAT4', mvp)
    shader.setUniform('sprite_position', 'VEC4', [
      position[0] / spriteSize[0],
      position[1] / spriteSize[1],
      size[0] / spriteSize[0],
      size[1] / spriteSize[1]
    ])
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  return {
    animations,
    setAnimation: (name: string) => {
      currentAnimation = name
      currentFrame = 0
    },
    render
  }
}
