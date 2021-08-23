attribute vec4 env_a_position;
attribute vec3 env_a_normal;

uniform mat4 env_u_projection;
uniform mat4 env_u_view;
uniform mat4 env_u_world;

varying vec3 env_v_worldPosition;
varying vec3 env_v_worldNormal;

void main() {
  // Multiply the position by the matrix.
  gl_Position = env_u_projection * env_u_view * env_u_world * env_a_position;

  // send the view position to the fragment shader
  env_v_worldPosition = (env_u_world * env_a_position).xyz;

  // orient the normals and pass to the fragment shader
  env_v_worldNormal = mat3(env_u_world) * env_a_normal;
}
