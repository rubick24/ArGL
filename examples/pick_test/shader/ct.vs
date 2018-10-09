#version 300 es

layout (location = 0) in vec3 a_position;
layout (location = 1) in vec2 a_texCoord;
layout (location = 2) in vec3 a_normal;

out vec2 TexCoords;
out vec3 WorldPos;
out vec3 Normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {
    TexCoords = a_texCoord;
    WorldPos = vec3(u_model * vec4(a_position, 1.0));
    Normal = mat3(u_model) * a_normal;
    gl_Position =  u_projection * u_view * vec4(WorldPos, 1.0);
}
