import * as Hammer from 'hammerjs'
import { IArGLPlugin } from '../argl'

export interface ITouchInput {
  pan: {
    lastX: number
    lastY: number
    deltaX: number
    deltaY: number
  }
  pitch: {
    scale: number
    lastScale: number
  }
  reset: () => void
}

export default class TouchInput implements IArGLPlugin {
  public el: HTMLElement
  public touchInput: ITouchInput
  public processAfterRender: Array<() => void>

  constructor(el: HTMLElement) {
    this.el = el
    const pan = {
      lastX: 0,
      lastY: 0,
      deltaX: 0,
      deltaY: 0
    }
    const pitch = {
      scale: 0,
      lastScale: 1
    }
    const hammer = new Hammer.Manager(el)
    hammer.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 10 })
    )
    hammer.add(new Hammer.Pinch({ threshold: 0 }))

    hammer.on('panstart', e => {
      pan.lastX = 0
      pan.lastY = 0
      pan.deltaX = e.deltaX
      pan.deltaY = e.deltaY
    })
    hammer.on('panmove', e => {
      pan.deltaX = e.deltaX - pan.lastX
      pan.deltaY = e.deltaY - pan.lastY
      pan.lastX = e.deltaX
      pan.lastY = e.deltaY
    })

    hammer.on('pinchstart', () => {
      pitch.scale = 0
      pitch.lastScale = 1
    })
    hammer.on('pinchmove', e => {
      pitch.scale = e.scale / pitch.lastScale - 1
      pitch.lastScale = e.scale
    })

    this.touchInput = {
      pan,
      pitch,
      reset() {
        this.pan.deltaX = 0
        this.pan.deltaY = 0
        this.pitch.scale = 0
      }
    }

    this.processAfterRender = [
      () => {
        this.touchInput.reset()
      }
    ]
  }
}
