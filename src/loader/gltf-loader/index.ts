import { GlTF } from '../glTF'
import loadImage from '../../util/loadImage'

import {
  ILoadedAccessor,
  ILoadedMesh,
  componentTypedArray,
  typeSize
} from './interfaces'

import parseGLB from './parseGLB'
import loadMesh from './loadMesh'
import loadMaterial, { ILoadedMaterial } from './loadMaterial'
import useMaterial from './useMaterial'
import { renderArgs, renderScene, renderNode } from './render'
import getCurrentValue from './getCurrentValue'

class GLTFLoader {
  public url: string
  public ext: string
  public json: GlTF
  public buffers: ArrayBuffer[]
  public gl: WebGL2RenderingContext
  public loadedAccessors: ILoadedAccessor[]
  public loadedMaterials: ILoadedMaterial[]
  public loadedImages: HTMLImageElement[]
  public loadedMeshs: ILoadedMesh[]

  // add attrs imported
  public renderArgs = renderArgs

  // add funcs imported
  public parseGLB = parseGLB
  public loadMaterial = loadMaterial
  public loadMesh = loadMesh
  public useMaterial = useMaterial
  public renderScene = renderScene
  public renderNode = renderNode
  public getCurrentValue = getCurrentValue

  constructor(url: string) {
    this.url = url
  }

  public async init(gl: WebGL2RenderingContext) {
    /**
     * resolve relative path from gltf file
     * @param target targe file url
     */
    const relativeURL = (target: string) => {
      if (this.url.lastIndexOf('/') !== -1) {
        return this.url.slice(0, this.url.lastIndexOf('/')) + '/' + target
      } else {
        return target
      }
    }

    if (/\.gltf/.test(this.url)) {
      this.ext = 'gltf'
      this.json = await fetch(this.url).then(res => res.json())
      this.buffers = await Promise.all(
        this.json.buffers.map(buffer => {
          const binURL = relativeURL(buffer.uri)
          return fetch(binURL).then(res => res.arrayBuffer())
        })
      )
    } else if (/\.glb/.test(this.url)) {
      this.ext = 'glb'
      await this.parseGLB()
    } else {
      throw new Error('glTFLoader: unsupported file extension')
    }

    if (this.json.accessors) {
      this.loadedAccessors = this.json.accessors.map((v, i) =>
        this.accessData(i)
      )
    }

    if (this.json.images) {
      this.loadedImages = await Promise.all(
        this.json.images.map(image => {
          if (image.uri) {
            return loadImage(relativeURL(image.uri))
          } else if (image.bufferView) {
            const bufferView = this.json.bufferViews[image.bufferView]
            const bufferData = this.buffers[bufferView.buffer].slice(
              bufferView.byteOffset,
              bufferView.byteOffset + bufferView.byteLength
            )
            const blob = new Blob([bufferData], { type: image.mimeType })
            const img = new Image()
            img.src = URL.createObjectURL(blob)
            return new Promise(resolve => {
              img.onload = () => resolve(img)
              // img.onprogress = onProgress
            }) as Promise<HTMLImageElement>
          }
        })
      )
    }

    this.gl = gl

    if (this.json.materials) {
      this.loadedMaterials = this.json.materials.map((v, i) =>
        this.loadMaterial(i)
      )
    }

    if (this.json.meshes) {
      this.loadedMeshs = this.json.meshes.map((v, i) => this.loadMesh(i))
    }
  }

  public accessData(accessorIndex: number) {
    const accessor = this.json.accessors[accessorIndex]
    const itemSize = typeSize(accessor.type)
    const bufferView = this.json.bufferViews[accessor.bufferView]
    const bufferIndex = bufferView.buffer
    const arrayType = componentTypedArray(accessor.componentType)
    const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0)

    const loadedAccessor = {
      index: accessorIndex,
      itemSize,
      bufferData: new arrayType(
        this.buffers[bufferIndex],
        byteOffset, // offset of byte
        itemSize * accessor.count // length of element
      )
    }
    return loadedAccessor
  }
}
export default GLTFLoader
