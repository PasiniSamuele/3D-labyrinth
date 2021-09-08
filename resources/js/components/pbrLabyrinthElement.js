/*******************
 * PbrLabyrinthElement.js
 ******************/

/**
 * Object to store a PbrLabyrinthElement
 */
class PbrLabyrinthElement {

	/**
	 * 
	 * @param {*} structure 
	 * @param {*} parent 
	 * @param {*} program 
	 * @param {*} texture 
	 */
	constructor(structure, parent, program, texture) {
		this.program = program;
		this.parent = parent;
		this.structure = structure;
		this.texture = texture;

		this.children = [];
		this.localMatrix = utils.identityMatrix();
		this.worldMatrix = utils.identityMatrix();
		this.projectionMatrix = [];
		this.vao = null;
	}

	/**
	 * Init function
	 */
	init() {
		this.loadLocations();
		this.loadComponent();
		this.loadVAO();
		this.loadTexture();

		this.children.forEach(child => child.init());
	}

	// TODO
	loadLocations() {

	}
	loadComponent() { }
	loadVAO() { }
	loadTexture() {
		this.texture.init();
	}

	updateWorld(matrix) {
		if (matrix) {
			// a matrix was passed in so do the math
			this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
		} else {
			// no matrix was passed in so just copy.
			utils.copy(this.localMatrix, this.worldMatrix);
		}

		// now process all the children
		var worldMatrix = this.worldMatrix;
		this.children.forEach(function (child) {
			child.updateWorldMatrix(worldMatrix);
		});
	}

	draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now) {
		
		// For each [..]
		this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix));
		let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, this.worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
		gl.useProgram(this.program);

		gl.bindVertexArray(this.vao);
		//skybox.bindMaps(this.program);
		gl.uniformMatrix4fv(this.program.projMatrix, gl.FALSE, utils.transposeMatrix(projectionMatrix));
		gl.uniformMatrix4fv(this.program.worldMatrix, gl.FALSE, utils.transposeMatrix(this.worldMatrix));
		gl.activeTexture(this.texture.albedoSlot);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.albedo);
		gl.uniform1i(this.program.albedoMap, utils.getTextureSlotOffset(gl, this.texture.albedoSlot));

		gl.activeTexture(this.texture.normalSlot);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.normal);
		gl.uniform1i(this.program.normalMap, utils.getTextureSlotOffset(gl, this.texture.normalSlot));

		gl.activeTexture(this.texture.metallicSlot);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.metallic);
		gl.uniform1i(this.program.metallicMap, utils.getTextureSlotOffset(gl, this.texture.metallicSlot));

		gl.activeTexture(this.texture.roughnessSlot);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.roughness);
		gl.uniform1i(this.program.roughnessMap, utils.getTextureSlotOffset(gl, this.texture.roughnessSlot));

		gl.activeTexture(this.texture.aoSlot);
		gl.bindTexture(gl.TEXTURE_2D, this.texture.ao);
		gl.uniform1i(this.program.aoMap, utils.getTextureSlotOffset(gl, this.texture.aoSlot));
		gl.uniform3f(this.program.lightPosition, light.position.x, light.position.y, light.position.z);

		if (light.ignition.value)
			gl.uniform3f(this.program.lightColor, light.color.r, light.color.g, light.color.b);
		else
			gl.uniform3f(this.program.lightColor, 0.0, 0.0, 0.0);

		gl.uniform1f(this.program.cutOff, Math.cos(utils.degToRad(light.cutOff)));
		gl.uniform1f(this.program.outerCutOff, Math.cos(utils.degToRad(light.outerCutOff)));
		gl.uniform1f(this.program.radians_over_time, utils.degToRad(now % 360));
		gl.uniform1f(this.program.constDecay, light.constDecay);
		gl.uniform1f(this.program.linDecay, light.linDecay);
		gl.uniform1f(this.program.quadDecay, light.quadDecay);
		gl.uniform1f(this.program.ambientStrengthDay, skybox.textures[0].ambientLight.strength);
		gl.uniform1f(this.program.ambientStrengthNight, skybox.textures[1].ambientLight.strength);
		console.log(skybox);
		gl.uniform3f(this.program.lightDir, light.direction.x, light.direction.y, light.direction.z);
		gl.uniform3f(this.program.directionalLightDir, skybox.lightDir.x, skybox.lightDir.y, skybox.lightDir.z);
		gl.uniform3f(this.program.camPos, camPos.x, camPos.y, camPos.z);
		gl.uniform3f(this.program.ambientLightDay, skybox.textures[0].ambientLight.r, skybox.textures[0].ambientLight.g, skybox.textures[0].ambientLight.b);
		gl.uniform3f(this.program.ambientLightNight, skybox.textures[1].ambientLight.r, skybox.textures[1].ambientLight.g, skybox.textures[1].ambientLight.b);
		gl.uniform3f(this.program.directionalLightDay, skybox.textures[0].directionalLight.r, skybox.textures[0].directionalLight.g, skybox.textures[0].directionalLight.b);
		gl.uniform3f(this.program.directionalLightNight, skybox.textures[1].directionalLight.r, skybox.textures[1].directionalLight.g, skybox.textures[1].directionalLight.b);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}


	loadLocations() {

		//VERTEX

		this.program.texCoord = gl.getAttribLocation(this.program, 'texCoord');
		this.program.normal = gl.getAttribLocation(this.program, 'normal');
		this.program.projMatrix = gl.getUniformLocation(this.program, 'projMatrix');
		this.program.worldMatrix = gl.getUniformLocation(this.program, 'worldMatrix');
		this.program.vertPosition = gl.getAttribLocation(this.program, 'vertPosition');

		//FRAGMENT
		this.program.ambientLightDay = gl.getUniformLocation(this.program, 'ambientLightDay');
		this.program.ambientLightNight = gl.getUniformLocation(this.program, 'ambientLightNight');
		this.program.albedoMap = gl.getUniformLocation(this.program, 'albedoMap');
		this.program.normalMap = gl.getUniformLocation(this.program, 'normalMap');
		this.program.metallicMap = gl.getUniformLocation(this.program, 'metallicMap');
		this.program.roughnessMap = gl.getUniformLocation(this.program, 'roughnessMap');
		this.program.aoMap = gl.getUniformLocation(this.program, 'aoMap');
		this.program.lightPosition = gl.getUniformLocation(this.program, 'lightPosition');
		this.program.lightColor = gl.getUniformLocation(this.program, 'lightColor');
		this.program.cutOff = gl.getUniformLocation(this.program, 'cutOff');
		this.program.outerCutOff = gl.getUniformLocation(this.program, 'outerCutOff');
		this.program.lightDir = gl.getUniformLocation(this.program, 'lightDir');
		this.program.camPos = gl.getUniformLocation(this.program, 'camPos');
		this.program.linDecay = gl.getUniformLocation(this.program, 'linDecay');
		this.program.constDecay = gl.getUniformLocation(this.program, 'constDecay');
		this.program.quadDecay = gl.getUniformLocation(this.program, 'quadDecay');
		this.program.radians_over_time = gl.getUniformLocation(this.program, 'radians_over_time');
		this.program.ambientStrengthDay = gl.getUniformLocation(this.program, 'ambientStrengthDay');
		this.program.ambientStrengthNight = gl.getUniformLocation(this.program, 'ambientStrengthNight');
		this.program.directionalLightDir = gl.getUniformLocation(this.program, 'directionalLightDir');
		this.program.directionalLightDay = gl.getUniformLocation(this.program, 'directionalLightDay');
		this.program.directionalLightNight = gl.getUniformLocation(this.program, 'directionalLightNight');
	}

}