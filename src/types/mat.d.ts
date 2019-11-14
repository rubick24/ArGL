type PushFront<TailT extends any[], FrontT> = ((front: FrontT, ...rest: TailT) => any) extends ((
  ...tuple: infer TupleT
) => any)
  ? TupleT
  : never

type Tuple<ElementT, LengthT extends number, OutputT extends any[] = []> = {
  0: OutputT
  1: Tuple<ElementT, LengthT, PushFront<OutputT, ElementT>>
}[OutputT['length'] extends LengthT ? 0 : 1]

type Vec2 = Tuple<number, 2>
type Vec3 = Tuple<number, 3>
type Vec4 = Tuple<number, 4>
type Quat = Tuple<number, 4>
type Mat2 = Tuple<number, 4>
type Mat3 = Tuple<number, 9>
type Mat4 = Tuple<number, 16>

type GLType = 'SCALAR' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4'
type GLArrayType = Int8Array | Uint8Array | Int16Array | Uint16Array | Uint32Array | Float32Array

declare module 'gl-matrix' {
  const value: any
  export default value
  export const glMatrix: any
  export const vec2: any
  export const vec3: any
  export const vec4: any
  export const mat2: any
  export const mat3: any
  export const mat4: any
  export const quat: any
}
