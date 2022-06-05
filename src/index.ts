export type TimerContext = {
  realTime: number
  lastTime: number
  time: number
  delta: number
  fps: number
}

export type FixedTimerContext = {
  time: number
  delta: number
}

export class Timer {
  context: TimerContext = {
    realTime: -1,
    lastTime: -1,
    time: -1,
    delta: -1,
    fps: -1
  }
  fixedContext = {
    time: -1,
    delta: 1000 / 30
  }
  lastT = 0
  raf = -1
  timeout = -1

  update = (context: TimerContext) => {}
  fixedUpdate = (context: FixedTimerContext) => {}

  fixedTick() {
    this.fixedContext.time = this.context.time
    this.fixedUpdate(this.fixedContext)
    this.timeout = self.setTimeout(() => this.fixedTick(), 30)
  }

  tick(t: number) {
    const context = this.context
    context.lastTime = context.realTime
    context.realTime = t
    context.delta = context.realTime - context.lastTime
    context.time += context.delta
    this.raf = requestAnimationFrame(this.tick.bind(this))

    this.update(this.context)
  }

  start() {
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(t => {
      const context = this.context
      context.time = 0
      context.lastTime = t
      context.realTime = t
      context.delta = 0
      this.raf = requestAnimationFrame(this.tick.bind(this))
    })

    this.timeout = self.setTimeout(
      () => requestAnimationFrame(this.fixedTick.bind(this)),
      this.fixedContext.delta
    )
  }

  pause() {
    cancelAnimationFrame(this.raf)
    clearTimeout(this.timeout)
  }

  resume() {
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(t => {
      const context = this.context
      context.lastTime = t
      context.realTime = t
      context.delta = 0
      this.raf = requestAnimationFrame(this.tick)
    })
    clearTimeout(this.timeout)
    this.timeout = self.setTimeout(
      () => requestAnimationFrame(this.fixedTick.bind(this)),
      this.fixedContext.delta
    )
  }
}

// test

const timer = new Timer()
timer.fixedUpdate = t => {}
timer.start()
