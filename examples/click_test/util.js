function rotateVec(vec, normal, angle) {
    let direction = glm.vec3.create()
    let t1 = glm.vec3.create()
    let t2 = glm.vec3.create()

    glm.vec3.normalize(normal, normal)

    glm.vec3.scale(t1, vec, Math.cos(angle))
    glm.vec3.cross(t2, normal, vec)
    glm.vec3.scale(t2, t2, Math.sin(angle))
    glm.vec3.add(direction, t1, t2)

    return direction
}

function RayIntersectsTriangle(ray, triangle, intersectionPoint) {
    const EPSILON = 0.0000001
    let edge1 = glm.vec3.create()
    let a,f,u,v;
}