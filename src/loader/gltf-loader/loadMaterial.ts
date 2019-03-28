import GLTFLoader from '.'
import { vec2 } from 'gl-matrix'

export interface ILoadedMaterial {
  index: number
  defines: string[]
  textures: WebGLTexture[]
  uniforms: Array<{
    name: string
    type: string
    value: any
  }>
  extensions: string[]
}

export default function loadMaterial(this: GLTFLoader, materialIndex: number) {
  const gl = this.gl
  let material = this.json.materials[materialIndex]
  const defines = [] // record '#define' infos add to shader source later
  const textures = [] // record textures used in this material
  const uniforms = []
  const extensions = []

  material = Object.assign(
    {
      emissiveFactor: [0, 0, 0],
      alphaMode: 'OPAQUE',
      alphaCutoff: 0.5,
      doubleSided: false
    },
    material
  )

  // assign default values, get define and texture info
  if (material.extensions) {
    if (material.extensions.KHR_materials_unlit) {
      extensions.push('KHR_materials_unlit')
    }
    if (material.extensions.KHR_materials_pbrSpecularGlossiness) {
      // TODO support specular glossiness material here
    }
  }

  if (material.pbrMetallicRoughness) {
    material.pbrMetallicRoughness = Object.assign(
      {
        baseColorFactor: [1, 1, 1, 1],
        metallicFactor: 1,
        roughnessFactor: 1
      },
      material.pbrMetallicRoughness
    )
    const mr = material.pbrMetallicRoughness
    uniforms.push(
      {
        name: 'u_MetallicRoughnessValues',
        type: 'VEC2',
        value: vec2.fromValues(mr.metallicFactor, mr.roughnessFactor)
      },
      { name: 'u_BaseColorFactor', type: 'VEC4', value: mr.baseColorFactor }
    )

    if (mr.baseColorTexture) {
      defines.push('HAS_BASECOLORMAP')
      textures.push(mr.baseColorTexture)
      uniforms.push({
        name: 'u_BaseColorSampler',
        type: 'INT',
        value: textures.length - 1
      })
    }

    if (mr.metallicRoughnessTexture) {
      defines.push('HAS_METALROUGHNESSMAP')
      textures.push(mr.metallicRoughnessTexture)
      uniforms.push({
        name: 'u_MetallicRoughnessSampler',
        type: 'INT',
        value: textures.length - 1
      })
    }
  }
  if (material.normalTexture) {
    material.normalTexture = Object.assign(
      { texCoord: 0, scale: 1 },
      material.normalTexture
    )
    defines.push('HAS_NORMALMAP')
    textures.push(material.normalTexture)
    uniforms.push(
      { name: 'u_NormalSampler', type: 'INT', value: textures.length - 1 },
      {
        name: 'u_NormalScale',
        type: 'FLOAT',
        value: material.normalTexture.scale
      }
    )
  }
  if (material.occlusionTexture) {
    material.occlusionTexture = Object.assign(
      { texCoord: 0, strength: 1 },
      material.occlusionTexture
    )
    defines.push('HAS_OCCLUSIONMAP')
    textures.push(material.occlusionTexture)
    uniforms.push(
      { name: 'u_OcclusionSampler', type: 'INT', value: textures.length - 1 },
      {
        name: 'u_OcclusionStrength',
        type: 'FLOAT',
        value: material.occlusionTexture.strength
      }
    )
  }
  if (material.emissiveTexture) {
    defines.push('HAS_EMISSIVEMAP')
    textures.push(material.emissiveTexture)
    uniforms.push(
      {
        name: 'u_EmissiveSampler',
        type: 'INT',
        value: textures.length - 1
      },
      {
        name: 'u_EmissiveFactor',
        type: 'VEC3',
        value: material.emissiveFactor
      }
    )
  }

  // assign material with default values added back
  this.json.materials[materialIndex] = material

  const loadTexture = (textureIndex: number, index: number) => {
    const tJSON = this.json.textures[textureIndex]
    const defaultSampler = {
      magFilter: WebGL2RenderingContext.LINEAR,
      minFilter: WebGL2RenderingContext.LINEAR,
      wrapS: WebGL2RenderingContext.REPEAT,
      wrapT: WebGL2RenderingContext.REPEAT
    }
    const sJSON = tJSON.sampler
      ? Object.assign(defaultSampler, this.json.samplers[tJSON.sampler])
      : defaultSampler
    const texture = gl.createTexture()

    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.loadedImages[tJSON.source]
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, sJSON.wrapS)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, sJSON.wrapT)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, sJSON.minFilter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, sJSON.magFilter)
    return texture
  }

  // load all used textures
  const loadedTextures = textures.map((v, i) => loadTexture(v.index, i))

  const loadedMaterial: ILoadedMaterial = {
    index: materialIndex,
    defines,
    textures: loadedTextures,
    uniforms,
    extensions
  }

  return loadedMaterial
}
