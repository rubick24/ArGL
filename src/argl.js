import { Mesh, initMeshBuffers } from 'webgl-obj-loader'

import FBhelper from './FBhelper'
import touchInput from './touchInput'
import desktopInput from './desktopInput'
import {mobilecheck, loadImage} from './util'

class ArGL {
  constructor({ width, height } = {
    width: 300,
    height: 150
  }) {
    this.el = document.createElement('div')
    this.canvas = document.createElement('canvas')

    this.canvas.width = width
    this.canvas.height = height
    // this.el.appendChild(this.canvas)

    this.loadingBar = document.createElement('progress')
    this.loadingBar.value = 0
    this.loadingBar.max = 100
    this.loadingBar.style.width = width + 'px'
    this.el.appendChild(this.loadingBar)

    this.resource = {}
    this.resource.images = []
    this.resourceCount = 0
    this.loadProgress = []
    let self = this
    this.loadProgressProxy = new Proxy(this.loadProgress, {
      set: function (target, key, value, receiver) {
        let sum = self.loadProgress.reduce((p, v) => { return p + v }, 0)
        // console.log('progress: ' + Math.round(sum / self.resourceCount) + '%')
        if (self.resourceCount !== 0) {
          self.loadingBar.value = sum / self.resourceCount
        }
        return Reflect.set(target, key, value, receiver)
      }
    })

    this.options = arguments[0]
    this.gl = this.canvas.getContext('webgl2')
    if (!this.gl) {
      console.error('Unable to initialize WebGL2. Your browser or machine may not support it.')
      return null
    }

    this.deltaTime = 0
    this.lastFrame = 0

    if (mobilecheck()) {
      this.addTouchInput()
    } else {
      this.addDesktopInput()
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

  draw() { }
  started() { }

  render(time) {
    this.deltaTime = time - this.lastFrame
    this.lastFrame = time
    this.resize()
    this.draw(time)

    if (this.mobile) {
      for (let i in this.ongoingTouches) {
        this.ongoingTouches[i].deltaX = 0
        this.ongoingTouches[i].deltaY = 0
      }
    } else {
      this.mouseMovement.x = 0
      this.mouseMovement.y = 0
      this.wheelDeltaY = 0
    }
    requestAnimationFrame(this.render.bind(this))
  }


  loadMesh(objString) {
    let mesh = new Mesh(objString)
    initMeshBuffers(this.gl, mesh)

    let self = this
    mesh.setVAO = function (shader) {
      this.a_position = self.gl.getAttribLocation(shader.program, 'a_position')
      this.a_texCoord = self.gl.getAttribLocation(shader.program, 'a_texCoord')
      this.a_normal = self.gl.getAttribLocation(shader.program, 'a_normal')

      this.vao = self.gl.createVertexArray()
      self.gl.bindVertexArray(this.vao)

      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, this.vertexBuffer)
      self.gl.vertexAttribPointer(this.a_position, 3, self.gl.FLOAT, false, 0, 0)
      self.gl.enableVertexAttribArray(this.a_position)
      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, this.textureBuffer)
      self.gl.vertexAttribPointer(this.a_texCoord, 2, self.gl.FLOAT, false, 0, 0)
      self.gl.enableVertexAttribArray(this.a_texCoord)
      self.gl.bindBuffer(self.gl.ARRAY_BUFFER, this.normalBuffer)
      self.gl.vertexAttribPointer(this.a_normal, 3, self.gl.FLOAT, false, 0, 0)
      self.gl.enableVertexAttribArray(this.a_normal)

      self.gl.bindVertexArray(null)
    }
    mesh.draw = function () {
      self.gl.bindVertexArray(this.vao)
      self.gl.bindBuffer(self.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer)
      self.gl.drawElements(self.gl.TRIANGLES, mesh.indexBuffer.numItems, self.gl.UNSIGNED_SHORT, 0)
      self.gl.bindVertexArray(null)
    }

    return mesh
  }

  async start() {
    let textures = await this.loadTexture()

    this.loadingBar.remove()
    this.el.appendChild(this.canvas)
    this.render()
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
FBhelper(ArGL)
touchInput(ArGL)
desktopInput(ArGL)

export default ArGL
