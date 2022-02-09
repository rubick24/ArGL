import { mat4 } from 'gl-matrix'
import { SpriteAtlasJson } from '../atlas'
import Shader from '../../shader'
import vs from './sprite.vert'
import fs from './sprite.frag'
import { refs } from '../../refs'

export const createAnimatedSprite = async (options: {
  texture: string
  atlas: string
  position?: [number, number, number]
  scale?: [number, number]
}) => {
  const { gl } = refs
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
  console.log(options.atlas, atlas)
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

  let currentFrame = 0
  let lastChange = performance.now()

  const mvp = mat4.create()
  let currentFrameObject = atlas.frames[currentFrame]
  let currentLoop = 0
  let loop = Infinity

  // switch animation immediately
  let switchAnimation: {
    name: string
    loop: number
  } | null = {
    name: '',
    loop: Infinity
  }

  // switch animation after current animation is finished
  const animationQueue: {
    name: string
    loop: number
  }[] = []

  return {
    scale: options.scale || [1, 1],
    position: options.position || [0, 0, 0],
    animations,
    currentAnimation: atlas.meta.frameTags[0].name,
    sourceSize: currentFrameObject.sourceSize,
    spriteSourceSize: currentFrameObject.spriteSourceSize,
    setAnimation(name: string, loop = Infinity) {
      switchAnimation = {
        name,
        loop
      }
    },
    pushAnimation(name: string, loop = Infinity) {
      animationQueue.push({ name, loop })
    },
    render({ modelMatrix, viewProjection }: { modelMatrix: mat4; viewProjection: mat4 }) {
      gl.bindVertexArray(vao)
      shader.use()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      if (refs.time > lastChange + currentFrameObject.duration || switchAnimation) {
        if (switchAnimation) {
          this.currentAnimation = switchAnimation.name
          loop = switchAnimation.loop
          switchAnimation = null
          currentFrame = 0
          currentLoop = 0
          const animation = animations[this.currentAnimation]
          currentFrameObject = atlas.frames[animation.start]
        } else {
          const animation = animations[this.currentAnimation]
          if (currentFrame + 1 === animation.length) {
            currentLoop += 1
          }
          if (currentLoop >= loop) {
            const next = animationQueue.shift()
            if (next) {
              this.currentAnimation = next.name
              loop = next.loop
              currentFrame = 0
              currentLoop = 0
              const animation = animations[this.currentAnimation]
              currentFrameObject = atlas.frames[animation.start]
            }
          } else {
            currentFrame = (currentFrame + 1) % animation.length
            currentFrameObject = atlas.frames[animation.start + currentFrame]
          }
        }
        // debug sprite animation frame
        // console.log(currentFrameObject.filename, refs.time - lastChange)
        const { frame, sourceSize, spriteSourceSize } = currentFrameObject
        shader.use()
        shader.setUniform('sprite_box', 'VEC4', [
          spriteSourceSize.x / sourceSize.w,
          spriteSourceSize.y / sourceSize.h,
          spriteSourceSize.w / sourceSize.w,
          spriteSourceSize.h / sourceSize.h
        ])
        shader.setUniform('sprite_position', 'VEC4', [
          frame.x / spriteSize.w,
          frame.y / spriteSize.h,
          frame.w / spriteSize.w,
          frame.h / spriteSize.h
        ])
        const endPixel = [
          0.01 / (sourceSize.w * this.scale[0]),
          0.01 / (sourceSize.h * this.scale[1])
        ]
        shader.setUniform('end_pixel', 'VEC2', endPixel)

        this.sourceSize = sourceSize
        this.spriteSourceSize = spriteSourceSize
        lastChange = refs.time
      }
      mat4.translate(mvp, modelMatrix, this.position)
      mat4.scale(mvp, mvp, [
        currentFrameObject.sourceSize.w * this.scale[0],
        currentFrameObject.sourceSize.h * this.scale[1],
        1
      ])
      mat4.mul(mvp, viewProjection, mvp)
      shader.setUniform('mvp_matrix', 'MAT4', mvp)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
  }
}
