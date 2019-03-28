import { mat4, mat3, mat2, vec4, vec3, vec2 } from 'gl-matrix'

function loadShader(
  gl: WebGL2RenderingContext,
  type:
    | WebGL2RenderingContext['VERTEX_SHADER']
    | WebGL2RenderingContext['FRAGMENT_SHADER'],
  source: string
): WebGLShader {
  const shader = gl.createShader(type)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const errMsg = `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
      shader
    )}`
    gl.deleteShader(shader)
    throw new Error(errMsg)
  }
  return shader
}

export type UNIFORM_TYPES =
  | 'BOOL'
  | 'INT'
  | 'FLOAT'
  | 'VEC2'
  | 'VEC3'
  | 'VEC4'
  | 'MAT2'
  | 'MAT3'
  | 'MAT4'

export default class Shader {
  public program: WebGLProgram
  private gl: WebGL2RenderingContext

  constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        'Unable to initialize the shader program: ' +
          gl.getProgramInfoLog(shaderProgram)
      )
      return null
    }

    this.gl = gl
    this.program = shaderProgram
  }
  public use() {
    this.gl.useProgram(this.program)
  }

  public setUniform(name: string, type: UNIFORM_TYPES, value: any) {
    switch (type) {
      case 'BOOL':
        return this.setBool(name, value as boolean)
      case 'INT':
        return this.setInt(name, value as number)
      case 'FLOAT':
        return this.setFloat(name, value as number)
      case 'VEC2':
        return this.setVec2(name, value as vec2)
      case 'VEC3':
        return this.setVec3(name, value as vec3)
      case 'VEC4':
        return this.setVec4(name, value as vec4)
      case 'MAT2':
        return this.setMat2(name, value as mat2)
      case 'MAT3':
        return this.setMat3(name, value as mat3)
      case 'MAT4':
        return this.setMat4(name, value as mat4)
    }
  }

  public setBool(name: string, value: boolean) {
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.program, name),
      Number(value)
    )
  }
  public setInt(name: string, value: number) {
    this.gl.uniform1i(
      this.gl.getUniformLocation(this.program, name),
      Math.round(value)
    )
  }
  public setFloat(name: string, value: number) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), value)
  }
  public setVec2(name: string, value: vec2) {
    this.gl.uniform2fv(this.gl.getUniformLocation(this.program, name), value)
  }
  public setVec3(name: string, value: vec3) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), value)
  }
  public setVec4(name: string, value: vec4) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), value)
  }
  public setMat2(name: string, value: mat2) {
    this.gl.uniformMatrix2fv(
      this.gl.getUniformLocation(this.program, name),
      false,
      value
    )
  }
  public setMat3(name: string, value: mat3) {
    this.gl.uniformMatrix3fv(
      this.gl.getUniformLocation(this.program, name),
      false,
      value
    )
  }
  public setMat4(name: string, value: mat4) {
    this.gl.uniformMatrix4fv(
      this.gl.getUniformLocation(this.program, name),
      false,
      value
    )
  }
}
