import GLTFLoader from '.'
import { ILoadedMesh, ILoadedPrimitive } from './interfaces'
import Shader from '../../shader'
import pbrVert from './shader/pbr.vert'
import pbrFrag from './shader/pbr.frag'
import unlitFrag from './shader/unlit.frag'

export default function loadMesh(this: GLTFLoader, meshIndex: number) {
  const gl = this.gl
  const mesh = this.json.meshes[meshIndex]
  const loadedMesh: ILoadedMesh = {
    loadedPrimitives: []
  }

  mesh.primitives.forEach(primitive => {
    const loadedPrimitive: ILoadedPrimitive = {
      indices: null,
      vao: gl.createVertexArray(),
      shader: undefined
    }

    if (primitive.indices !== undefined) {
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
      const loadedAccessor = this.loadedAccessors[primitive.indices]
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        loadedAccessor.bufferData,
        gl.STATIC_DRAW
      )
      loadedPrimitive.indices = buffer
    }
    gl.bindVertexArray(loadedPrimitive.vao)

    const attributes = Object.keys(primitive.attributes)

    // construct shader
    const loadedMaterial = this.loadedMaterials[primitive.material]
    const defines = loadedMaterial.defines
    attributes.forEach(v => {
      if (v !== 'POSITION') {
        defines.push('HAS_' + v)
      }
    })

    const prefix = defines.reduce((prev, cur) => {
      return prev + `#define ${cur}  1\n`
    }, '#version 300 es\n')
    const vert = prefix + pbrVert
    const frag =
      prefix +
      (loadedMaterial.extensions.some(v => v === 'KHR_materials_unlit')
        ? unlitFrag
        : pbrFrag)
    const shader = new Shader(gl, vert, frag)
    loadedPrimitive.shader = shader

    attributes.forEach(k => {
      const buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      const accessor = this.json.accessors[primitive.attributes[k]]
      const loadedAccessor = this.loadedAccessors[primitive.attributes[k]]
      gl.bufferData(gl.ARRAY_BUFFER, loadedAccessor.bufferData, gl.STATIC_DRAW)
      const attrLocation = gl.getAttribLocation(shader.program, 'a_' + k)
      gl.vertexAttribPointer(
        attrLocation,
        loadedAccessor.itemSize,
        accessor.componentType,
        false,
        0,
        0
      )
      gl.enableVertexAttribArray(attrLocation)
    })

    gl.bindVertexArray(null)
    loadedMesh.loadedPrimitives.push(loadedPrimitive)
  })
  return loadedMesh
}
