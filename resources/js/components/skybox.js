function Skybox(textures, program){
    this.textures = textures
    this.program = program;
    this.locations = {};
    this.vao;

    this.init=function(){
        this.loadLocations();
        skyboxVertPos = new Float32Array(
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
    };

    this.loadLocations=function(){
        this.locations['env_u_day_texture'] = gl.getUniformLocation( this.program, "env_u_day_texture");
        this.locations['env_u_night_texture'] = gl.getUniformLocation( this.program, "env_u_night_texture");
        this.locations['env_inverseViewProjMatrix'] = gl.getUniformLocation( this.program, "env_inverseViewProjMatrix");
        this.locations['env_in_position'] = gl.getAttribLocation( this.program, "env_in_position");
        this.locations['radians_over_time'] = gl.getUniformLocation( this.program, "radians_over_time");
    };

    this.draw=function(now, perspectiveMatrix, viewMatrix){
            gl.useProgram(this.program);

			gl.activeTexture(this.textures[0].slot);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[0].texture);
			gl.uniform1i(this.locations['env_u_day_texture'], utils.getTextureSlotOffset(gl,this.textures[0].slot));

			gl.activeTexture(this.textures[1].slot);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.textures[1].texture);
			gl.uniform1i(this.locations['env_u_night_texture'], utils.getTextureSlotOffset(gl,this.textures[1].slot));

			var viewProjMat = utils.multiplyMatrices(perspectiveMatrix, viewMatrix);
			inverseViewProjMatrix = utils.invertMatrix(viewProjMat);
			gl.uniformMatrix4fv(this.locations['env_inverseViewProjMatrix'], gl.FALSE, utils.transposeMatrix(inverseViewProjMatrix));

			gl.uniform1f(this.locations['radians_over_time'], now);

			gl.bindVertexArray(this.vao);
			gl.depthFunc(gl.LEQUAL);
			gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);
    }

    this.init();
}