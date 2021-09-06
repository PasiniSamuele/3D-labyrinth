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

		console.log(utils.getGeometriesExtents(this.mesh.geometries));
	
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

	}

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