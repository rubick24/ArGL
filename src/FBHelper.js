import Shader from './shader'

export default function FBhelper(ArGL) {
  const quadVertices = [
    -1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
  ]
  const quadVerticesWithUV = [
    -1.0, 1.0, 0.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
  ]


  const fbvs = `#version 300 es

  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec2 a_texCoord;

  out vec2 TexCoord;

  void main()
  {
      TexCoord = a_texCoord;
      gl_Position = vec4(a_position, 1.0);
  }
  `

  const fbfs = `#version 300 es

  precision mediump float;

  out vec4 FragColor;
  in vec2 TexCoord;

  uniform sampler2D scene;

  void main()
  {
    FragColor = texture(scene, TexCoord);
  }
  `
  const depthFS = `#version 300 es

  precision mediump float;

  out vec4 FragColor;
  in vec2 TexCoord;

  uniform sampler2D depthMap;

  void main()
  {
    float depthValue = texture(depthMap, TexCoord).r;
    FragColor = vec4(vec3(depthValue), 1.0);
  }
  `

  ArGL.prototype.drawQuad = function (textures) {
    // self.gl.bindVertexArray(null)
    if (this.quadVAO === undefined) {
      this.quadVAO = this.gl.createVertexArray()
      let quadVBO = this.gl.createBuffer()
      this.gl.bindVertexArray(this.quadVAO)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quadVerticesWithUV), this.gl.STATIC_DRAW)
      this.gl.enableVertexAttribArray(0)
      this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, true, 20, 0)
      this.gl.enableVertexAttribArray(1)
      this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, true, 20, 12)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
      this.gl.bindVertexArray(null)
    }
    this.gl.bindVertexArray(this.quadVAO)
    if (textures.length === 1) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[0])
    } else {
      for (let i in textures) {
        this.gl.activeTexture(this.gl.TEXTURE0 + Number(i))
        this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i])
      }
    }

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    this.gl.bindVertexArray(null)
  }

  ArGL.prototype.drawFB = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new Shader(this.gl, fbvs, fbfs)
    }
    this.fbShader.use()
    this.fbShader.setInt('scene', 0)
    this.drawQuad([texture])
  }

  ArGL.prototype.drawDepth = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new Shader(this.gl, fbvs, depthFS)
    }
    this.fbShader.use()
    this.fbShader.setInt('depthMap', 0)
    this.drawQuad([texture])
  }

  ArGL.prototype.QuadVertices = quadVertices
  ArGL.prototype.QuadVerticesWithUV = quadVerticesWithUV
  ArGL.prototype.FBVS = fbvs
  ArGL.prototype.FBFS = fbvs
  ArGL.prototype.DEPTHFS = depthFS
}
