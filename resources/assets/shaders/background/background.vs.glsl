#version 300 es
precision mediump float;
#define POSITION_LOCATION 0

layout (location = POSITION_LOCATION) in vec3 aPos;

uniform mat4 perspective;
uniform mat4 view;

out vec3 WorldPos;

/*void main()
{
    WorldPos = aPos;

	mat4 rotView = mat4(mat3(view));
	vec4 clipPos = perspective * rotView * vec4(WorldPos, 1.0);

	gl_Position = clipPos.xyww;
}*/

void main() {
  // Multiply the position by the matrix.
  gl_Position = vec4(aPos,1.0);
 
  // Pass a normal. Since the positions are
  // centered around the origin we can just 
  // pass the position
  WorldPos = aPos;
}