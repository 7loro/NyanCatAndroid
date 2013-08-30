var imgCat = new Image();
var stage;
var canvas;
var isMDown;
var missileArr = [];
var totalMissile = 0;
var misText = [];
var i=0;
//var textDebug;
//var countString = new Array("GET", "READY", "SET", "GO", "");
//var countNum=0;
//var textCountDown;
var textResult;
var textTitle;
var textScore;
var totalScore=0;
var isInitial;
var time=0;
var level = 0;
var tenLv =1;
var beginTime =0;
var beforeInnerWidth = window.innerWidth;
var beforeInnerHeight = window.innerHeight;
var alive=true;
var isIE;
//var bgmInstance;
var backgroundMusic;
var gameStartMusic;
var gameOverMusic;

var moveFrom = function() {
	this.x=0;
	this.y=0;
}
var resizeVar=0;
var charBox = function() {
	this.width=0;
	this.height=0;
}
var hitBox = function() {
	this.width=0;
	this.height=0;
}

window.onresize = function() {
	if(resizeVar) { // resizeVar is for solving the problem that onresize is fired twice.
		clearTimeout(resizeVar);
	}
	resizeVar = setTimeout(function(){
		canvas.setAttribute("width", window.innerWidth);
		canvas.setAttribute("height", window.innerHeight);
		bmpAnimation.scaleX = (window.innerWidth*70)/(1366*100);
		bmpAnimation.scaleY = (window.innerHeight*70)/(667*100);
		missileRepaint();
		bmpAnimation.x = bmpAnimation.x*document.getElementById("canvas").getAttribute("width")/beforeInnerWidth;
		bmpAnimation.y = bmpAnimation.y*document.getElementById("canvas").getAttribute("height")/beforeInnerHeight;
		charBox.width = 100*bmpAnimation.scaleX;
		charBox.height = 70*bmpAnimation.scaleY;
		beforeInnerWidth = window.innerWidth;
		beforeInnerHeight = window.innerHeight;
		//console.log("After bmpX : "+bmpAnimation.x);
		textScore.x = stage.canvas.width / 2;
		textScore.font = stage.canvas.height/30+"px Arial";
		textTitle.x = stage.canvas.width / 2;
		textTitle.y = stage.canvas.height / 5;
		textTitle.font = stage.canvas.height/2.5+"px Arial";
		textHowTo.x = stage.canvas.width/2;
		textHowTo.y = textTitle.y+textTitle.getMeasuredHeight();
		textHowTo.font = stage.canvas.height/20+"px Arial";
		textResult.x = 0;
		textResult.y = stage.canvas.height/2;
		textResult.font = stage.canvas.height/20+"px Arial";
		//textCountDown 크기 조절
		//console.log("resized");
		//console.log("window.screen : "+window.innerWidth+" "+window.innerHeight);
		stage.update();
	},0);
}

function missileRepaint() {
	for(var i=0;i<missileArr.length; i++){
		if(!(missileArr[i].onScreen))
			continue;
		//console.log("missileArr["+i+"].x = "+missileArr[i].x);
		//console.log("getAttribute = "+document.getElementById("canvas").getAttribute("width"));
		//console.log("beforeInnerWidth = "+beforeInnerWidth);
		missileArr[i].x= missileArr[i].x*document.getElementById("canvas").getAttribute("width")/beforeInnerWidth;
		missileArr[i].y= missileArr[i].y*document.getElementById("canvas").getAttribute("height")/beforeInnerHeight;
		//console.log("After missileX : "+missileArr[i].x);
	}
}

function onLoad() {
    document.addEventListener("deviceready",preload,false);
}

function preload() {
	// sound
	//if(!createjs.Sound.initializeDefaultPlugins())
	//	alert("We cannot play audio in this browser");
	canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	
	imgCat.src = "file:///android_asset/www/assets/images/nyancat_spirte.png";
	backgroundMusic = new Media("/android_asset/www/assets/nyancat.mp3");
	gameStartMusic = new Media("/android_asset/www/assets/start.mp3");
	gameOverMusic = new Media("/android_asset/www/assets/gameover.mp3");

	// create spritesheet and assign the associated data.
	var spriteSheet = new createjs.SpriteSheet({
		// image to use
		images: [imgCat], 
		// width, height & registration point of each sprite
		frames: {width: 100, height: 70}, 
		animations: {    
			fly: [0, 5, "fly", 4],
			dead: [0, 7, "dead", 6]
		}
	});
	
	// create a BitmapAnimation instance to display and play back the sprite sheet:
	bmpAnimation = new createjs.BitmapAnimation(spriteSheet);
	//var queue = new createjs.LoadQueue(true);
	//queue.installPlugin(createjs.Sound);
	isIE = (
			typeof document.getElementById!="undefined" 
			&& 
			typeof document.all!="undefined" 
			&& 
			typeof window.opera=="undefined"
		);
	

	document.body.style.overflow = "hidden";

	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	canvas.style.backgroundImage = "url('file:///android_asset/www/assets/images/cat_background.png')";
	//console.log(canvas.getAttribute("width")+" "+canvas.getAttribute("height"));
	//console.log(window.innerWidth+" "+window.innerHeight);
	createjs.Touch.enable(stage);
	
	bmpAnimation.scaleX = (window.innerWidth*70)/(1366*100);
	bmpAnimation.scaleY = (window.innerHeight*70)/(667*100);
	// start playing the first sequence:
	bmpAnimation.gotoAndPlay("fly");     //animate
		
	// set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
	// of animated rats if you disabled the shadow.
	bmpAnimation.shadow = new createjs.Shadow("black", 0, 3, 5);

	bmpAnimation.name = "cat1";
	bmpAnimation.direction = 90;
	bmpAnimation.vX = 3; // velocity that move cat to center
	bmpAnimation.v = 5;
			
	bmpAnimation.currentFrame = 0;
	stage.addChild(bmpAnimation);
	
	charBox.width = 100*bmpAnimation.scaleX;
	charBox.height = 70*bmpAnimation.scaleY;
	hitBox.width = charBox.width*0.54;
	hitBox.height = charBox.height*44/70;
	
	//Events for visibility
	//document.addEventListener("webkitvisibilitychange", stateChanged);
	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	
	init();
	//queue.addEventListener("complete", init);
	//queue.loadManifest([{id:"backgroundMusic", src:"file:///android_asset/www/assets/nyancat.mp3|file:///android_asset/www/assets/nyancat.ogg"},
	//                    {id:"startMusic", src:"file:///android_asset/www/assets/start.mp3|file:///android_asset/www/assets/start.ogg"},
	//                    {id:"gameOverMusic", src:"file:///android_asset/www/assets/gameover.mp3|file:///android_asset/www/assets/gameover.ogg"}]);
	
	//queue.loadFile({id:"backgroundMusic", src:"assets/nyancat.mp3|assets/nyancat.ogg"});
}
/*
function stateChanged() {
	if(document.webkitHidden)
		stopSound();
	else
		playSound();
}

function playSound() {
	bgmInstance.resume();
}

function stopSound() {
	bgmInstance.pause();
}
*/

function onPause() {
    backgroundMusic.pause();
    togglePause();
    //console.log("On Pause");
}

function onResume() {
    backgroundMusic.play();
    togglePause();
    //console.log("On Resume");
}

function togglePause() {
    var paused = !createjs.Ticker.getPaused();
    createjs.Ticker.setPaused(paused);
}

function init() {
	//bgmInstance = createjs.Sound.play("backgroundMusic");
	backgroundMusic.play();
	// 게임 시작 전에 제목 표시해주고 할 때 캐릭터 위, 수정필요하다.

	textScore = new createjs.Text("Score", stage.canvas.height/30+"px Arial", "white");
	textTitle = new createjs.Text("NYAN", stage.canvas.height/2.5+"px Arial", "white");
	textTitle.textAlign = "center";
	textTitle.x = stage.canvas.width/2;
	textTitle.y = stage.canvas.height/5;
	
	textHowTo = new createjs.Text("TOUCH TO START", stage.canvas.height/20+"px Arial", "white");
	textHowTo.textAlign = "center";
	textHowTo.x = stage.canvas.width/2;
	textHowTo.y = textTitle.y+textTitle.getMeasuredHeight()+textHowTo.getMeasuredHeight()*2;
	
	textResult = new createjs.Text("", stage.canvas.height/20+"px Arial", "white");
	textResult.y = stage.canvas.height/2;
	textResult.font = stage.canvas.height/20+"px Arial";
	textResult.textAlign = "center";
	//textCountDown = new createjs.Text("", stage.canvas.height/4+"px Arial", "white");
	//textCountDown.textAlign = "center";
	
	bmpAnimation.x=textTitle.x-(textTitle.getMeasuredWidth()/2);
	bmpAnimation.y=textTitle.y-charBox.height/2;
	//console.log("stage w : "+stage.canvas.width);
	//bmpAnimation.x = bmpAnimation.x*document.getElementById("canvas").getAttribute("width")/beforeInnerWidth-100;
	//bmpAnimation.y = bmpAnimation.y*document.getElementById("canvas").getAttribute("height")/beforeInnerHeight;
	
	stage.addChild(textTitle);
	stage.addChild(textHowTo);
	
	stage.swapChildren(textTitle, bmpAnimation);
	
	stage.update();
	
	createjs.Ticker.addEventListener("tick", moveAroundTitle);
	//createjs.Ticker.addEventListener("tick", tick);
	
	createjs.Ticker.useRAF = true;
	// Best Framerate targeted (60 FPS)
	createjs.Ticker.setFPS(60);
	
	// hit box for dubgging
	//var hitboxRect = new createjs.Shape();
	//hitboxRect.graphics.beginFill("red").drawRect((bmpAnimation.x+(charBox.width*0.24)), (bmpAnimation.y+(charBox.height*(6/70))),
	//(hitBox.width),(hitBox.height));
	//stage.addChild(hitboxRect);
	
	stage.addEventListener("stagemousedown", mDownBeforeCountDown);
}


function moveAroundTitle() {
	if (bmpAnimation.x >= textTitle.x+textTitle.getMeasuredWidth()/2-charBox.width) { // to center of canvas because 50 is cat width
		bmpAnimation.rotation+=1.5;
	}
	
	else {
		bmpAnimation.x += bmpAnimation.vX;
		// 제목나타내고 touch screen to start 띄워주는 것 필요
	}
	
	// update the stage:
	stage.update();
}

function mDownBeforeCountDown() {
	stage.removeEventListener("stagemousedown", mDownBeforeCountDown);
	stage.addEventListener("stagemouseup", countDown);
}

function countDown() {
	createjs.Ticker.removeEventListener("tick", moveAroundTitle);
	//if(bgmInstance.playState == "playFinished")
	//	bgmInstance.play();
	
	stage.removeAllEventListeners();
	
	varInitialize();
	
	stage.removeChild(textResult);
	stage.removeChild(textTitle);
	stage.removeChild(textHowTo);
	/*
	// Ready, Set, Go 띄워주고 움직임을 위한 mouse click event 추가, tick event추가
	textCountDown.x = stage.canvas.width/2;
	textCountDown.y = stage.canvas.height/4;
	textCountDown.text=countString[0];
	stage.addChild(textCountDown);
	
	
	time=createjs.Ticker.getTime();
	console.log("time : "+time);
	stage.update();
	
	while(countNum<4){
		console.log("time : "+time);
		console.log(createjs.Ticker.getTime());
		if(createjs.Ticker.getTime() - time > 1000) {
			
			textCountDown.text = countString[countNum+1];
			countNum++;
			time=createjs.Ticker.getTime();
			console.log("GET READY SET !");
			stage.update();
		}
	}*/
	//countDownDraw();
	//text for Debugging
	//textDebug = new createjs.Text("Bounds of Cat", "20px Arial", "#ff7700");
	//textDebug.x = 550;
	//textDebug.y = 0;
	//stage.addChild(textDebug);
	
	textScore.x = stage.canvas.width / 2;
	textScore.y = 0;
	textScore.textAlign = "center";
	stage.addChild(textScore);
	stage.addEventListener("stagemousedown", mDown);
	stage.addEventListener("stagemouseup", mUp);
	//createjs.Sound.play("startMusic");
	gameStartMusic.play();
	backgroundMusic.play();
	createjs.Ticker.addEventListener("tick", game);
	//stage.removeChild(textCountDown);
}

function varInitialize() {
	isInitial = true;
	alive = true;
	totalScore = 0;
	tenLv = 1;
	level = 0;
	totalMissile = 0;
	countNum = 0;
	bmpAnimation.x = stage.canvas.width/2 - charBox.width/2;
	bmpAnimation.y = stage.canvas.height/2 - charBox.height/2;
	bmpAnimation.rotation = 0;
	bmpAnimation.gotoAndPlay("fly");
}

function mDown() {
	isMDown = true;
	moveFrom.x = stage.mouseX;
	moveFrom.y = stage.mouseY;
	//console.log("isMDown = true");
}

function mUp() {
	isMDown = false;
	//console.log("isMDown = false");
}

function game(event) {
    if(!event.paused){
    	//textDebug.text = "x : "+ (Math.floor(bmpAnimation.x + charBox.width*0.1)) + " ~ " + (Math.floor(bmpAnimation.x + charBox.width*0.70))
    	//+ "\ny : " + Math.floor(bmpAnimation.y) + " ~ " + Math.floor(bmpAnimation.y + charBox.height*0.65)
    	//+ "\nm x : "+stage.mouseX+" y : "+stage.mouseY;
    	
    	//textScore.text = "SCORE : " + totalScore+"\nLevel : "+level+"\ncurrent : "+createjs.Ticker.getTime()+"\nbefore Time: "+time+"\nsubtract : "+(createjs.Ticker.getTime()-time);
    	if(isInitial){
    		isInitial = false;
    		time=createjs.Ticker.getTime();
    		beginTime=time;
    		missileArr.push(new missile(totalMissile));
    		stage.addChild(missileArr[0]);
    		totalMissile++;
    	}
    
    	textScore.text = "SCORE : " + totalScore+"\nLevel : "+tenLv+"\n"+formatAfterPoint(((Math.round((createjs.Ticker.getTime(true)-beginTime))/1000)+''),3)+"s"
    								+"\n"+ Math.round(createjs.Ticker.getMeasuredFPS())+"fps"; 
    	
    
    	if(isMDown){
    		(window.innerWidth*70)/(1366*100)
    		if(!(((bmpAnimation.x+(stage.mouseX - moveFrom.x) + (charBox.width*0.65)) >= stage.canvas.width) || 
    		    (bmpAnimation.y+(stage.mouseY - moveFrom.y) + (charBox.height*0.90)) >= stage.canvas.height || 
    			bmpAnimation.x+(stage.mouseX - moveFrom.x) <= 0 || 
    			bmpAnimation.y+(stage.mouseY - moveFrom.y) <= 0)){
    			
    			bmpAnimation.x += (stage.mouseX - moveFrom.x);
    			bmpAnimation.y += (stage.mouseY - moveFrom.y);
    			//commented codes are for another moving that character follows mouse's position.
    			//bmpAnimation.x += ((stage.mouseX-(bmpAnimation.scaleX*100/2))-bmpAnimation.x)*0.1;
    			//bmpAnimation.y += ((stage.mouseY-(bmpAnimation.scaleY*100/2))-bmpAnimation.y)*0.1;
    		}
    		
    		//background move
    		//if(!isIE)
    			//$("#canvas").animate({backgroundPositionX: "+="+((stage.mouseX - moveFrom.x)*0.1)+"%"},10);
    		moveFrom.x = stage.mouseX;
    		moveFrom.y = stage.mouseY;
    	}
    	if(alive){
    		if(createjs.Ticker.getTime() - time > 1000) {
    			for(var i=0;i<level;i++){
    				missileArr.push(new missile(totalMissile));
    				stage.addChild(missileArr[totalMissile]);
    				totalMissile++;
    				if(level < 10*tenLv){
    					if(i > 2*tenLv)
    						break;
    				}
    				else
    					tenLv++;
    			}
    			level++;
    			time=createjs.Ticker.getTime();
    		}
    	}
    	stage.update();
    }
}

function tryAgainMDown() {
	stage.removeEventListener("stagemousedown", tryAgainMDown);
	createjs.Ticker.removeEventListener("tick", gameOverTick);
	stage.addEventListener("stagemouseup", countDown);
}

function gameOverTick() {
	if (textResult.x-textResult.getMeasuredWidth()/2 >= stage.canvas.width) {
		textResult.x = 0 - textResult.getMeasuredWidth()/3;
	}
	
	else {
		textResult.x += stage.canvas.width*6/2200;
	}
	
	// update the stage:
	stage.update();
}
// make non display value 0 to string value "0" after point.
function formatAfterPoint(string, digit) {
	if(string == "0")
		return "0.000";
	for(var i=string.lastIndexOf(".")+1;i<string.lastIndexOf(".")+digit+1;i++) {
		if(typeof string[i] == 'undefined')
			string+="0";
	}
	return string;
}
