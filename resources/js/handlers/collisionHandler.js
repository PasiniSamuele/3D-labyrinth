function CollisionHandler(){
    this.structure=[];

    this.checkCameraCollision = function(camerax,cameraz){
        return mazeElement.BLOCKS.includes(this.structure[Math.floor(cameraz)][Math.floor(camerax)])
    }

    this.setStructure = function(str){
        this.structure = str;
    }
}