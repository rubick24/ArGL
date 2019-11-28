import { IAccessor } from './interfaces'
import { GlTF, Animation, AnimationChannel } from '../types/glTF'


export default (json: GlTF, accessors: IAccessor[]) => {

  if (!json.animations) {
    return []
  }
  const animations = json.animations
  animations.forEach(m => {
    m.channels
  })


  return []
}
