import { GlTF } from '../types/glTF'
import { IAccessor, IPrimitive, IMaterial, IMesh } from './interfaces'
import getDefaultMaterial from './getDefaultMaterial'
import Shader from '../shader'
import vsSource from './shader/vert'
import fsSource from './shader/frag'

export default (
  gl: WebGL2RenderingContext,
  json: GlTF,
  accessors: IAccessor[],
  materials: IMaterial[]
) => {
  if (!json.meshes) {
    throw new Error('glTFLoader: no meshes found')
  }

  return json.meshes.map(
    (mesh): IMesh => {
      const primitives = mesh.primitives.map(
        (primitive): IPrimitive => {
          // if () {
          //   // TODO: support no indices primitive
          //   throw new Error('glTFLoader: primitive.indices is undefined')
          // }
          const vao = gl.createVertexArray()
          const buffer = gl.createBuffer()
          if (primitive.indices === undefined || !vao || !buffer) {
            throw new Error('glTFLoader: can not create vao or buffer')
          }
          gl.bindVertexArray(vao)
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
          const accessor = accessors[primitive.indices]
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, accessor.bufferData, gl.STATIC_DRAW)

          let material: IMaterial
          if (primitive.material === undefined) {
            // throw new Error('glTFLoader: no default material')
            material = getDefaultMaterial(gl)
          } else {
            material = materials[primitive.material]
          }

          const attributeKeys = Object.keys(primitive.attributes)
          // const attributes = ['POSITION', 'NORMAL', 'TANGENT', 'TEXCOORD_0']

          const attrs: { attrType: string, name: string }[] = []

          attributeKeys.forEach((k, i) => {
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            const accessor = accessors[primitive.attributes[k]]
            gl.bufferData(gl.ARRAY_BUFFER, accessor.bufferData, gl.STATIC_DRAW)
            // const attrLocation = gl.getAttribLocation(shader.program, 'a_' + k)
            gl.enableVertexAttribArray(i)
            gl.vertexAttribPointer(
              i, // attrLocation
              accessor.itemSize,
              accessor.componentType,
              false,
              0,
              0
            )
            const glslType = accessor.type === 'SCALAR' ? 'float' : accessor.type.toLocaleLowerCase()

            attrs.push({
              attrType: glslType,
              name: k
            })
          })
          gl.bindVertexArray(null)


          // const vertUniforms: string[] = []
          // if (attributeKeys.some(v => v === 'JOINTS_0')) {
          //   vertUniforms.push(`uniform mat4 u_jointMat[${1}]`)
          // }

          const shader = new Shader({
            gl,
            vs: vsSource({
              attrs: attrs.map((v, i) => `layout (location = ${i}) in ${v.attrType} a_${v.name};`).join('\n')
            }),
            fs: fsSource(),

          })

          return {
            indices: {
              accessor,
              buffer
            },
            vao,
            material,
            shader,
            mode: primitive.mode === undefined ? 4 : primitive.mode
          }
        }
      )
      return { primitives }
    }
  )
}
