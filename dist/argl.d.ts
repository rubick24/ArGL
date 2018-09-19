// Type definitions for ArGL
// Project: ArGL
// Definitions by: shen pengfei <https://github.com/deadalusmask>


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

  /**
   * will be called in render circle
   * @param time
   */
  draw(time: number): void

  /**
   * start render circle
   */
  async start(): void

  /**
   * bind images to this.resource.images
   * @param images array of images path
   */
  setImageResource(images: string[]): void

  /**
   * create textures from this.resource.images
   */
  async loadTexture(): WebGLTexture[]

}
