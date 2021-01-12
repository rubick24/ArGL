import { vec3, quat } from 'gl-matrix'
import { GLArrayType, IAccessor } from './interfaces'

const tempM0 = vec3.create()
const tempM1 = vec3.create()
const tempRes = vec3.create()
const tempQuat = quat.create()

const common = (inputAccessor: IAccessor, outputAccessor: IAccessor, currentTime: number) => {
  // maybe replace this by interval?
  let previousTime = 0
  let nextTime = 0
  for (let i = 0; i < inputAccessor.bufferData.length; i++) {
    if (inputAccessor.bufferData[i] > currentTime) {
      previousTime = inputAccessor.bufferData[i - 1]
      nextTime = inputAccessor.bufferData[i]
      break
    }
  }

  const prevIndex = inputAccessor.bufferData.indexOf(previousTime)
  const nextIndex = inputAccessor.bufferData.indexOf(nextTime)

  const t = (currentTime - previousTime) / (nextTime - previousTime)
  const d = outputAccessor.bufferData

  return [previousTime, nextTime, prevIndex, nextIndex, t, d] as [
    number,
    number,
    number,
    number,
    number,
    GLArrayType
  ]
}

export const getInterpolationVec3 = (
  inputAccessor: IAccessor,
  outputAccessor: IAccessor,
  interpolation: string | undefined,
  currentTime: number
) => {
  const [previousTime, nextTime, prevIndex, nextIndex, t, d] = common(
    inputAccessor,
    outputAccessor,
    currentTime
  )
  if (prevIndex === -1) {
    return [0, 0, 0] as vec3
  }

  if (interpolation === 'CUBICSPLINE') {
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
    const m0 = vec3.scale(tempM0, preVal.bk as vec3, nextTime - previousTime)
    const m1 = vec3.scale(tempM1, nextVal.ak as vec3, nextTime - previousTime)
    const res = tempRes
    vec3.scaleAndAdd(res, res, p0 as vec3, 2 * t ** 3 - 3 * t ** 2 + 1)
    vec3.scaleAndAdd(res, res, m0, t ** 3 - 2 * t ** 2 + t)
    vec3.scaleAndAdd(res, res, p1 as vec3, -2 * t ** 3 + 3 * t ** 2)
    vec3.scaleAndAdd(res, res, m1, t ** 3 - t ** 2)
    return res
  } else {
    const pi = prevIndex * 3
    const ni = nextIndex * 3
    const preVal = [d[pi], d[pi + 1], d[pi + 2]] as vec3
    if (interpolation === 'STEP') {
      return preVal
    }

    // default: interpolation === 'LINEAR'
    const nextVal = [d[ni], d[ni + 1], d[ni + 2]] as vec3
    return vec3.lerp(tempRes, preVal, nextVal, t)
  }
}

export const getInterpolationQuat = (
  inputAccessor: IAccessor,
  outputAccessor: IAccessor,
  interpolation: string | undefined,
  currentTime: number
) => {
  const [previousTime, nextTime, prevIndex, nextIndex, t, d] = common(
    inputAccessor,
    outputAccessor,
    currentTime
  )
  if (prevIndex === -1) {
    return [0, 0, 0, 1] as quat
  }
  const pi = prevIndex * 4
  const ni = nextIndex * 4
  const preVal = outputAccessor.bufferData.slice(pi, pi + 4) as quat
  const nextVal = outputAccessor.bufferData.slice(ni, ni + 4) as quat

  return quat.slerp(tempQuat, preVal, nextVal, t)
}

export const getInterpolationFloat = (
  inputAccessor: IAccessor,
  outputAccessor: IAccessor,
  interpolation: string | undefined,
  currentTime: number
) => {
  const [previousTime, nextTime, prevIndex, nextIndex, t, d] = common(
    inputAccessor,
    outputAccessor,
    currentTime
  )
  if (prevIndex === -1) {
    return 0
  }
  if (interpolation === 'STEP') {
    const preVal = d[prevIndex]
    return preVal
  } else if (interpolation === 'CUBICSPLINE') {
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
  } else {
    // LINEAR
    const preVal = d[prevIndex]
    const nextVal = d[nextIndex]
    return preVal + t * (nextVal - preVal)
  }
}
