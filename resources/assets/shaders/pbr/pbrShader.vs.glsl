# version 300 es
precision mediump float;

in vec3 vertPosition;
in vec2 texCoord;
in vec3 normal;

out vec2 fragTexCoord;
out vec3 fragVertPosition;
out vec3 fragNormal;

uniform mat4 projMatrix;
uniform mat4 worldMatrix;
uniform mat4 normalMatrix;

void main(){
    fragVertPosition = (worldMatrix*vec4(vertPosition, 1.0)).xyz;
    fragTexCoord = texCoord;
    fragNormal = mat3(normalMatrix)*normal;
    gl_Position = projMatrix * vec4(vertPosition, 1.0);
}