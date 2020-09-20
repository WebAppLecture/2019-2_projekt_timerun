import * as Constants from "./constants.js"

export default class Player {

    constructor(){
        this.widthPlayer=10;
        this.heightPlayer=35;
        this.xPosPlayer=30;
        this.yPosPlayer=Constants.lineYpos-this.heightPlayer;

        this.maxJumpHeightPlayer=Constants.lineYpos-100;
        this.maxHeightPlayer=this.heightPlayer;

        this.isJumping=false;
        this.isDucking=false;
        this.color = Constants.firstColor;
    }

    drawPlayer(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPosPlayer,this.yPosPlayer,this.widthPlayer,this.heightPlayer);
        ctx.stroke();
    }

    movePlayer(){
        this.jump();
        this.duck();
    }

    jump () {
        if(this.isJumping===true){
            this.updatePlayerToJump();
        }
        else {
            this.updatePlayerToLand();
        }
    }

    duck () {
        if(this.isDucking===true){
            this.updatePlayerToDuck();
        }
        else {
            this.updatePlayerToStand();
        }
    }

    updatePlayerToJump(){
        if(this.yPosPlayer>this.maxJumpHeightPlayer){
            this.yPosPlayer -= 2;
        }
        else{
            this.isJumping=false;
        } 
    }

    updatePlayerToLand(){
        if(this.yPosPlayer+this.heightPlayer<Constants.lineYpos){
            this.yPosPlayer += 2;
        }
    }

    updatePlayerToDuck(){
        if(this.heightPlayer > this.maxHeightPlayer/2){
            this.heightPlayer--;
        }
        else {
            this.isDucking=false;
        }
    }

    updatePlayerToStand(){
        if(this.heightPlayer < this.maxHeightPlayer){
            this.yPosPlayer--;
            this.heightPlayer++;
        }
    }
}