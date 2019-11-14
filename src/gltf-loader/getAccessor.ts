import { GlTF } from '../types/glTF'
import { IAccessor, typeSize, componentTypedArray } from './interfaces'

export default (json: GlTF, buffers: ArrayBuffer[]): IAccessor[] => {
  if (!json.accessors || !json.bufferViews) {
    throw new Error('glTFLoader: no accessors or bufferViews')
  }
  const accessorsTemp = json.accessors
  const bufferViewsTemp = json.bufferViews
  return accessorsTemp.map((v, i) => {
    const accessor = accessorsTemp[i]
    const itemSize = typeSize[accessor.type as GLType]
    const bufferView = bufferViewsTemp[accessor.bufferView as number]
    const bufferIndex = bufferView.buffer
    const arrayType = componentTypedArray[accessor.componentType]
    const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0)
    return {
      index: i,
      itemSize,
      count: accessor.count,
      componentType: accessor.componentType,
      bufferData: new arrayType(
        buffers[bufferIndex],
        byteOffset, // offset of byte
        itemSize * accessor.count // length of element
      )
    }
  })
}
