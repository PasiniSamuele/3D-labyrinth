# version 300 es
precision mediump float;

in vec3 labVertPosition;
in vec3 labVertColor;

out vec3 fragColor;

uniform mat4 labProjMatrix;

void main(){
    fragColor = labVertColor;
    gl_Position = labProjMatrix * vec4(labVertPosition, 1.0);
}