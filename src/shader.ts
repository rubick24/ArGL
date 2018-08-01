import { vec3, vec4, mat3, mat4 } from "gl-matrix";
import { Mesh } from "webgl-obj-loader";

export default class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram

  constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
    let vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
    let fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    // 创建着色器程序
    let shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    // 创建失败
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram))
      return null
    }

    this.gl = gl
    this.program = shaderProgram
  }

  use() {
    this.gl.useProgram(this.program)
  }

  setBool(name: string, value: boolean) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setInt(name: string, value: number) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Math.round(Number(value)))
  }
  setFloat(name: string, value: number) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setVec3(name: string, vec3: vec3) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), vec3)
  }
  setVec4(name: string, vec4: vec4) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), vec4)
  }
  setMat3(name: string, mat3: mat3) {
    this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, mat3)
  }
  setMat4(name: string, mat4: mat4) {
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, mat4)
  }

}

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  // Send the source to the shader object
  gl.shaderSource(shader, source)
  // Compile the shader program
  gl.compileShader(shader)
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}
