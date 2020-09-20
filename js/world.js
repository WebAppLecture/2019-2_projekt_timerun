import Obstacle from "./obstacle.js";
import ImageObstacle from "./image.js";
import * as Constants from "./constants.js";
import Player from "./player.js";
import {loadImages} from "./ImageLoader.js";



export default class World {

    constructor(){
        this.screenElement = document.getElementById("gamescreen");

        this.screen1audio = new Audio("./audio/screen1music.mp3");
        this.screen2audio = new Audio("./audio/screen2music.mp3");
        this.screen3audio = new Audio("./audio/screen3music.mp3");
        this.gameoverAudio = new Audio("./audio/gameover.mp3");
        this.winAudio = new Audio("./audio/win.mp3");

        this.setLevel(1);

        this.canvas = document.querySelector("#myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.counter = 0;
        this.lineHeight=10;
        this.player = new Player();
        this.obstacles = [this.addObstacles(0,Constants.minYObstacle,Constants.maxYObstacle,Constants.firstColor),
        this.addObstacles(150,Constants.minYObstacle,Constants.maxYObstacle,Constants.firstColor),this.addObstacles(350,Constants.minYObstacle,Constants.maxYObstacle,Constants.firstColor)];
        window.addEventListener('keydown', this.onKeyDown.bind(this), true);

        let imagesToLoad = [
            "./img/eye_monster.png"
        ];

        loadImages(imagesToLoad).then((loadedImages) => {
            this.images = loadedImages;
            this.startGame()
        });
    }



    startGame() {
        this.draw();
        this.gameLoop();  
    }

    //draw game
    draw(){
        //screen and gorund
        this.ctx.clearRect(0, 0, 500, 300);
        this.drawLine();

        //player (color depending on #level)
        if(this.counter > 10){
            this.player.color = Constants.playerColor2;
        }
        this.player.drawPlayer(this.ctx);

        //obstacles
        for (var x = 0; x < this.obstacles.length; x++){
        this.obstacles[x].drawObstacle(this.ctx);
        }  
    }

    gameLoop() {
        for (let x = this.obstacles.length - 1; x >= 0; x--){
            this.obstacles[x].update(this.obstacles[x].width);

            if(this.obstacles[x].rectX <= -this.obstacles[x].width) { // Object leaves screen left         
                this.obstacles.shift();

                //counting obstacles for level-up
                if(this.counter < 10){
                    this.obstacles.push(this.addObstacles(0,Constants.minYObstacle,Constants.maxYObstacle, Constants.firstColor));
                    this.setLevel(1);

                } else if( 10 <= this.counter && this.counter < 23) {
                    this.obstacles.push(this.addObstacles(0,Constants.minYObstacle,Constants.maxYObstacle,Constants.secObjectColor));
                    this.setLevel(2);

                } else if (this.counter >= 23 && this.counter < 40) {
                    this.obstacles.push(this.addImageObstacle());
                    this.counter++;
                    this.setLevel(3);
                }
            }           
        } 
        
        this.player.movePlayer();
        this.draw();

        //check collision
        if(!Obstacle.isCollide(this.obstacles[0],this.player)){
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }else{
            this.gameOver();
        }

        //playern wins if he passed 40 obstacles
        if (this.counter >= 40){
            this.win();
        }
    }

    //draw ground
    drawLine(){
        this.ctx.fillStyle = Constants.firstColor;
        this.ctx.fillRect(0, Constants.lineYpos, Constants.canvasWidth, this.lineHeight);
        this.ctx.stroke();
    }



    //create obstacles
    addObstacles(space,x,y, color) {
        this.counter++;
        return new Obstacle(
            500+space,
            this.getRandomMeasurement(x,y),
            this.getRandomMeasurement(Constants.minHeight,Constants.maxMeasure),
            this.getRandomMeasurement(Constants.minWidth,Constants.maxMeasure), 
            color
            );
    }

    //create image-obstacle (level 3)
    addImageObstacle(){
        this.counter++;
        return new ImageObstacle(500,this.getRandomMeasurement(180,205),25,25,this.images[0].img,0,0,25,25)
    }

    //get random num for obstacle-position
    getRandomMeasurement(min,max){
        return Math.random()*(max-min)+min;
    }

    
    
    
    //handle key press
    onKeyDown (e) {
        if (e.keyCode === 38) {
            this.player.isJumping=true;
        }
        if (e.keyCode === 40) {
            this.player.isDucking=true;
        }
        if (e.keyCode === 32){
            this.startNewGame();
        }
    }

    

    //level is supposed valued 1 2 or 3
    setLevel(level){

        if(level === this.level){ //don't do anything if level doesn't change
            return;
        }

        if(level === 1){
            this.playPromise = this.screen1audio.play();}
        else if(level === 2){
            this.playPromise = this.screen2audio.play();}
        else if(level === 3){
            this.playPromise = this.screen3audio.play();}

        this.level = level;
        let levelClassNames = ["screen1", "screen2", "screen3"];

        this.screenElement.classList.remove(...this.screenElement.classList);
        this.screenElement.classList.add(levelClassNames[level-1])
    }

    gameOver(){
        this.disableGame();
        this.drawGameoverScreen();
        this.playGameoverSound();
    }

    win(){
        this.disableGame();
        this.drawWinScreen();
        this.playWinSound();
    }

    drawGameoverScreen(){
        let textString = "Game Over";
        let textWidth;

        if(this.level === 1){
            this.ctx.font = '75px Impact';
            textWidth = this.ctx.measureText(textString ).width;

            /**this.ctx.clearRect(0, 0, 500, 300);
            this.ctx.fillStyle = '#F80102';
            this.ctx.fillRect(115,110,270, 80);
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '50px Arial';
            this.ctx.strokeText("Game Over", 120,170);
            this.drawNewGameExplanation(); */
        }
        else if (this.level === 2){
            this.ctx.font = '75px Comic Sans MS';
            this.ctx.fillStyle = '#F80102';
            textWidth = this.ctx.measureText(textString).width;
        }
        else if (this.level === 3){
            this.ctx.clearRect(0, 0, 500, 300);
            this.ctx.font = '75px Gabriola';
            this.ctx.fillStyle = '#FF1493';
            textWidth = this.ctx.measureText(textString ).width;
            this.ctx.fillText(textString, (Constants.canvasWidth/2) - ((textWidth / 2)-6),170);
            this.ctx.font = '75px Gabriola';
            this.ctx.fillStyle = '#7CFC00';
            textWidth = this.ctx.measureText(textString ).width;
            this.ctx.fillText(textString, (Constants.canvasWidth/2) - ((textWidth / 2)-3),170);
            this.ctx.font = '75px Gabriola';
            this.ctx.fillStyle = '#00BFFF';
            textWidth = this.ctx.measureText(textString ).width;
        }

        this.ctx.fillText(textString, (Constants.canvasWidth/2) - (textWidth / 2),170);
        this.drawNewGameExplanation();
    }

    playGameoverSound(){
        this.screen1audio.pause();
        this.screen2audio.pause();
        this.screen3audio.pause();
        this.playPromise = this.gameoverAudio.play();
    }

    drawWinScreen(){
        this.ctx.textAlign = "center";
        var angle = Math.PI * 0.8; //radians
        var radius = 200;

        this.ctx.font = "40pt Sans";
        this.ctx.fillStyle = "#FF8000";
        this.drawTextAlongArc(this.ctx, "CONGRATULATIONS!", Constants.canvasWidth / 2, Constants.canvasHeight - 30, radius, angle);
        
        this.ctx.font = "20pt Sans";
        this.ctx.fillStyle = "#CED8F6";
        this.ctx.fillText("You win!", Constants.canvasWidth / 2, (Constants.canvasHeight - 30) / 2, 200);

        this.ctx.font = "10pt Sans";
        this.ctx.fillText("Your fascinating time travel came to an end.", Constants.canvasWidth / 2, (Constants.canvasHeight - 30) / 2 + 20, 250);

        this.drawNewGameExplanation();
    }

    playWinSound(){
        this.screen3audio.pause();
        this.playPromise = this.winAudio.play();
    }

    disableGame(){
        this.player = null;
    }

    drawNewGameExplanation(){
        this.ctx.font = "10pt Calibri";
        this.ctx.fillStyle = "#FBEFF2";
        this.ctx.fillText("SPACE to travel back in time again!", Constants.canvasWidth / 2, Constants.canvasHeight - 30, 250);
    }


    startNewGame(){
        location.reload();
    }


    //circle font
    //https://codepen.io/lmillward/pen/RxeQXZ
    drawTextAlongArc(context, str, centerX, centerY, radius, angle){
        context.save();
        context.translate(centerX, centerY);
        context.rotate(-1 * angle / 2);
        context.rotate(-1 * (angle / str.length) / 2);
        for (var n = 0; n < str.length; n++) {
            context.rotate(angle / str.length);
            context.save();
            context.translate(0, -1 * radius);
            var char = str[n];
            context.fillText(char, 0, 0);
            context.restore();
        }
        context.restore();
    }
}