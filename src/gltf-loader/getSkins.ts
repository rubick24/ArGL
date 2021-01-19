import { mat4 } from 'gl-matrix'
import { GlTF } from '../types/glTF'
import { IAccessor, INode, ComputeJoints } from './interfaces'

export default (
  gl: WebGL2RenderingContext,
  json: GlTF,
  accessors: IAccessor[],
  nodes: INode[]
): ComputeJoints => {
  if (!json.skins) {
    return () => {}
  }
  const identity = mat4.create()
  const jointMatrix = mat4.create()
  const normalMatrix = mat4.create()

  const computeJoints: ComputeJoints = (skin, parentNode) => {

    for (let i = 0; i < skin.joints.length; i++) {
      const joint = skin.joints[i]
      const node = nodes[joint]

      let ibm = skin.inverseBindMatricesAccessor
        ? (skin.inverseBindMatricesAccessor.bufferData.slice(i * 16, i * 16 + 16) as mat4)
        : identity

      mat4.mul(jointMatrix, node.worldTransform, ibm)
      mat4.mul(jointMatrix, parentNode.inverseWorldTransform, jointMatrix)

      skin.jointMatrices.set(jointMatrix, i * 16)

      mat4.invert(normalMatrix, jointMatrix)
      mat4.transpose(normalMatrix, normalMatrix)
      skin.jointNormalMatrices.set(jointMatrix, i * 16)
    }
  }

  const skins = json.skins.map((skinJson, i) => {
    let accessor: IAccessor | null = null
    if (skinJson.inverseBindMatrices) {
      accessor = accessors[skinJson.inverseBindMatrices]
    }
    const jointMatrices = new Float32Array(skinJson.joints.length * 16)
    const jointNormalMatrices = new Float32Array(skinJson.joints.length * 16)

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
