class PbrFloor extends PbrLabyrinthElementh{
    constructor(structure, parent, program, texture){
        super(structure, parent, program, texture);
    }

    init(){
        super.init();
    }

    /**
     * function to create the vertex array object
     */
     loadVAO() {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        let vertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.vertPosition);
        gl.vertexAttribPointer(
            this.program.vertPosition,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 // Offset from the beginning of a single vertex to this attribute
        );

        var texCoordBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.texCoord);
        gl.vertexAttribPointer(
            this.program.texCoord,
            2,
            gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        var indexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        var normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.program.normal);
		gl.vertexAttribPointer(
            this.program.normal,
            3,
            gl.FLOAT,
            gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );
    }

    loadComponent() {
        let floor3D = labyrinthUtils.compute3DFloor(this.structure, 0.0, 1.0, 1.0);
        this.vertices = floor3D[0];
        this.indices = floor3D[1];
        this.colours = floor3D[2];
        this.normals = floor3D[3];
        this.uvs = floor3D[4];
    }

    draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now){
       // super.draw(perspectiveMatrix, viewMatrix);
        
        let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, this.worldMatrix);
        let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        //skybox.bindMaps(this.program);
        gl.uniformMatrix4fv(this.program.projMatrix, gl.FALSE, utils.transposeMatrix(projectionMatrix));
        gl.uniformMatrix4fv(this.program.worldMatrix, gl.FALSE, utils.transposeMatrix(this.worldMatrix));
        gl.activeTexture(this.texture.albedoSlot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.albedo);
        gl.uniform1i(this.program.albedoMap, utils.getTextureSlotOffset(gl, this.texture.albedoSlot));

        gl.activeTexture(this.texture.normalSlot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.normal);
        gl.uniform1i(this.program.normalMap, utils.getTextureSlotOffset(gl, this.texture.normalSlot));

        gl.activeTexture(this.texture.metallicSlot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.metallic);
        gl.uniform1i(this.program.metallicMap, utils.getTextureSlotOffset(gl, this.texture.metallicSlot));

        gl.activeTexture(this.texture.roughnessSlot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.roughness);
        gl.uniform1i(this.program.roughnessMap, utils.getTextureSlotOffset(gl, this.texture.roughnessSlot));
        //console.log(this);
        gl.activeTexture(this.texture.aoSlot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.ao);
        gl.uniform1i(this.program.aoMap, utils.getTextureSlotOffset(gl, this.texture.aoSlot));
        gl.uniform3f(this.program.lightPosition, light.position.x, light.position.y, light.position.z);
        gl.uniform3f(this.program.lightColor, light.color.r, light.color.g, light.color.b);
        console.log(light);
        gl.uniform1f(this.program.ConeOut, light.coneOut);
        gl.uniform1f(this.program.ConeIn, light.coneIn);
        gl.uniform1f(this.program.radians_over_time, utils.degToRad(now % 360));
        gl.uniform3f(this.program.lightDir, light.direction.x, light.direction.y, light.direction.z);
        gl.uniform3f(this.program.camPos, camPos.x, camPos.y, camPos.z);
        gl.uniform3f(this.program.ambientLightDay, skybox.textures[0].ambientLight.r,skybox.textures[0].ambientLight.g,skybox.textures[0].ambientLight.b);
        gl.uniform3f(this.program.ambientLightNight, skybox.textures[1].ambientLight.r,skybox.textures[1].ambientLight.g,skybox.textures[1].ambientLight.b);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    loadLocations(){

        //VERTEX
        
        this.program.texCoord = gl.getAttribLocation(this.program, 'texCoord');
        this.program.normal = gl.getAttribLocation(this.program, 'normal');
        this.program.projMatrix= gl.getUniformLocation(this.program, 'projMatrix');
        this.program.worldMatrix= gl.getUniformLocation(this.program, 'worldMatrix');
        this.program.vertPosition= gl.getAttribLocation(this.program, 'vertPosition');
        
        //FRAGMENT
        this.program.ambientLightDay = gl.getUniformLocation(this.program, 'ambientLightDay');
        this.program.ambientLightNight = gl.getUniformLocation(this.program, 'ambientLightNight');
        this.program.albedoMap = gl.getUniformLocation(this.program, 'albedoMap');
        this.program.normalMap = gl.getUniformLocation(this.program, 'normalMap');
        this.program.metallicMap = gl.getUniformLocation(this.program, 'metallicMap');
        this.program.roughnessMap = gl.getUniformLocation(this.program, 'roughnessMap');
        this.program.aoMap = gl.getUniformLocation(this.program, 'aoMap');
        this.program.lightPosition = gl.getUniformLocation(this.program, 'lightPosition');
        this.program.lightColor = gl.getUniformLocation(this.program, 'lightColor');
        this.program.ConeOut = gl.getUniformLocation(this.program, 'ConeOut');
        this.program.ConeIn = gl.getUniformLocation(this.program, 'ConeIn');
        this.program.lightDir = gl.getUniformLocation(this.program, 'lightDir');
        this.program.camPos = gl.getUniformLocation(this.program, 'camPos');
        this.program.radians_over_time = gl.getUniformLocation(this.program, 'radians_over_time');
    }
}