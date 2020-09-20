export default class Obstacle{

    constructor(rectX,rectY,height,width, color){
        this.height = height;
        this.width = width;
        this.rectX = rectX;
        this.rectY = rectY;
        this.color = color;
    }
    
    update(width){
        if(this.rectX >= -width) {
            this.rectX -= 2;
        }
    }

    drawObstacle(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.rectX,this.rectY, this.width, this.height);
    }

    static isCollide(object,player){
        let playerX = player.xPosPlayer,
            playerY = player.yPosPlayer,
            playerW = player.widthPlayer,
            playerH = player.heightPlayer;
        if(player!=null && (playerY<(object.rectY + object.height)) && ((object.rectY + object.height)< (playerY+playerH))&&(object.rectX <(playerX + playerW)) && (object.rectX >= playerX) ||
        (object.rectY < (playerY + playerH)) && (object.rectX <= (playerX + playerW)) && (object.rectY > playerY ) && (object.rectX >= playerX)){
            return true;
        }
        return false;
    }

}