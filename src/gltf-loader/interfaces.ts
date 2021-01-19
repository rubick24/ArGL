import { mat4, quat, vec3 } from 'gl-matrix'
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
  type: string
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
  shader: Shader
  mode: number
}

export interface IMesh {
  primitives: IPrimitive[]
}

export interface ISkin {
  joints: number[]
  inverseBindMatricesAccessor: IAccessor | null
  jointMatrices: Float32Array
  jointNormalMatrices: Float32Array
}
export type ComputeJoints = (skin: ISkin, node: INode) => void

export interface INode {
  name: string
  index: number
  rotation: quat
  translation: vec3
  scale: vec3
  localTransform: mat4
  worldTransform: mat4
  inverseWorldTransform: mat4

  mesh?: IMesh
  children?: INode[]
  skin?: ISkin
  tempMatrix: mat4
}

export interface IScene {
  name: string
  nodes?: INode[]
}

export interface IAnimationCannel {
  targetNode: INode
  path: string
  duration: number
  interval: number
  inputAccessor: IAccessor
  outputAccessor: IAccessor
  interpolation?: string
}
export interface IAnimation {
  name: string
  targetNodes: {
    node: INode
    channels: IAnimationCannel[]
  }[]
  // channels: IAnimationCannel[]
  duration: number
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
