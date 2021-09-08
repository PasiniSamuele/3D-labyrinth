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

out vec4 outColor;

void main () {
    vec4 v_color = vec4(color, 1.0);
    //  spotlight cone
    vec3 L = normalize(u_lightPosition - v_position);

    float theta     = dot(L, normalize(-u_lightDirection));
	float epsilon   = u_cutOff - u_outerCutOff;
	float intensity = clamp((theta - u_outerCutOff) / epsilon, 0.0, 1.0); 
	
    vec3 radiance = u_lightColor * intensity;
    float d = length(u_lightPosition - v_position);
    float attenuation = 1.0 / (u_constDecay + u_linDecay * d + u_quadDecay * (d * d));    

    radiance*=attenuation;

    //  lambert diffuse + blinn specular
    vec3 normal = normalize(v_normal);

    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(normalize(u_lightDirection) + surfaceToViewDirection);

    //float fakeLight = clamp(dot(normalize(u_lightDirection), normal), 0.0, 1.0);
    float specularLight = clamp(dot(normal, halfVector), 0.0, 1.0);

    //vec3 effectiveDiffuse = diffuse * v_color.rgb;
    float effectiveOpacity = opacity * v_color.a;
    
    //  ambient
    float ambientStrength = mix(u_ambientStrengthDay,u_ambientStrengthNight,(cos(radians_over_time)+1.0)/2.0);
    vec3 ambient = mix(u_ambientLightDay,u_ambientLightNight,(cos(radians_over_time)+1.0)/2.0) * ambientStrength;

    outColor = vec4(
        emissive +
        ambient +
        radiance*
        //(effectiveDiffuse * fakeLight),
        (specular * pow(specularLight, shininess)),
        effectiveOpacity)*
        v_color;

    //outColor = vec4(emissive + ambient, effectiveOpacity)*v_color;
}
