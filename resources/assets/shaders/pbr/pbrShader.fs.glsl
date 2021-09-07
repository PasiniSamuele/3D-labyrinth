# version 300 es
precision mediump float;

//from vs
in vec2 fragTexCoord;
in vec3 fragVertPosition;
in vec3 fragNormal;

// IBL
uniform vec3 ambientLightDay;
uniform vec3 ambientLightNight;
uniform float radians_over_time;


//pbr textures
uniform sampler2D albedoMap;
uniform sampler2D normalMap;
uniform sampler2D metallicMap;
uniform sampler2D roughnessMap;
uniform sampler2D aoMap;

//flashlight
uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 lightDir;
uniform float cutOff;	
uniform float outerCutOff;
uniform float constDecay;
uniform float linDecay;
uniform float quadDecay;	

uniform vec3 camPos;

out vec4 outColor;

const float PI = 3.14159265359;

vec3 getNormalFromMap()
{
    vec3 tangentNormal = texture(normalMap, fragTexCoord).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(fragVertPosition);
    vec3 Q2  = dFdy(fragVertPosition);
    vec2 st1 = dFdx(fragTexCoord);
    vec2 st2 = dFdy(fragTexCoord);

    vec3 N   = normalize(fragNormal);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}

float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}

//self shadowing
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

//How much energy is reflecting
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}

vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness)
{
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}  

void main(){

    vec3 albedo     = pow(texture(albedoMap, fragTexCoord).rgb, vec3(2.2));
    vec3 normal     = getNormalFromMap();
    float metallic  = texture(metallicMap, fragTexCoord).r;
    float roughness = texture(roughnessMap, fragTexCoord).r;
    float ao        = texture(aoMap, fragTexCoord).r;

    vec3 N = fragNormal;
    vec3 V = normalize(camPos - fragVertPosition);
    vec3 R = reflect(-V, N); 

    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);


    // reflectance equation
    vec3 Lo = vec3(0.0);

    // calculate per-light radiance
    vec3 L = normalize(lightPosition - fragVertPosition);
    vec3 H = normalize(V + L);
    float theta     = dot(L, normalize(-lightDir));
	float epsilon   = cutOff -outerCutOff;
	float intensity = clamp((theta - outerCutOff) / epsilon, 0.0, 1.0); 
	
    vec3 radiance = lightColor * intensity;
    float d = length(lightPosition - fragVertPosition);
    float attenuation = 1.0 / (constDecay + linDecay * d + quadDecay * (d * d));    

    radiance*=attenuation;

	//vec3 radiance = lightColor;
    // Cook-Torrance BRDF
    float NDFlight = DistributionGGX(N, H, roughness);   
    float Glight    = GeometrySmith(N, V, L, roughness);    
    vec3 Flight     = fresnelSchlick(max(dot(H, V), 0.0), F0);        
    
    vec3 numerator    = NDFlight  * Glight  * Flight ;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.001; // 0.001 to prevent divide by zero.
    vec3 specularLight = numerator / denominator;
    
        // kS is equal to Fresnel
    vec3 kSlight  = Flight ;
    // for energy conservation, the diffuse and specular light can't
    // be above 1.0 (unless the surface emits light); to preserve this
    // relationship the diffuse component (kD) should equal 1.0 - kS.
    vec3 kDlight  = vec3(1.0) - kSlight ;
    // multiply kD by the inverse metalness such that only non-metals 
    // have diffuse lighting, or a linear blend if partly metal (pure metals
    // have no diffuse light).
    kDlight  *= 1.0 - metallic;	                
        
    // scale light by NdotL
    float NdotL = max(dot(N, L), 0.0);        

    // add to outgoing radiance Lo
    Lo += (kDlight  * albedo / PI + specularLight) * radiance * NdotL; // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again

    // ambient lighting (we now use IBL as the ambient term)
    vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
    
    vec3 kS = F;
    vec3 kD = 1.0 - kS;
    kD *= 1.0 - metallic;	  
    



    vec3 ambient =  mix(ambientLightNight,ambientLightDay,(cos(radians_over_time)+1.0)/2.0)* albedo * ao;
    
    vec3 color = ambient + Lo;

    // HDR tonemapping
    color = color / (color + vec3(1.0));
    // gamma correct
    color = pow(color, vec3(1.0/2.2)); 

   outColor = vec4(color , 1.0);
    // outColor = vec4(1.0, 0.0, 0.0 , 1.0);
}