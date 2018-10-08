// Type definitions for ArGL
// Project: ArGL
// Definitions by: shen pengfei <https://github.com/deadalusmask>

import { vec2, vec3, vec4, mat2, mat3, mat4, quat } from 'gl-matrix'

export as namespace ArGL;

interface desktopInputOptions {
  lockPointer: boolean
}
export interface Options {
  width?: number,
  height?: number,
  desktopInput?: boolean | desktopInputOptions,
  touchInput?: boolean
}


export class ArGL {
  el: HTMLDivElement
  canvas: HTMLCanvasElement
  loadingBar: HTMLProgressElement
  resource: any
  gl: WebGL2RenderingContext
  textures: WebGLTexture[]

  resourceCount: number
  loadProgress: number[]
  loadProgressProxy: any
  options: Options

  deltaTime: number
  lastFrame: number
  mobile: boolean

  /**
   * will be called in render circle
   * @param time
   */
  draw(time: number): void

  /**
   * start render circle
   */
  start(): void

  /**
   * bind images to this.resource.images
   * @param images array of images path
   */
  setImageResource(images: string[]): void

  /**
   * create textures from this.resource.images
   */
  loadTexture(): WebGLTexture[]

}

export class Shader {
  gl: WebGL2RenderingContext
  program: WebGLProgram

  constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string)

  /**
   * active this shader to draw
   */
  use(): void

  /**
   * set bool uniform
   * @param name
   * @param value
   */
  setBool(name: string, value: boolean): void

  /**
   * set int uniform
   * @param name
   * @param value
   */
  setInt(name: string, value: number): void

  /**
   * set float uniform
   * @param name
   * @param value
   */
  setFloat(name: string, value: number)
  setVec2(name: string, vec2: vec2)
  setVec3(name: string, vec3: vec3)
  setVec4(name: string, vec4: vec4)
  setMat2(name: string, mat2: mat2)
  setMat3(name: string, mat3: mat3)
  setMat4(name: string, mat4: mat4)
}

export class Camera {
  position: vec3
  orientation: quat
  zoom: number

  constructor(position?: vec3, orientation?: quat, zoom?: number)

  /**
   * get viewMatrix of this camera
   * @return mat4 viewMatrix
   */
  getViewMatrix(): mat4

  /**
   * translate camera by v
   * @param v
   */
  translate(v: vec3): void

  /**
   * rotate camera with given axis and angle
   * @param angle
   * @param axis
   */
  rotate(angle: number, axis: vec3): void

  yaw(angle: number): void
  pitch(angle: number): void
  roll(angle: number): void

  /**
   * zoom in/out the camera
   * @param yoffset
   */
  processZoom(yoffset: number): void
}

export class FreeMoveCamera extends Camera {

  static Movement

  /**
   * move camera with given direction and given steps
   * @param direction
   * @param step
   */
  processMove(direction: vec3, step: number): void

  /**
   * add desktop free move control
   * @param currentlyPressedKeys
   * @param step
   * @param mouseInput
   * @param mouseSensitivity
   * @param keys ['w', 's', 'a', 'd', ' ', 'Shift', 'q', 'e']
   */
  desktopFreeMoveControl(currentlyPressedKeys: Map<string, boolean>, step: number, mouseInput: any, mouseSensitivity: number, keys: string[]): void


}

export class OrbitCamera extends Camera {

  /**
   * orbit camera will always look at center and rotate by the center
   * @param position
   * @param center
   * @param zoom
   */
  constructor(position?: vec3, center?: vec3, zoom?: number)

  /**
   * rotate x radian horizontal then y radian vertical
   * @param radianX
   * @param radianY
   */
  processRotate(radianX: number, radianY: number)

  /**
   * add orbitControl to argl
   * @param argl
   */
  orbitControl(argl: ArGL)
}
