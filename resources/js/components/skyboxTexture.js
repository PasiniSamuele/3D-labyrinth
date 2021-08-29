/*******************
 * SkyboxTexture.js
 ******************/

/**
 * Object that represents a Texture (pack) of a Skybox
 */
class SkyboxTexture {
    /**
     * 
     * @param { object } faceInfos Images of the faces info
     * @param { object } slot gl.TEXTURE slot for this Texture
     */
    constructor(faceInfos, ambientLight,  slot) {
        this.faceInfos = faceInfos;
        this.slot = slot;
        this.ambientLight = ambientLight;
        this.init();
    }

    /**
     * Function to initialize the Skybox Texture
     */
    init() {
        this.texture = gl.createTexture();
        gl.activeTexture(this.slot);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        let scope = this;
        this.faceInfos.forEach((faceInfo) => {

            let target = utils.computeTargetFace(faceInfo.target);
            let url = faceInfo.url;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 1024;
            const height = 1024;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            // setup each face so it's immediately renderable
            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function () {
                // Now that the image has loaded upload it to the texture.
                gl.activeTexture(scope.slot);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, scope.texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
}