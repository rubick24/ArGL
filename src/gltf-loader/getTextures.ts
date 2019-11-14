import { GlTF } from '../types/glTF'

export default (
  gl: WebGL2RenderingContext,
  json: GlTF,
  images: HTMLImageElement[],
  textureIndex: number,
  index: number
) => {
  if (!json.textures) {
    throw new Error('glTFLoader: texture not found')
  }
  const tJSON = json.textures[textureIndex]
  if (tJSON.source === undefined) {
    throw new Error('glTFLoader: texture.source is undefined')
  }
  const defaultSampler = {
    magFilter: WebGL2RenderingContext.LINEAR,
    minFilter: WebGL2RenderingContext.LINEAR,
    wrapS: WebGL2RenderingContext.REPEAT,
    wrapT: WebGL2RenderingContext.REPEAT
  }
  const sJSON = tJSON.sampler
    ? Object.assign(defaultSampler, json.samplers && json.samplers.length > tJSON.sampler ? json.samplers[tJSON.sampler] : defaultSampler)
    : defaultSampler
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error('glTFLoader: create texture failed')
  }
  gl.activeTexture(gl.TEXTURE0 + index)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[tJSON.source])
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, sJSON.wrapS)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, sJSON.wrapT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, sJSON.minFilter)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, sJSON.magFilter)
  return texture
}
