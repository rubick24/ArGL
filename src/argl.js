import { Mesh, initMeshBuffers } from 'webgl-obj-loader'
require('./util')

const quadVertices = [
  // positions   // texture Coords
  -1.0, 1.0, 0.0, 0.0, 1.0,
  -1.0, -1.0, 0.0, 0.0, 0.0,
  1.0, 1.0, 0.0, 1.0, 1.0,
  1.0, -1.0, 0.0, 1.0, 0.0,
]

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

  addTouchInput(){
    this.mobile = true
    // touch controls

    let self = this


    // 移动端横屏 应在具体应用中实现
    //-----------
    // let tip = document.createElement('span')
    // tip.innerText = '横屏以获取最佳体验'

    // //screen.width screen.height
    // //window.innerHeight  window.innerWidth

    // function detectOrient(){
    //   if (screen.orientation.angle % 180 === 0) {
    //     self.el.appendChild(tip)
    //     self.canvas.width = Math.min(self.options.width, screen.width-16)
    //     self.canvas.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight) -16)
    //   } else {
    //     tip.remove()
    //     self.canvas.width = Math.min(self.options.width, screen.width-16)
    //     self.canvas.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight)  -16)
    //   }
    // }
    // detectOrient()
    // window.addEventListener('orientationchange',detectOrient)

    this.canvas.addEventListener("touchstart", handleStart, false)
    this.canvas.addEventListener("touchend", handleEnd, false)
    this.canvas.addEventListener("touchmove", handleMove, false)

    this.ongoingTouches = new Array()
    function handleStart(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for(let i=0;i<touches.length;i++){
        touches[i].startX = touches[i].pageX
        touches[i].startY = touches[i].pageY
        touches[i].deltaX = 0
        touches[i].deltaY = 0
        self.ongoingTouches.push(touches[i])
      }
    }

    function handleEnd(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for(let i=0;i<touches.length;i++){
        let idx = ongoingTouchIndexById(touches[i].identifier)
        touches[i].pageX
        touches[i].pageY
        self.ongoingTouches.splice(i, 1)
      }
    }
    function handleMove(e) {
      e.preventDefault()
      let touches = e.changedTouches
      for(let i=0;i<touches.length;i++){
        let idx = ongoingTouchIndexById(touches[i].identifier)

        touches[i].pageY
        touches[i].startX = self.ongoingTouches[idx].startX
        touches[i].startY = self.ongoingTouches[idx].startY
        touches[i].deltaX = touches[i].pageX - self.ongoingTouches[idx].pageX
        touches[i].deltaY = touches[i].pageY - self.ongoingTouches[idx].pageY

        // console.log(self.ongoingTouches[idx].pageX, touches[i].pageX, self.ongoingTouches[0])
        self.ongoingTouches.splice(idx, 1, touches[i])  // swap in the new touch record
      }

    }

    function ongoingTouchIndexById(idToFind) {
      for (let i=0; i<self.ongoingTouches.length; i++) {
        let id = self.ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1   // not found
    }
  }

  addDesktopInput(){
    this.mobile = false
    // desktop controls
    this.currentlyPressedKeys = {}
    this.mouseMovement = {
      x: 0,
      y: 0
    }
    this.wheelDeltaY = 0

    let self = this

    this.canvas.requestPointerLock = this.canvas.requestPointerLock ||
      this.canvas.mozRequestPointerLock
    this.canvas.exitPointerLock = this.canvas.exitPointerLock ||
      this.canvas.mozExitPointerLock
    this.canvas.onclick = function () {
      self.canvas.requestPointerLock()
    }
    document.addEventListener('pointerlockchange', handleLockChange, false)
    document.addEventListener('mozpointerlockchange', handleLockChange, false)

    function handleKeyDown(e) {
      self.currentlyPressedKeys[e.key] = true
    }
    function handleKeyUp(e) {
      self.currentlyPressedKeys[e.key] = false
    }
    function mouse_callback(e) {
      self.mouseMovement.x = e.movementX || 0
      self.mouseMovement.y = e.movementY || 0
    }
    function wheel_callback(e) {
      self.wheelDeltaY = e.wheelDeltaY
    }

    function handleLockChange() {
      if (document.pointerLockElement === self.canvas ||
        document.mozPointerLockElement === self.canvas) {
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        document.addEventListener('mousemove', mouse_callback)
        document.addEventListener('wheel', wheel_callback)
      } else {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp)
        document.removeEventListener('mousemove', mouse_callback)
        document.removeEventListener('wheel', wheel_callback)
      }

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

    if(this.mobile){
      for(let i in this.ongoingTouches){
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


  loadMesh(objString, shader) {
    let mesh = new Mesh(objString)
    initMeshBuffers(this.gl, mesh)
    mesh.a_position = this.gl.getAttribLocation(shader.program, 'a_position')
    mesh.a_texCoord = this.gl.getAttribLocation(shader.program, 'a_texCoord')
    mesh.a_normal = this.gl.getAttribLocation(shader.program, 'a_normal')

    mesh.vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(mesh.vao)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vertexBuffer)
    this.gl.vertexAttribPointer(mesh.a_position, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(mesh.a_position)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.textureBuffer)
    this.gl.vertexAttribPointer(mesh.a_texCoord, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(mesh.a_texCoord)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.normalBuffer)
    this.gl.vertexAttribPointer(mesh.a_normal, 3, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(mesh.a_normal)

    this.gl.bindVertexArray(null)

    let self = this
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

  static loadImage(imageUrl, onprogress) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      let notifiedNotComputable = false

      xhr.open('GET', imageUrl, true)
      xhr.responseType = 'arraybuffer'

      xhr.onprogress = function (ev) {
        if (ev.lengthComputable) {
          onprogress(parseInt((ev.loaded / ev.total) * 100))
        } else {
          if (!notifiedNotComputable) {
            notifiedNotComputable = true
            onprogress(-1)
          }
        }
      }

      xhr.onloadend = function () {
        if (!xhr.status.toString().match(/^2/)) {
          reject(xhr)
        } else {
          if (!notifiedNotComputable) {
            onprogress(100)
          }

          let options = {}
          let headers = xhr.getAllResponseHeaders()
          let m = headers.match(/^Content-Type\:\s*(.*?)$/mi)

          if (m && m[1]) {
            options.type = m[1]
          }

          let blob = new Blob([this.response], options)
          var imageUrl = window.URL.createObjectURL(blob)
          let img = new Image()
          img.src = imageUrl
          img.onload = () => resolve(img)
        }
      }

      xhr.send()
    })
  }


  // loadImage(src) {
  //   return new Promise((resolve, reject) => {
  //     let img = new Image()
  //     img.onload = () => resolve(img)
  //     img.onerror = reject
  //     img.src = src
  //   })
  // }


  // use shader before call this func
  static drawQuad(textures) {

    let quadVAO = this.gl.createVertexArray()
    let quadVBO = this.gl.createBuffer()
    this.gl.bindVertexArray(quadVAO)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quadVertices), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(0)
    this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, true, 20, 0)
    this.gl.enableVertexAttribArray(1)
    this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, true, 20, 12)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

    for (i in textures) {
      this.gl.activeTexture(this.gl.TEXTURE0 + i)
      this.gl.bindTexture(this.gl.TEXTURE_2D, textures[i])
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    this.gl.bindVertexArray(null)
  }

}

export default ArGL
