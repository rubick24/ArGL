import isMobile from './util/isMobile'

export interface IArGLPlugin {
  processBeforeRender?: Array<() => void>
  processAfterRender?: Array<() => void>
}

// interface IOptions {}
const defaultOptions = {}

class ArGL {
  // TODO: 添加资源管理
  // public resource: {
  //   images?: string[],
  //   count: number,
  //   loadProgress: number
  // }
  public options: {}
  public canvas: HTMLCanvasElement
  public gl: WebGL2RenderingContext
  public time: {
    deltaTime: number
    lastFrame: number
  }
  public isMobile: boolean
  public processBeforeRender: Array<() => void> = []
  public processAfterRender: Array<() => void> = []

  private renderFunc: (time: number) => void

  constructor(canvas: HTMLCanvasElement, options: {} = defaultOptions) {
    this.canvas = canvas
    if (options) {
      this.options = Object.assign(defaultOptions, options)
    }
    this.gl = this.canvas.getContext('webgl2')
    if (!this.gl) {
      throw new Error(
        'Unable to initialize WebGL2. Your browser or machine may not support it.'
      )
    }
    this.time = {
      deltaTime: 0,
      lastFrame: 0
    }

    this.isMobile = isMobile()
  }

  public use(p: IArGLPlugin) {
    if (p.processBeforeRender) {
      this.processBeforeRender.push(...p.processBeforeRender)
    }
    if (p.processAfterRender) {
      this.processAfterRender.unshift(...p.processAfterRender)
    }
    return this
  }

  public resize() {
    const displayWidth = this.canvas.clientWidth
    const displayHeight = this.canvas.clientHeight

    if (
      this.canvas.width !== displayWidth ||
      this.canvas.height !== displayHeight
    ) {
      this.canvas.width = displayWidth
      this.canvas.height = displayHeight
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
  }

  public start(renderFunc: (time: number) => void, started?: () => void) {
    this.renderFunc = renderFunc
    this.render(this.time.lastFrame)
    if (started) {
      started()
    }
  }

  private beforeRender() {
    this.processBeforeRender.forEach(func => func())
  }
  private afterRender() {
    this.processAfterRender.forEach(func => func())
  }

  private render(time: number) {
    this.beforeRender()
    this.time.deltaTime = time - this.time.lastFrame
    this.time.lastFrame = time
    this.resize()
    this.renderFunc(time)
    this.afterRender()
    requestAnimationFrame(this.render.bind(this))
  }
}

export default ArGL
