import { vec3, quat } from 'gl-matrix'
import { Animation, AnimationChannel, AnimationSampler } from '../types/glTF'
import { IAccessor } from './interfaces'

const tempM0 = vec3.create()
const tempM1 = vec3.create()
const tempRes = vec3.create()
const tempQuat = quat.create()

export default (
  accessors: IAccessor[],
  currentTime: number,
  sampler: AnimationSampler,
  path: 'scale' | 'translation' | 'rotation' | 'weights'
) => {
  // const sampler = animation.samplers[channel.sampler]
  const inputAccessor = accessors[sampler.input]
  const outputAccessor = accessors[sampler.output]
  // trick solotion here
  const previousTime = [...inputAccessor.bufferData].reduce((p, c) =>
    c > p && c < currentTime ? c : p
  )
  const nextTime = [...inputAccessor.bufferData].reduce((p, c) => {
    if (c > currentTime && p > currentTime) {
      return c < p ? c : p
    } else {
      return c > currentTime ? c : p
    }
  })

  const prevIndex = inputAccessor.bufferData.indexOf(previousTime)
  const nextIndex = inputAccessor.bufferData.indexOf(nextTime)

  const t = (currentTime - previousTime) / (nextTime - previousTime)
  // const path = channel.target.path
  const d = outputAccessor.bufferData
  if (path === 'scale' || path === 'translation') {
    if (sampler.interpolation === 'CUBICSPLINE') {
      const pi = prevIndex * 9
      const ni = nextIndex * 9
      const preVal = {
        ak: [d[pi], d[pi + 1], d[pi + 2]],
        vk: [d[pi + 3], d[pi + 4], d[pi + 5]],
        bk: [d[pi + 6], d[pi + 7], d[pi + 8]]
      }
      const nextVal = {
        ak: [d[ni], d[ni + 1], d[ni + 2]],
        vk: [d[ni + 3], d[ni + 4], d[ni + 5]],
        bk: [d[ni + 6], d[ni + 7], d[ni + 8]]
      }
      const p0 = preVal.vk
      const p1 = nextVal.vk
      const m0 = vec3.scale(tempM0, preVal.bk, nextTime - previousTime)
      const m1 = vec3.scale(tempM1, nextVal.ak, nextTime - previousTime)
      const res = tempRes
      vec3.scaleAndAdd(res, res, p0, 2 * t ** 3 - 3 * t ** 2 + 1)
      vec3.scaleAndAdd(res, res, m0, t ** 3 - 2 * t ** 2 + t)
      vec3.scaleAndAdd(res, res, p1, -2 * t ** 3 + 3 * t ** 2)
      vec3.scaleAndAdd(res, res, m1, t ** 3 - t ** 2)
      return res
    } else {
      const pi = prevIndex * 3
      const ni = nextIndex * 3
      const preVal = [d[pi], d[pi + 1], d[pi + 2]]
      const nextVal = [d[ni], d[ni + 1], d[ni + 2]]

      if (sampler.interpolation === 'LINEAR') {
        return vec3.lerp(tempRes, preVal, nextVal, t)
      } else if (sampler.interpolation === 'STEP') {
        return preVal
      }
    }
  } else if (path === 'rotation') {
    const pi = prevIndex * 4
    const ni = nextIndex * 4
    const preVal = outputAccessor.bufferData.slice(pi, pi + 4)
    const nextVal = outputAccessor.bufferData.slice(ni, ni + 4)
    return quat.slerp(
      tempQuat,
      quat.fromValues.apply(quat, preVal),
      quat.fromValues.apply(quat, nextVal),
      t
    )
  } else if (path === 'weights') {
    if (sampler.interpolation === 'LINEAR') {
      const preVal = d[prevIndex]
      const nextVal = d[nextIndex]
      return preVal + t * (nextVal - preVal)
    } else if (sampler.interpolation === 'STEP') {
      const preVal = d[prevIndex]
      return preVal
    } else if (sampler.interpolation === 'CUBICSPLINE') {
      const pi = prevIndex * 3
      const ni = nextIndex * 3
      const preVal = {
        ak: d[pi],
        vk: d[pi + 1],
        bk: d[pi + 2]
      }
      const nextVal = {
        ak: d[ni],
        vk: d[ni + 1],
        bk: d[ni + 2]
      }
      const p0 = preVal.vk
      const p1 = nextVal.vk
      const m0 = (nextTime - previousTime) * preVal.bk
      const m1 = (nextTime - previousTime) * nextVal.ak
      return (
        (2 * t ** 3 - 3 * t ** 2 + 1) * p0 +
        (t ** 3 - 2 * t ** 2 + t) * m0 +
        (-2 * t ** 3 + 3 * t ** 2) * p1 +
        (t ** 3 - t ** 2) * m1
      )
    }
  }
}
