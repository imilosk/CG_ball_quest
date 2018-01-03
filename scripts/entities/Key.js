function Key(entity, body){
    this.entity = entity;
    this.body = body;
};

Key.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
};

var found = false;

Key.prototype.update = function () {
	var that = this;
	this.entity.increaseRotation(0,-1.5,0);
	that.body.addEventListener("collide", function () {
		if(!found){
			kFound();
			that.entity.setScale(0,0,0);
			document.getElementById("misija").innerText = "POIŠČI IZHOD";
			var keyAudio = new Audio('./res/coin.wav');
			keyAudio.play();
			found = true;
		}
	});
	this.entity.update();
};