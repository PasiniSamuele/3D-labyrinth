//directories
var settings = "resources/settings/settings.json"


//handlers
var loadingHandler;
var movementHandler;
var collisionHandler;
var sceneHandler;

//variables
/** @type {WebGLRenderingContext} */
var gl;

var activeLevel;


function main(){
    utils.initInteraction(gl.canvas);
	utils.resizeCanvasToDisplaySize(gl.canvas);
    sceneHandler.setLevel(activeLevel);

}
function loadGl(){
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

function init(){
    loadingHandler = new LoadingHandler();
    movementHandler = new MovementHandler();
    collisionHandler = new CollisionHandler();
    sceneHandler = new SceneHandler();

    loadGl();
    activeLevel = loadingHandler.init(settings);

    main();
}

window.onload = init;

