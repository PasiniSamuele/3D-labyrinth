/*******************
 * PbrTexture.js
 ******************/

/**
 * PbrTexture object
 */
 class PbrTexture {

	/**
	 * Constructor
	 * @param {*} imageUrls 
	 * @param {*} albedoSlot 
	 * @param {*} normalSlot 
	 * @param {*} metallicSlot 
	 * @param {*} roughnessSlot 
	 * @param {*} aoSlot 
	 */
    constructor(imageUrls, albedoSlot, normalSlot, metallicSlot, roughnessSlot, aoSlot, shadowSlot){
        this.imageUrls = imageUrls;
        this.albedoSlot = albedoSlot;
        this.normalSlot = normalSlot;
        this.metallicSlot = metallicSlot;
        this.roughnessSlot = roughnessSlot;
        this.aoSlot = aoSlot;
        this.shadowSlot = shadowSlot;
    }

	/**
	 * Init function
	 */
    init(){
        this.albedo = this.loadTexture(this.albedoSlot, this.imageUrls.albedo);
        this.normal =this.loadTexture(this.normalSlot, this.imageUrls.normal);
        this.metallic =this.loadTexture(this.metallicSlot, this.imageUrls.metallic);
        this.roughness =this.loadTexture(this.roughnessSlot, this.imageUrls.roughness);
        this.ao =this.loadTexture(this.aoSlot, this.imageUrls.ao);
        this.shadows =this.loadTexture(this.shadowSlot, this.imageUrls.shadows);
    }

	/**
	 * loadTexture function
	 * @param {*} slot 
	 * @param {*} url 
	 * @returns 
	 */
    loadTexture(slot, url) {
        let texture = gl.createTexture();
        gl.activeTexture(slot);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // put a 1x1 red pixel in the texture so it's renderable immediately
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));

        const image = new Image();
        image.src = url;
        image.addEventListener('load', function () {
            
            gl.activeTexture(slot);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            //gl.generateMipmap(gl.TEXTURE_2D);
        });
        return texture;
    }
}