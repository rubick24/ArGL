const loadShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('can not create shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errMsg = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    gl.deleteShader(shader)
    throw new Error(errMsg)
  }
  return shader
}

type uType = 'BOOLEAN' | 'INT' | 'FLOAT' | 'VEC2' | 'VEC3' | 'VEC4' | 'MAT2' | 'MAT3' | 'MAT4'

interface ShaderOptions {
  gl: WebGL2RenderingContext
  vs: string
  fs: string
  transformFeedbackVaryings?: string[]
}

export default class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram
  locations: Map<string, WebGLUniformLocation | null>
  unifromBuffers: any

  constructor({
    gl,
    vs,
    fs,
    transformFeedbackVaryings
  }: ShaderOptions) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs)
    const shaderProgram = gl.createProgram()
    if (!shaderProgram) {
      throw new Error('can not create shader program')
    }
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)

    if (transformFeedbackVaryings) {
      gl.transformFeedbackVaryings(shaderProgram, transformFeedbackVaryings, gl.INTERLEAVED_ATTRIBS)
    }
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`
      )
    }
    this.gl = gl
    this.program = shaderProgram
    this.locations = new Map()
    this.unifromBuffers = {}
  }

  use() {
    this.gl.useProgram(this.program)
  }
  setUniform(name: string, type: uType, value: any) {
    let location = this.locations.get(name)
    if (!location) {
      location = this.gl.getUniformLocation(this.program, name)
      this.locations.set(name, location)
    }

    switch (type) {
      case 'BOOLEAN':
        return this.gl.uniform1i(location, Number(value))
      case 'INT':
        return this.gl.uniform1i(location, Math.round(value))
      case 'FLOAT':
        return this.gl.uniform1f(location, value)
      case 'VEC2':
        return this.gl.uniform2fv(location, value)
      case 'VEC3':
        return this.gl.uniform3fv(location, value)
      case 'VEC4':
        return this.gl.uniform4fv(location, value)
      case 'MAT2':
        return this.gl.uniformMatrix2fv(location, false, value)
      case 'MAT3':
        return this.gl.uniformMatrix3fv(location, false, value)
      case 'MAT4':
        return this.gl.uniformMatrix4fv(location, false, value)
      default:
        return
    }
  }
  setUniformBuffer(name: string, data: Float32Array) {
    const gl = this.gl
    let buffer = this.unifromBuffers[name]
    if (!buffer) {
      buffer = gl.createBuffer()
      gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
      gl.uniformBlockBinding(this.program, 0, 0)
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, buffer)
      this.unifromBuffers[name] = buffer
    }

    gl.bindBuffer(gl.UNIFORM_BUFFER, buffer)
    gl.bufferData(gl.UNIFORM_BUFFER, data, gl.DYNAMIC_DRAW)
  }
}
