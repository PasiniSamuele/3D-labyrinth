function SceneHandler(movementHandler, interactionHandler){
    this.then=0;
    this.level;
	this.movementHandler=movementHandler;
	this.interactionHandler=interactionHandler;

    this.drawScene=function(now,scope, iter) {
		
        // Get current time
		now =Math.floor(now* 0.001);  // seconds;
		console.log(now);
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
		//let perspectiveMatrix = utils.MakePerspective(90, gl.canvas.width / gl.canvas.height, 0.1, 100.0);
        let viewMatrix = scope.level.camera.viewMatrix;
		//let viewMatrix = utils.MakeView(0.5, 1, 0.5, 0, 90);

        scope.level.skybox.draw(now, perspectiveMatrix, viewMatrix)
        scope.level.labyrinth.draw(perspectiveMatrix, viewMatrix);

		//if(iter==0)
        	window.requestAnimationFrame(()=>scope.drawScene(Date.now(),scope,iter+1));
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