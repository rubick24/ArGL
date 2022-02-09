type Size = {
  w: number
  h: number
}
type Box = {
  x: number
  y: number
  w: number
  h: number
}
type Frame = {
  filename: string
  frame: Box
  rotated: boolean
  trimmed: boolean
  spriteSourceSize: Box
  sourceSize: Size
  duration: number
}

type Meta = {
  app: string
  version: string
  image: string
  format: string
  size: Size
  scale: number
  frameTags: {
    name: string
    from: number
    to: number
    direction: string // "forward"
  }[]
  layers: {
    name: string
    opacity: number
    blendMode: string // "normal"
  }
  // slices: []
}

export type SpriteAtlasJson = {
  frames: Frame[]
  meta: Meta
}

export type SpriteAtlasHashJson = {
  frames: Record<string, Frame>
  meta: Meta
}
