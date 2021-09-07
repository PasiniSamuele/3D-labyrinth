//directories
// TODO: non può essere globale
//var settings = "resources/settings/settings.json"


// Handlers
var loadingHandler;
var movementHandler;
var collisionHandler;
var interactionHandler;
var sceneHandler;
var levelHandler;

//variables
/** @type {WebGLRenderingContext} */
var gl;

function main(activeLevel) {
	utils.resizeCanvasToDisplaySize(gl.canvas);
	interactionHandler.resetKeys();
	sceneHandler.setLevel(activeLevel);
	levelHandler.setLevel(activeLevel);
	movementHandler.blocked=false;
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
	
	loadingHandler = new PbrLoadingHandler();
	movementHandler = new MovementHandler();
	interactionHandler = new InteractionHandler();
	collisionHandler = new CollisionHandler();
	levelHandler = new LevelHandler();
	sceneHandler = new SceneHandler(movementHandler, interactionHandler, levelHandler);

	var settings = "resources/settings/settings.json"
	let activeLevel = await loadingHandler.init(settings);

	main(activeLevel);
}

window.onload = init;

