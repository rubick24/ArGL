import { Engine, Composite, Bodies, Body, Events } from 'matter-js'
import { DesktopInput } from './input/DesktopInput'

export const refs = {
  debug: true,
  gl: null as WebGL2RenderingContext | null,
  engine: Engine.create(),
  di: null as DesktopInput | null,
  deltaT: 0,
  lastT: 0,
  time: 0
}
