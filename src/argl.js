import { Mesh, initMeshBuffers } from 'webgl-obj-loader'
import { mobilecheck, loadImage } from './util'
import Input from './input'
import FBHelper from './FBHelper'

const defaultOptions = {
  desktopInput: true,
  touchInput: true
}

class ArGL {
  constructor(canvas, options) {
    if (options) {
      this.options = Object.assign(defaultOptions, options)
    } else {
      this.options = defaultOptions
    }

    this.canvas = canvas

    this.loadProgress = 0

    this.resource = {
      images: []
    }
    this.resourceCount = 0
    this._loadProgresses = []
    let self = this
    this.loadProgresses = new Proxy(this._loadProgresses, {
      set: function (target, key, value, receiver) {
        let sum = self._loadProgresses.reduce((p, v) => { return p + Number(v) }, 0)
        if (self.resourceCount !== 0 && self.loadProgress !== sum / self.resourceCount) {
          self.loadProgress = sum / self.resourceCount
          let Progress = new CustomEvent('progress', { detail: self.loadProgress })
          self.canvas.dispatchEvent(Progress)
        }
        return Reflect.set(target, key, value, receiver)
      }
    })


    this.gl = this.canvas.getContext('webgl2')
    if (!this.gl) {
      console.error('Unable to initialize WebGL2. Your browser or machine may not support it.')
      return null
    }

    this.deltaTime = 0
    this.lastFrame = 0

    if (mobilecheck()) {
      this.mobile = true
    } else {
      this.mobile = false
    }

    if (this.options.desktopInput) {
      let dio = { lockPointer: true }
      if (typeof this.options.desktopInput !== 'boolean') {
        dio = this.options.desktopInput
      }
      let { currentlyPressedKeys, mouseInput } = ArGL.desktopInput(this.canvas, dio)
      this.currentlyPressedKeys = currentlyPressedKeys
      this.mouseInput = mouseInput
    }

    if (this.options.touchInput) {
      this.touchInput = ArGL.touchInput(this.canvas)
    }
  }

  resize() {
    let displayWidth = this.canvas.clientWidth
    let displayHeight = this.canvas.clientHeight

    if (this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight) {

      this.canvas.width = displayWidth
      this.canvas.height = displayHeight
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
  }

  draw(time) { }
  started() { }

  render(time) {
    this.deltaTime = time - this.lastFrame
    this.lastFrame = time
    this.resize()
    this.draw(time)

    if (this.options.touchInput) {
      this.touchInput.reset()
    }
    if (this.options.desktopInput) {
      this.mouseInput.reset()
    }
    requestAnimationFrame(this.render.bind(this))
  }

  loadMesh(objString) {
    let mesh = new Mesh(objString)
    initMeshBuffers(this.gl, mesh)
    return mesh
  }

  setMeshVAO(mesh, shader) {
    let a_position = this.gl.getAttribLocation(shader.program, 'a_position')
    let a_texCoord = this.gl.getAttribLocation(shader.program, 'a_texCoord')
    let a_normal = this.gl.getAttribLocation(shader.program, 'a_normal')

    let vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(vao)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer)
    this.gl.vertexAttribPointer(a_position, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.textureBuffer)
    this.gl.vertexAttribPointer(a_texCoord, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_texCoord)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer)
    this.gl.vertexAttribPointer(a_normal, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(a_normal)

    this.gl.bindVertexArray(null)

    return vao
  }

  drawMesh(mesh, vao) {
    this.gl.bindVertexArray(vao)
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer)
    this.gl.drawElements(this.gl.TRIANGLES, mesh.indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0)
    this.gl.bindVertexArray(null)
  }

  async start() {
    let textures = await this.loadTexture()
    this.render(this.lastFrame)
    this.textures = textures
    this.started()
  }

  setImageResource(images) {
    this.resource.images = images
  }

  async loadTexture() {
    let textures = []
    this.resourceCount += this.resource.images.length
    let promises = this.resource.images.map((element, index) => {
      return ArGL.loadImage(element, (ratio) => {
        this.loadProgresses[index] = ratio
      })
    })

    let loadedImgs = await Promise.all(promises)
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
    loadedImgs.forEach((element, index) => {
      textures[index] = this.gl.createTexture()
      this.gl.activeTexture(this.gl.TEXTURE0 + index)
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[index])
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, element)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    })

    return textures

  }

}
ArGL.loadImage = loadImage
Input(ArGL)
FBHelper(ArGL)

export default ArGL
