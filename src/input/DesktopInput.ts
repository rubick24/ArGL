export interface IMouseInput {
  x: number
  y: number
  lastX: number
  lastY: number
  draging: boolean
  wheel: number
  lastWheel: number
}

export default class DesktopInput {
  public lockPointer: boolean = false
  public currentlyPressedKeys: Map<string, boolean>
  public mouseInput: IMouseInput

  constructor(public el: HTMLElement, options?: { lockPointer?: boolean }) {
    this.el = el
    if (options) {
      if (options.lockPointer !== undefined) {
        this.lockPointer = options.lockPointer
      }
    }

    this.currentlyPressedKeys = new Map()
    this.mouseInput = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
      draging: false,
      wheel: 0,
      lastWheel: 0
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      this.currentlyPressedKeys.set(e.key, true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      this.currentlyPressedKeys.set(e.key, false)
    }

    const handleMouseMove = (e: MouseEvent) => {
      this.mouseInput.lastX = this.mouseInput.x
      this.mouseInput.lastY = this.mouseInput.y
      this.mouseInput.x = e.screenX
      this.mouseInput.y = e.screenY
    }
    const handleWheel = (e: WheelEvent) => {
      this.mouseInput.lastWheel = this.mouseInput.wheel
      this.mouseInput.wheel += e.deltaY
    }
    const handleDragStart = () => {
      this.mouseInput.draging = true
    }
    const handleDragEnd = () => {
      this.mouseInput.draging = false
    }
    const addInputListener = () => {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mousedown', handleDragStart)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('wheel', handleWheel)
    }
    const removeInputListener = () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleDragStart)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('wheel', handleWheel)
    }

    if (this.lockPointer) {
      // @ts-ignore
      el.requestPointerLock = el.requestPointerLock || el.mozRequestPointerLock
      // @ts-ignore
      el.exitPointerLock = el.exitPointerLock || el.mozExitPointerLock
      el.addEventListener('click', el.requestPointerLock)
      const handleLockChange = () => {
        // @ts-ignore
        if (document.pointerLockElement === el || document.mozPointerLockElement === el) {
          addInputListener()
        } else {
          removeInputListener()
        }
      }
      document.addEventListener('pointerlockchange', handleLockChange, false)
      document.addEventListener('mozpointerlockchange', handleLockChange, false)
    } else {
      el.contentEditable = 'true'
      el.style.cursor = 'default'
      el.style.outline = 'none'
      el.addEventListener('focus', addInputListener)
      el.addEventListener('blur', removeInputListener)
    }
  }
}
