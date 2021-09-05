/*******************
 * Character.js
 ******************/

/**
 * Class that represents the main character
 */
class Character extends Mesh {

	/**
	 * Constructor
	 * 
	 * @param {*} objString 
	 * @param {*} matString 
	 * @param {*} offset 
	 * @param {*} program 
	 * @param {*} light 
	 */
	constructor(objString, matString, offset, program, light) {
		super(objString, matString, program, offset);
		this.light = light;
		this.light.position = {};
		this.light.direction = {};
		this.light.ignition.value = light.ignition.default;
		this.light.ignition.lastTime = 0.0;
	}

	/**
	 * Function to draw the character
	 * 
	 * @param {*} perspectiveMatrix 
	 * @param {*} viewMatrix 
	 */
	draw(perspectiveMatrix, camera) {

		let worldMatrix = utils.MakeTrueWorld(
			camera.position.x + this.offset.x,
			camera.position.y + this.offset.y, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.z + this.offset.z,
			-camera.position.elevation/1.5,
			camera.position.angle + 180,
			0.0,
			0.25
		);
		/*let angle = utils.MakeRotateXMatrix(camera.position.angle + 180);
		let minuselevation = utils.MakeRotateXMatrix(camera.position.elevation)

		let worldMatrix = utils.MakeWorldFromMatrices(
			utils.MakeTranslateMatrix(
				camera.position.x + this.offset.x, 
				camera.position.y + this.offset.y, 
				camera.position.z + this.offset.z),
			utils.multiplyMatrices(utils.multiplyMatrices(minuselevation, angle), utils.invertMatrix(minuselevation)),
			utils.MakeRotateXMatrix(camera.position.elevation),
			utils.identityMatrix(),
			utils.MakeScaleMatrix(0.25)
		)*/

		this.light.position.x=camera.position.x;
		this.light.position.y=camera.position.y;
		this.light.position.z=camera.position.z;
		this.light.direction.x=Math.cos(utils.degToRad(camera.position.angle))*Math.cos(utils.degToRad(camera.position.elevation));
		this.light.direction.y=Math.sin(utils.degToRad(camera.position.elevation));
		this.light.direction.z=Math.sin(utils.degToRad(camera.position.angle))*Math.cos(utils.degToRad(camera.position.elevation));

        gl.useProgram(this.program);

		// Light positional parameters
		this.light.position.x = camera.position.x;
		this.light.position.y = camera.position.y;
		this.light.position.z = camera.position.z;
		this.light.direction.x = 0;
		this.light.direction.y = camera.position.angle;
		this.light.direction.z = 0;
		
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

	}

}