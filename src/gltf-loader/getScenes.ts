import { GlTF } from '../types/glTF'
import { IScene, INode } from './interfaces'

export default (json: GlTF, nodes: INode[]) => {
  if (!json.scenes) {
    return []
  }
  return json.scenes.map((scene): IScene => {
    return {
      name: scene.name || '',
      nodes: scene.nodes ? scene.nodes.map(v => nodes[v]) : undefined
    }
  })
}
