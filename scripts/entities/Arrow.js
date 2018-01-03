function Arrow(entity){
    this.entity = entity;
};

Arrow.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
};

var down = true;

Arrow.prototype.update = function () {
	if(this.entity.position[1] > 4.9 && down)
		this.entity.setY(this.entity.position[1]-0.05);
	if(down && this.entity.position[1] <= 5)
		down=false;
				
	if(this.entity.position[1] < 7.1 && !down)
		this.entity.setY(this.entity.position[1]+0.05);
	if(!down && this.entity.position[1] >=7)
		down=true;
			
	this.entity.update();
};