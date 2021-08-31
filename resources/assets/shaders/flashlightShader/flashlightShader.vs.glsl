# version 300 es
precision mediump float;

in vec3 chVertPosition;
in vec2 chTexCoord;
in vec3 chNormal;

uniform mat4 chProjMatrix;
uniform mat4 chWorldMatrix;

void main(){
	gl_Position = chProjMatrix * vec4(chVertPosition, 1.0);
}