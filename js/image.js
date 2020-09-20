import Obstacle from "./obstacle.js";

export default class ImageObstacle extends Obstacle{

    constructor(rectX, rectY, height, width, imgSource, imgX, imgY, imgWidth, imgHeight) {
        super(rectX,rectY,height,width, "red");
        this.imgSource = imgSource;
        this.imgX = imgX;
        this.imgY = imgY;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
    }

    drawObstacle(ctx){
        ctx.drawImage(this.imgSource, this.imgX, this.imgY, this.height, this.width, this.rectX, this.rectY, this.imgWidth, this.imgHeight);
    }
}