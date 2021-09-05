#version 300 es
precision mediump float;

layout (location = 0) in vec3 aPos;

out vec3 WorldPos;

uniform mat4 perspective;
uniform mat4 view;

void main()
{
    WorldPos = aPos;  
    gl_Position =  perspective * view * vec4(WorldPos, 1.0);
}