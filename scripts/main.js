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
var key;
var arrow;

// coin vars
var boxBody2;
var boxBodies;
var coin;
var coins;

var lastTime = 0;
var lastFrameTime = 0;

//Game vars
var keyFound = false;
var gameOver = false;
var points = 0;
var bgmusic = new Audio('/res/bgmusic.wav');
var endmusic = new Audio('/res/end.wav'); //if time runs out
bgmusic.loop = true;

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

//called when key is found
function kFound(){ 
	keyFound = true;
}

//called when portal is reached
function gOver(){
	clearInterval(x);
	document.getElementById("timer").innerText = "";
	document.getElementById("misija").innerText = "";
	gameOver = true;
	bgmusic.pause();
}

function increasePoints(){
	points+=10;
	document.getElementById("tocke").innerText = "TOČKE: "+points+"";
}

var world;
var fixedTimeStep;
var maxSubSteps;
var sphereBody;
var world;

//portal textures
var p;
var pCounter = 0;
var portalEntity;
//

function initCoins(){
	boxBodies[0].position.set(35, 30, 2);
	world.addBody(boxBodies[0]);
	var c = new Entity("coin", models["coin"], textures["coin"], [boxBodies[0].position.x, boxBodies[0].position.z, boxBodies[0].position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, boxBodies[0]));
	
	boxBodies[1].position.set(116, 64, 8);
	world.addBody(boxBodies[1]);
	c = new Entity("coin", models["coin"], textures["coin"], [boxBodies[1].position.x, boxBodies[1].position.z, boxBodies[1].position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, boxBodies[1]));
	
	boxBodies[3].position.set(147, 70, 2);
	world.addBody(boxBodies[3]);
	c = new Entity("coin", models["coin"], textures["coin"], [boxBodies[3].position.x, boxBodies[3].position.z, boxBodies[3].position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, boxBodies[3]));
	
	boxBodies[2].position.set(127, 40, 5.5);
	world.addBody(boxBodies[2]);
	c = new Entity("coin", models["coin"], textures["coin"], [boxBodies[2].position.x, boxBodies[2].position.z, boxBodies[2].position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, boxBodies[2]));
	
	boxBodies[4].position.set(125, 98, 6.5);
	world.addBody(boxBodies[4]);
	c = new Entity("coin", models["coin"], textures["coin"], [boxBodies[4].position.x, boxBodies[4].position.z, boxBodies[4].position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, boxBodies[4]));
	////////
	var trenutni = boxBodies[5];
	
	trenutni.position.set(200,62,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[6];
	
	trenutni.position.set(236,90,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[7];
	
	trenutni.position.set(225,65,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[8];
	
	trenutni.position.set(170,24,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[9];
	
	trenutni.position.set(150,110,8);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[10];
	
	trenutni.position.set(53,30,4.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[11];
	
	trenutni.position.set(186,104,1.4);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[12];
	
	trenutni.position.set(214,115,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[13];
	
	trenutni.position.set(171,157,1.8);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[14];
	
	trenutni.position.set(175,178,4);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[15];
	
	trenutni.position.set(161,230,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[16];
	
	trenutni.position.set(206,232,1.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[17];
	
	trenutni.position.set(90,48,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[18];
	
	trenutni.position.set(232,176,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[19];
	
	trenutni.position.set(17.5,51.5,1.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[20];
	
	trenutni.position.set(12.2,91.5,5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[21];
	
	trenutni.position.set(45,153,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[22];
	
	trenutni.position.set(55,154,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[23];
	
	trenutni.position.set(45,160,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[24];
	
	trenutni.position.set(43,165,2.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	///////////
	var trenutni = boxBodies[25];
	
	trenutni.position.set(45,153,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[26];
	
	trenutni.position.set(55,154,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[27];
	
	trenutni.position.set(45,160,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[28];
	
	trenutni.position.set(188,202,6);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[29];
	
	trenutni.position.set(127,183,4);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	
	var trenutni = boxBodies[30];
	
	trenutni.position.set(43,165,2.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[31];
	
	trenutni.position.set(103,190,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[32];
	
	trenutni.position.set(84,156,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[33];
	
	trenutni.position.set(125,137,8.5);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[34];
	
	trenutni.position.set(235,88,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[35];
	
	trenutni.position.set(195,18,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	
	var trenutni = boxBodies[36];
	
	trenutni.position.set(198,31,2);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));
	
	var trenutni = boxBodies[37];
	
	trenutni.position.set(198,85,6);
	world.addBody(trenutni);
	var c = new Entity("coin", models["coin"], textures["coin"], [trenutni.position.x, trenutni.position.z, trenutni.position.y])
	c.setScale([0.5,0.5,0.5]);
	coins.push(new Coin(c, trenutni));

}

//timer
var timeLeft = 121;

var x = setInterval(function() {
	timeLeft--;
	if (timeLeft == 0) {
		if(!gameOver){
			gOver();
			endmusic.play();
			document.getElementById("tocke").innerText = "";
			document.getElementById("konec").innerText = "ČAS POTEKEL!";
		}
		clearInterval(x);
	}
	else{
		document.getElementById("timer").innerText = "PREOSTANEK ČASA: "+timeLeft+"s";
	}
}, 1000);
//

function startRender(){

    var flag = false;
    timeStep = 1.0 / 60.0; // seconds
    maxSubSteps = 3;
    var groundBody;
	var kljuc;

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
			
			//Box (Key Collider)
			var boxBody;
			var boxShape = new CANNON.Box(new CANNON.Vec3(0.24, 1.4, 0.15));
			boxBody = new CANNON.Body({ mass: 0 });
			boxBody.addShape(boxShape);
			boxBody.position.set(163,41,9); //35, 30, 1   
			boxBody.collisionResponse = false;
			world.addBody(boxBody);
			
			//Box 2 (Coin Collider) -- for each coin
			boxBodies = [];
			for(var i = 0; i < 38; i++){
				boxBody2;
				boxShape = new CANNON.Box(new CANNON.Vec3(0.4,0.4,0.4));
				boxBody2 = new CANNON.Body({ mass: 0 });
				boxBody2.addShape(boxShape);
				boxBody2.position.set(35, 30, 2);
				boxBody2.collisionResponse = false;
				boxBodies.push(boxBody2);
			}
			
			//Cylinder (Portal)
			p;
			var cylinderShape = new CANNON.Cylinder(0.4,0.4,0.2,5);
			p = new CANNON.Body({mass:0});
			p.addShape(cylinderShape);
			p.position.set(38,38,-0.1);
			p.collisionResponse = false;
			
			//portalEntity
			portalEntity = new Entity("portal",models["cylinder"],textures["portal0"],[p.position.x, p.position.z, p.position.y]);
			
			//puscica
			var a = new Entity("arrow",models["arrow"],textures["portal1"],[p.position.x, p.position.z+6, p.position.y]);
			a.setScale([0.4,0.4,0.4]);
			
            //var playerEntity = new Entity("ball", models["ball"], textures["snow"], [0, terrain.getHeightOfTerrain(0, 100, terrain), 100]);
            var playerEntity = new Entity("ball", models["ball"], textures["key"], [sphereBody.position.x, sphereBody.position.z, sphereBody.position.y]);
            playerEntity.setScale([0.3, 0.3, 0.3]);

			//key
			kljuc = new Entity("key", models["key"], textures["key"],[boxBody.position.x, boxBody.position.z, boxBody.position.y+1]);
			kljuc.setScale([0.17,0.17,0.17]);
			
            camera = new Camera(playerEntity);
            player = new Player(camera, playerEntity, terrain, sphereBody);
			key = new Key(kljuc, boxBody);		
			portal = new Portal(portalEntity, p);
			arrow = new Arrow(a);
			
			coins = [];
			initCoins();
			
            light = new Light([0.0, 10000.0, 1000.0]);

			bgmusic.play();

            flag = true;
			
        }
		
        if (texturesLoaded == texturePaths.length && flag && !gameOver) {
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

			if(keyFound) //portal collider activates when key is found
				world.addBody(p);
				
			//portal textures + drawing arrow if key is found
			if(keyFound){
				
				arrow.update();
				arrow.draw(shaderProgram);
				
				if(pCounter == 0){
					portalEntity = new Entity("portal",models["cylinder"],textures["portal2"],[p.position.x, p.position.z, p.position.y]);
					portal = new Portal(portalEntity, p);
				} 
				else if(pCounter == 7){
					portalEntity = new Entity("portal",models["cylinder"],textures["portal3"],[p.position.x, p.position.z, p.position.y]);
					portal = new Portal(portalEntity, p);
				} 
				else if(pCounter == 14){
					portalEntity = new Entity("portal",models["cylinder"],textures["portal4"],[p.position.x, p.position.z, p.position.y]);
					portal = new Portal(portalEntity, p);
				} 
				
				if(pCounter == 21){
						//console.log("x:"+sphereBody.position.x);
						//console.log("y:"+sphereBody.position.y);
						//console.log("z:"+sphereBody.position.z);
					pCounter = -1;
				}
				pCounter++;
			
			}
			//
			
            player.update();
            player.draw(shaderProgram);

            light.calculateLightColor();

            terrain.update();
            terrain.draw(shaderProgram);

			key.update();
			key.draw(shaderProgram);
						
			portal.update();
			portal.draw(shaderProgram);
			
			for(var i = 0; i < coins.length; i++){
				coins[i].update();
				coins[i].draw(shaderProgram);
			}

        }
    }, 16);
}

// Given an X,Y in 1st quadrant cartesian coordinates give the corresponding screen coordinate

