import { mat4 } from 'gl-matrix'
import { GlTF } from '../types/glTF'
import { IAccessor, INode, ComputeJoints } from './interfaces'

export default (json: GlTF, accessors: IAccessor[], nodes: INode[]): ComputeJoints => {
  if (!json.skins) {
    return () => {}
  }
  const identity = mat4.create()

  const computeJoints: ComputeJoints = (skin, parentNode) => {
    const jointMatrices = []
    // const jointNormalMatrices = []

    for (let i = 0; i < skin.joints.length; i++) {
      const joint = skin.joints[i]
      const node = nodes[joint]

      let jointMatrix = mat4.create()
      let ibm = skin.inverseBindMatricesAccessor
        ? (skin.inverseBindMatricesAccessor.bufferData.slice(i * 16, i * 16 + 16) as mat4)
        : identity

      mat4.mul(jointMatrix, node.worldTransform, ibm)
      mat4.mul(jointMatrix, parentNode.inverseWorldTransform, jointMatrix)

      jointMatrices.push(jointMatrix)

      // let normalMatrix = mat4.create()
      // mat4.invert(normalMatrix, jointMatrix)
      // mat4.transpose(normalMatrix, normalMatrix)
      // jointNormalMatrices.push(normalMatrix)
    }
    skin.jointMatrices = jointMatrices
    // skin.jointNormalMatrices = jointNormalMatrices

    // return [ jointMatrices, jointNormalMatrices ]
  }

  const skins = json.skins.map(skinJson => {
    let accessor: IAccessor | null = null
    if (skinJson.inverseBindMatrices) {
      accessor = accessors[skinJson.inverseBindMatrices]
    }
    const jointMatrices: mat4[] = []
    const jointNormalMatrices: mat4[] = []

    return {
      joints: skinJson.joints,
      inverseBindMatricesAccessor: accessor,
      jointMatrices,
      jointNormalMatrices
    }
  })

  json.nodes?.forEach((node, i) => {
    if (node.skin !== undefined) {
      nodes[i].skin = skins[node.skin]
    }
  })

  return computeJoints
}
