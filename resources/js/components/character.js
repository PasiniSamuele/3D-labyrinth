/**
 * 
 */

class Character extends Mesh{

	constructor(objString, matString, offset, program) {
		super(objString, matString, program, offset);
	}

    /**
     * function to draw the character
     * @param {*} perspectiveMatrix 
     * @param {*} viewMatrix 
     */
    /*draw(perspectiveMatrix, camera) {

		let worldMatrix = utils.MakeWorld(
			camera.position.x + offset.x + Math.sin(utils.degToRad(camera.position.angle)) * offset.angle,
			camera.position.y + offset.y, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.z + offset.z- Math.cos(utils.degToRad(camera.position.angle)) * offset.angle, //+ Math.sin(utils.degToRad(camera.position.elevation)) * offset.elevation,
			camera.position.angle + 180,
			0.0,0.0,0.25
		);

        let viewWorldMatrix = utils.multiplyMatrices(camera.viewMatrix, worldMatrix);
        let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        let length = [].concat.apply([],this.mesh.indicesPerMaterial).length;
        gl.uniformMatrix4fv(this.locations['chProjMatrix'], gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniformMatrix4fv(this.locations['chWorldMatrix'], gl.FALSE, utils.transposeMatrix(worldMatrix));
        //gl.uniform1i(this.locations['labSampler'], utils.getTextureSlotOffset(gl, this.slot));
        gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
    }*/

}