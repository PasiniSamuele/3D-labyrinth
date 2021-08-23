precision highp float;

// Passed in from the vertex shader.
varying vec3 env_v_worldPosition;
varying vec3 env_v_worldNormal;

// The texture.
uniform samplerCube env_u_texture;

// The position of the camera
uniform vec3 env_u_worldCameraPosition;

void main() {
  vec3 worldNormal = normalize(env_v_worldNormal);
  vec3 eyeToSurfaceDir = normalize(env_v_worldPosition - env_u_worldCameraPosition);
  vec3 direction = reflect(eyeToSurfaceDir,worldNormal);

  gl_FragColor = textureCube(env_u_texture, direction);
}
