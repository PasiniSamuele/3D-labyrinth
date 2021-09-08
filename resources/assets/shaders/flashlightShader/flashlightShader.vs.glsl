# version 300 es
precision highp float;

in vec3 a_position;
in vec3 a_normal;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_world;
uniform vec3 u_viewWorldPosition;

out vec3 v_position;
out vec3 v_normal;
out vec3 v_surfaceToView;
out vec4 v_color;

void main() {
    v_position = (u_world*vec4(a_position, 1.0)).xyz;
    gl_Position = u_projection * vec4(a_position, 1.0);
    v_surfaceToView = u_viewWorldPosition - v_position;
    v_normal = (u_world*vec4(a_normal, 1.0)).xyz;
    v_color = a_color;

}