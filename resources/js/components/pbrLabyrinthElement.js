class PbrLabyrinthElementh{
    constructor(structure, parent, program, texture){
        this.program = program;
        this.parent = parent;
        this.structure = structure;
        this.texture=texture;

        this.children = [];
        this.localMatrix = utils.identityMatrix();
        this.worldMatrix = utils.identityMatrix();
        this.projectionMatrix = [];
        this.vao = null;
    }

    init(){
        this.loadLocations();
        this.loadComponent();
        this.loadVAO();
        this.loadTexture();

        this.children.forEach(child => child.init());
    }

    loadLocations(){

    }
    loadComponent(){}
    loadVAO(){}
    loadTexture(){
        this.texture.init();
    }

    updateWorld(matrix){
        if (matrix) {
            // a matrix was passed in so do the math
            this.worldMatrix = utils.multiplyMatrices(matrix, this.localMatrix);
        } else {
            // no matrix was passed in so just copy.
            utils.copy(this.localMatrix, this.worldMatrix);
        }
    
        // now process all the children
        var worldMatrix = this.worldMatrix;
        this.children.forEach(function(child) {
        child.updateWorldMatrix(worldMatrix);
        });
    }

    draw(perspectiveMatrix, viewMatrix, light, camPos, skybox, now){
        this.children.forEach(child => child.draw(perspectiveMatrix, viewMatrix));
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