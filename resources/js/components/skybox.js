/*******************
 * Skybox.js
 ******************/

/**
 * Class that represents a Skybox
 */
class Skybox {

    /**
     * Constructor
     * @param { object } textures textures used by the skybox
     * @param { object } program gl program associated to the object
     */
    constructor(textures, program, lightDir) {
        this.textures = textures;
        this.program = program;
        this.lightDir = lightDir;
        this.locations = {};
        this.init();
    }

    /**
     * function to initialize the skybox
     */
    init() {
        this.loadLocations();
        let skyboxVertPos = new Float32Array(
            [
                -1, -1, 1.0,
                1, -1, 1.0,
                -1, 1, 1.0,
                -1, 1, 1.0,
                1, -1, 1.0,
                1, 1, 1.0,
            ]);

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, skyboxVertPos, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.locations['env_in_position']);
        gl.vertexAttribPointer(this.locations['env_in_position'], 3, gl.FLOAT, false, 0, 0);
    }

    /**
     * function to fill the map with GLSL attributes and uniforms
     */
    loadLocations() {
        this.locations['env_u_day_texture'] = gl.getUniformLocation(this.program, "env_u_day_texture");
        this.locations['env_u_night_texture'] = gl.getUniformLocation(this.program, "env_u_night_texture");
        this.locations['env_inverseViewProjMatrix'] = gl.getUniformLocation(this.program, "env_inverseViewProjMatrix");
        this.locations['env_in_position'] = gl.getAttribLocation(this.program, "env_in_position");
        this.locations['radians_over_time'] = gl.getUniformLocation(this.program, "radians_over_time");
    }

    /**
     * Function to draw the skybox
     * @param { number} now time instant
     * @param { object } perspectiveMatrix 
     * @param { object } viewMatrix 
     */
    draw(now, perspectiveMatrix, viewMatrix) {
        gl.useProgram(this.program);

        gl.activeTexture(this.textures[0].slot);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[0].texture);
        gl.uniform1i(this.locations['env_u_day_texture'], utils.getTextureSlotOffset(gl, this.textures[0].slot));

        gl.activeTexture(this.textures[1].slot);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[1].texture);
        gl.uniform1i(this.locations['env_u_night_texture'], utils.getTextureSlotOffset(gl, this.textures[1].slot));

        let viewProjMat = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
        let inverseViewProjMatrix = utils.invertMatrix(viewProjMat);
        gl.uniformMatrix4fv(this.locations['env_inverseViewProjMatrix'], gl.FALSE, utils.transposeMatrix(inverseViewProjMatrix));
        //var time = ((new Date()).getTime()*0.003)%6.28;
        gl.uniform1f(this.locations['radians_over_time'], utils.degToRad(now % 360));
        gl.bindVertexArray(this.vao);
        gl.depthFunc(gl.LEQUAL);
        gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    }
}