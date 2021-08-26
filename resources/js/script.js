//directories
// TODO: non può essere globale
//var settings = "resources/settings/settings.json"


// Handlers
var loadingHandler;
var movementHandler;
var collisionHandler;
var interactionHandler;
var sceneHandler;

//variables
/** @type {WebGLRenderingContext} */
var gl;

var activeLevel;


function main() {
	utils.resizeCanvasToDisplaySize(gl.canvas);
	sceneHandler.setLevel(activeLevel);
	sceneHandler.start();
}

function loadGl() {
	let canvas = document.getElementById("canvas-id");
	gl = canvas.getContext("webgl2");
	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}
}

async function init() {
	loadGl();
	
	loadingHandler = new LoadingHandler();
	movementHandler = new MovementHandler();
	interactionHandler = new InteractionHandler()
	//collisionHandler = new CollisionHandler();
	sceneHandler = new SceneHandler(movementHandler, interactionHandler);

	

	var settings = "resources/settings/settings.json"
	activeLevel = await loadingHandler.init(settings);

	main();
}

window.onload = init;

