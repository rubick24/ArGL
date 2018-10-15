(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("gl-matrix"), require("hammerjs"), require("webgl-obj-loader"));
	else if(typeof define === 'function' && define.amd)
		define(["gl-matrix", "hammerjs", "webgl-obj-loader"], factory);
	else if(typeof exports === 'object')
		exports["ArGL"] = factory(require("gl-matrix"), require("hammerjs"), require("webgl-obj-loader"));
	else
		root["ArGL"] = factory(root["window"], root["Hammer"], root["OBJ"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_gl_matrix__, __WEBPACK_EXTERNAL_MODULE_hammerjs__, __WEBPACK_EXTERNAL_MODULE_webgl_obj_loader__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/FBHelper.js":
/*!*************************!*\
  !*** ./src/FBHelper.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return FBhelper; });
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader */ "./src/shader.js");


function FBhelper(Argl) {
  const quadVertices = [
    // positions   // texture Coords
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

  Argl.prototype.drawQuad = function (textures) {
    // self.gl.bindVertexArray(null)
    if (this.quadVAO === undefined) {
      this.quadVAO = this.gl.createVertexArray()
      let quadVBO = this.gl.createBuffer()
      this.gl.bindVertexArray(this.quadVAO)
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, quadVBO)
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(quadVertices), this.gl.const_DRAW)
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

  Argl.prototype.drawFB = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new _shader__WEBPACK_IMPORTED_MODULE_0__["default"](this.gl, fbvs, fbfs)
    }
    this.fbShader.use()
    this.fbShader.setInt('scene', 0)
    this.drawQuad([texture])
  }

  Argl.prototype.drawDepth = function (texture) {
    if (this.fbShader === undefined) {
      this.fbShader = new _shader__WEBPACK_IMPORTED_MODULE_0__["default"](this.gl, fbvs, depthFS)
    }
    this.fbShader.use()
    this.fbShader.setInt('depthMap', 0)
    this.drawQuad([texture])
  }
}


/***/ }),

/***/ "./src/argl.js":
/*!*********************!*\
  !*** ./src/argl.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webgl-obj-loader */ "webgl-obj-loader");
/* harmony import */ var webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony import */ var _input__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./input */ "./src/input.js");
/* harmony import */ var _FBHelper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FBHelper */ "./src/FBHelper.js");





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

    if (Object(_util__WEBPACK_IMPORTED_MODULE_1__["mobilecheck"])()) {
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
    let mesh = new webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__["Mesh"](objString)
    Object(webgl_obj_loader__WEBPACK_IMPORTED_MODULE_0__["initMeshBuffers"])(this.gl, mesh)
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
ArGL.loadImage = _util__WEBPACK_IMPORTED_MODULE_1__["loadImage"]
Object(_input__WEBPACK_IMPORTED_MODULE_2__["default"])(ArGL)
Object(_FBHelper__WEBPACK_IMPORTED_MODULE_3__["default"])(ArGL)

/* harmony default export */ __webpack_exports__["default"] = (ArGL);


/***/ }),

/***/ "./src/camera/camera.js":
/*!******************************!*\
  !*** ./src/camera/camera.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_0__);


class Camera {
  constructor(position = [0, 0, 0], orientation = [0, 0, 0, 1], zoom = 45) {
    this.position = position
    this.orientation = orientation
    this.zoom = zoom
    this.update()
  }

  getViewMatrix() {
    this.update()
    let view = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create()
    let center = [0, 0, 0]
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["vec3"].add(center, this.position, this.front)
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].lookAt(view, this.position, center, this.up)
    return view
  }

  translate(v) {
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["vec3"].add(this.position, this.position, v)
    // this.position += v * this.orientation
  }

  rotate(angle, axis) {
    let t = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].setAxisAngle(t, axis, angle)
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["quat"].mul(this.orientation, this.orientation, t)
    // this.orientation *= glm.angleAxis(angle, axis * this.orientation)
    this.update()
  }

  yaw(angle) {
    this.rotate(angle, this.up)
  }
  pitch(angle) {
    this.rotate(angle, this.right)
  }
  roll(angle) {
    this.rotate(angle, this.front)
  }

  update() {
    let m = gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_0__["mat4"].fromQuat(m, this.orientation)
    this.right = [-m[0], -m[4], -m[8]]
    this.up = [m[1], m[5], m[9]]
    this.front = [m[2], m[6], m[10]]
  }

  processZoom(yoffset) {
    if (this.zoom >= 1.0 && this.zoom <= 45.0)
      this.zoom -= yoffset / 200
    if (this.zoom <= 1.0)
      this.zoom = 1.0
    if (this.zoom >= 45.0)
      this.zoom = 45.0
  }
}

/* harmony default export */ __webpack_exports__["default"] = (Camera);


/***/ }),

/***/ "./src/camera/free-move-camrea.js":
/*!****************************************!*\
  !*** ./src/camera/free-move-camrea.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera/camera.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_1__);




const CameraMovement = {
  FORWARD: 0,
  BACKWARD: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4,
  DOWN: 5
}

class FreeMoveCamera extends _camera__WEBPACK_IMPORTED_MODULE_0__["default"] {

  processMove(direction, step) {
    let dirvec = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    if (direction == FreeMoveCamera.Movement.FORWARD) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.front, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.BACKWARD) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.front, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.LEFT) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.right, -step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.RIGHT) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.right, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.UP) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.up, step)
      this.translate(dirvec)
    }
    if (direction == FreeMoveCamera.Movement.DOWN) {
      gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(dirvec, this.up, -step)
      this.translate(dirvec)
    }
  }


  desktopFreeMoveControl(currentlyPressedKeys, step, mouseInput, mouseSensitivity, keys = ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']) {
    if (currentlyPressedKeys.get(keys[0])) {
      this.processMove(FreeMoveCamera.Movement.FORWARD, step)
    }
    if (currentlyPressedKeys.get(keys[1])) {
      this.processMove(FreeMoveCamera.Movement.BACKWARD, step)
    }
    if (currentlyPressedKeys.get(keys[2])) {
      this.processMove(FreeMoveCamera.Movement.LEFT, step)
    }
    if (currentlyPressedKeys.get(keys[3])) {
      this.processMove(FreeMoveCamera.Movement.RIGHT, step)
    }
    if (currentlyPressedKeys.get(keys[4])) {
      this.processMove(FreeMoveCamera.Movement.UP, step)
    }
    if (currentlyPressedKeys.get(keys[5])) {
      this.processMove(FreeMoveCamera.Movement.DOWN, step)
    }

    let toRadian = degree => degree / 180 * Math.PI
    if (currentlyPressedKeys.get(keys[6])) {
      this.roll(toRadian(-step * 5))
    }
    if (currentlyPressedKeys.get(keys[7])) {
      this.roll(toRadian(step * 5))
    }

    let radianX = toRadian(mouseInput.deltaX * mouseSensitivity)
    let radianY = toRadian(mouseInput.deltaY * mouseSensitivity)


    this.pitch(radianY)
    this.rotate(radianX, [0, 1, 0])
    this.processZoom(mouseInput.wheelDeltaY)
  }

}
FreeMoveCamera.Movement = CameraMovement

/* harmony default export */ __webpack_exports__["default"] = (FreeMoveCamera);


/***/ }),

/***/ "./src/camera/orbit-camera.js":
/*!************************************!*\
  !*** ./src/camera/orbit-camera.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ "./src/camera/camera.js");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gl-matrix */ "gl-matrix");
/* harmony import */ var gl_matrix__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gl_matrix__WEBPACK_IMPORTED_MODULE_1__);



function rotateVec(vec, normal, angle) {
  let direction = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
  let t1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
  let t2 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()

  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(normal, normal)

  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, vec, Math.cos(angle))
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].cross(t2, normal, vec)
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t2, t2, Math.sin(angle))
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].add(direction, t1, t2)
  gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(direction, direction)
  return direction
}

class OrbitCamera extends _camera__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(position = [0, 0, 5], center = [0, 0, 0], zoom = 45) {
    let direction = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].sub(direction, center, position)
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].normalize(direction, direction)

    let dirX = [direction[0], 0, direction[2]]
    let dirY = [0, direction[1], Math.sqrt(1 - direction[1] ** 2)]
    let angleX = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].length(dirX) === 0 ? 0 : gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].angle([0, 0, 1], dirX)
    angleX = direction[0] > 0 ? -angleX : angleX
    let angleY = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].length(dirY) === 0 ? 0 : gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].angle([0, 0, 1], dirY)
    angleY = direction[1] > 0 ? -angleY : angleY
    let orientation = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["quat"].create()

    super(position, orientation, zoom)
    this.yaw(angleX)
    this.pitch(angleY)

    this.center = center
    this.distance = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].distance(center, position)

  }

  processRotate(radianX, radianY) {

    let t1 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, this.front, -1)
    t1 = rotateVec(t1, [0, 1, 0], -radianX)

    let t2 = gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].create()
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].cross(t2, this.up, t1)
    t1 = rotateVec(t1, t2, -radianY)
    gl_matrix__WEBPACK_IMPORTED_MODULE_1__["vec3"].scale(t1, t1, this.distance)
    this.position = t1

    this.rotate(radianX, [0, 1, 0])
    this.pitch(radianY)

  }

  desktopOrbitControl(argl) {
    if (argl.mouseInput.drag) {
      let radianX = argl.mouseInput.dragX / argl.canvas.clientWidth * Math.PI * 2
      let radianY = argl.mouseInput.dragY / argl.canvas.clientHeight * Math.PI * 2
      this.processRotate(radianX, radianY)
    }
    this.processZoom(argl.mouseInput.wheelDeltaY)
  }

  mobileOrbitControl(argl) {
    let radianX = argl.touchInput.pan.deltaX / argl.canvas.clientWidth * Math.PI * 2
    let radianY = argl.touchInput.pan.deltaY / argl.canvas.clientHeight * Math.PI * 2
    this.processRotate(radianX, radianY)
    this.processZoom(argl.touchInput.pitch.scale*10000)
  }

}

/* harmony default export */ __webpack_exports__["default"] = (OrbitCamera);


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: ArGL, Camera, Shader, OrbitCamera, FreeMoveCamera, util, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _argl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./argl */ "./src/argl.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ArGL", function() { return _argl__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _camera_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./camera/camera */ "./src/camera/camera.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Camera", function() { return _camera_camera__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shader */ "./src/shader.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Shader", function() { return _shader__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _camera_orbit_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./camera/orbit-camera */ "./src/camera/orbit-camera.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OrbitCamera", function() { return _camera_orbit_camera__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _camera_free_move_camrea__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./camera/free-move-camrea */ "./src/camera/free-move-camrea.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FreeMoveCamera", function() { return _camera_free_move_camrea__WEBPACK_IMPORTED_MODULE_4__["default"]; });

/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util */ "./src/util.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "util", function() { return _util__WEBPACK_IMPORTED_MODULE_5__; });









/* harmony default export */ __webpack_exports__["default"] = (_argl__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/input.js":
/*!**********************!*\
  !*** ./src/input.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Input; });
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hammerjs */ "hammerjs");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_0__);


function Input(Argl) {
  Argl.desktopInput = function (el, options) {
    let currentlyPressedKeys = new Map()
    let mouseInput = {
      deltaX: 0,
      deltaY: 0,
      wheelDeltaY: 0
    }

    function handleKeyDown(e) {
      currentlyPressedKeys.set(e.key, true)
    }
    function handleKeyUp(e) {
      currentlyPressedKeys.set(e.key, false)
    }
    function mouse_callback(e) {
      mouseInput.deltaX = e.movementX || 0
      mouseInput.deltaY = e.movementY || 0
      if (mouseInput.drag) {
        mouseInput.dragX = e.movementX || 0
        mouseInput.dragY = e.movementY || 0
      }
    }
    function wheel_callback(e) {
      mouseInput.wheelDeltaY = e.wheelDeltaY
    }
    function handleDragStart() {
      mouseInput.drag = true
      mouseInput.dragX = 0
      mouseInput.dragY = 0
    }
    function handleDragEnd() {
      mouseInput.drag = false
    }
    function addInputListener() {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      document.addEventListener('mousemove', mouse_callback)
      document.addEventListener('mousedown', handleDragStart)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('wheel', wheel_callback)
    }
    function removeInputListener() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', mouse_callback)
      document.removeEventListener('mousedown', handleDragStart)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('wheel', wheel_callback)
    }

    if (options.lockPointer) {
      el.requestPointerLock = el.requestPointerLock ||
        el.mozRequestPointerLock
      el.exitPointerLock = el.exitPointerLock ||
        el.mozExitPointerLock
      el.onclick = function () {
        el.requestPointerLock()
      }
      document.addEventListener('pointerlockchange', handleLockChange, false)
      document.addEventListener('mozpointerlockchange', handleLockChange, false)
      function handleLockChange() {
        if (document.pointerLockElement === el ||
          document.mozPointerLockElement === el) {
          addInputListener()
        } else {
          removeInputListener()
        }
      }
    } else {
      el.contentEditable = 'true'
      el.style.cursor = 'default'
      el.addEventListener('focus', addInputListener)
      el.addEventListener('blur', removeInputListener)
    }

    mouseInput.reset = function () {
      this.deltaX = 0
      this.deltaY = 0
      if (this.drag) {
        this.dragX = 0
        this.dragY = 0
      }
      this.wheelDeltaY = 0
    }

    return { currentlyPressedKeys, mouseInput }
  }

  Argl.touchInput = function (el) {

    let pan = {
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0
    }
    let pitch = {
      scale: 0,
      lastScale: 1
    }
    let hammer = new hammerjs__WEBPACK_IMPORTED_MODULE_0__["Manager"](el)
    hammer.add(new hammerjs__WEBPACK_IMPORTED_MODULE_0__["Pan"]({ direction: hammerjs__WEBPACK_IMPORTED_MODULE_0__["DIRECTION_ALL"], threshold: 10 }))
    hammer.add(new hammerjs__WEBPACK_IMPORTED_MODULE_0__["Pinch"]({ threshold: 0 }))

    hammer.on('panstart', function (e) {
      pan.lastX = 0
      pan.lastY = 0
      pan.deltaX = e.deltaX
      pan.deltaY = e.deltaY
    })
    hammer.on('panmove', function (e) {
      pan.deltaX = e.deltaX - pan.lastX
      pan.deltaY = e.deltaY - pan.lastY
      pan.lastX = e.deltaX
      pan.lastY = e.deltaY
    })

    hammer.on('pinchstart', function () {
      pitch.scale = 0
      pitch.lastScale = 1
    })
    hammer.on('pinchmove', function (e) {
      pitch.scale = e.scale / pitch.lastScale - 1
      pitch.lastScale = e.scale
    })

    let touchInput = { pan, pitch }
    touchInput.reset = function () {
      this.pan.deltaX = 0
      this.pan.deltaY = 0
      this.pitch.scale = 0
    }
    return touchInput
  }

}


/***/ }),

/***/ "./src/shader.js":
/*!***********************!*\
  !*** ./src/shader.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Shader; });

class Shader {
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
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), Math.round(Number(value)))
  }
  setFloat(name, value) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), Number(value))
  }
  setVec2(name, vec2) {
    this.gl.uniform2fv(this.gl.getUniformLocation(this.program, name), vec2)
  }
  setVec3(name, vec3) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), vec3)
  }
  setVec4(name, vec4) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), vec4)
  }
  setMat2(name, mat2) {
    this.gl.uniformMatrix2fv(this.gl.getUniformLocation(this.program, name), false, mat2)
  }
  setMat3(name, mat3) {
    this.gl.uniformMatrix3fv(this.gl.getUniformLocation(this.program, name), false, mat3)
  }
  setMat4(name, mat4) {
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, mat4)
  }

}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}


/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: mobilecheck, loadImage, loadBinary */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mobilecheck", function() { return mobilecheck; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadImage", function() { return loadImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadBinary", function() { return loadBinary; });

function mobilecheck() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

function loadImage(imageUrl, onprogress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    let notifiedNotComputable = false

    xhr.open('GET', imageUrl, true)
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = function (ev) {
      if (ev.lengthComputable) {
        onprogress(Math.round((ev.loaded / ev.total) * 100))
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
        let imageUrl = window.URL.createObjectURL(blob)
        let img = new Image()
        img.src = imageUrl
        img.onload = () => resolve(img)
      }
    }

    xhr.send()
  })
}

function loadBinary(uri, onprogress) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    let notifiedNotComputable = false

    xhr.open('GET', uri, true)
    xhr.responseType = 'arraybuffer'

    xhr.onprogress = function (ev) {
      if (ev.lengthComputable) {
        onprogress(Math.round((ev.loaded / ev.total) * 100))
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
        resolve(this.response)
      }
    }
    xhr.send()
  })
}


/***/ }),

/***/ "gl-matrix":
/*!***************************************************************************************************!*\
  !*** external {"root":"window","commonjs":"gl-matrix","commonjs2":"gl-matrix","amd":"gl-matrix"} ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_gl_matrix__;

/***/ }),

/***/ "hammerjs":
/*!************************************************************************************************!*\
  !*** external {"root":"Hammer","commonjs":"hammerjs","commonjs2":"hammerjs","amd":"hammerjs"} ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_hammerjs__;

/***/ }),

/***/ "webgl-obj-loader":
/*!*********************************************************************************************************************!*\
  !*** external {"root":"OBJ","commonjs":"webgl-obj-loader","commonjs2":"webgl-obj-loader","amd":"webgl-obj-loader"} ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_webgl_obj_loader__;

/***/ })

/******/ });
});
//# sourceMappingURL=argl.js.map