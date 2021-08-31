# version 300 es
precision mediump float;

in vec3 chVertPosition;
in vec2 chTexCoord;
in vec3 chNormal;

out vec2 fragTexCoord;
out vec3 fragNormal;

uniform mat4 chProjMatrix;
uniform mat4 chWorldMatrix;

void main(){
	fragTexCoord = chTexCoord;
	fragNormal = (chWorldMatrix*vec4(chNormal, 1.0)).xyz;
	gl_Position = chProjMatrix * vec4(chVertPosition, 1.0);
}