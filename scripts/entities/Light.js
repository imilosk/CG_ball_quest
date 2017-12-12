
function Light(position){
    this.position = position;
    this.ambientColor = [0.878, 1, 1];
    this.pointColor = [0.1, 0.0, 0.1];
    this.specularColor = [0.933, 0.510, 0.933];
}

Light.prototype.calculateLightColor = function (){

    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        this.ambientColor[0],
        this.ambientColor[1],
        this.ambientColor[2]
    );

    gl.uniform3f(
        shaderProgram.uPointLightLocation,
        this.position[0],
        this.position[1],
        this.position[2]
    );

    gl.uniform3f(
        shaderProgram.uPointLightColor,
        this.pointColor[0],
        this.pointColor[1],
        this.pointColor[2]
    );

    gl.uniform3f(
        shaderProgram.pointLightingSpecularColorUniform,
        this.specularColor[0],
        this.specularColor[1],
        this.specularColor[2]
    );

}


function calculateSpecular(reflectivity) {
    gl.uniform1f(shaderProgram.materialShininessUniform, reflectivity);
}