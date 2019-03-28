import Shader from '../../shader'

export type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array

type TypedArrayConstructor =
  | Int8ArrayConstructor
  | Uint8ArrayConstructor
  | Int16ArrayConstructor
  | Uint16ArrayConstructor
  | Int32ArrayConstructor
  | Uint32ArrayConstructor
  | Uint8ClampedArrayConstructor
  | Float32ArrayConstructor
  | Float64ArrayConstructor

export interface ILoadedAccessor {
  index: number
  itemSize: number
  bufferData: TypedArray
}

export interface ILoadedPrimitive {
  indices: WebGLBuffer
  vao: WebGLVertexArrayObject
  shader: Shader
}

export interface ILoadedMesh {
  loadedPrimitives: ILoadedPrimitive[]
}

export function componentTypedArray(type: number): TypedArrayConstructor {
  switch (type) {
    case WebGL2RenderingContext.BYTE:
      return Int8Array
    case WebGL2RenderingContext.UNSIGNED_BYTE:
      return Uint8Array
    case WebGL2RenderingContext.SHORT:
      return Int16Array
    case WebGL2RenderingContext.UNSIGNED_SHORT:
      return Uint16Array
    case WebGL2RenderingContext.UNSIGNED_INT:
      return Uint32Array
    case WebGL2RenderingContext.FLOAT:
      return Float32Array
  }
}

export function typeSize(type: string): number {
  switch (type) {
    case 'SCALAR':
      return 1
    case 'VEC2':
      return 2
    case 'VEC3':
      return 3
    case 'VEC4':
      return 4
    case 'MAT2':
      return 4
    case 'MAT3':
      return 9
    case 'MAT4':
      return 16
  }
}
