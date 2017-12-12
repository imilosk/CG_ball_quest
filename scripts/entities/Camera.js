
function Camera(player){
    this.position = [0, 0, 0];
    this.pitch = 25;
    this.yaw = 0;
    this.roll = 0;
    this.mvMatrix = mat4.create();
    this.entity = player;

    this.distanceFromPlayer = 5;
    this.angleAroundPlayer  = 0;
}

Camera.prototype.move = function () {
    var horizontalDistance = this.calculateHorizontalDinstance();
    var verticalDistance = this.calculateVerticalDinstance();
    this.calculateCameraPosition(horizontalDistance, verticalDistance);
    this.yaw = 180 - (this.entity.rotation[1] + this.angleAroundPlayer);
};

Camera.prototype.createViewMatrix = function (){
    mat4.identity(this.mvMatrix);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.pitch), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.yaw), [0, 1, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.roll), [0, 0, 1]);
    var negativeCameraPosition = [-this.position[0], -this.position[1], -this.position[2]];
    mat4.translate(this.mvMatrix, this.mvMatrix, negativeCameraPosition);
};

Camera.prototype.updateMatrix = function () {
    this.createViewMatrix();
    gl.uniformMatrix4fv(shaderProgram.cameraMatrix, false, this.mvMatrix);
};

Camera.prototype.calculateHorizontalDinstance = function(){
    return this.distanceFromPlayer * Math.cos(degToRad(this.pitch));
};

Camera.prototype.calculateVerticalDinstance = function(){
    return this.distanceFromPlayer * Math.sin(degToRad(this.pitch));
};

Camera.prototype.calculateCameraPosition = function (horizontalDistance, verticalDistance) {
    var theta = this.entity.rotation[1] + this.angleAroundPlayer;
    var offsetX = horizontalDistance * Math.sin(degToRad(theta));
    var offsetZ = horizontalDistance * Math.cos(degToRad(theta));
    this.position[0] = this.entity.position[0] - offsetX;
    this.position[2] = this.entity.position[2] - offsetZ;
    this.position[1] = this.entity.position[1] + verticalDistance;
};
