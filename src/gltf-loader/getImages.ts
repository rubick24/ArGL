import { GlTF } from '../types/glTF'

export default async (json: GlTF, buffers?: ArrayBuffer[]) => {
  if (!json.images) {
    return []
  }
  return Promise.all(
    json.images.map(image => {
      if (image.uri) {
        const img = new Image()
        img.src = image.uri
        return new Promise(resolve => {
          img.onload = () => resolve(img)
        }) as Promise<HTMLImageElement>
      } else if (image.bufferView) {
        if (!json.bufferViews || !buffers) {
          throw new Error('glTFLoader: no bufferViews or buffers')
        }
        const bufferView = json.bufferViews[image.bufferView]
        const byteOffset = bufferView.byteOffset || 0
        const bufferData = buffers[bufferView.buffer].slice(
          byteOffset,
          byteOffset + bufferView.byteLength
        )
        const blob = new Blob([bufferData], { type: image.mimeType })
        const img = new Image()
        img.src = URL.createObjectURL(blob)
        return new Promise(resolve => {
          img.onload = () => resolve(img)
          // img.onprogress = onProgress
        }) as Promise<HTMLImageElement>
      } else {
        throw new Error('glTFLoader: neither image.uri or image.bufferView specified')
      }
    })
  )
}
