function SceneHandler(){
    this.then=0;
    this.level;
    this.drawScene=function(now) {
        // Get current time
		now *= 0.001;  // seconds;
		let deltaTime = now - this.then;
		this.then = now;


        utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);

		console.log(this.level);

		this.level.camera.idle();
		let movementHandlerRet = movementHandler.idle(this.level.camera, interactionHandler);
		this.level.camera = movementHandlerRet.camera;
		movementHandler = movementHandlerRet.movementHandler;


        // Perspective, World Matrix
		let perspectiveMatrix = this.level.camera.perspectiveMatrix;
        let viewMatrix = this.level.camera.viewMatrix;

        this.level.skybox.draw(now, perspectiveMatrix, viewMatrix)
        this.level.labyrinth.draw(perspectiveMatrix, viewMatrix);

        window.requestAnimationFrame(this.drawScene);
    }
    this.setLevel=function(level){
        this.level=level;
    }
	this.start = function() {
        this.drawScene(0);
	}

	// TODO VERIFICARE SE E' SUPERFLUO
    //this.setLevel(level);
    
}