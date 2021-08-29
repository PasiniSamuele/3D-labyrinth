# version 300 es
precision mediump float;

in vec3 labVertPosition;
in vec2 labVertTexCoord;

out vec2 fragTexCoord;

uniform mat4 labProjMatrix;

void main(){
    fragTexCoord = labVertTexCoord;
    gl_Position = labProjMatrix * vec4(labVertPosition, 1.0);
}