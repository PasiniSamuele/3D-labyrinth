# version 300 es
precision mediump float;

in vec3 v_normal;
in vec3 v_surfaceToView;
in vec3 v_position;

uniform vec3 color;
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

uniform vec3 u_lightPosition;
uniform vec3 u_lightDirection;
uniform vec3 u_lightColor;
uniform float u_cutOff;
uniform float u_outerCutOff;
uniform float u_linDecay;
uniform float u_constDecay;
uniform float u_quadDecay;

uniform vec3 u_ambientLightDay;
uniform vec3 u_ambientLightNight;
uniform float u_ambientStrengthDay;
uniform float u_ambientStrengthNight;
uniform float radians_over_time;

uniform vec3 u_directLightDirection;
uniform vec3 u_directColorDay;
uniform vec3 u_directColorNight;

out vec4 outColor;

void main () {
    //  color
	vec4 v_color = vec4(color, 1.0);
    vec3 directColor = mix(u_directColorNight,u_directColorDay,(cos(radians_over_time)+1.0)/2.0);

    //  initialize
    vec3 eyeDir = normalize(v_surfaceToView);
    vec3 L = normalize(-u_directLightDirection);
    vec3 nNormal = normalize(v_normal);
    
    //  lambert diffuse
	float LdotN = clamp(dot(nNormal, L), 0.0, 1.0);

    vec3 diffuseComponent = directColor * diffuse * LdotN;

    //  blinn specular
    float NLE = dot(normalize(eyeDir + L), nNormal);
    float powN = pow(clamp(NLE, 0.0, 1.0), shininess);

    vec3 specularComponent = directColor * specular * powN;

    //  ambient
    float ambientStrength = mix(u_ambientStrengthNight,u_ambientStrengthDay,(cos(radians_over_time)+1.0)/2.0);
    vec3 ambient = mix(u_ambientLightNight,u_ambientLightDay,(cos(radians_over_time)+1.0)/2.0) * ambientStrength;

    //  out color
    outColor = vec4(clamp(emissive + ambient + diffuseComponent + specularComponent, 0.0, 1.0), opacity)*v_color;
}
