import { Mesh, initMeshBuffers } from 'webgl-obj-loader'
import { mobilecheck, loadImage } from './util'
import Input from './input'
import FBHelper from './FBHelper'


class ArGL {
  constructor({
    width = 300,
    height = 150,
    desktopInput = true,
    touchInput = true
  }) {
    this.options = { width, height, desktopInput, touchInput }
    // console.log(arguments[0], this.options)

    this.el = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.el.style.width = width.toString() + 'px'
    this.el.style.height = height.toString() + 'px'
    this.canvas.style.width = width.toString() + 'px'
    this.canvas.style.height = height.toString() + 'px'

    this.loadingBar = document.createElement('progress')
    this.loadingBar.value = 0
    this.loadingBar.max = 100
    this.loadingBar.style.width = width + 'px'
    this.el.appendChild(this.loadingBar)

    this.resource = {
      images: []
    }
    this.resourceCount = 0
    this.loadProgress = []
    let self = this
    this.loadProgressProxy = new Proxy(this.loadProgress, {
      set: function (target, key, value, receiver) {
        let sum = self.loadProgress.reduce((p, v) => { return p + Number(v) }, 0)
        // console.log('progress: ' + Math.round(sum / self.resourceCount) + '%')
        if (self.resourceCount !== 0) {
          self.loadingBar.value = sum / self.resourceCount
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
      if (typeof desktopInput !== 'boolean') {
        dio = this.options.desktopInput
      }
      let [currentlyPressedKeys, mouseInput] = ArGL.desktopInput(this.canvas, dio)
      this.currentlyPressedKeys = currentlyPressedKeys
      this.mouseInput = mouseInput

    }

    if (touchInput) {
      let ongoingTouches = ArGL.touchInput(this.canvas)
      this.ongoingTouches = ongoingTouches
    }
  }

  resize() {
    // 获取浏览器中画布的显示尺寸
    let displayWidth = this.canvas.clientWidth
    let displayHeight = this.canvas.clientHeight

    // 检尺寸是否相同
    if (this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight) {

      // 设置为相同的尺寸
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
      for (let i in this.ongoingTouches) {
        this.ongoingTouches[i].deltaX = 0
        this.ongoingTouches[i].deltaY = 0
      }
    }
    if (this.options.desktopInput) {
      this.mouseInput.deltaX = 0
      this.mouseInput.deltaY = 0
      if (this.mouseInput.drag) {
        this.mouseInput.dragX = 0
        this.mouseInput.dragY = 0
      }
      this.mouseInput.wheelDeltaY = 0
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

    this.loadingBar.remove()
    this.el.appendChild(this.canvas)
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
        this.loadProgressProxy[index] = ratio
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
