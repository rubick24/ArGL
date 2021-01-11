import { mat4 } from 'gl-matrix'
import Shader from '../shader'

export type GLType = 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4'
export type GLArrayType =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Uint32Array
  | Float32Array

export interface IAccessor {
  index: number
  itemSize: number
  count: number
  componentType: number
  max: number[] | undefined
  min: number[] | undefined
  bufferData: GLArrayType
}

export type UniformType =
  | 'BOOLEAN'
  | 'INT'
  | 'FLOAT'
  | 'VEC2'
  | 'VEC3'
  | 'VEC4'
  | 'MAT2'
  | 'MAT3'
  | 'MAT4'

export interface IMaterial {
  shader: Shader
  uniforms: {
    name: string
    type: UniformType
    value: any
  }[]
  textures: WebGLTexture[]
}

export interface IPrimitive {
  indices: {
    accessor: IAccessor
    buffer: WebGLBuffer
  }
  vao: WebGLVertexArrayObject
  material: IMaterial
  mode: number
}

export interface IMesh {
  primitives: IPrimitive[]
}

export interface INode {
  name: string
  index: number
  matrix: mat4
  mesh?: IMesh
  children?: INode[]
  tempMatrix: mat4
}

export interface IScene {
  name: string
  nodes?: INode[]
}

export interface IAnimationCannel {
  targetNodeIndex: number
  path: string
  startAt: number
  endAt: number
  data: Float32Array
}
export interface IAnimation {
  name: string
  frameRate: number
  triggerStart: boolean
  startAt: number
  channels: IAnimationCannel[]
}

export const typeSize = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}

export const componentTypedArray = {
  [WebGL2RenderingContext.BYTE]: Int8Array,
  [WebGL2RenderingContext.UNSIGNED_BYTE]: Uint8Array,
  [WebGL2RenderingContext.SHORT]: Int16Array,
  [WebGL2RenderingContext.UNSIGNED_SHORT]: Uint16Array,
  [WebGL2RenderingContext.UNSIGNED_INT]: Uint32Array,
  [WebGL2RenderingContext.FLOAT]: Float32Array
}
