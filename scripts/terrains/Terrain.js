
function Terrain(name, texture, position){
    this.heights = [];
    this.entity;
    this.name = name;
    this.texture = texture;
    this.position = position;
    this.mvMatrix;
}

Terrain.prototype.update = function () {
    gl.uniform1i(shaderProgram.isTerrain, true);
    this.entity.update();
};

Terrain.prototype.draw = function (shaderProgram) {
    this.entity.draw(shaderProgram);
    gl.uniform1i(shaderProgram.isTerrain, false);
};

Terrain.prototype.getHeightOfTerrain = function(worldX, worldZ, terrain){
    var terrainX = worldX - terrain.position[0];
    var terrainZ = worldZ - terrain.position[2];
    var gridSquareSize = this.SIZE / (this.heights.length - 1);
    var gridX = Math.floor(terrainX / gridSquareSize);
    var gridZ = Math.floor(terrainZ / gridSquareSize);

    return this.heights[gridX][gridZ];
};

Terrain.prototype.calculateNormal = function(x, z) {
    var heightL = this.getHeight(x - 1, z);
    var heightR = this.getHeight(x + 1, z);
    var heightD = this.getHeight(x, z - 1);
    var heightU = this.getHeight(x, z + 1);

    var normal = vec3.fromValues(heightL - heightR, 2.0, heightD - heightU);
    vec3.normalize(normal, normal);

    return normal;
};

Terrain.prototype.getHeight = function (x, z) {
    if (x < 0 || x >= this.SIZE || z < 0 || z >= this.SIZE)
        return 0;
    return this.heights[x][z];
};