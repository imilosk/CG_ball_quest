function Portal(entity, body){
    this.entity = entity;
    this.body = body;
	this.found = false;
};

Portal.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
};

Portal.prototype.update = function () {
	var that = this;
	that.body.addEventListener("collide", function () {
		if(!this.found){
			gOver();
			document.getElementById("misija").innerText = "";
			document.getElementById("konec").innerText = "       KONEC IGRE!";
			var endAudio = new Audio('/res/end.flac');
			endAudio.play();
			this.found=true;
		}
	});
	this.entity.update();
};