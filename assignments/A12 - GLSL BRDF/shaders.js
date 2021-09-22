function shaders() {

// The shader can find the required informations in the following variables:
	//vec3 fs_pos;			// Position of the point in 3D space
	
	//float SpecShine;		// specular coefficient for both Blinn and Phong
	//float DToonTh;		// Threshold for diffuse in a toon shader
	//float SToonTh;		// Threshold for specular in a toon shader
	
	//vec4 diffColor;		// diffuse color
	//vec4 ambColor;		// material ambient color
	//vec4 specularColor;	// specular color
	//vec4 emit;			// emitted color
	
	//vec3 normalVec;		// direction of the normal vecotr to the surface
	//vec3 eyedirVec;		// looking direction

// Lighr directions can be found into:
	//vec3 lightDirA;
	//vec3 lightDirB;
	//vec3 lightDirC;

// and intensity is returned into:
	//vec4 lightColorA;
	//vec4 lightColorB;
	//vec4 lightColorC;

// Ambient light contribution can be found intop
	// vec4 ambientLight;

// Lambert diffuse and Ambient material. No specular or emisssion.
var S1 = `
	vec4 LAcontr = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LBcontr = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LCcontr = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;

	out_color = clamp(diffColor * (LAcontr + LBcontr + LCcontr) + ambientLight * ambColor, 0.0, 1.0);
`;

// Lambert diffuse and Blinn specular. No ambient and emission.
var S2 = `
	vec4 LAcontr = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LBcontr = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LCcontr = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;
	
	vec4 f_specular	=	(lightColorA * specularColor) * pow(clamp(dot(normalVec, normalize(lightDirA + eyedirVec)), 0.0, 1.0), SpecShine) + 
						(lightColorB * specularColor) * pow(clamp(dot(normalVec, normalize(lightDirB + eyedirVec)), 0.0, 1.0), SpecShine) + 
						(lightColorC * specularColor) * pow(clamp(dot(normalVec, normalize(lightDirC + eyedirVec)), 0.0, 1.0), SpecShine);

	out_color = clamp(diffColor * (LAcontr + LBcontr + LCcontr) + f_specular, 0.0, 1.0);
`;

// Ambient and Phong specular. No emssion and no diffuse.
var S3 = `
	vec3 rA = -reflect(lightDirA, normalVec);
	vec3 rB = -reflect(lightDirB, normalVec);
	vec3 rC = -reflect(lightDirC, normalVec);
	
	vec4 f_specular =	(lightColorA * specularColor) * pow(clamp(dot(eyedirVec, rA), 0.0, 1.0), SpecShine) +
						(lightColorB * specularColor) * pow(clamp(dot(eyedirVec, rB), 0.0, 1.0), SpecShine) +
						(lightColorC * specularColor) * pow(clamp(dot(eyedirVec, rC), 0.0, 1.0), SpecShine);

	out_color = clamp(f_specular + ambientLight * ambColor, 0.0, 1.0);
`;

// Diffuse, ambient, emission and Phong specular.
var S4 = `
	vec4 LAcontr = clamp(dot(lightDirA, normalVec),0.0,1.0) * lightColorA;
	vec4 LBcontr = clamp(dot(lightDirB, normalVec),0.0,1.0) * lightColorB;
	vec4 LCcontr = clamp(dot(lightDirC, normalVec),0.0,1.0) * lightColorC;
	
	vec3 rA = -reflect(lightDirA, normalVec);
	vec3 rB = -reflect(lightDirB, normalVec);
	vec3 rC = -reflect(lightDirC, normalVec);
	
	vec4 f_specular =	(lightColorA * specularColor) * pow(clamp(dot(eyedirVec, rA), 0.0, 1.0), SpecShine) +
						(lightColorB * specularColor) * pow(clamp(dot(eyedirVec, rB), 0.0, 1.0), SpecShine) +
						(lightColorC * specularColor) * pow(clamp(dot(eyedirVec, rC), 0.0, 1.0), SpecShine);

	out_color = clamp(diffColor * (LAcontr + LBcontr + LCcontr) + f_specular + ambientLight * ambColor + emit, 0.0, 1.0);
`;

// Ambient, Toon diffuse and and Toon (Blinn based) specular. No emssion.
var S5 = `
	vec4 f_diffuse	=	max(0.0, sign(dot(normalVec, lightDirA) - DToonTh)) * (lightColorA * diffColor) +
						max(0.0, sign(dot(normalVec, lightDirB) - DToonTh)) * (lightColorB * diffColor) +
						max(0.0, sign(dot(normalVec, lightDirC) - DToonTh)) * (lightColorC * diffColor);
	
	vec4 f_specular	=	max(0.0, sign(dot(normalVec, normalize(lightDirA + eyedirVec)) - SToonTh)) * (lightColorA * specularColor) + 
						max(0.0, sign(dot(normalVec, normalize(lightDirB + eyedirVec)) - SToonTh)) * (lightColorB * specularColor) + 
						max(0.0, sign(dot(normalVec, normalize(lightDirC + eyedirVec)) - SToonTh)) * (lightColorC * specularColor);
	
	out_color = clamp(f_diffuse + f_specular + ambientLight * ambColor, 0.0, 1.0);
`;

	return [S1, S2, S3, S4, S5];
}

