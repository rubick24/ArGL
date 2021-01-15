import { GlTF } from '../types/glTF'
import { INode } from './interfaces'
import { vec3, mat4, quat } from 'gl-matrix'

const defaultTranslation = vec3.create()
const defaultRotation = quat.create()
const defaultScale = vec3.fromValues(1, 1, 1)

const getNodes = (json: GlTF) => {
  if (!json.nodes) {
    return []
  }
  const inodes = json.nodes.map(
    (node, i): INode => {
      let matrix = mat4.create()
      if (node.matrix) {
        matrix = new Float32Array(node.matrix)
      } else {
        const translation = node.translation as vec3 || defaultTranslation
        const rotation = node.rotation as quat || defaultRotation
        const scale = node.scale as vec3 || defaultScale
        mat4.fromRotationTranslationScale(matrix, rotation, translation, scale)
      }
      return {
        name: node.name || '',
        index: i,
        matrix,
        mesh: undefined,
        children: undefined,
        localTransform: mat4.create(),
        worldTransform: mat4.create(),
        inverseWorldTransform: mat4.create(),
        tempMatrix: mat4.create()
      }
    }
  )

  // 连接子节点
  inodes.forEach((v, i) => {
    if (!json.nodes) {
      return []
    }
    const node = json.nodes[i]
    if (node.children) {
      inodes[i].children = node.children.map(v => inodes[v])
    }
  })

  return inodes
}

export default getNodes
