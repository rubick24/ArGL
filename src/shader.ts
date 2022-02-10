import { mat2, mat3, mat4, vec2, vec3, vec4 } from 'gl-matrix'

const loadShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errMsg = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    gl.deleteShader(shader)
    throw new Error(errMsg)
  }
  return shader
}

export type ShaderOptions = {
  gl: WebGL2RenderingContext
  vs: string
  fs: string
  transformFeedbackVaryings?: string[]
}

type SetUniformParams = {
  BOOLEAN: boolean
  INT: number
  FLOAT: number
  VEC2: vec2
  VEC3: vec3
  VEC4: vec4
  MAT2: mat2
  MAT3: mat3
  MAT4: mat4
}
export type UniformType = keyof SetUniformParams

type SetUniform = <T extends UniformType>(name: string, type: T, value: SetUniformParams[T]) => void

export type Shader = {
  use(): void
  setUniform: SetUniform
  setUniformBuffer(name: string, data: Float32Array): void
}

export const createShader = ({ gl, vs, fs, transformFeedbackVaryings }: ShaderOptions): Shader => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs)
  const program = gl.createProgram()
  if (!program) {
    throw new Error('can not create shader program')
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS)
  }
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`)
  }

  const locations = new Map()
  const uniformBuffers = {} as Record<string, WebGLBuffer>

  const setUniform: SetUniform = (name, type, value) => {
    let location = locations.get(name)
    if (!location) {
      location = gl.getUniformLocation(program, name)
      locations.set(name, location)
    }

    switch (type) {
      case 'BOOLEAN':
        return gl.uniform1i(location, Number(value))
      case 'INT':
        return gl.uniform1i(location, Math.round(value as number))
      case 'FLOAT':
        return gl.uniform1f(location, value as number)
      case 'VEC2':
        return gl.uniform2fv(location, value as vec2)
      case 'VEC3':
        return gl.uniform3fv(location, value as vec3)
      case 'VEC4':
        return gl.uniform4fv(location, value as vec4)
      case 'MAT2':
        return gl.uniformMatrix2fv(location, false, value as mat2)
      case 'MAT3':
        return gl.uniformMatrix3fv(location, false, value as mat3)
      case 'MAT4':
        return gl.uniformMatrix4fv(location, false, value as mat4)
      default:
        return
    }
  }

  const setUniformBuffer = (name: string, data: Float32Array) => {
    let buffer = uniformBuffers[name]
    if (!buffer) {
      buffer = gl.createBuffer()!
      gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
      gl.uniformBlockBinding(program, 0, 0)
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffer)
      uniformBuffers[name] = buffer
    }

    gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.DYNAMIC_DRAW)
  }
  return {
    use: () => {
      gl.useProgram(program)
    },
    setUniform,
    setUniformBuffer
  }
}
