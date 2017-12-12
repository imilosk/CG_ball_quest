
var models = {};
var modelPaths = ["./res/grass.json", "./res/person.json", "./res/ball.json"];
var modelsLoaded = 0;

function initModels() {
    for(var n = 0; n < modelPaths.length; n++) {
        (function(filePath) {
            var modelName = filePath.split("/")[2].replace(".json", "");
            var request = new XMLHttpRequest();
            request.open("GET", filePath);
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    var content = parseContent(JSON.parse(request.responseText));
                    bindModel(models, modelName, content);
                    models[modelName].ready = true;
                }
            };
            request.send();

        })(modelPaths[n]);
    }
}

function parseContent(content){

    var vertices = content.meshes[0].vertices;
    var indices = content.meshes[0].faces;
    indices = [].concat.apply([], indices);
    var textureCoords = content.meshes[0].texturecoords;
    textureCoords = textureCoords[0];
    var normals = content.meshes[0].normals;

    /*
    var vertices = content.vertices;
    var normals = content.normals;
    var indices = content.indices;
    var textureCoords = content.textureCoords;
    */

    /*
    content = content.geometries[3].data;

    var vertices = content.vertices;
    var normals = content.normals;
    var indices = content.faces;
    var textureCoords = content.uvs[0];
    */

    return {"vertices" : vertices,
        "normals" : normals,
        "indices" : indices,
        "textureCoords" : textureCoords};
}


function bindModel(models, modelName, content){
    var vbo = bindVertexBuffer(content["vertices"]);
    models[modelName] = [vbo];
    models[modelName].push(content["vertices"]);

    var tbo = bindTextureBuffer(content["textureCoords"]);
    models[modelName].push(tbo);
    models[modelName].push(content["textureCoords"]);

    var ibo = bindIndicesBuffer(content["indices"]);
    models[modelName].push(ibo);
    models[modelName].push(content["indices"]);

    if (content["normals"]){
        var nbo = bindNormalsBuffer(content["normals"]);
        models[modelName].push(nbo);
        models[modelName].push(content["normals"]);
    }

    modelsLoaded += 1;
}

//Creates VBO
function bindVertexBuffer(vertices){

    var vertexBufferObject = gl.createBuffer();
    var itemSize = 3;
    var numItems = vertices.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    vertexBufferObject.itemSize = itemSize;
    return vertexBufferObject;
}

// Creates IBO
function bindIndicesBuffer(indices){
    var indicesBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    indicesBufferObject.numItems = indices.length;
    return indicesBufferObject

}

// Creates TBO
function bindTextureBuffer(textureCoords){
    var textureBufferObject = gl.createBuffer();
    //if(textureCoord){
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        textureBufferObject.itemSize = 2;
        textureBufferObject.numItems = textureCoords.length / 2;
        return textureBufferObject

    //}
}

// Creates NBO
function bindNormalsBuffer(normals){
    var normalBufferObject = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    normalBufferObject.itemSize = 3;
    normalBufferObject.numItems = normals.length / 3;
    return normalBufferObject
}
