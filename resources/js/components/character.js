/*******************
 * Character.js
 ******************/

/**
 * Class that represents the main character
 */

var DEBUGLIGHT = false;

var lightOffset = {
	angle: 0.0,
	elevation: 0.0
}

var radOffset = 0.0;

class Character {

	/**
	 * Constructor
	 * 
	 * @param {*} objString 
	 * @param {*} matString 
	 * @param {*} offset 
	 * @param {*} program 
	 * @param {*} light 
	 */
	constructor(objString, matString, offset, program, light, colours) {
		this.mesh = utils.ParseOBJ(objString);
		this.material = utils.ParseMTL(matString);
		
		this.program = program;
		
		this.offset = offset;

		this.light = light;
		this.light.position = {};
		this.light.direction = {};
		this.light.ignition.value = light.ignition.default;
		this.light.ignition.lastTime = 0.0;

		this.colours = colours;

		this.init();
	}

	init() {
        this.loadLocations();
        this.loadVAO();
	}

	loadLocations(){
        this.program.position = gl.getAttribLocation(this.program, 'a_position');
        this.program.normal = gl.getAttribLocation(this.program, 'a_normal');
        this.program.color = gl.getUniformLocation(this.program, 'color');
        this.program.projection = gl.getUniformLocation(this.program, 'u_projection');
        this.program.view = gl.getUniformLocation(this.program, 'u_view');
        this.program.world = gl.getUniformLocation(this.program, 'u_world');
		
        this.program.viewWorldPosition = gl.getUniformLocation(this.program, 'u_viewWorldPosition');
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
    }

	loadVAO() {
		let scope = this;
		this.vao = [];
		this.mesh.geometries.forEach((element, pos) => {
			scope.vao[pos] = gl.createVertexArray();
			gl.bindVertexArray(scope.vao[pos]);
			// Load character buffers

			let vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.position), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(scope.program.position);
			gl.vertexAttribPointer(
				scope.program.position,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
			);

			let normBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, normBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(element.data.normal), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(scope.program.normal);
			gl.vertexAttribPointer(
				scope.program.normal,
				3,
				gl.FLOAT,
				gl.FALSE,
				3 * Float32Array.BYTES_PER_ELEMENT,
				0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
			);
		});
    }

	draw(perspectiveMatrix, camera, light, skybox, now) {

		let worldMatrix = utils.MakeTrueWorld(
			camera.position.x + this.offset.x,
			camera.position.y + this.offset.y, 
			camera.position.z + this.offset.z,
			-camera.position.elevation/1.5,
			camera.position.angle + 180,
			0.0,
			this.offset.scale
		);

		if(!DEBUGLIGHT)
			this.computeLight(camera);

        gl.useProgram(this.program);

		let viewWorldMatrix = utils.multiplyMatrices(camera.viewMatrix, worldMatrix);
		let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			console.log(this.colours[element.material]);

			gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(camera.viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(projectionMatrix));
			gl.uniform3f(this.program.viewWorldPosition, camera.position.x, camera.position.y, camera.position.z);
			gl.uniform3fv(this.program.color, this.colours[element.material]);

			gl.uniform3fv(this.program.diffuse, this.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, this.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, this.material[element.material].emissive);
			gl.uniform3fv(this.program.specular, this.material[element.material].specular);
			gl.uniform1f(this.program.shininess, this.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, this.material[element.material].opacity);

			gl.uniform3f(this.program.lightPosition, light.position.x, light.position.y, light.position.z);
			gl.uniform3fv(this.program.lightDirection, [light.direction.x, light.direction.y, light.direction.z]);
			gl.uniform1f(this.program.cutOff, light.cutOff);
			gl.uniform1f(this.program.outerCutOff, light.outerCutOff);
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
			
			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length/3);
		});
    }

	/**
	 * Function to draw the character
	 * 
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 */
	/*draw(perspectiveMatrix, camera) {

		let worldMatrix = utils.MakeTrueWorld(
			camera.position.x + this.offset.x,
			camera.position.y + this.offset.y, 
			camera.position.z + this.offset.z,
			-camera.position.elevation/1.5,
			camera.position.angle + 180,
			0.0,
			this.offset.scale
		);

		if(!DEBUGLIGHT)
			this.computeLight(camera);
		
		// GL stuffs
		gl.useProgram(this.program);

		// For each object to render
		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(camera.viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(perspectiveMatrix));
			gl.uniform3f(this.program.viewWorldPosition, camera.position.x, camera.position.y, camera.position.z);
			gl.uniform3fv(this.program.diffuse, this.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, this.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, this.material[element.material].emissive);
			gl.uniform3fv(this.program.specular, this.material[element.material].specular);
			gl.uniform1f(this.program.shininess, this.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, this.material[element.material].opacity);
			gl.uniform3fv(this.program.lightDirection, [-1.0, 3.0, 5.0]);
			gl.uniform3fv(this.program.ambientLight, [0.0, 0.0, 0.0]);

			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length / 3);
		});

	}*/

	computeLight(camera){
			let x = this.light.offset.x*0.25;
			let y = this.light.offset.y*0.25;
			let z = this.light.offset.z*0.25;
			
			let angle = Math.acos(z/Math.sqrt(x*x+z*z));
			let elevation = Math.acos(z/Math.sqrt(y*y+z*z));

			let a = utils.degToRad(-camera.position.angle) + angle;
			let b = utils.degToRad(-camera.position.elevation/1.5-90) - elevation;
			let r = Math.sqrt(x*x+y*y+z*z)-0.01;
			
			this.light.position.x = r*Math.sin(b)*Math.sin(a) + camera.position.x;
			this.light.position.y = r*Math.cos(b) + camera.position.y;
			this.light.position.z = r*Math.sin(b)*Math.cos(a) + camera.position.z;
						
			
			this.light.direction.x=Math.sin(utils.degToRad(camera.position.elevation/1.5-90+lightOffset.elevation))*Math.sin(utils.degToRad(-camera.position.angle+lightOffset.angle));
			this.light.direction.y=Math.cos(utils.degToRad(camera.position.elevation/1.5-90+lightOffset.elevation));
			this.light.direction.z=Math.sin(utils.degToRad(camera.position.elevation/1.5-90+lightOffset.elevation))*Math.cos(utils.degToRad(-camera.position.angle+lightOffset.angle));

			
			let lightVector = utils.normalize([this.light.direction.x,this.light.direction.y,this.light.direction.z]);
			this.light.direction.x = lightVector[0];
			this.light.direction.y = lightVector[1];
			this.light.direction.z = lightVector[2];
	}

}