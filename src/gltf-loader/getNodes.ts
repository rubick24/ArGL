import { GlTF } from '../types/glTF'
import { INode } from './interfaces'
import { vec3, mat4, quat } from 'gl-matrix'

const getNodes = (json: GlTF) => {
  if (!json.nodes) {
    return []
  }
  const inodes = json.nodes.map(
    (node, i): INode => {
      let matrix = mat4.create()
      let translation = vec3.create()
      let rotation = quat.create()
      let scale = vec3.fromValues(1, 1, 1)
      if (node.matrix) {
        matrix = new Float32Array(node.matrix)
        mat4.getScaling(scale, matrix)
        // To extract a correct rotation, the scaling component must be eliminated.
        const mn = mat4.create()
        for (const col of [0, 1, 2]) {
          mn[col] = matrix[col] / scale[0]
          mn[col + 4] = matrix[col + 4] / scale[1]
          mn[col + 8] = matrix[col + 8] / scale[2]
        }
        mat4.getRotation(rotation, mn)
        quat.normalize(rotation, rotation)
        mat4.getTranslation(translation, matrix)
      } else {
        if (node.rotation) {
          rotation = new Float32Array(node.rotation) as quat
        }
        if (node.translation) {
          translation = new Float32Array(node.translation) as vec3
        }
        if (node.scale) {
          scale = new Float32Array(node.scale) as vec3
        }
      }
      return {
        name: node.name || '',
        index: i,
        mesh: undefined,
        children: undefined,
        translation,
        rotation,
        scale,
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
