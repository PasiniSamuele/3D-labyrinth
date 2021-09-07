# version 300 es
precision mediump float;

in vec4 v_color;

uniform float opacity;

uniform vec3 u_ambientLightDay;
uniform vec3 u_ambientLightNight;
uniform float u_ambientStrengthDay;
uniform float u_ambientStrengthNight;
uniform float radians_over_time;

out vec4 outColor;

void main () {
    //  ambient
    float ambientStrength = mix(u_ambientStrengthDay,u_ambientStrengthNight,(cos(radians_over_time)+1.0)/2.0);
    vec3 ambient = mix(u_ambientLightDay,u_ambientLightNight,(cos(radians_over_time)+1.0)/2.0) * ambientStrength;

    outColor = vec4(ambient, opacity)*v_color;
}