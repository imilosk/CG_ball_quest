//
// setMatrixUniforms
//
// Set the uniform values in shaders for model-view and projection matrix.

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    
    //
    // TODO NEW PART
    //
    var normalMatrix = mat3.create();
    toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix,normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);

    // Didn't find an element with the specified ID; abort.
    if (!shaderScript) {
        return null;
    }

    // Walk through the source element's children, building the
    // shader source string.
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            shaderSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;  // Unknown shader type
    }

    // Send the source to the shader object
    gl.shaderSource(shader, shaderSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Create the shader program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    // start using shading program for rendering
    gl.useProgram(shaderProgram);

    // store location of aVertexPosition variable defined in shader
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

    // turn on vertex position attribute at specified position
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // store location of aTextureCoord variable defined in shader
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    // turn on vertex texture coordinates attribute at specified position
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    
    //
    // TODO NEW PART
    //
    // store location of aTextureCoord variable defined in shader
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram,"aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    //
    //
    //

    // store location of uPMatrix variable defined in shader - projection matrix
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    // store location of uMVMatrix variable defined in shader - model-view matrix
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    // store location of uNMatrix variable defined in shader - normal matrix
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    // store location of uSampler variable defined in shader
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    // store location of cameraMatrix variable defined in shader - camera matrix
    shaderProgram.cameraMatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");

    //
    // Diffuse lighting
    //
    // store location of uAmbientColor variable defined in shader
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    // store location of uLightingDirection variable defined in shader
    shaderProgram.uPointLightLocation = gl.getUniformLocation(shaderProgram, "uPointLightLocation");
    // store location of uDirectionalColor variable defined in shader
    shaderProgram.uPointLightColor = gl.getUniformLocation(shaderProgram, "uPointLightColor");

    // Specular Lighting
    // store location of uPointLightingSpecularColor variable defined in shader
    shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
    shaderProgram.pointLightingSpecularColorUniform = gl.getUniformLocation(shaderProgram, "uPointLightingSpecularColor");

    shaderProgram.isTerrain = gl.getUniformLocation(shaderProgram, "isTerrain");

}

function enableCulling(){
    gl.enable(gl.CULL_FACE);
}

function disableCulling(){
    gl.disable(gl.CULL_FACE);
}

//
//
//
function toInverseMat3 (mat, dest) {
    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10];
    
    var b01 = a22*a11-a12*a21;
    var b11 = -a22*a10+a12*a20;
    var b21 = a21*a10-a11*a20;
    
    var d = a00*b01 + a01*b11 + a02*b21;
    if (!d) { return null; }
    var id = 1/d;
    
    if(!dest) { dest = mat3.create(); }
    
    dest[0] = b01*id;
    dest[1] = (-a22*a01 + a02*a21)*id;
    dest[2] = (a12*a01 - a02*a11)*id;
    dest[3] = b11*id;
    dest[4] = (a22*a00 - a02*a20)*id;
    dest[5] = (-a12*a00 + a02*a10)*id;
    dest[6] = b21*id;
    dest[7] = (-a21*a00 + a01*a20)*id;
    dest[8] = (a11*a00 - a01*a10)*id;
    
    return dest;
};
