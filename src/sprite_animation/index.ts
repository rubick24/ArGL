import { mat4 } from 'gl-matrix'
import { SpriteAtlasJson } from './atlas'
import Shader from '../shader'
import vs from './sprite.vert'
import fs from './sprite.frag'

export const animated_sprite = async (
  gl: WebGL2RenderingContext,
  options: {
    texture: string
    atlas: string
    scale: number
  }
) => {
  if (!options.scale) {
    options.scale = 1
  }
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
    fetch(options.atlas).then(r => r.json()) as Promise<SpriteAtlasJson>
  ])
  console.log(atlas, texture)
  const spriteSize = atlas.meta.size

  const getDuration = (from: number, to: number) => {
    let r = 0
    for (let i = from; i <= to; i++) {
      r += atlas.frames[i].duration
    }
    return r
  }
  const animations: Record<string, { start: number; length: number; duration: number }> = {}
  for (const tag of atlas.meta.frameTags) {
    animations[tag.name] = {
      start: tag.from,
      length: tag.to - tag.from + 1,
      duration: getDuration(tag.from, tag.to)
    }
  }

  let currentAnimation = atlas.meta.frameTags[0].name
  let currentFrame = 0
  let last = performance.now()

  const mvp = mat4.create()
  let currentFrameObject = atlas.frames[currentFrame]

  const render = ({
    modelMatrix,
    viewProjection,
    time
  }: {
    modelMatrix: mat4
    viewProjection: mat4
    time: number
  }) => {
    gl.bindVertexArray(vao)
    shader.use()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    const animation = animations[currentAnimation]

    if (time > last + currentFrameObject.duration) {
      last = time
      currentFrame = (currentFrame + 1) % animation.length
      currentFrameObject = atlas.frames[animation.start + currentFrame]

      const { frame, sourceSize, spriteSourceSize } = currentFrameObject

      shader.setUniform('sprite_box', 'VEC4', [
        spriteSourceSize.x / sourceSize.w,
        spriteSourceSize.y / sourceSize.h,
        spriteSourceSize.w / sourceSize.w,
        spriteSourceSize.h / sourceSize.h
      ])
      shader.setUniform('sprite_position', 'VEC4', [
        (frame.x + 2) / spriteSize.w,
        (frame.y + 2) / spriteSize.h,
        (frame.w - 4) / spriteSize.w,
        (frame.h - 4) / spriteSize.h
      ])
    }

    mat4.scale(mvp, modelMatrix, [
      currentFrameObject.sourceSize.w * options.scale,
      currentFrameObject.sourceSize.h * options.scale,
      1
    ])
    mat4.mul(mvp, viewProjection, mvp)
    shader.setUniform('mvp_matrix', 'MAT4', mvp)
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
