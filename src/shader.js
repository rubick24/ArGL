export default class Shader {
  constructor(gl, vsSource, fsSource) {
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

  setBool(name, value) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setInt(name, value) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setFloat(name, value) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setVec3(name, vec3) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), vec3)
  }
  setVec4(name, vec4) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), vec4)
  }
  setMat3(name, mat3) {
    this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, mat3)
  }
  setMat4(name, mat4) {
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, mat4)
  }

  // setUniforms(uniforms){
  //   Object.keys(uniforms).forEach(key=>{

  //   })
  // }
}

function loadShader(gl, type, source) {
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
