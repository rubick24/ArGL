import { IArGLPlugin } from '../argl'

export interface IMouseInput {
  move: {
    x: number
    y: number
  }
  draging: boolean
  drag: {
    x: number
    y: number
  }
  wheel: number
  reset: () => void
}

interface IPLE extends HTMLElement {
  // requestPointerLock: () => void // HTMLElement type alrdy has this now
  exitPointerLock?: () => void
  mozRequestPointerLock?: () => void
  mozExitPointerLock?: () => void
}

export default class DesktopInput implements IArGLPlugin {
  public el: HTMLElement
  public lockPointer: boolean
  public currentlyPressedKeys: Map<string, boolean>
  public mouseInput: IMouseInput
  // public processBeforeRender?: Array<() => void>
  public processAfterRender: Array<() => void>

  constructor(el: IPLE, options?: { lockPointer?: boolean }) {
    this.el = el
    if (options) {
      if (options.lockPointer !== undefined) {
        this.lockPointer = options.lockPointer
      }
    }

    this.currentlyPressedKeys = new Map()
    this.mouseInput = {
      move: {
        x: 0,
        y: 0
      },
      draging: false,
      drag: {
        x: 0,
        y: 0
      },
      wheel: 0,
      reset() {
        this.move.x = 0
        this.move.y = 0
        if (this.draging) {
          this.drag.x = 0
          this.drag.y = 0
        }
        this.wheel = 0
      }
    }

    const self = this
    function handleKeyDown(e: KeyboardEvent) {
      self.currentlyPressedKeys.set(e.key, true)
    }
    function handleKeyUp(e: KeyboardEvent) {
      self.currentlyPressedKeys.set(e.key, false)
    }
    function handleMouseMove(e: MouseEvent) {
      self.mouseInput.move.x = e.movementX || 0
      self.mouseInput.move.y = e.movementY || 0
      if (self.mouseInput.draging) {
        self.mouseInput.drag.x = e.movementX || 0
        self.mouseInput.drag.y = e.movementY || 0
      }
    }
    function handleWheel(e: WheelEvent) {
      self.mouseInput.wheel = e.deltaY
    }
    function handleDragStart() {
      self.mouseInput.draging = true
      self.mouseInput.drag.x = 0
      self.mouseInput.drag.y = 0
    }
    function handleDragEnd() {
      self.mouseInput.draging = false
    }
    function addInputListener() {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mousedown', handleDragStart)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('wheel', handleWheel)
    }
    function removeInputListener() {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleDragStart)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('wheel', handleWheel)
    }

    if (this.lockPointer) {
      el.requestPointerLock = el.requestPointerLock || el.mozRequestPointerLock
      el.exitPointerLock = el.exitPointerLock || el.mozExitPointerLock
      el.onclick = () => {
        el.requestPointerLock()
      }
      document.addEventListener('pointerlockchange', handleLockChange, false)
      document.addEventListener('mozpointerlockchange', handleLockChange, false)
      function handleLockChange() {
        if (
          // @ts-ignore
          document.pointerLockElement === el ||
          // @ts-ignore
          document.mozPointerLockElement === el
        ) {
          addInputListener()
        } else {
          removeInputListener()
        }
      }
    } else {
      el.contentEditable = 'true'
      el.style.cursor = 'default'
      el.style.outline = 'none'
      el.addEventListener('focus', addInputListener)
      el.addEventListener('blur', removeInputListener)
    }
    this.processAfterRender = [
      () => {
        this.mouseInput.reset()
      }
    ]
  }
}
