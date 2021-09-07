/********************************
 * 
 * Script.js
 * 
 *******************************/

// Handlers
var loadingHandler;
var movementHandler;
var collisionHandler;
var interactionHandler;
var sceneHandler;
var levelHandler;

// Global variable GL
/** @type {WebGLRenderingContext} */
var gl;

/**
 * Main function
 * @param {*} activeLevel 
 */
function main(activeLevel) {
	// Canvas resizing
	utils.resizeCanvasToDisplaySize(gl.canvas);
	// Handler settings
	interactionHandler.resetKeys();
	sceneHandler.setLevel(activeLevel);
	levelHandler.setLevel(activeLevel);
	movementHandler.blocked=false;
	sceneHandler.start();
}

/**
 * Link canvas and GL context
 */
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

/**
 * Main init function
 */
async function init() {
	// Call the loadGl function
	loadGl();
	// Instantiate handlers
	loadingHandler = new PbrLoadingHandler();
	movementHandler = new MovementHandler();
	interactionHandler = new InteractionHandler();
	collisionHandler = new CollisionHandler();
	levelHandler = new LevelHandler();
	sceneHandler = new SceneHandler(movementHandler, interactionHandler, levelHandler);
	// Main loading function
	var settings = "resources/settings/settings.json"
	let activeLevel = await loadingHandler.init(settings);
	// Start the game
	main(activeLevel);
}

// Onload
window.onload = init;

