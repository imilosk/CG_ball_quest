function Coin(entity, body){
    this.entity = entity;
    this.body = body;
	this.found = false;
};

Coin.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
};

Coin.prototype.update = function () {
	var that = this;
	this.entity.increaseRotation(0,-1.5,0);
	that.body.addEventListener("collide", function () {
		if(!this.found){
			coinHit(); // calls function in player to disable jump
			var audio = new Audio('./res/coin.wav');
			audio.play();
			
			increasePoints();
			that.entity.setScale(0,0,0);
			this.found=true;
		}
	});
	this.entity.update();
};