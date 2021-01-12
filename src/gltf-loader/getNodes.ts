import { GlTF } from '../types/glTF'
import { INode, IMesh } from './interfaces'
import { vec3, mat4, quat } from 'gl-matrix'

const tmp = mat4.create()

const getNodes = (json: GlTF, meshes: IMesh[]) => {
  if (!json.nodes) {
    return []
  }
  const inodes = json.nodes.map(
    (node, i): INode => {
      let matrix
      if (node.matrix) {
        matrix = new Float32Array(node.matrix) // TODO: to row major order?
      } else {
        matrix = mat4.create()
        if (node.translation) {
          mat4.translate(matrix, matrix, node.translation as vec3)
        }
        if (node.rotation) {
          mat4.fromQuat(tmp, node.rotation as quat)
          mat4.mul(matrix, matrix, tmp)
        }
        if (node.scale) {
          mat4.scale(matrix, matrix, node.scale as vec3)
        }
      }
      return {
        name: node.name || '',
        index: i,
        matrix,
        mesh: node.mesh !== undefined ? meshes[node.mesh] : undefined,
        children: undefined,
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
