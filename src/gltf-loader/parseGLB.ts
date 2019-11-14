import { GlTF } from '../types/glTF'

const ASCII_GLTF = 0x46546c67 // glTF
const ASCII_JSON = 0x4e4f534a // JSON
const ASCII_BIN = 0x004e4942 //  BIN

export default async (url: string): Promise<[GlTF, ArrayBuffer[]]> => {
  const glb = await fetch(url).then(res => res.arrayBuffer())

  const header = new DataView(glb, 0, 12)
  if (header.getUint32(0, true) !== ASCII_GLTF) {
    throw new Error('glTFLoader: File is not valid binary glTF')
  }

  const version = header.getUint32(4, true)
  if (version !== 2) {
    throw new Error('glTFLoader: Only support glTF version 2')
  }

  const length = header.getUint32(8, true)
  const jsonChunkHeader = new DataView(glb, 12, 8)
  const jsonChunkLength = jsonChunkHeader.getUint32(0, true)
  if (jsonChunkHeader.getUint32(4, true) !== ASCII_JSON) {
    throw new Error('glTFLoader: first chunk must be structured JSON content')
  }
  const jsonChunkContent = new DataView(glb, 20, jsonChunkLength)
  const textDecoder = new TextDecoder('utf-8')
  const json = JSON.parse(textDecoder.decode(jsonChunkContent)) as GlTF

  // file header 12 byte + chunk header 8 byte + chunk data length
  let currentLength = 20 + jsonChunkLength

  if (currentLength >= length) {
    throw new Error('glTFLoader: glb parsing error')
  }

  const chunkHeader = new DataView(glb, currentLength, 8)
  const chunkLength = chunkHeader.getUint32(0, true)
  if (chunkHeader.getUint32(4, true) !== ASCII_BIN) {
    throw new Error('glTFLoader: second chunk of glb must be BIN chunk')
  }
  // pass chunk header
  currentLength += 8
  const buffers = [glb.slice(currentLength, currentLength + chunkLength)]
  return [json, buffers]
}
