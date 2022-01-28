import { Engine, Composite, Bodies, Body, Events } from 'matter-js'
import { DesktopInput } from './input/DesktopInput'

export const refs: {
  gl: WebGL2RenderingContext | null
  di: DesktopInput | null
  engine: Engine
  deltaT: number
  lastT: number
  time: number
} = {
  gl: null,
  engine: Engine.create(),
  di: null,
  deltaT: 0,
  lastT: 0,
  time: 0,
}
