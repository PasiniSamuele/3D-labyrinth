# version 300 es
precision mediump float;

in vec3 vertPosition;
in vec3 vertColor;

out vec3 fragColor;

uniform mat4 projMatrix;

void main(){
    fragColor = vertColor;
    gl_Position = projMatrix * vec4(vertPosition, 1.0);
}