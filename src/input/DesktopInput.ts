export interface IMouseInput {
  x: number
  y: number
  lastX: number
  lastY: number
  dragging: boolean
  wheel: number
  lastWheel: number
}

export class DesktopInput {
  public currentlyPressedKeys: Map<string, boolean>
  public mouseInput: IMouseInput
  private raf = 0
  private t = performance.now()

  static instances: DesktopInput[] = []

  static getInstance(el: HTMLElement) {
    let t = this.instances.find(v => v.el === el)
    if (!t) {
      t = new DesktopInput(el)
      this.instances.push(t)
    }
    return t
  }

  constructor(public el: HTMLElement) {
    this.currentlyPressedKeys = new Map()
    this.mouseInput = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      dragging: false,
      wheel: 0,
      lastWheel: 0
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      this.currentlyPressedKeys.set(e.key, true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      this.currentlyPressedKeys.set(e.key, false)
    }

    const addInputListener = () => {
      el.addEventListener('keydown', handleKeyDown)
      el.addEventListener('keyup', handleKeyUp)
    }

    el.contentEditable = 'true'
    el.style.cursor = 'default'
    el.style.outline = 'none'
    addInputListener()
  }
}
