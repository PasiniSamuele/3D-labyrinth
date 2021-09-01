//directories
// TODO: non può essere globale
//var settings = "resources/settings/settings.json"


// Handlers
var loadingHandler;
var movementHandler;
var collisionHandler;
var interactionHandler;
var sceneHandler;

var offset = {
	x: 0.0,y:-0.45,z:0.0,angle:0.01,elevation:0.1
};
var offset2 = {
	x: 0.01,y:-0.45,z:0.01,angle:180.0,elevation:0.0
};

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
	interactionHandler = new InteractionHandler();
	collisionHandler = new CollisionHandler();
	sceneHandler = new SceneHandler(movementHandler, interactionHandler);

	

	var settings = "resources/settings/settings.json"
	activeLevel = await loadingHandler.init(settings);

	main();
}

window.onload = init;

