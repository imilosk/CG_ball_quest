
function Entity(name, model, texture, position){
    //Position and rotation of the entity
    this.name = name;
    this.position = position;
    this.texture = texture;
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];

    //Model view Matrix
    this.mvMatrix = mat4.create();
    // Buffers
    this.vbo = model[0];
    this.vertices = model[1];
    this.tbo = model[2];
    this.textureCoord = model[3];
    this.ibo = model[4];
    this.indices = model[5];

    if (model[6]){
        this.nbo = model[6];
        this.normalsCoord = model[7];
    }

    // Lights
    this.reflectivity = 32;
}

Entity.prototype.draw = function (shaderProgram) {

    mvMatrix = this.mvMatrix;
    calculateSpecular(this.reflectivity);

    // Bind VBO (vertices)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vbo.itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    //Bind TBO (texture)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.tbo.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    // Set the normals attribute for vertices.
    if (this.nbo){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.nbo.itemSize, gl.FLOAT, false, 0, 0);
    }

    // Bind IBO (indices)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);


    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.ibo.numItems, gl.UNSIGNED_SHORT, 0);
    //gl.drawElements(gl.LINE_STRIP, this.ibo.numItems, gl.UNSIGNED_SHORT, 0);

    //UNBind Buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
};


Entity.prototype.increasePosition = function(dx, dy, dz){
    this.position[0] += dx;
    this.position[1] += dy;
    this.position[2] += dz;
};
Entity.prototype.setX = function(x){
    this.position[0] = x;
};
Entity.prototype.setY = function(y){
    this.position[1] = y;
};
Entity.prototype.setZ = function(z){
    this.position[2] = z;
};
Entity.prototype.increaseRotation = function (dx, dy, dz){
    this.rotation[0] += dx;
    this.rotation[1] += dy;
    this.rotation[2] += dz;
};
Entity.prototype.increaseScale = function (sx, sy, sz) {
    this.scale[0] += sx;
    this.scale[1] += sy;
    this.scale[2] += sz;
};
Entity.prototype.setPosition = function(position){
    this.position = position;
};
Entity.prototype.setRotation = function(rotation){
    this.rotation = [rotation[0], rotation[1], rotation[2]];
};
Entity.prototype.setScale = function(scale){
    this.scale = scale;
};
Entity.prototype.update = function () {
    mat4.identity(this.mvMatrix);
    mat4.translate(this.mvMatrix, this.mvMatrix, this.position);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.rotation[0]), [1, 0, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.rotation[1]), [0, 1, 0]);
    mat4.rotate(this.mvMatrix, this.mvMatrix, degToRad(this.rotation[2]), [0, 0, 1]);
    mat4.scale(this.mvMatrix, this.mvMatrix, this.scale);
};
Entity.prototype.setReflectivity = function(reflectivity) {
    this.reflectivity = reflectivity;
};

function degToRad(angle){
    return angle * (Math.PI / 180);
};

function radToDeg(angle){
    return angle * 180 / Math.PI;
};
