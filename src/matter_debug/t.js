'use strict'
/* TODO:  **************************************************************
make a graphics that looks like the player has (loose wires / a tail / a rope) to indicate player motion

draw images on top of bodies
  make an svg in html, export to png, add to canvas
  add a background layer
  add a foreground layer for shadows, lights, stuff in front of player

add more methods of player interaction
  portals
    need to find a way to fire the portals at locations
      use raycasting in matter.js
      they could only interact with statics
  gun
    you'd have to add bad guys too of course...
  flipping rotating gravity
    also rotate the canvas around
  reverse time
    negate all velocities, x,y angular
      can't reverse time this way because of friction

game mechanics
  mechanics that support the physics engine
    add rope/constraint
  store/spawn bodies in player (like starfall)
  get ideas from game: limbo / inside
  environmental hazards
    laser
    lava
  button / switch
  door
  fizzler
  moving platform
  map zones
    water
    low friction ground
    bouncy ground

 give each foot a sensor to check for ground collisions
  feet with not go into the ground even on slanted ground
  this might be not worth it, but it might look really cool

track foot positions with velocity better as the player walks/crouch/runs

track what body the player is standing on
  get id from jump sensor collisions, find the body with the id.
  when player jumps/moves apply an opposite force on that body
  leg animation should be relative to the velocity of the body player is on

crouch after landing at a high speed
  you could just set the crouch keys[] to true for a few cycles if velocity.y is large

give grab a method of interaction with bullets, while paused

FIX************************************************************
pause doesn't track rotation
  anything else pause wipes?

pause in matter isn't working/possible??
  slowing time down makes all the bodies bounce around.

holding a body with a constraint pushes on other bodies too easily
  mostly fixed by capping the mass of what player can hold

*/

//set up canvas
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function setupCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.font = '15px Arial'
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
}

setupCanvas()
window.onresize = function () {
  setupCanvas()
}

//mouse move input
window.onmousemove = function (e) {
  mech.getMousePos(e.clientX, e.clientY)
}
//mouse click input

//keyboard input
const keys = []
document.body.addEventListener('keyup', function (e) {
  keys[e.keyCode] = false
})
document.body.addEventListener('keydown', function (e) {
  keys[e.keyCode] = true
  if (keys[84]) {
    //t = testing mode
    if (game.testing) {
      game.testing = false
    } else {
      game.testing = true
    }
  }
})

const stats = new Stats() //setup stats library to show FPS
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
//stats.domElement.style.opacity   = '0.5'

// game Object Prototype *********************************************
//*********************************************************************
const gameProto = function () {
  this.testing = false //testing mode: shows wireframe and some variables
  //time related vars and methods
  this.cycle = 0 //total cycles, 60 per second
  this.cyclePaused = 0
  this.lastTimeStamp = 0 //tracks time stamps for measuing delta
  this.delta = 0 //measures how slow the engine is running compared to 60fps
  this.buttonCD = 0
  this.gravityDir = 0
  this.gravityFlip = function () {
    if (keys[82] && this.buttonCD < this.cycle) {
      this.buttonCD = this.cycle + 30

      //engine.world.gravity.scale = -engine.world.gravity.scale
      if (this.gravityDir) {
        this.gravityDir = 0
      } else {
        this.gravityDir = 1
      }

      Matter.Body.setPosition(player, {
        x: player.position.x,
        y: -player.position.y
      })
      Matter.Body.setVelocity(player, {
        x: player.velocity.x,
        y: -player.velocity.y
      })
      mech.testingMoveLook()
      mech.Sy = mech.y
      for (let i = 0; i < bullet.length; i++) {
        Matter.Body.setPosition(bullet[i], {
          x: bullet[i].position.x,
          y: -bullet[i].position.y
        })
        Matter.Body.setVelocity(bullet[i], {
          x: bullet[i].velocity.x,
          y: -bullet[i].velocity.y
        })
      }
      for (let i = 0; i < body.length; i++) {
        Matter.Body.setPosition(body[i], {
          x: body[i].position.x,
          y: -body[i].position.y
        })
        Matter.Body.setVelocity(body[i], {
          x: body[i].velocity.x,
          y: -body[i].velocity.y
        })
      }
      for (let i = 0; i < map.length; i++) {
        Matter.Body.setPosition(map[i], {
          x: map[i].position.x,
          y: -map[i].position.y
        })
        //Matter.Body.rotate(map[i], Math.PI)
      }
      for (let i = 0; i < cons.length; i++) {
        cons[i].pointA = {
          x: cons[i].pointA.x,
          y: -cons[i].pointA.y
        }
      }

      //ctx.rotate(this.gravityDir);

      //engine.world.gravity.scale = -engine.world.gravity.scale
      //this.gravityDir = (this.gravityDir + Math.PI)%(Math.PI*2);
      //Matter.Body.setAngle(player, this.gravityDir)

      //Matter.Body.rotate(player, Math.PI);
    }
  }
  this.timing = function () {
    this.cycle++ //tracks game cycles
    //delta is used to adjust forces on game slow down;
    this.delta = (engine.timing.timestamp - this.lastTimeStamp) / 16.666666666666
    this.lastTimeStamp = engine.timing.timestamp //track last engine timestamp
  }
  this.zoom = 1 / 300
  this.scaleZoom = function () {
    if (this.zoom != 1) {
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.scale(this.zoom, this.zoom)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
    }
  }
  this.keyZoom = function () {
    if (keys[187]) {
      //plus
      this.zoom *= 1.01
    } else if (keys[189]) {
      //minus
      this.zoom *= 0.99
    } else if (keys[48]) {
      this.zoom = 1
    }
  }
  this.wipe = function () {
    if (this.isPaused) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  this.isPaused = false
  this.pause = function () {
    if (keys[70] && mech.buttonCD < this.cycle) {
      mech.buttonCD = this.cycle + 20
      if (!this.isPaused) {
        this.cyclePaused = this.cycle
        this.isPaused = true
        for (let i = 0; i < body.length; i++) {
          body[i].pausedVelocity = body[i].velocity //sleep wipes velocity, so we need to keep track
          body[i].pausedVelocityA = body[i].angularVelocity //sleep wipes velocity, so we need to keep track
          Matter.Sleeping.set(body[i], true)
        }
        for (let i = 0; i < bullet.length; i++) {
          bullet[i].pausedVelocity = bullet[i].velocity //sleep wipes velocity, so we need to keep track
          bullet[i].pausedVelocityA = bullet[i].angularVelocity //sleep wipes velocity, so we need to keep track
          Matter.Sleeping.set(bullet[i], true)
        }
      } else {
        this.isPaused = false
        for (let i = 0; i < body.length; i++) {
          Matter.Sleeping.set(body[i], false)
          Matter.Body.setVelocity(body[i], body[i].pausedVelocity) //return old velocity before pause
          Matter.Body.setAngularVelocity(body[i], body[i].angularVelocity)
        }
        for (let i = 0; i < bullet.length; i++) {
          bullet[i].birthCycle += this.cycle - this.cyclePaused //extends the lifespan of a bullet
          Matter.Sleeping.set(bullet[i], false)
          if (bullet[i].pausedVelocity) {
            Matter.Body.setVelocity(bullet[i], bullet[i].pausedVelocity) //return old velocity before pause
            Matter.Body.setAngularVelocity(bullet[i], bullet[i].angularVelocity)
          }
        }
      }
    }
  }
}
const game = new gameProto()

// player Object Prototype *********************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************

const mechProto = function () {
  this.width = 50
  this.radius = 30
  this.stroke = '#333'
  this.fill = '#eee'
  this.height = 42
  this.yOffWhen = {
    crouch: 22,
    stand: 49,
    jump: 70
  }
  this.yOff = 70
  this.yOffGoal = 70
  this.onGround = false //checks if on ground or in air
  this.onBody = {}
  this.numTouching = 0
  this.crouch = false
  this.isHeadClear = true
  this.spawnPos = {
    x: 675,
    y: 750
  }
  this.spawnVel = {
    x: 0,
    y: 0
  }
  this.x = this.spawnPos.x
  this.y = this.spawnPos.y
  this.Sy = this.y //adds a smoothing effect to vertical only
  this.Vx = 0
  this.VxMax = 7
  this.Vy = 0
  this.mass = 5
  this.Fx = 0.004 * this.mass //run Force on ground
  this.FxAir = 0.0006 * this.mass //run Force in Air
  this.Fy = -0.04 * this.mass //jump Force
  this.angle = 0
  this.walk_cycle = 0
  this.stepSize = 0
  this.flipLegs = -1
  this.hip = {
    x: 12,
    y: 24
  }
  this.knee = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0
  }
  this.foot = {
    x: 0,
    y: 0
  }
  this.legLength1 = 55
  this.legLength2 = 45
  this.canvasX = canvas.width / 2
  this.canvasY = canvas.height / 2
  this.transX = this.canvasX - this.x
  this.transY = this.canvasX - this.x
  this.mouse = {
    x: canvas.width / 3,
    y: canvas.height
  }
  this.getMousePos = function (x, y) {
    this.mouse.x = x
    this.mouse.y = y
  }
  this.testingMoveLook = function () {
    //move
    this.x = player.position.x
    this.y = playerBody.position.y - this.yOff
    this.Vx = player.velocity.x
    this.Vy = player.velocity.y
    //look
    this.canvasX = canvas.width / 2
    this.canvasY = canvas.height / 2
    this.transX = this.canvasX - this.x
    this.transY = this.canvasY - this.y
    this.angle = Math.atan2(this.mouse.y - this.canvasY, this.mouse.x - this.canvasX)
  }

  this.move = function () {
    this.x = player.position.x
    //looking at player body, to ignore the other parts of the player composite
    this.y = playerBody.position.y - this.yOff
    this.Vx = player.velocity.x
    this.Vy = player.velocity.y
  }
  this.look = function () {
    //set a max on mouse look
    let mX = this.mouse.x
    if (mX > canvas.width * 0.8) {
      mX = canvas.width * 0.8
    } else if (mX < canvas.width * 0.2) {
      mX = canvas.width * 0.2
    }
    let mY = this.mouse.y
    if (mY > canvas.height * 0.8) {
      mY = canvas.height * 0.8
    } else if (mY < canvas.height * 0.2) {
      mY = canvas.height * 0.2
    }
    //set mouse look
    this.canvasX = this.canvasX * 0.94 + (canvas.width - mX) * 0.06
    this.canvasY = this.canvasY * 0.94 + (canvas.height - mY) * 0.06
    //set translate values
    this.transX = this.canvasX - this.x
    this.Sy = 0.99 * this.Sy + 0.01 * this.y
    //hard caps how behind y position tracking can get.
    if (this.Sy - this.y > canvas.height / 2) {
      this.Sy = this.y + canvas.height / 2
    } else if (this.Sy - this.y < -canvas.height / 2) {
      this.Sy = this.y - canvas.height / 2
    }
    this.transY = this.canvasY - this.Sy
    //make player head angled towards mouse
    this.angle = Math.atan2(this.mouse.y - this.canvasY, this.mouse.x - this.canvasX)
  }
  this.doCrouch = function () {
    if (!this.crouch) {
      this.crouch = true
      this.yOffGoal = this.yOffWhen.crouch
      Matter.Body.translate(playerHead, {
        x: 0,
        y: 40
      })
    }
  }
  this.undoCrouch = function () {
    this.crouch = false
    this.yOffGoal = this.yOffWhen.stand
    Matter.Body.translate(playerHead, {
      x: 0,
      y: -40
    })
  }
  this.enterAir = function () {
    this.onGround = false
    player.frictionAir = 0.001
    if (this.isHeadClear) {
      if (this.crouch) {
        this.undoCrouch()
      }
      this.yOffGoal = this.yOffWhen.jump
    }
  }
  this.enterLand = function () {
    this.onGround = true
    if (this.crouch) {
      if (this.isHeadClear) {
        this.undoCrouch()
        player.frictionAir = 0.12
      } else {
        this.yOffGoal = this.yOffWhen.crouch
        player.frictionAir = 0.5
      }
    } else {
      this.yOffGoal = this.yOffWhen.stand
      player.frictionAir = 0.12
    }
  }
  this.buttonCD_jump = 0 //cooldown for player buttons
  this.keyMove = function () {
    if (this.onGround) {
      //on ground **********************
      if (this.crouch) {
        //crouch
        if (!(keys[40] || keys[83]) && this.isHeadClear) {
          //not pressing crouch anymore
          this.undoCrouch()
          player.frictionAir = 0.12
        }
      } else if (keys[40] || keys[83]) {
        //on ground && not crouched and pressing s or down
        this.doCrouch()
        player.frictionAir = 0.5
      } else if ((keys[32] || keys[38] || keys[87]) && this.buttonCD_jump + 20 < game.cycle) {
        //jump
        this.buttonCD_jump = game.cycle //can't jump until 20 cycles pass
        Matter.Body.setVelocity(player, {
          //zero player velocity for consistant jumps
          x: player.velocity.x,
          y: 0
        })
        player.force.y = this.Fy / game.delta //jump force / delta so that force is the same on game slowdowns
      }
      //horizontal move on ground
      if (keys[37] || keys[65]) {
        //left or a
        if (player.velocity.x > -this.VxMax) {
          player.force.x = -this.Fx / game.delta
        }
      } else if (keys[39] || keys[68]) {
        //right or d
        if (player.velocity.x < this.VxMax) {
          player.force.x = this.Fx / game.delta
        }
      }
    } else {
      // in air **********************************
      //check for short jumps
      if (
        this.buttonCD_jump + 60 > game.cycle && //just pressed jump
        !(keys[32] || keys[38] || keys[87]) && //but not pressing jump key
        this.Vy < 0
      ) {
        // and velocity is up
        Matter.Body.setVelocity(player, {
          //reduce player velocity every cycle until not true
          x: player.velocity.x,
          y: player.velocity.y * 0.94
        })
      }
      if (keys[37] || keys[65]) {
        // move player   left / a
        if (player.velocity.x > -this.VxMax + 2) {
          player.force.x = -this.FxAir / game.delta
        }
      } else if (keys[39] || keys[68]) {
        //move player  right / d
        if (player.velocity.x < this.VxMax - 2) {
          player.force.x = this.FxAir / game.delta
        }
      }
    }
    //smoothly move height towards height goal ************
    this.yOff = this.yOff * 0.85 + this.yOffGoal * 0.15
  }
  this.deathCheck = function () {
    if (this.y > 4000) {
      // if player is 4000px deep reset to spawn Position and Velocity
      Matter.Body.setPosition(player, this.spawnPos)
      Matter.Body.setVelocity(player, this.spawnVel)
      this.dropBody()
      //this.testingMoveLook();  //updates mech position
      //this.Sy = mech.y  //moves camera to new position quickly
    }
  }
  this.holdKeyDown = 0
  this.buttonCD = 0 //cooldown for player buttons
  this.keyHold = function () {
    //checks for holding/dropping/picking up bodies
    if (this.isHolding) {
      //give the constaint more length and less stiffness if it is pulled out of position
      const Dx = body[this.holdingBody].position.x - holdConstraint.pointA.x
      const Dy = body[this.holdingBody].position.y - holdConstraint.pointA.y
      holdConstraint.length = Math.sqrt(Dx * Dx + Dy * Dy) * 0.95
      holdConstraint.stiffness = -0.01 * holdConstraint.length + 1
      if (holdConstraint.length > 100) this.dropBody() //drop it if the constraint gets too long
      holdConstraint.pointA = {
        //set constraint position
        x: this.x + 50 * Math.cos(this.angle), //just in front of player nose
        y: this.y + 50 * Math.sin(this.angle)
      }
      if (keys[81]) {
        // q = rotate the body
        body[this.holdingBody].torque = 0.05 * body[this.holdingBody].mass
      }
      //look for dropping held body
      if (this.buttonCD < game.cycle) {
        if (keys[69]) {
          //if holding e drops
          this.holdKeyDown++
        } else if (this.holdKeyDown && !keys[69]) {
          this.dropBody() //if you hold down e long enough the body is thrown
          this.throwBody()
        }
      }
    } else if (keys[69]) {
      //when not holding  e = pick up body
      this.findClosestBody()
      if (this.closest.dist2 < 10000) {
        //pick up if distance closer then 100*100
        this.isHolding = true
        this.holdKeyDown = 0
        this.buttonCD = game.cycle + 20
        body[this.holdingBody].collisionFilter.group = 2 //force old holdingBody to collide with player
        this.holdingBody = this.closest.index //set new body to be the holdingBody
        //body[this.closest.index].isSensor = true; //sensor seems a bit inconsistant
        body[this.holdingBody].collisionFilter.group = -2 //don't collide with player
        body[this.holdingBody].frictionAir = 0.1 //makes the holding body less jittery
        holdConstraint.bodyB = body[this.holdingBody]
        holdConstraint.length = 0
        holdConstraint.pointA = {
          x: this.x + 50 * Math.cos(this.angle),
          y: this.y + 50 * Math.sin(this.angle)
        }
      }
    }
  }
  this.dropBody = function () {
    let timer //reset player collision
    function resetPlayerCollision() {
      timer = setTimeout(function () {
        const dx = mech.x - body[mech.holdingBody].position.x
        const dy = mech.y - body[mech.holdingBody].position.y
        if (dx * dx + dy * dy > 20000) {
          body[mech.holdingBody].collisionFilter.group = 2 //can collide with player
        } else {
          resetPlayerCollision()
        }
      }, 100)
    }
    resetPlayerCollision()
    this.isHolding = false
    body[this.holdingBody].frictionAir = 0.01
    holdConstraint.bodyB = jumpSensor //set on sensor to get the constaint on somethign else
  }
  this.throwMax = 150
  this.throwBody = function () {
    let throwMag = 0
    if (this.holdKeyDown > 20) {
      if (this.holdKeyDown > this.throwMax) this.holdKeyDown = this.throwMax
      //scale fire with mass and with holdKeyDown time
      throwMag = body[this.holdingBody].mass * this.holdKeyDown * 0.001
    }
    body[this.holdingBody].force.x = throwMag * Math.cos(this.angle)
    body[this.holdingBody].force.y = throwMag * Math.sin(this.angle)
  }
  this.isHolding = false
  this.holdingBody = 0
  this.closest = {
    dist2: 1000000,
    index: 0
  }
  this.findClosestBody = function () {
    this.closest.dist2 = 100000
    for (let i = 0; i < body.length; i++) {
      const Px = body[i].position.x - (this.x + 50 * Math.cos(this.angle))
      const Py = body[i].position.y - (this.y + 50 * Math.sin(this.angle))
      if (body[i].mass < player.mass && Px * Px + Py * Py < this.closest.dist2) {
        this.closest.dist2 = Px * Px + Py * Py
        this.closest.index = i
      }
    }
  }
  /*   this.forcePoke = function() {
      for (var i = 0; i < body.length; i++) {
        var Dx = body[i].position.x - (this.mouse.x - this.transX);
        var Dy = body[i].position.y - (this.mouse.y - this.transY);
        var accel = 0.2 / Math.sqrt(Dx * Dx + Dy * Dy);
        if (accel > 0.01) accel = 0.01; //cap accel
        accel = accel * body[i].mass //scale with mass
        var angle = Math.atan2(Dy, Dx);
        body[i].force.x -= accel * Math.cos(angle);
        body[i].force.y -= accel * Math.sin(angle);
      }
    }; */
  this.drawLeg = function (stroke) {
    ctx.save()
    ctx.scale(this.flipLegs, 1) //leg lines
    ctx.strokeStyle = stroke
    ctx.lineWidth = 7
    ctx.beginPath()
    ctx.moveTo(this.hip.x, this.hip.y)
    ctx.lineTo(this.knee.x, this.knee.y)
    ctx.lineTo(this.foot.x, this.foot.y)
    ctx.stroke()
    //toe lines
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(this.foot.x, this.foot.y)
    ctx.lineTo(this.foot.x - 15, this.foot.y + 5)
    ctx.moveTo(this.foot.x, this.foot.y)
    ctx.lineTo(this.foot.x + 15, this.foot.y + 5)
    ctx.stroke()
    //hip joint
    ctx.strokeStyle = this.stroke
    ctx.fillStyle = this.fill
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(this.hip.x, this.hip.y, 11, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    //knee joint
    ctx.beginPath()
    ctx.arc(this.knee.x, this.knee.y, 7, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    //foot joint
    ctx.beginPath()
    ctx.arc(this.foot.x, this.foot.y, 6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
  this.calcLeg = function (cycle_offset, offset) {
    this.hip.x = 12 + offset
    this.hip.y = 24 + offset
    //stepSize goes to zero if Vx is zero or not on ground (make this transition cleaner)
    //changes to stepsize are smoothed by adding only a percent of the new value each cycle
    this.stepSize = 0.9 * this.stepSize + 0.1 * (8 * Math.sqrt(Math.abs(this.Vx)) * this.onGround)
    const stepAngle = 0.037 * this.walk_cycle + cycle_offset
    this.foot.x = 2 * this.stepSize * Math.cos(stepAngle) + offset
    this.foot.y = offset + this.stepSize * Math.sin(stepAngle) + this.yOff + this.height
    const Ymax = this.yOff + this.height
    if (this.foot.y > Ymax) this.foot.y = Ymax

    //calculate knee position as intersection of circle from hip and foot
    const d = Math.sqrt(
      (this.hip.x - this.foot.x) * (this.hip.x - this.foot.x) +
        (this.hip.y - this.foot.y) * (this.hip.y - this.foot.y)
    )
    const l =
      (this.legLength1 * this.legLength1 - this.legLength2 * this.legLength2 + d * d) / (2 * d)
    const h = Math.sqrt(this.legLength1 * this.legLength1 - l * l)
    this.knee.x =
      (l / d) * (this.foot.x - this.hip.x) -
      (h / d) * (this.foot.y - this.hip.y) +
      this.hip.x +
      offset
    this.knee.y =
      (l / d) * (this.foot.y - this.hip.y) + (h / d) * (this.foot.x - this.hip.x) + this.hip.y
  }
  this.draw = function () {
    ctx.fillStyle = this.fill
    if (this.mouse.x > canvas.width / 2) {
      this.flipLegs = 1
    } else {
      this.flipLegs = -1
    }
    this.walk_cycle += this.flipLegs * this.Vx

    //draw body
    ctx.save()
    // if(game.gravityDir){
    //   ctx.scale(1, -1);
    //   //ctx.translate(0,-1.5*canvas.height)
    //   ctx.translate(this.x, -this.y-this.yOff-this.height);
    // } else{
    //   ctx.translate(this.x, this.y);
    // }
    ctx.translate(this.x, this.y)
    this.calcLeg(Math.PI, -3)
    this.drawLeg('#444')
    this.calcLeg(0, 0)
    this.drawLeg('#333')
    ctx.rotate(this.angle)
    ctx.strokeStyle = this.stroke
    ctx.lineWidth = 2
    //ctx.fillStyle = this.fill;
    let grd = ctx.createLinearGradient(-30, 0, 30, 0)
    grd.addColorStop(0, '#bbb')
    grd.addColorStop(1, '#fff')
    ctx.fillStyle = grd
    ctx.beginPath()
    //ctx.moveTo(0, 0);
    ctx.arc(0, 0, 30, 0, 2 * Math.PI)
    ctx.arc(15, 0, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    //draw holding graphics
    if (this.isHolding) {
      if (this.holdKeyDown > 20) {
        if (this.holdKeyDown > this.throwMax) {
          ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)'
        } else {
          ctx.strokeStyle =
            'rgba(255, 0, 255, ' + (0.2 + (0.4 * this.holdKeyDown) / this.throwMax) + ')'
        }
      } else {
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)'
      }
      ctx.lineWidth = 10
      ctx.beginPath()
      ctx.moveTo(
        holdConstraint.bodyB.position.x + Math.random() * 2,
        holdConstraint.bodyB.position.y + Math.random() * 2
      )
      ctx.lineTo(this.x + 15 * Math.cos(this.angle), this.y + 15 * Math.sin(this.angle))
      //ctx.lineTo(holdConstraint.pointA.x,holdConstraint.pointA.y);
      ctx.stroke()
    }
  }
  this.info = function () {
    let line = 80
    ctx.fillStyle = '#000'
    ctx.fillText('Press T to exit testing mode', 5, line)
    line += 30
    ctx.fillText('cycle: ' + game.cycle, 5, line)
    line += 20
    ctx.fillText('delta: ' + game.delta.toFixed(6), 5, line)
    line += 20
    ctx.fillText('mX: ' + (this.mouse.x - this.transX).toFixed(2), 5, line)
    line += 20
    ctx.fillText('mY: ' + (this.mouse.y - this.transY).toFixed(2), 5, line)
    line += 20
    ctx.fillText('x: ' + this.x.toFixed(0), 5, line)
    line += 20
    ctx.fillText('y: ' + this.y.toFixed(0), 5, line)
    line += 20
    ctx.fillText('Vx: ' + this.Vx.toFixed(2), 5, line)
    line += 20
    ctx.fillText('Vy: ' + this.Vy.toFixed(2), 5, line)
    line += 20
    ctx.fillText('Fx: ' + player.force.x.toFixed(3), 5, line)
    line += 20
    ctx.fillText('Fy: ' + player.force.y.toFixed(3), 5, line)
    line += 20
    ctx.fillText('yOff: ' + this.yOff.toFixed(1), 5, line)
    line += 20
    ctx.fillText('mass: ' + player.mass.toFixed(1), 5, line)
    line += 20
    ctx.fillText('onGround: ' + this.onGround, 5, line)
    line += 20
    ctx.fillText('crouch: ' + this.crouch, 5, line)
    line += 20
    ctx.fillText('isHeadClear: ' + this.isHeadClear, 5, line)
    line += 20
    ctx.fillText('HeadIsSensor: ' + headSensor.isSensor, 5, line)
    line += 20
    ctx.fillText('frictionAir: ' + player.frictionAir.toFixed(3), 5, line)
    line += 20
    ctx.fillText('stepSize: ' + this.stepSize.toFixed(2), 5, line)
    line += 20
    ctx.fillText('zoom: ' + game.zoom.toFixed(4), 5, line)
    line += 20
    ctx.fillText('on body id: ' + this.onBody, 5, line)
  }
}
const mech = new mechProto()

//bullets**************************************************************
//*********************************************************************
//*********************************************************************
//*********************************************************************

const bullet = []
//mouse click events
window.onmousedown = function (e) {
  game.mouseDown = true
}
window.onmouseup = function (e) {
  game.mouseDown = false
}

function fireBullet(type) {
  const len = bullet.length
  //bullet[len] = Bodies.polygon(e.x - mech.transX, e.y- mech.transY, 5, 5);
  const dist = 15 //radial distance mech head
  const dir = (Math.random() - 0.5) * 0.1 + mech.angle
  //spawn as a rectangle
  bullet[len] = Bodies.rectangle(
    mech.x + dist * Math.cos(mech.angle),
    mech.y + dist * Math.sin(mech.angle),
    10,
    3,
    {
      angle: dir,
      //density: 0.001,
      //friction: 0.05,
      frictionAir: 0,
      //frictionStatic: 0.2,
      restitution: 0.25,
      //sleepThreshold: 30, //bullets despawn on sleep after __ cycles
      collisionFilter: {
        group: -2 //can't collide with player (at first)
      }
    }
  )
  //fire polygons
  // bullet[len] = Bodies.polygon(mech.x + dist*Math.cos(mech.angle), mech.y + dist*Math.sin(mech.angle),5, 5,{
  //   angle: Math.random(),
  //   collisionFilter: {group: -2 }
  //   );
  //fire circles
  //bullet[len] = Bodies.circle(mech.x + dist*Math.cos(mech.angle), mech.y + dist*Math.sin(mech.angle), 3,{ restitution: 0.5, sleepThreshold: 15, collisionFilter: { group: -2 }});
  bullet[len].birthCycle = game.cycle
  bullet[len].blankfunc = function () {
    //blank functino for later
  }
  //bullet velocity in direction of player plus player velocity
  // Matter.Body.setVelocity(bullet[len], {
  //   x: mech.Vx + vel * Math.cos(dir),
  //   y: mech.Vy + vel * Math.sin(dir)
  // });
  Matter.Body.setVelocity(bullet[len], {
    x: mech.Vx,
    y: mech.Vy
  })
  //add force to fire bullets
  const vel = 0.0025
  const f = {
    x: (vel * Math.cos(dir)) / game.delta,
    y: (vel * Math.sin(dir)) / game.delta
  }
  bullet[len].force = f
  //equal but opposite force on player
  player.force.x -= f.x
  player.force.y -= f.y

  World.add(engine.world, bullet[len]) //add bullet to world
}

let fireBulletCD = 0
function bulletLoop() {
  //fire check
  //if (game.mouseDown && !(game.cycle % 2) && !game.isPaused) {
  if (game.mouseDown && fireBulletCD < game.cycle && !game.isPaused) {
    fireBulletCD = game.cycle + 5
    fireBullet()
  }
  //all bullet loop
  let i = bullet.length
  while (i--) {
    //soon after spawn bullets can collide with player
    //this may need to be removed
    if (bullet[i].birthCycle + 5 < game.cycle) {
      bullet[i].collisionFilter.group = 1
    }
    //bullets despawn if the sleep or if they fall down or after some cycles
    //if (bullet[i].isSleeping || bullet[i].birthCycle + 360 < game.cycle) {
    if (bullet[i].birthCycle + 200 < game.cycle && !game.isPaused) {
      Matter.World.remove(engine.world, bullet[i])
      bullet.splice(i, 1)
    }
  }
}

//matter.js ***********************************************************
//*********************************************************************
//*********************************************************************
//*********************************************************************
//*********************************************************************

// module aliases
const Engine = Matter.Engine,
  World = Matter.World,
  Events = Matter.Events,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Constraint = Matter.Constraint,
  Vertices = Matter.Vertices,
  Query = Matter.Query,
  Body = Matter.Body,
  Bodies = Matter.Bodies

// create an engine
const engine = Engine.create()
//engine.enableSleeping = true;  //might want to turn this off to improve accuracy

//define player *************************************************************
//***************************************************************************
//player as a series of vertices
let vector = Vertices.fromPath('0 40  0 115  20 130  30 130  50 115  50 40')
const playerBody = Matter.Bodies.fromVertices(0, 0, vector)
//this sensor check if the player is on the ground to enable jumping
var jumpSensor = Bodies.rectangle(0, 46, 40, 20, {
  sleepThreshold: 99999999999,
  isSensor: true
})
//this part of the player lowers on crouch
vector = Vertices.fromPath('0 -66 18 -82  0 -37 50 -37 50 -66 32 -82')
const playerHead = Matter.Bodies.fromVertices(0, -55, vector)
//a part of player that senses if the player's head is empty and can return after crouching
const headSensor = Bodies.rectangle(0, -57, 48, 45, {
  sleepThreshold: 99999999999,
  isSensor: true
})

const player = Body.create({
  //combine jumpSensor and playerBody
  parts: [playerBody, playerHead, jumpSensor, headSensor],
  inertia: Infinity, //prevents player rotation
  friction: 0.002,
  //frictionStatic: 0.5,
  restitution: 0.3,
  sleepThreshold: Infinity,
  collisionFilter: {
    group: -2
  }
})
Matter.Body.setPosition(player, mech.spawnPos)
Matter.Body.setVelocity(player, mech.spawnVel)
Matter.Body.setMass(player, mech.mass)
World.add(engine.world, [player])
//holding body constraint
const holdConstraint = Constraint.create({
  pointA: {
    x: 0,
    y: 0
  },
  //setting constaint to jump sensor because it has to be on something until the player picks up things
  bodyB: jumpSensor,
  stiffness: 0.4
})

World.add(engine.world, holdConstraint)

//spawn bodies  *************************************************************
//***************************************************************************
//arrays that hold all the elements that are drawn by the renderer
const body = [] //non static bodies
const map = [] //all static bodies
const cons = [] //all constaints between a point and a body
const consBB = [] //all constaints between two bodies

spawn()

function spawn() {
  //spawns bodies and map elements
  function BodyRect(x, y, width, height, properties) {
    //speeds up adding reactangles to map array
    body[body.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties)
  }
  //premade property options
  //Object.assign({}, propsHeavy, propsBouncy, propsNoRotation)      //will combine properties into a new object
  const propsBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1
  }
  const propsOverBouncy = {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 1.05
  }
  const propsHeavy = {
    density: 0.01 //default density 0.001
  }
  const propsNoRotation = {
    inertia: Infinity //prevents player rotation
  }

  function constraintPB(x, y, bodyIndex, stiffness) {
    cons[cons.length] = Constraint.create({
      pointA: {
        x: x,
        y: y
      },
      bodyB: body[bodyIndex],
      stiffness: stiffness
    })
  }

  function constraintBB(bodyIndexA, bodyIndexB, stiffness) {
    consBB[consBB.length] = Constraint.create({
      bodyA: body[bodyIndexA],
      bodyB: body[bodyIndexB],
      stiffness: stiffness
    })
  }

  BodyRect(1475, 0, 100, 800) //huge tall vertical box
  BodyRect(800, 438, 250, 10) //long skinny box

  for (let i = 0; i < 10; i++) {
    //random bouncy circles
    body[body.length] = Bodies.circle(
      -800 + (0.5 - Math.random()) * 200,
      600 + (0.5 - Math.random()) * 200,
      7 + Math.ceil(Math.random() * 30),
      {
        restitution: 0.8
      }
    )
  }

  for (let i = 0; i < 10; i++) {
    //stack of medium hexagons
    body[body.length] = Bodies.polygon(-400, 30 - i * 70, 6, 40, {
      angle: Math.PI / 2
    })
  }

  for (let i = 0; i < 5; i++) {
    //stairs of boxes taller on left
    for (let j = 0; j < 5 - i; j++) {
      const r = 40
      body[body.length] = Bodies.rectangle(50 + r / 2 + i * r, 900 - r / 2 - i * r, r, r, {
        restitution: 0.8
      })
    }
  }
  for (let i = 0; i < 10; i++) {
    //stairs of boxes taller on right
    for (let j = 0; j < i; j++) {
      const r = 120
      body[body.length] = Bodies.rectangle(2639 + r / 2 + i * r, 900 + r - i * r, r, r, {
        restitution: 0.6,
        friction: 0.3,
        frictionStatic: 0.9
      })
    }
  }
  for (let i = 0; i < 12; i++) {
    //a stack of boxes
    body[body.length] = Bodies.rectangle(936, 700 + i * 21, 25, 21)
  }
  for (let i = 0; i < 12; i++) {
    //a stack of boxes
    body[body.length] = Bodies.rectangle(464, 700 + i * 21, 25, 21)
  }

  ;(function newtonsCradle() {
    //build a newton's cradle
    const x = -600
    const r = 20
    const y = 200
    for (let i = 0; i < 5; i++) {
      body[body.length] = Bodies.circle(
        x + i * r * 2,
        490,
        r,
        Object.assign({}, propsHeavy, propsOverBouncy, propsNoRotation)
      )
      constraintPB(x + i * r * 2, 200, body.length - 1, 0.9)
    }
    body[body.length - 1].force.x = 0.02 * body[body.length - 1].mass //give the last one a kick
  })()
  // body[body.length] = Bodies.circle(0, 570, 20)
  // body[body.length] = Bodies.circle(30, 570, 20)
  // body[body.length] = Bodies.circle(0, 600, 20)
  // constraintBB(body.length - 2, body.length - 3, 0.2)
  // constraintBB(body.length - 2, body.length - 1, 0.2)

  //map statics  **************************************************************
  //***************************************************************************
  function mapRect(x, y, width, height, properties) {
    //addes reactangles to map array
    map[map.length] = Bodies.rectangle(x + width / 2, y + height / 2, width, height, properties)
  }

  function mapVertex(x, y, vector, properties) {
    //addes reactangles to map array
    map[map.length] = Matter.Bodies.fromVertices(x, y, Vertices.fromPath(vector), properties)
  }
  //mapVertex(-1700, 700, '0 0 0 -500 500 -500 1000 -400 1500 0'); //large ramp
  //mapVertex(1285, 867, '200 0  200 100 0 100'); // ramp
  mapVertex(1400, 854, '0 100 600 100 600 0 150 0') // ramp
  mapVertex(-1300, 670, '0 0 -500 0 -500 200') //angeled ceiling
  //mapVertex(-1650, 700, '0 0 500 0 500 200'); //angeled ceiling
  //mapRect(1350, 800, 300, 100) //ground
  mapRect(650, 890, 50, 10) //ground bump
  mapRect(-600, 0, 400, 200) //left cave
  mapRect(-600, 600, 400, 194) //left cave
  mapRect(-50, 700, 100, 200) //left wall
  mapRect(0, 100, 300, 25) //left high platform
  mapRect(550, 450, 300, 25) //wide platform
  mapRect(650, 250, 100, 25) //wide platform
  mapRect(1000, 450, 400, 25) //platform
  mapRect(1200, 250, 200, 25) //platform
  mapRect(1300, 50, 100, 25) //platform
  mapRect(-350, 885, 20, 20) //ground bump

  map[map.length] = Bodies.rectangle(700, 650, 500, 30) //platform 1
  map[map.length] = Bodies.rectangle(0, 1000, 4000, 200) //ground
  map[map.length] = Bodies.rectangle(4600, 1000, 4000, 200) //far right ground

  //add arrays to the world******************************************************
  //*****************************************************************************
  for (let i = 0; i < body.length; i++) {
    body[i].collisionFilter.group = 1
    World.add(engine.world, body[i]) //add to world
  }
  for (let i = 0; i < map.length; i++) {
    map[i].collisionFilter.group = -1
    Matter.Body.setStatic(map[i], true) //make static
    World.add(engine.world, map[i]) //add to world
  }
  for (let i = 0; i < cons.length; i++) {
    World.add(engine.world, cons[i])
  }
  for (let i = 0; i < consBB.length; i++) {
    World.add(engine.world, consBB[i])
  }
}

// matter events *********************************************************
//************************************************************************
//************************************************************************
//************************************************************************

function playerOnGroundCheck(event) {
  //runs on collisions events
  function enter() {
    mech.numTouching++
    if (!mech.onGround) mech.enterLand()
  }
  const pairs = event.pairs
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i]
    if (pair.bodyA === jumpSensor) {
      mech.onBody = pair.bodyB.id
      enter()
    } else if (pair.bodyB === jumpSensor) {
      enter()
      mech.onBody = pair.bodyA.id
    }
  }
}

function playerOffGroundCheck(event) {
  //runs on collisions events
  function enter() {
    if (mech.onGround && mech.numTouching === 0) mech.enterAir()
  }
  const pairs = event.pairs
  for (let i = 0, j = pairs.length; i != j; ++i) {
    let pair = pairs[i]
    if (pair.bodyA === jumpSensor) {
      enter()
    } else if (pair.bodyB === jumpSensor) {
      enter()
    }
  }
}

function playerHeadCheck(event) {
  //runs on collisions events
  if (mech.crouch) {
    mech.isHeadClear = true
    const pairs = event.pairs
    for (let i = 0, j = pairs.length; i != j; ++i) {
      let pair = pairs[i]
      if (pair.bodyA === headSensor) {
        mech.isHeadClear = false
      } else if (pair.bodyB === headSensor) {
        mech.isHeadClear = false
      }
    }
  }
}
Events.on(engine, 'beforeUpdate', function (event) {
  mech.numTouching = 0
})

//determine if player is on the ground
Events.on(engine, 'collisionStart', function (event) {
  playerOnGroundCheck(event)
  playerHeadCheck(event)
})
Events.on(engine, 'collisionActive', function (event) {
  playerOnGroundCheck(event)
  playerHeadCheck(event)
})
Events.on(engine, 'collisionEnd', function (event) {
  playerOffGroundCheck(event)
})

// render ***********************************************************
//*******************************************************************
//*******************************************************************
//*******************************************************************

function drawMatterWireFrames() {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#999'
  const bodies = Composite.allBodies(engine.world)
  ctx.beginPath()
  for (let i = 0; i < bodies.length; i += 1) {
    ctx.fillText(bodies[i].id, bodies[i].position.x, bodies[i].position.y)
    let vertices = bodies[i].vertices
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y)
    }
    ctx.lineTo(vertices[0].x, vertices[0].y)
  }
  ctx.lineWidth = 1
  ctx.strokeStyle = '#000'
  ctx.stroke()
}

function drawMap() {
  //draw map
  ctx.beginPath()
  for (let i = 0; i < map.length; i += 1) {
    let vertices = map[i].vertices
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y)
    }
    ctx.lineTo(vertices[0].x, vertices[0].y)
  }
  ctx.fillStyle = '#444'
  ctx.fill()
}

function drawBody() {
  //draw body
  ctx.beginPath()
  for (let i = 0; i < body.length; i += 1) {
    let vertices = body[i].vertices
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y)
    }
    ctx.lineTo(vertices[0].x, vertices[0].y)
  }
  ctx.lineWidth = 1.5
  ctx.fillStyle = '#777'
  ctx.fill()
  ctx.strokeStyle = '#222'
  ctx.stroke()
}

function drawBullet() {
  //draw body
  ctx.beginPath()
  for (let i = 0; i < bullet.length; i += 1) {
    let vertices = bullet[i].vertices
    ctx.moveTo(vertices[0].x, vertices[0].y)
    for (let j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y)
    }
    ctx.lineTo(vertices[0].x, vertices[0].y)
  }
  ctx.fillStyle = '#f34'
  //ctx.fillStyle = '#0cc';
  ctx.fill()
}

function drawCons() {
  //draw body
  ctx.beginPath()
  for (let i = 0; i < cons.length; i += 1) {
    ctx.moveTo(cons[i].pointA.x, cons[i].pointA.y)
    ctx.lineTo(cons[i].bodyB.position.x, cons[i].bodyB.position.y)
  }
  ctx.lineWidth = 1
  ctx.strokeStyle = '#999'
  ctx.stroke()
}

function drawPlayerBodyTesting() {
  //shows the different parts of the player body for testing
  //jump
  ctx.beginPath()
  let bodyDraw = jumpSensor.vertices
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y)
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y)
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y)
  ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.stroke()
  //main body
  ctx.beginPath()
  bodyDraw = playerBody.vertices
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y)
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y)
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y)
  ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'
  ctx.fill()
  ctx.stroke()
  //head
  ctx.beginPath()
  bodyDraw = playerHead.vertices
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y)
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y)
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y)
  ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'
  ctx.fill()
  ctx.stroke()
  //head sensor
  ctx.beginPath()
  bodyDraw = headSensor.vertices
  ctx.moveTo(bodyDraw[0].x, bodyDraw[0].y)
  for (let j = 1; j < bodyDraw.length; j += 1) {
    ctx.lineTo(bodyDraw[j].x, bodyDraw[j].y)
  }
  ctx.lineTo(bodyDraw[0].x, bodyDraw[0].y)
  ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'
  ctx.fill()
  ctx.stroke()
}

//main loop ************************************************************
//**********************************************************************
//**********************************************************************
//**********************************************************************

function cycle() {
  stats.begin()
  game.timing()
  game.wipe()
  mech.keyMove()
  mech.keyHold()
  game.keyZoom()
  game.gravityFlip()
  game.pause()
  if (game.testing) {
    mech.testingMoveLook()
    mech.deathCheck()
    bulletLoop()
    ctx.save()
    game.scaleZoom()
    ctx.translate(mech.transX, mech.transY)
    mech.draw()
    drawMatterWireFrames()
    drawPlayerBodyTesting()
    ctx.restore()
    mech.info()
  } else {
    mech.move()
    mech.deathCheck()
    bulletLoop()
    mech.look()
    game.wipe()
    ctx.save()
    game.scaleZoom()
    ctx.translate(mech.transX, mech.transY)
    ctx.drawImage(background_img, -600, -400)
    drawCons()
    drawBody()
    mech.draw()
    ctx.drawImage(foreground_img, -700, -1500)
    drawMap()
    drawBullet()
    ctx.restore()
  }
  //svg graphics , just here until I convert svg to png in inkscape
  /*   document.getElementById('background').setAttribute('transform',
                                                     'translate(' + (canvas.width/2) + ',' + (canvas.height/2) + ')'
                                                     + 'scale(' + game.zoom + ')'
                                                     + 'translate(' + (mech.transX - canvas.width/2) + ',' + (mech.transY - canvas.height/2) + ')'); */
  // document.getElementById('foreground').setAttribute('transform',
  //                                                    'translate(' + (canvas.width/2) + ',' + (canvas.height/2) + ')'
  //                                                    + 'scale(' + game.zoom + ')'
  //                                                    + 'translate(' + (mech.transX - canvas.width/2) + ',' + (mech.transY - canvas.height/2) + ')');

  stats.end()
  requestAnimationFrame(cycle)
}

const bmo_img = new Image() // Create new img element
bmo_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/Bmo.png' // Set source path

const foreground_img = new Image() // Create new img element
foreground_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/circle3390.png' // Set source path

const background_img = new Image() // Create new img element
background_img.src = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/464612/background.png' // Set source path

function runPlatformer(el) {
  el.onclick = null //removes the onclick effect so the function only runs once
  el.style.display = 'none' //hides the element that spawned the function
  document.getElementById('keysright').innerHTML = ''
  document.getElementById('keysleft').innerHTML = ''
  document.body.appendChild(stats.dom) //show stats.js FPS tracker
  Engine.run(engine) //starts game engine
  console.clear() //gets rid of annoying console message about vertecies not working
  open()
  requestAnimationFrame(cycle) //starts game loop
}

function open() {
  const introCycles = 200
  game.zoom = game.cycle / introCycles
  if (game.cycle < introCycles) {
    requestAnimationFrame(open)
  } else {
    ctx.restore()
  }
}
