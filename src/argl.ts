import { Mesh, initMeshBuffers } from 'webgl-obj-loader'

import Shader from './shader'
import { mobilecheck, loadImage } from './util'

const document: any = window.document

interface Options {
  width?: number,
  height?: number,
  desktopInput?: boolean,
  touchInput?: boolean
}

interface Resource {
  images: string[]
}

interface MouseInput {
  deltaX: number
  deltaY: number
  wheelDeltaY: number
}


interface TouchInput {
  pageX: number
  pageY: number
  startX: number
  startY: number
  deltaX: number
  deltaY: number
  identifier: number
}



class ArGL {
  el: HTMLDivElement
  canvas: HTMLCanvasElement
  loadingBar: HTMLProgressElement
  resource: Resource
  gl: WebGL2RenderingContext
  textures: WebGLTexture[]

  resourceCount: number
  loadProgress: number[]
  loadProgressProxy: any
  options: Options

  deltaTime: number
  lastFrame: number
  mobile: boolean

  //frame buffer
  quadVAO: WebGLVertexArrayObject
  fbShader: Shader

  //input
  currentlyPressedKeys: Map<string, boolean>
  mouseInput: MouseInput
  ongoingTouches: TouchInput[]

  static loadImage = loadImage

  constructor({
    width = 300,
    height = 150,
    desktopInput = true,
    touchInput = true
  } = {}) {
    this.options = <Options>arguments[0]
    if (desktopInput) this.options.desktopInput = true
    if (touchInput) this.options.touchInput = true

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

    if (desktopInput) {
      let [currentlyPressedKeys, mouseInput] = ArGL.desktopInput(this.canvas)
      this.currentlyPressedKeys = <Map<string, boolean>>currentlyPressedKeys
      this.mouseInput = <MouseInput>mouseInput
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

  draw(time: number) { }
  started() { }

  render(time: number) {
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
      this.mouseInput.wheelDeltaY = 0
    }
    requestAnimationFrame(this.render.bind(this))
  }

  loadMesh(objString: string) {
    let mesh = new Mesh(objString)
    initMeshBuffers(this.gl, mesh)
    return mesh
  }

  setMeshVAO(mesh: Mesh, shader: Shader): WebGLVertexArrayObject {
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

  drawMesh(mesh: Mesh, vao: WebGLVertexArrayObject) {
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

  setImageResource(images: string[]) {
    this.resource.images = images
  }

  async loadTexture() {
    let textures: WebGLTexture[] = []
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
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, <ImageData>element)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
      this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    })

    return textures

  }


  static readonly quadVertices = [
    // positions   // texture Coords
    -1.0, 1.0, 0.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0,
    1.0, -1.0, 0.0, 1.0, 0.0,
  ]

  static readonly fbvs = `#version 300 es

  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec2 a_texCoord;

  out vec2 TexCoord;

  void main()
  {
      TexCoord = a_texCoord;
      gl_Position = vec4(a_position, 1.0);
  }
  `

  static readonly fbfs = `#version 300 es

  precision mediump float;

  out vec4 FragColor;
  in vec2 TexCoord;

  uniform sampler2D scene;

  void main()
  {
    FragColor = texture(scene, TexCoord);
  }
  `
  static readonly depthFS = `#version 300 es

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

  drawQuad(textures: WebGLTexture[]) {
    // self.gl.bindVertexArray(null)
    if (this.quadVAO === undefined) {
      this.quadVAO = this.gl.createVertexArray()
      let quadVBO = this.gl.createBuffer()
      this.gl.bindVertexArray(this.quadVAO)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(ArGL.quadVertices), this.gl.STATIC_DRAW)
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

  drawFB(texture: WebGLTexture) {
    if (this.fbShader === undefined) {
      this.fbShader = new Shader(this.gl, ArGL.fbvs, ArGL.fbfs)
    }
    this.fbShader.use()
    this.fbShader.setInt('scene', 0)
    this.drawQuad([texture])
  }

  drawDepth(texture: WebGLTexture) {
    if (this.fbShader === undefined) {
      this.fbShader = new Shader(this.gl, ArGL.fbvs, ArGL.depthFS)
    }
    this.fbShader.use()
    this.fbShader.setInt('depthMap', 0)
    this.drawQuad([texture])
  }

  static desktopInput(el: any) {
    let currentlyPressedKeys = new Map<string, boolean>()
    let mouseInput = {
      deltaX: 0,
      deltaY: 0,
      wheelDeltaY: 0
    }

    el.requestPointerLock = el.requestPointerLock ||
      el.mozRequestPointerLock
    el.exitPointerLock = el.exitPointerLock ||
      el.mozExitPointerLock
    el.onclick = function () {
      el.requestPointerLock()
    }
    document.addEventListener('pointerlockchange', handleLockChange, false)
    document.addEventListener('mozpointerlockchange', handleLockChange, false)

    function handleKeyDown(e: KeyboardEvent) {
      currentlyPressedKeys.set(e.key, true)
    }
    function handleKeyUp(e: KeyboardEvent) {
      currentlyPressedKeys.set(e.key, false)
    }
    function mouse_callback(e: MouseEvent) {
      mouseInput.deltaX = e.movementX || 0
      mouseInput.deltaY = e.movementY || 0
    }
    function wheel_callback(e: WheelEvent) {
      mouseInput.wheelDeltaY = e.wheelDeltaY
    }

    function handleLockChange() {
      if (document.pointerLockElement === el ||
        document.mozPointerLockElement === el) {
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

    return [currentlyPressedKeys, mouseInput]
  }

  static touchInput(el: any) {

    const ongoingTouches: TouchInput[] = []
    // 移动端横屏 应在具体应用中实现
    //-----------
    // let tip = document.createElement('span')
    // tip.innerText = '横屏以获取最佳体验'

    // //screen.width screen.height
    // //window.innerHeight  window.innerWidth

    // function detectOrient(){
    //   if (screen.orientation.angle % 180 === 0) {
    //     self.el.appendChild(tip)
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight) -16)
    //   } else {
    //     tip.remove()
    //     el.width = Math.min(self.options.width, screen.width-16)
    //     el.height = Math.min(self.options.height, screen.height-(screen.width-window.innerHeight)  -16)
    //   }
    // }
    // detectOrient()
    // window.addEventListener('orientationchange',detectOrient)

    el.addEventListener("touchstart", handleStart, false)
    el.addEventListener("touchend", handleEnd, false)
    el.addEventListener("touchmove", handleMove, false)


    function handleStart(e: TouchEvent) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let touch: TouchInput = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: touches[i].pageX,
          startY: touches[i].pageY,
          deltaX: 0,
          deltaY: 0,
          identifier: touches[i].identifier
        }
        ongoingTouches.push(touch)
      }
    }

    function handleEnd(e: TouchEvent) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)
        ongoingTouches.splice(idx, 1)
      }
    }
    function handleMove(e: TouchEvent) {
      e.preventDefault()
      let touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier)

        let touch: TouchInput = {
          pageX: touches[i].pageX,
          pageY: touches[i].pageY,
          startX: ongoingTouches[idx].startX,
          startY: ongoingTouches[idx].startY,
          deltaX: touches[i].pageX - ongoingTouches[idx].pageX,
          deltaY: touches[i].pageY - ongoingTouches[idx].pageY,
          identifier: touches[i].identifier
        }
        ongoingTouches.splice(idx, 1, touch)  // swap in the new touch record
      }

    }

    function ongoingTouchIndexById(idToFind: number) {
      for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1   // not found
    }

    return ongoingTouches
  }

}

export default ArGL
