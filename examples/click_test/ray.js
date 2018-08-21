import * as glm from 'gl-matrix'

function Ray(position, direction) {
  this.position = position
  this.direction = direction
  return this
}

Ray.prototype.intersectsTriangle = function (triangle) {
  const EPSILON = 0.0000001
  let edge1 = glm.vec3.create()
  let edge2 = glm.vec3.create()
  let h = glm.vec3.create()
  let s = glm.vec3.create()
  let q = glm.vec3.create()
  let a, f, u, v, t
  let temp = glm.vec3.create()

  glm.vec3.sub(edge1, triangle[1], triangle[0])
  glm.vec3.sub(edge2, triangle[2], triangle[0])
  glm.vec3.cross(h, this.direction, edge2)
  a = glm.vec3.dot(edge1, h)
  if (a > -EPSILON && a < EPSILON)
    return false
  f = 1/a
  glm.vec3.sub(s, this.position, triangle[0])
  u = f * glm.vec3.dot(s, h)
  if (u < 0.0 || u > 1.0)
    return false
  glm.vec3.cross(q, s, edge1)
  v = f * glm.vec3.dot(this.direction, q)
  if (v < 0.0 || u + v > 1.0)
      return false
  // At this stage we can compute t to find out where the intersection point is on the line.
  t = f * glm.vec3.dot(edge2, q)
  if (t > EPSILON) // ray intersection
  {
      let IntersectionPoint = glm.vec3.create()
      glm.vec3.scale(temp, this.direction, t)
      glm.vec3.add(IntersectionPoint, this.position, this.direction )
      return true
  }
  else // This means that there is a line intersection but not a ray intersection.
      return false
}

export default Ray
