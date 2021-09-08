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


vec3 lambertDiffuse(vec3 L, vec3 nNormal, vec3 lightColor){
    //  lambert diffuse
	float LdotN = clamp(dot(nNormal, L), 0.0, 1.0);

    return lightColor * LdotN;
}

vec3 blinnSpecular(vec3 L, vec3 nNormal, vec3 lightColor, vec3 eyeDir){
    //  blinn specular
    float NLE = dot(normalize(eyeDir + L), nNormal);
    float powN = pow(clamp(NLE, 0.0, 1.0), shininess);

    return lightColor * powN;
}

void main () {
    //  init color
	vec4 v_color = vec4(color, 1.0);
    vec3 directColor = mix(u_directColorNight,u_directColorDay,(cos(radians_over_time)+1.0)/2.0);

    //  initialize direct
    vec3 eyeDir = normalize(v_surfaceToView);
    vec3 L = normalize(-u_directLightDirection);
    vec3 nNormal = normalize(v_normal);

    //  compute direct
    vec3 directDiffuse = lambertDiffuse(L, nNormal, directColor);
    vec3 directSpecular = blinnSpecular(L, nNormal, directColor, eyeDir);

    //  initialize spotlight
    float theta     = dot(eyeDir, normalize(-u_lightDirection));
	float epsilon   = u_cutOff - u_outerCutOff;
	float intensity = clamp((theta - u_outerCutOff) / epsilon, 0.0, 1.0); 
    vec3 radiance = u_lightColor * intensity;

    float d = length(u_lightPosition - v_position);
    float attenuation = 1.0 / (u_constDecay + u_linDecay * d + u_quadDecay * (d * d));
    radiance*=attenuation;

    //  compute spotlight
    vec3 spotDiffuse = lambertDiffuse(L, nNormal, radiance);
    vec3 spotSpecular = blinnSpecular(L, nNormal, radiance, eyeDir);

    //  ambient
    float ambientStrength = mix(u_ambientStrengthDay,u_ambientStrengthNight,(cos(radians_over_time)+1.0)/2.0);
    vec3 f_ambient = mix(u_ambientLightNight,u_ambientLightDay,(cos(radians_over_time)+1.0)/2.0) * ambientStrength;

    //  out color
    vec3 f_specular = specular * (directSpecular + spotSpecular);
    vec3 f_diffuse = diffuse * (directDiffuse + spotDiffuse);
    outColor = vec4(emissive + f_ambient + f_specular + f_diffuse, opacity)* v_color;
}
