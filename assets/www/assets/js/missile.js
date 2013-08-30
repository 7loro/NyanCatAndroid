(function() {
	var missile = function(id) {
	  this.initialize(id);
	}
	missile.prototype = new createjs.Shape();
	 
	missile.prototype.Shape_initialize = missile.prototype.initialize;
	missile.prototype.initialize = function(id) {
		this.Shape_initialize();
		// add custom setup logic here.
		this.radius = (Math.floor(Math.random() * (10 - 5 + 1)) + 5)*window.innerWidth/1366;
		this.mID=id;
		this.missileColor="#00ffd2";
		this.xSpeed = 1;
		this.ySpeed = 1;
		this.snapToPixel = true; // for cache
		// generate random int
		// Math.floor(Math.random() * (max - min + 1)) + min;
		this.speedDiv = Math.floor(Math.random() * (10 - 1 + 1)) + 1; // speedDiv is 1 ~ 10 integer, lower value is faster
		var randomXY=this.randomSide(Math.floor(Math.random()*1000%4)); // 0 top 1 right 2 bottom 3 left
		this.x = randomXY.x;
		this.y = randomXY.y;
		this.score = (11-this.speedDiv) * 10;
		this.onScreen = true;
		this.setMissileColor();
		this.graphics.beginFill(this.missileColor).drawCircle(0, 0, this.radius);
		//console.log("missile is created at x : "+this.x+" y : "+this.y);
	}
	 
	missile.prototype._tick = function() {
	   if(!createjs.Ticker.getPaused()){
		this.x += this.xSpeed;
		this.y += this.ySpeed;

		//console.log(this.id+" x : "+this.x + " y: "+this.y);
		if(this.x >= stage.canvas.width || this.y >= stage.canvas.height || this.x <= 0 || this.y <= 0){
			totalScore += this.score;
			this.onScreen = false;
			stage.removeChild(this);
			//console.log("missile removed");
		}

		// game over case. when cat is hit by missiles.
		//if(false){ // for debugging : power overwhelming
		//if(bmpAnimation.x+(charBox.width*0.24) <= this.x
		//&& bmpAnimation.x+(charBox.width*0.24)+hitBox.width >= this.x
		//&& bmpAnimation.y+(charBox.height*(6/70))<= this.y
		//&& bmpAnimation.y+(charBox.height*(6/70)+hitBox.height) >= this.y)
		if((bmpAnimation.x+(charBox.width*0.24))-this.x <= this.radius
				&& this.x-(bmpAnimation.x+(charBox.width*0.24)+hitBox.width) <= this.radius
				&& (bmpAnimation.y+(charBox.height*(6/70)))-this.y <= this.radius
				&& this.y-(bmpAnimation.y+(charBox.height*(6/70)+hitBox.height)) <= this.radius){
			if(createjs.Ticker.hasEventListener("tick")){
				createjs.Ticker.removeEventListener("tick", game);
			}
			bmpAnimation.gotoAndPlay("dead");
			backgroundMusic.stop();
			//bgmInstance.stop();
			//createjs.Sound.play("gameOverMusic");
			gameOverMusic.play();
			//alert("Score : "+totalScore+"\nYou Hate Missile ID : "+this.mID+"\nYou lived for "+(Math.round((createjs.Ticker.getTime()-beginTime))/1000)+"s");
			for(var i=missileArr.length; i>0;i--){
				stage.removeChild(missileArr[i-1]);
				missileArr.pop();
				totalMissile = 0;
			}
			alive = false;
			textResult.text = "Score : "+totalScore+"\nYou Hate\nMissile ID : "+this.mID+"\nYou lived\nfor "+(Math.round((createjs.Ticker.getTime()-beginTime))/1000)+"s";
			textResult.x = 0-textResult.getMeasuredWidth()/3;
			stage.addChild(textResult);
			stage.removeAllEventListeners();
			//	createjs.Sound.stop();
			console.log("game over");
			stage.addEventListener("stagemousedown", tryAgainMDown);
			createjs.Ticker.addEventListener("tick", gameOverTick);
		}
		//}
	   }
	}
	
	missile.prototype.randomSide = function(side) {
		var randomXY	= function() {
			this.x=1;
			this.y=1;
		};
		switch(side) {
			case 0: // top
				randomXY.x = Math.floor((Math.random()*10000)%stage.canvas.width);
				randomXY.y = 1;	
				break;
			case 1: // right
				randomXY.x = stage.canvas.width-1;
				randomXY.y = Math.floor((Math.random()*10000)%stage.canvas.height);
				break;
			case 2: // bottom
				randomXY.x = Math.floor((Math.random()*10000)%stage.canvas.width);
				randomXY.y = stage.canvas.height-1;
				break;
			default: // left
				randomXY.x = 1;
				randomXY.y = Math.floor((Math.random()*10000)%stage.canvas.height);
		}
		// speed is consisting of two speed : main speed, detail speed(additional speed which range is 0.0 ~ 1.0)
		this.xSpeed = (Math.round((bmpAnimation.x - randomXY.x) / (Math.round(createjs.Ticker.getFPS())*this.speedDiv)) + 
							0.1*(Math.floor(Math.random() * (10 - 0 + 1)) + 0))*window.innerWidth/1366;
		this.ySpeed = (Math.round((bmpAnimation.y - randomXY.y) / (Math.round(createjs.Ticker.getFPS())*this.speedDiv)) + 
							0.1*(Math.floor(Math.random() * (10 - 0 + 1)) + 0))*window.innerHeight/667;
		//console.log(this.id + "의 xSpeed : "+this.xSpeed+" ySpeed : "+this.ySpeed);
		return randomXY;
	}
	
	missile.prototype.setMissileColor = function() {
		// (fast)1 ~ 10(slow)
		switch(this.speedDiv) {
			case 1:
				this.missileColor="#ff0000";
				break;
			case 2:
				this.missileColor="#ff5000";
				break;
			case 3:
				this.missileColor="#ffa000";
				break;
			case 4:
				this.missileColor="#fff000";
				break;
			case 5:
				this.missileColor="#beff00";
				break;
			case 6:
				this.missileColor="#6eff00";
				break;
			case 7:
				this.missileColor="#1eff00";
				break;
			case 8:
				this.missileColor="#00ff32";
				break;
			case 9:
				this.missileColor="#00ff82";
				break;
			default:
				this.missileColor="#00ffd2";
		}
	}
	
	window.missile = missile;
}());
