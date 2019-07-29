import GLTFLoader from '.'
import { mat4, quat, vec3 } from 'gl-matrix'

export const renderArgs = {
  viewMat: mat4.create(),
  projectionMat: mat4.create(),
  camPos: vec3.create()
}

export function renderScene(
  this: GLTFLoader,
  sceneIndex: number,
  camera: any,
  time: number
) {
  const gl = this.gl
  const transformMat = mat4.create()

  this.renderArgs.camPos = camera.position
  this.renderArgs.viewMat = camera.viewMatrix
  this.renderArgs.projectionMat = camera.getProjectionMatrix(
    gl.canvas.clientWidth / gl.canvas.clientHeight,
    0.1,
    1000
  )

  const scene = this.json.scenes[sceneIndex]
  scene.nodes.forEach(nodeIndex => {
    const modelMat = transformMat || mat4.create()
    this.renderNode(nodeIndex, time, modelMat)
  })
}

export function renderNode(
  this: GLTFLoader,
  nodeIndex: number,
  time: number,
  modelMat: mat4
) {
  const gl = this.gl
  const node = this.json.nodes[nodeIndex]
  if (node.matrix) {
    mat4.mul(
      modelMat,
      modelMat,
      mat4.fromValues.apply(mat4, node.matrix.slice(0, 16))
    )
  } else {
    if (node.translation) {
      mat4.translate(modelMat, modelMat, node.translation)
    }
    if (node.rotation) {
      const rotation = mat4.create()
      mat4.fromQuat(
        rotation,
        quat.fromValues.apply(quat, node.rotation.slice(0, 4))
      )
      mat4.mul(modelMat, modelMat, rotation)
    }
    if (node.scale) {
      mat4.scale(modelMat, modelMat, node.scale)
    }
  }

  if (this.json.animations !== undefined) {
    /**
     * 触发时设置 activedAnim[i] = true
     * if (active && time < tiggertime + duration): animate
     * if (active && time > tiggertime + duration): deactive
     * if ()
     *
     */
    this.json.animations.forEach(a => {
      a.channels.forEach(c => {
        if (nodeIndex === c.target.node) {
          const inputAccessor = this.json.accessors[a.samplers[c.sampler].input]
          const duration = inputAccessor.max[0] - inputAccessor.min[0]
          if (duration > 0) {
            const v = this.getCurrentValue((time / 1000) % duration, a, c)

            if (c.target.path === 'scale') {
              mat4.scale(modelMat, modelMat, v as vec3)
            } else if (c.target.path === 'translation') {
              mat4.translate(modelMat, modelMat, v as vec3)
            } else if (c.target.path === 'rotation') {
              const rotateAni = mat4.create()
              mat4.fromQuat(rotateAni, v as quat)
              mat4.mul(modelMat, modelMat, rotateAni)
            }
          }
        }
      })
    })
  }
  if (node.mesh !== undefined) {
    const mvMatrix = mat4.multiply(
      mat4.create(),
      this.renderArgs.viewMat,
      modelMat
    )
    const mvpMatrix = mat4.multiply(
      mat4.create(),
      this.renderArgs.projectionMat,
      mvMatrix
    )
    const modelInverse = mat4.invert(mat4.create(), modelMat)
    const normalMatrix = mat4.transpose(mat4.create(), modelInverse)

    this.json.meshes[node.mesh].primitives.forEach((primitive, i) => {
      const loadedPrimitive = this.loadedMeshs[node.mesh].loadedPrimitives[i]
      const shader = loadedPrimitive.shader
      if (primitive.material !== undefined) {
        this.useMaterial(shader, primitive.material)
      }

      // automate this?
      shader.setVec3('u_LightDirection', vec3.fromValues(3, 5, 4))
      shader.setVec3('u_LightColor', vec3.fromValues(1, 1, 1))

      shader.setVec3('u_Camera', this.renderArgs.camPos)
      shader.setMat4('u_MVPMatrix', mvpMatrix)
      shader.setMat4('u_ModelMatrix', modelMat)
      shader.setMat4('u_NormalMatrix', normalMatrix)

      gl.bindVertexArray(loadedPrimitive.vao)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, loadedPrimitive.indices)

      const accessor = this.json.accessors[primitive.indices]
      gl.drawElements(primitive.mode, accessor.count, accessor.componentType, 0)
      gl.bindVertexArray(null)
    })
  }
  if (node.children !== undefined) {
    node.children.forEach(childNodeIndex => {
      const childModelMatrix = mat4.copy(mat4.create(), modelMat)
      this.renderNode(childNodeIndex, time, childModelMatrix)
    })
  }
}
