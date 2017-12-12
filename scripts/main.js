// Global variable definition
var canvas;
var gl;
var shaderProgram;

// Model-View and Projection matrices
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var light;
var terrain;
var gitin = false;
var camera;
var player;
var currentlyPressedKeys = {};

var lastTime = 0;
var lastFrameTime = 0;

// load game data
function prepareData(){
    initCanvas();
    initShaders();
    initTextures();
    initModels();
    startRender();
}

// Game items
var entities = [];

//
// initGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initGL(canvas) {
    var gl = null;
    try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch(e) {}

    // If we don't have a GL context, give up now
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
    }
    return gl;
}

function initCanvas() {
    canvas = document.getElementById("glcanvas");

    gl = initGL(canvas);      // Initialize the GL context

    // Only continue if WebGL is available and working
    if (gl) {
        gl.clearColor(0.523, 0.808, 0.98, 1.0);                      // Set clear color to black, fully opaque
        gl.clearDepth(1.0);                                     // Clear everything
        gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
        gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things

        // Initialize the shaders; this is where all the lighting for the
        // vertices and so forth is established.
    }
}

function drawScene() {


}

var world;
var fixedTimeStep;
var maxSubSteps;
var sphereBody;
var world;

function startRender(){

    var flag = false;
    timeStep = 1.0 / 60.0; // seconds
    maxSubSteps = 3;
    var groundBody;


    setInterval(function () {

        if (modelsLoaded == modelPaths.length && !flag){

            // Physics world
            world = new CANNON.World();
            world.gravity.set(0, 0, -9.82);
            world.broadphase = new CANNON.SAPBroadphase(world);
            world.defaultContactMaterial.friction = 0.2;

            // Terrain
            terrain = new HeightMapTerrain("terrain", textures["snow"], [0, 0, 0], textures["terrain01"]);
            terrain.generateTerrain();

            var hfShape = new CANNON.Heightfield(terrain.heights, {
                minSize: 10,
                maxSize: 150,
                elementSize: 1
            });
            hfShape.collisionResponse = true;

            var hfBody = new CANNON.Body({ mass: 0 });
            hfBody.addShape(hfShape);
            hfBody.position.set(0, 0, 0);               //////
            world.addBody(hfBody);

            terrain.entity.position = [0, hfBody.position.z, 0];

            // Ball (Player)
            var radius = 0.35;
            sphereBody = new CANNON.Body({
                mass: 20,
                position: new CANNON.Vec3(15, 15, 20), //////
                shape: new CANNON.Sphere(radius),
                angularDamping: 0.4
            });
            sphereBody.position.vadd(hfBody.position, sphereBody.position);
            world.addBody(sphereBody);

            //var playerEntity = new Entity("ball", models["ball"], textures["snow"], [0, terrain.getHeightOfTerrain(0, 100, terrain), 100]);
            var playerEntity = new Entity("ball", models["ball"], textures["snow"], [sphereBody.position.x, sphereBody.position.z, sphereBody.position.y]);
            playerEntity.setScale([0.3, 0.3, 0.3]);

            camera = new Camera(playerEntity);
            player = new Player(camera, playerEntity, terrain, sphereBody);

            light = new Light([0.0, 10000.0, 1000.0]);

            flag = true;
        }

        if (texturesLoaded == texturePaths.length && flag) {
            var timeNow = new Date().getTime();
            if (lastTime != 0) {
                lastFrameTime = timeNow - lastTime;
            }
            lastTime = timeNow;

            //player.handleKeys();

            // set the rendering environment to full canvas size
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

            // Clear the canvas before we start drawing on it.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Establish the perspective with which we want to view the
            // scene. Our field of view is 45 degrees, with a width/height
            // ratio, and we only want to see objects between 0.1 units
            // and 100 units away from the camera.

            camera.move();
            camera.updateMatrix();

            mat4.perspective(pMatrix, degToRad(45), gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);


            world.step(timeStep);

            // **********************************************

            // **********************************************

            player.update();
            player.draw(shaderProgram);

            light.calculateLightColor();

            terrain.update();
            terrain.draw(shaderProgram);

        }
    }, 16);
}

// Given an X,Y in 1st quadrant cartesian coordinates give the corresponding screen coordinate

