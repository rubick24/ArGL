export type TimerContext = {
  raf: number
  realTime: number
  lastTime: number
  time: number
  delta: number
  fps: number
}

export class Timer {
  context: TimerContext = {
    raf: -1,
    realTime: -1,
    lastTime: -1,
    time: -1,
    delta: -1,
    fps: -1
  }
  lastT = 0

  tick = (context: TimerContext) => {}

  af(t: number) {
    const context = this.context
    context.lastTime = context.realTime
    context.realTime = t
    context.delta = context.realTime - context.lastTime
    context.time += context.delta
    context.raf = requestAnimationFrame(this.af)

    this.tick(this.context)
  }

  start() {
    const context = this.context
    cancelAnimationFrame(context.raf)
    context.raf = requestAnimationFrame(t => {
      context.time = 0
      context.lastTime = t
      context.realTime = t
      context.delta = 0
      context.raf = requestAnimationFrame(this.af)
    })
  }
  pause() {
    cancelAnimationFrame(this.context.raf)
  }

  resume() {
    const context = this.context
    cancelAnimationFrame(context.raf)
    context.raf = requestAnimationFrame(t => {
      context.lastTime = t
      context.realTime = t
      context.delta = 0
      context.raf = requestAnimationFrame(this.af)
    })
  }
}
