## Sprite Animation

```js
import sprite from './sprite'

const frameDuration = 100
const playerSprite = await sprite(gl, {
  texture: 'sprite/player.png',
  atlas: 'sprite/player.json',
  frameDuration
})

const renderLoop = (time: number) => {
  // ...
  playerSprite.render({ modelMatrix, viewMatrix: camera.viewMatrix, projectionMatrix, time })
  requestAnimationFrame(renderLoop)
}
requestAnimationFrame(renderLoop)
```

set current animation to idle:

```js
playerSprite.setAnimation('idle')
```

loop in all animations(maybe use time in raf rather than setTimeout):

```js
const animations = playerSprite.animations
let i = 0
const ans = Object.keys(animations)
const nextAnimation = () => {
  i = (i + 1) % ans.length
  console.log(ans[i])
  playerSprite.setAnimation(ans[i])
  setTimeout(nextAnimation, animations[ans[i]].length * frameDuration)
}
setTimeout(nextAnimation, animations[ans[i]].length * frameDuration)
```
