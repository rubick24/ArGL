export default class TouchInput {
  public touchList: Touch[] = []
  public lastTouchList: Touch[] = []
  private raf = 0
  private t = performance.now()
  constructor(public el: HTMLElement) {
    const touchStart = (e: TouchEvent) => {
      this.touchList = Array.from(e.touches)
    }
    const touchMove = (e: TouchEvent) => {
      this.touchList = Array.from(e.touches)
    }
    const touchEnd = (e: TouchEvent) => {
      this.touchList = Array.from(e.touches)
    }

    el.addEventListener('touchstart', touchStart)
    el.addEventListener('touchmove', touchMove)
    el.addEventListener('touchend', touchEnd)
    const af = () => {
      const now = performance.now()
      if (now - this.t > 100) {
        this.t = now
        this.lastTouchList = this.touchList
      }
      requestAnimationFrame(af)
    }
    this.raf = requestAnimationFrame(af)
  }
}
