
function HeightMapTerrain(name, texture, position, heightmap){
    Terrain.call(this, name, texture, position);
    this.SIZE = 255;
    this.VERTEX_COUNT = 255;
    this.MAX_HEIGHT = 30;
    this.heightmap = heightmap;
    this.imagePixels;
    this.getHeightData(heightmap);
}

HeightMapTerrain.prototype = new Terrain();

HeightMapTerrain.prototype.generateTerrain = function(){

    var vertices = [],
        normals = [],
        textureCoords = [],
        indices = [];


    for (var i = 0; i < this.VERTEX_COUNT; i++){
        this.heights[i] = [];
    }

    var vertexPointer = 0;
    for (var i = 0; i < this.VERTEX_COUNT; i++){
        for (var j = 0; j < this.VERTEX_COUNT; j++){
            vertices[vertexPointer * 3] = j / (this.VERTEX_COUNT - 1) * this.SIZE;
            var height = this.generateHeight(j, i, this.heightmap);
            this.heights[j][i] = height;
            vertices[vertexPointer * 3 + 1] = height;
            vertices[vertexPointer * 3 + 2] = i / (this.VERTEX_COUNT - 1) * this.SIZE;

            var normal = this.calculateNormal(i, j);
            normals[vertexPointer * 3] = normal[0];
            normals[vertexPointer * 3 + 1] = normal[1];
            normals[vertexPointer * 3 + 2] = normal[2];

            textureCoords[vertexPointer * 2] = j / (this.VERTEX_COUNT - 1);
            textureCoords[vertexPointer * 2 + 1] = i /(this.VERTEX_COUNT - 1);

            vertexPointer++;
        }
    }

    var pointer = 0;

    for (var gz = 0; gz < this.SIZE - 1; gz++){
        for (var gx = 0; gx < this.SIZE - 1; gx++){
            var topLeft = (gz * this.SIZE) + gx;
            var topRight = topLeft + 1;
            var bottomLeft = ((gz + 1) * this.SIZE) + gx;
            var bottomRight = bottomLeft + 1;
            indices[pointer++] = topLeft;
            indices[pointer++] = bottomLeft;
            indices[pointer++] = topRight;
            indices[pointer++] = topRight;
            indices[pointer++] = bottomLeft;
            indices[pointer++] = bottomRight;
        }
    }

    var content = {"vertices" : vertices,
        "normals" : normals,
        "indices" : indices,
        "textureCoords" : textureCoords};

    bindModel(models, this.name, content);
    this.entity = new Entity(this.name, models[this.name], this.texture, this.position);
    this.mvMatrix = this.entity.mvMatrix;
};

HeightMapTerrain.prototype.generateHeight = function(x, z, heightmap){
    if (x < 0 || x >= heightmap.image.height || z < 0 || z >= heightmap.image.height)
        return 0;

    var height = this.getColorOfHeightmap(x, z);

    return height * this.MAX_HEIGHT;
};

HeightMapTerrain.prototype.getHeightData = function(heightmap){
    var canvas = document.createElement('canvas');
    canvas.width = this.VERTEX_COUNT;
    canvas.height = this.VERTEX_COUNT;
    var context = canvas.getContext('2d');
    context.drawImage(heightmap.image, 0, 0);
    this.imagePixels = context;
};


HeightMapTerrain.prototype.getColorOfHeightmap = function (x, z) {
    var imgd;
    imgd = this.imagePixels.getImageData(x, z, 1, 1).data;
    var all = (Math.max(imgd[0] + imgd[1] + imgd[2]) + Math.min(imgd[0] + imgd[1] + imgd[2])) / 2;
    all = all / 3;
    all = all / 255;
    return all;
};


