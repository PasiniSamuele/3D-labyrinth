#version 300 es
precision mediump float;
out vec4 outColor;
in vec3 WorldPos;

uniform mat4 inverseViewProjMatrix;



uniform samplerCube environmentMap;

/*void main()
{		
    vec3 envColor = textureLod(environmentMap, WorldPos, 0.0).rgb;
    
    // HDR tonemap and gamma correct
    envColor = envColor / (envColor + vec3(1.0));
    envColor = pow(envColor, vec3(1.0/2.2)); 
    
    outColor = vec4(1.0,0.0,0.0 , 1.0);
}*/
void main() {
    vec4 p = inverseViewProjMatrix*vec4(WorldPos, 1.0);


    vec4 rgba = texture(environmentMap, normalize(p.xyz / p.w));
    
    outColor = vec4(1.0,1.0,1.0, 1.0);
}