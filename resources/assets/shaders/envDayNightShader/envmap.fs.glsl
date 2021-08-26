#version 300 es

precision mediump float;

in vec3 sampleDir;
 
uniform samplerCube env_u_day_texture;
uniform samplerCube env_u_night_texture;
uniform mat4 env_inverseViewProjMatrix;

uniform float radians_over_time;

out vec4 outColor;
 
void main() {
    vec4 p = env_inverseViewProjMatrix*vec4(sampleDir, 1.0);
    
    vec4 rgbaDay = texture(env_u_day_texture, normalize(p.xyz / p.w));
    vec4 day = vec4(rgbaDay.rgb, 1.0);

    vec4 rgbaNight = texture(env_u_night_texture, normalize(p.xyz / p.w));
    vec4 night = vec4(rgbaNight.rgb, 1.0);
    
    outColor = mix(day,night,(cos(radians_over_time)+1.0)/2.0);
}
