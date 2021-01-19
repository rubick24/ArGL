import { GlTF } from '../types/glTF'
import parseGLB from './parseGLB'
import getAccessor from './getAccessor'
import getImages from './getImages'
import getMeshes from './getMeshes'
import getMaterials from './getMaterials'
import getNodes from './getNodes'
import getScenes from './getScenes'
import getAnimations from './getAnimations'
import getSkins from './getSkins'

import draw from './draw'
import render from './render'
import animate from './animate'

const relativeURL = (base: string, target: string) => {
  if (base.lastIndexOf('/') !== -1) {
    return base.slice(0, base.lastIndexOf('/')) + '/' + target
  } else {
    return target
  }
}
const loadGLTF = async (url: string, gl: WebGL2RenderingContext) => {
  // get json and buffers
  let extension: string
  let json: GlTF
  let buffers: ArrayBuffer[]
  if (/\.gltf$/.test(url)) {
    extension = 'gltf'
    json = (await fetch(url).then(res => res.json())) as GlTF
    if (!json.buffers) {
      throw new Error('glTFLoader: no buffer specified in gltf file')
    }
    buffers = await Promise.all(
      json.buffers.map(buffer => {
        if (!buffer.uri) {
          throw new Error('glTFLoader: buffer.uri not specified')
        }
        const binURL = relativeURL(url, buffer.uri)
        return fetch(binURL).then(res => res.arrayBuffer())
      })
    )
  } else if (/\.glb$/.test(url)) {
    extension = 'gltf'
    const r = await parseGLB(url)
    json = r[0]
    buffers = r[1]
  } else {
    throw new Error('glTFLoader: file suffix not support')
  }

  console.log('glTFLoader: json', json)
  // get accessors
  const accessors = getAccessor(json, buffers)

  // get images
  const images = await getImages(json, buffers)

  // TODO: getMaterials
  // use default unlit material now
  const materials = getMaterials(gl, json, images)

  const nodes = getNodes(json)
  const meshes = getMeshes(gl, json, accessors, materials)
  nodes.forEach((n, i) => {
    const node = json.nodes?.[n.index]
    nodes[i].mesh = node?.mesh !== undefined ? meshes[node.mesh] : undefined
  })

  const computeJoints = getSkins(json, accessors, nodes)

  const scenes = getScenes(json, nodes)

  const animations = getAnimations(json, accessors, nodes)



  return {
    json,
    // scene,
    scenes,
    meshes,
    animations,
    draw: draw(gl),
    render: render(gl, nodes, computeJoints),
    animate
    // cameras
  }
}

// render(scene)
// draw(gl, meshes[0], modelMatrix, viewMatrix, projectionMatrix, cameraPositon)
// animate(animations[0], )

export default loadGLTF
