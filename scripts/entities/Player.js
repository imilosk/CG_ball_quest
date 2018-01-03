
function Player(camera, entity, terrain, sphereBody){
    this.camera = camera;
    this.entity = entity;
    this.terrain = terrain;

    this.run_speed = 0.5;
    this.sphereBody = sphereBody;

    this.deltaX = 0;
    this.deltaZ = 0;
    this.rotX = 0;
    this.rotZ = 0;
    this.inputVelocity = new CANNON.Vec3(0, 0, 0);
    this.jumpVector = new CANNON.Vec3(0, 0, 115);

    //this.setUp();
    this.setup();
};

Player.prototype.setup = function () {
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
};

var moveForward = false,
    moveLeft = false,
    moveBackward = false,
    moveRight = false,
    timesPressed = 0;

var increaseRight,
    increaseLeft,
    increaseUp,
    increaseDown;

var onKeyDown = function ( event ) {

    switch ( event.keyCode ) {

        case 87: // w
            moveForward = true;
            break;

        case 65: // a
            moveLeft = true; 
			break;

        case 83: // s
            moveBackward = true;
            break;

        case 68: // d
            moveRight = true;
            break;

        case 32: // space
            timesPressed += 1;
            break;

        case 39: // right arrow
            increaseRight = true;
            break;

        case 37: // left arrow
            increaseLeft = true;
            break;

        case 38: // up arrow
            increaseUp = true;
            break;

        case 40: // down arrow
            increaseDown = true;
            break;

    }

};

var onKeyUp = function ( event ) {

    switch( event.keyCode ) {

        case 87: // w
            moveForward = false;
            break;

        case 65: // a
            moveLeft = false;
            break;

        case 83: // a
            moveBackward = false;
            break;

        case 68: // d
            moveRight = false;
            break;

        case 39: // right arrow
            increaseRight = false;
            break;

        case 37: // left arrow
            increaseLeft = false;
            break;

        case 38: // up arrow
            increaseUp = false;
            break;

        case 40: // down arrow
            increaseDown = false;
            break;

    }

};

Player.prototype.handleKeys = function () {
    this.moveCamera();
    this.distance = this.run_speed * lastFrameTime;
    this.move();
    this.jump();
};

Player.prototype.moveCamera = function () {
    if (increaseRight){
        this.entity.increaseRotation(0,-1,0);
    } else if (increaseLeft){
        this.entity.increaseRotation(0,1,0);
    } else if (increaseUp){
        camera.pitch -= 0.8;
    } else if (increaseDown){
        camera.pitch += 0.8;
    }
};

Player.prototype.move = function () {

    var force = 2;

    var angle = this.entity.rotation[1];
    var dz = Math.cos(degToRad(angle));
    var dx = Math.sin(degToRad(angle));

    var angle2 = 180 - this.entity.rotation[1];
    var dz2 = Math.cos(degToRad(angle2));
    var dx2 = Math.sin(degToRad(angle2));

    this.deltaX = 0;
    this.deltaZ = 0;

    if (moveForward) {
        this.deltaX = force * dx;
        this.deltaZ = force * dz;
    }
    if (moveBackward){
        this.deltaX = -force * dx;
        this.deltaZ = -force * dz;
    }
    if (moveLeft){
        this.deltaX = -force * dz2;
        this.deltaZ = -force * dx2;
    }
    if (moveRight){
        this.deltaX = force * dz2;
        this.deltaZ = force * dx2;
    }

    //console.log(this.sphereBody.quaternion.x);

    this.inputVelocity.x = this.deltaX;
    this.inputVelocity.y = this.deltaZ;

    this.sphereBody.applyImpulse(this.inputVelocity, this.sphereBody.position);

};

function coinHit(){ //disables jump when coin is hit
	timesPressed = 2;
}

Player.prototype.jump = function(){
    var that = this;
    that.sphereBody.addEventListener("collide", function () {
        //console.log("Collision detected");
        timesPressed = 0;
    });

    if (timesPressed == 1){
        //this.sphereBody.velocity.z = 5;
        this.sphereBody.applyImpulse(this.jumpVector, this.sphereBody.position);
		var audio = new Audio('./res/jump.wav');
			audio.play();
        timesPressed++;
    }
};

Player.prototype.update = function () {
    this.handleKeys();

    player.entity.setX(sphereBody.position.x);
    player.entity.setY(sphereBody.position.z);
    player.entity.setZ(sphereBody.position.y);

    //player.entity.increaseRotation(1, 0, 0);

    //console.log(this.sphereBody.torque);


    this.entity.update();
};

Player.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
};


