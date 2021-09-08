/*******************
 * LabyrinthModel.js
 ******************/

/**
 * Object that extends LabyrinthElement
 */
class LabyrinthModel extends PbrLabyrinthElement {

	/**
	 * Constructor
	 * @param {*} structure 
	 * @param {*} parent 
	 * @param {*} program 
	 * @param {*} objStr 
	 * @param {*} mtlStr 
	 */
    constructor(structure, parent, program, objStr, mtlStr){
		// Calls the parent constructor
        super(structure, parent, program);
		// Initialize mesh and material
        this.mesh = utils.ParseOBJ(objStr);
        this.material = utils.ParseMTL(mtlStr);
    }

	/**
	 * Init function
	 */
    init() {
        this.loadLocations();
        this.loadVAO();
	}

	/**
	 * Load shader locations
	 */
	loadLocations(){
        this.program.position = gl.getAttribLocation(this.program, 'a_position');
        this.program.normal = gl.getAttribLocation(this.program, 'a_normal');

        this.program.projection = gl.getUniformLocation(this.program, 'u_projection');
        //this.program.view = gl.getUniformLocation(this.program, 'u_view');
        this.program.world = gl.getUniformLocation(this.program, 'u_world');
        this.program.viewWorldPosition = gl.getUniformLocation(this.program, 'u_viewWorldPosition');
		this.program.normalMatrix = gl.getUniformLocation(this.program, 'u_normalMatrix');

        this.program.color = gl.getUniformLocation(this.program, 'color');
        this.program.diffuse = gl.getUniformLocation(this.program, 'diffuse');
        this.program.emissive = gl.getUniformLocation(this.program, 'emissive');
        this.program.specular = gl.getUniformLocation(this.program, 'specular');
        this.program.shininess = gl.getUniformLocation(this.program, 'shininess');
        this.program.opacity = gl.getUniformLocation(this.program, 'opacity');

        this.program.lightPosition = gl.getUniformLocation(this.program, 'u_lightPosition');
        this.program.lightDirection = gl.getUniformLocation(this.program, 'u_lightDirection');
		this.program.lightColor = gl.getUniformLocation(this.program, 'u_lightColor');
		this.program.cutOff = gl.getUniformLocation(this.program, 'u_cutOff');
		this.program.outerCutOff = gl.getUniformLocation(this.program, 'u_outerCutOff');
		this.program.linDecay = gl.getUniformLocation(this.program, 'u_linDecay');
		this.program.constDecay = gl.getUniformLocation(this.program, 'u_constDecay');
		this.program.quadDecay = gl.getUniformLocation(this.program, 'u_quadDecay');

        this.program.ambientLightDay = gl.getUniformLocation(this.program, 'u_ambientLightDay');
		this.program.ambientLightNight = gl.getUniformLocation(this.program, 'u_ambientLightNight');
		this.program.radians_over_time = gl.getUniformLocation(this.program, 'radians_over_time');
		this.program.ambientStrengthDay = gl.getUniformLocation(this.program, 'u_ambientStrengthDay');
		this.program.ambientStrengthNight = gl.getUniformLocation(this.program, 'u_ambientStrengthNight');

		this.program.directLightDirection = gl.getUniformLocation(this.program, 'u_directLightDirection');
		this.program.directColorDay = gl.getUniformLocation(this.program, 'u_directColorDay');
		this.program.directColorNight = gl.getUniformLocation(this.program, 'u_directColorNight');
    }

	/**
	 * Loads Vertex Array Objects
	 */
	loadVAO() {
		this.vao = [];
		this.mesh.geometries.forEach((element, pos) => {
			this.vao[pos] = gl.createVertexArray();
			gl.bindVertexArray(this.vao[pos]);
			// Load character buffers
			let vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.position), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.program.position);
			gl.vertexAttribPointer(
				this.program.position,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
			);

			let normBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.normal), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(this.program.normal);
			gl.vertexAttribPointer(
				this.program.normal,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);
		});
    }

	/**
	 * Draw function
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 * @param {*} light 
	 * @param {*} camPos 
	 */
	draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now) {
		// Calls the parent draw
		this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix, light, camPos));
		let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, this.worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
		
		// GL stuffs
        gl.useProgram(this.program);
		// For each geometry in mesh
		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			//gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(this.worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(projectionMatrix));
			gl.uniformMatrix4fv(this.program.normalMatrix, gl.FALSE, utils.invertMatrix(utils.transposeMatrix(this.worldMatrix)));
			gl.uniform3f(this.program.viewWorldPosition, camPos.x, camPos.y, camPos.z);

			gl.uniform3fv(this.program.color, this.color);
			gl.uniform3fv(this.program.diffuse, this.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, this.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, this.emissive);
			gl.uniform3fv(this.program.specular, this.material[element.material].specular);
			gl.uniform1f(this.program.shininess, this.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, this.material[element.material].opacity);

			gl.uniform3f(this.program.lightPosition, light.position.x, light.position.y, light.position.z);
			gl.uniform3f(this.program.lightDirection, light.direction.x, light.direction.y, light.direction.z);
			gl.uniform1f(this.program.cutOff, Math.cos(utils.degToRad(light.cutOff)));
			gl.uniform1f(this.program.outerCutOff, Math.cos(utils.degToRad(light.outerCutOff)));
			gl.uniform1f(this.program.constDecay, light.constDecay);
			gl.uniform1f(this.program.linDecay, light.linDecay);
			gl.uniform1f(this.program.quadDecay, light.quadDecay);

			if (light.ignition.value)
				gl.uniform3f(this.program.lightColor, light.color.r, light.color.g, light.color.b);
			else
				gl.uniform3f(this.program.lightColor, 0.0, 0.0, 0.0);

			gl.uniform3f(this.program.ambientLightDay, skybox.textures[0].ambientLight.r, skybox.textures[0].ambientLight.g, skybox.textures[0].ambientLight.b);
			gl.uniform3f(this.program.ambientLightNight, skybox.textures[1].ambientLight.r, skybox.textures[1].ambientLight.g, skybox.textures[1].ambientLight.b);
			gl.uniform1f(this.program.radians_over_time, utils.degToRad(now % 360));
			gl.uniform1f(this.program.ambientStrengthDay, skybox.textures[0].ambientLight.strength);
			gl.uniform1f(this.program.ambientStrengthNight, skybox.textures[1].ambientLight.strength);

			gl.uniform3f(this.program.directLightDirection, skybox.lightDir.x, skybox.lightDir.y, skybox.lightDir.z);
			gl.uniform3f(this.program.directColorDay, skybox.textures[0].directionalLight.r, skybox.textures[0].directionalLight.g, skybox.textures[0].directionalLight.b);
			gl.uniform3f(this.program.directColorNight, skybox.textures[1].directionalLight.r, skybox.textures[1].directionalLight.g, skybox.textures[1].directionalLight.b);
			
			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length/3);
		});
    }
	
}