import { GlTF } from '../types/glTF'
import { IMaterial, UniformType } from './interfaces'
import getTextures from './getTextures'
import Shader from '../shader'
import vsSource from './shader/m.vert'
import fsSource from './shader/m.frag'

let shader: Shader

export default (gl: WebGL2RenderingContext, json: GlTF, images: HTMLImageElement[]) => {
  if (!shader) {
    shader = new Shader({ gl, vs: vsSource, fs: fsSource })
  }
  if (!json.materials) {
    return []
  }

  return json.materials.map(
    (material): IMaterial => {
      const uniforms = []
      const textureIndexes = []

      // 只支持unlit
      if (
        !material.extensions ||
        !material.extensions.KHR_materials_unlit ||
        !material.pbrMetallicRoughness
      ) {
        throw new Error('glTFLoader: only support KHR_materials_unlit now')
      }
      const mr = material.pbrMetallicRoughness
      uniforms.push({
        name: 'u_BaseColorFactor',
        type: 'VEC4' as UniformType,
        value: new Float32Array(mr.baseColorFactor || [0.5, 0.5, 0.5])
      })

      if (mr.baseColorTexture) {
        textureIndexes.push(mr.baseColorTexture)
        uniforms.push({
          name: 'u_BaseColorSampler',
          type: 'INT' as UniformType,
          value: textureIndexes.length - 1
        })
      }

      const textures = textureIndexes.map((v, i) => getTextures(gl, json, images, v.index, i))
      return {
        shader,
        uniforms,
        textures
      }
    }
  )
}
