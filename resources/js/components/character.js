/**
 * 
 */

class Character extends Mesh{

	constructor(objString, matString, offset, program, light) {
		super(objString, matString, program, offset);
        this.light=light;
        this.light.position={};     
        this.light.direction={};  
	}

    /**
     * function to draw the character
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    draw(perspectiveMatrix, camera) {

		let worldMatrix = utils.MakeWorld(
			camera.position.x + this.offset.x + Math.sin(utils.degToRad(camera.position.angle)) * this.offset.angle,
			camera.position.y + this.offset.y, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.z + this.offset.z- Math.cos(utils.degToRad(camera.position.angle)) * this.offset.angle, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.angle + 180,0.0,0.0,0.25
			
		);
		this.light.position.x=camera.position.x;
		this.light.position.y=camera.position.y;
		this.light.position.z=camera.position.z;
		this.light.direction.x=0;
		this.light.direction.y=camera.position.angle;
		this.light.direction.z=0;

        gl.useProgram(this.program);

		let scope = this;

		this.mesh.geometries.forEach((element, pos) => {
			gl.bindVertexArray(this.vao[pos]);

			gl.uniformMatrix4fv(this.program.view, gl.FALSE, utils.transposeMatrix(camera.viewMatrix));
			gl.uniformMatrix4fv(this.program.world, gl.FALSE, utils.transposeMatrix(worldMatrix));
			gl.uniformMatrix4fv(this.program.projection, gl.FALSE, utils.transposeMatrix(perspectiveMatrix));
			gl.uniform3f(this.program.viewWorldPosition, camera.position.x, camera.position.y, camera.position.z);
			gl.uniform3fv(this.program.diffuse, scope.material[element.material].diffuse);
			gl.uniform3fv(this.program.ambient, scope.material[element.material].ambient);
			gl.uniform3fv(this.program.emissive, scope.material[element.material].emissive);
			gl.uniform3fv(this.program.specular, scope.material[element.material].specular);
			gl.uniform1f(this.program.shininess, scope.material[element.material].shininess);
			gl.uniform1f(this.program.opacity, scope.material[element.material].opacity);
			gl.uniform3fv(this.program.lightDirection, [-1.0, 3.0, 5.0]);
			gl.uniform3fv(this.program.ambientLight, [0.0, 0.0, 0.0]);
			
			gl.drawArrays(gl.TRIANGLES, 0, element.data.position.length/3);
		});
    
    }

}