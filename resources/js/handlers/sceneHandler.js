function SceneHandler(movementHandler, interactionHandler){
    this.then=0;
    this.level;
	this.movementHandler=movementHandler;
	this.interactionHandler=interactionHandler;

    this.drawScene=function(now,scope, iter) {

        // Get current time
		now *= 0.001;  // seconds;
		let deltaTime = now - scope.then;
		scope.then = now;


        utils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		gl.clearColor(1, 1, 1, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.frontFace(gl.CCW);
		gl.cullFace(gl.BACK);

		scope.level.camera.idle(deltaTime);
		let movementHandlerRet = scope.movementHandler.idle(scope.level.camera, scope.interactionHandler);
		scope.level.camera = movementHandlerRet.camera;
		scope.interactionHandler = movementHandlerRet.interactionHandler;


        // Perspective, World Matrix
		let perspectiveMatrix = scope.level.camera.perspectiveMatrix;
        let viewMatrix = scope.level.camera.viewMatrix;

        scope.level.skybox.draw(now, perspectiveMatrix, viewMatrix)
        scope.level.labyrinth.draw(perspectiveMatrix, viewMatrix);

		if(iter==0)
        	window.requestAnimationFrame(()=>scope.drawScene(now,scope,iter+1));
    }

    this.setLevel=function(level){
        this.level=level;
    }
	this.start = function() {
        this.drawScene(Date.now(),this,0);
		
	}

	// TODO VERIFICARE SE E' SUPERFLUO
    //this.setLevel(level);
    
}