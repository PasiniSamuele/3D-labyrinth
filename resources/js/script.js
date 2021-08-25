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
	interactionHandler = new InteractionHandler();
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
	loadingHandler = new LoadingHandler();
	movementHandler = new MovementHandler();
	//collisionHandler = new CollisionHandler();
	sceneHandler = new SceneHandler();

	loadGl();

	var settings = "resources/settings/settings.json"
	activeLevel = await loadingHandler.init(settings);

	main();
}

window.onload = init;

