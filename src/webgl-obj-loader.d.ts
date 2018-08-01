declare module 'webgl-obj-loader' {
  interface WebGLBufferExt extends WebGLBuffer {
    itemSize: number
    numItems: number
  }

  export class Mesh {
    vertices: number[]  //group by 3
    vertexNormals: number[] //group by 3
    textures: number[] //group by 2
    indices: number[]

    normalBuffer: WebGLBufferExt
    textureBuffer: WebGLBufferExt
    vertexBuffer: WebGLBufferExt
    indexBuffer: WebGLBufferExt

    constructor(objStr: string)
  }

  export function initMeshBuffers(gl:WebGLRenderingContext, mesh: Mesh): void

}

