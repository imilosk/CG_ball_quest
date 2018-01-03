texturesLoaded = 0;

var texturePaths = ["./res/grassy.png", "./res/house.png",
                    "./res/person.png", "./res/heightmap2.png",
                    "./res/snow.png", "./res/terrain01.png",
                    "./res/myHeightmap.png", "./res/key.png",
					"./res/portal1.png", "./res/portal2.png",
					"./res/portal3.png", "./res/portal0.png",
					"./res/portal4.png", "./res/coin.png"];
var textures = {};

function initTextures() {

    var name;
    for(var n = 0; n < texturePaths.length; n++) {
        name = texturePaths[n].split("/")[2].replace(".png", "");
        (function(name) {
            textures[name] = gl.createTexture();
            textures[name].image = new Image();
            textures[name].image.onload = function() {
                handleTextureLoaded(textures[name]);
                textures[name].ready = true;
            };
            textures[name].image.src = texturePaths[n];
        })(name);
    }

}


function handleTextureLoaded(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);
    texturesLoaded += 1;
}