var level; //determines the difficulty of the current stage. Bosses appear and enemy tail lengths increase on multiples of 5
// every multiple of 5 and every 3rd stage after that (3, 8, 13, etc.), the number of enemies increases by 2.

var stageTime; // tracks how long the stage will last (10 seconds);

var enemyCt; // number of enemies
var eTail; // length of the tail

var safety; //determines how close the enemies can spawn to the player
var pdir; // storing player direction

var control; // player variable
var endStage; // when the stage is over, becomes true, and initiates the next level
var rules; //if rules have been shown
var lose; // loss state
var losetime; // track when to start again

var enemyList; // array of enemies

var board; // 2D array of tiles

var bossList; // array of bosses

function setup(){
	createCanvas(800,800);
	background(0);
	frameRate(24);
	noStroke();

	board = []; //create the board of 10x10 tiles, 80x80 total.
	for (let x = 0; x < 80; x++){
		board[x] = []; // 2D array
		for (let y = 0; y < 80; y++){
			//print('x, y: ' + x + ' ' + y);
			board[x][y] = new Tile(x*10,y*10); //create a tile with the top left corner in x*10, y*10
		}
	}
	level = 0; //determines the difficulty of the current stage. Bosses appear and enemy tail lengths increase on multiples of 5
	// Every boss stage reached adds an additional boss 
	// every multiple of 5 and every 3rd stage after that (3, 8, 13, etc.), the number of enemies increases by 2.
	enemyCt = 2;
	eTail = 20;
	safety = 10; //determines how close the enemies can spawn to the player

	pdir = 0; // storing player direction

	control = new Player(40, 40);

	endStage = true; // when the stage is over, becomes true, and initiates the next level

	enemyList = [];

	bossList = [];

	lose = false; // if true, show loss screen

	//rules = 0;

	//losetime = 0;
}

function draw(){
	background(0);
	if(lose){
		/*
		fill(50, 50, 230);
		textSize(100);
		stroke(1)
		text('You lost', 300, 300);
		text('The game will restart in 3 seconds', 100, 400);*/ //doesn't work
		for (let x = 0; x < 80; x++){
			for (let y = 0; y < 80; y++){
				//print('x, y: ' + x + ' ' + y);
				board[x][y].pDecay = 0;
				board[x][y].r = 0;
				board[x][y].g = 0;
				board[x][y].b = 0;
			}
		}
		print('board clean');
		//const pause = frameCount;
		//not appreciated by most interpreters
		/*
		var time;
		if(losetime == 1){
			do{
				time = frameCount;
			} while (time-pause < 72);

		}*/
		//noStroke();
		/*
		var wait = frameCount+240;
		print(wait);
		while(frameCount < wait){
			//print("waiting");
		}*/
		endStage = true;
		//print(endStage);
		//sleep(5000);
		
		lose = false;
		level = 0;
		
		//losetime++;
	}
	if(endStage && !lose){

		level++; //increment stage

		control.cx = 40; //reset player position and direction
		control.cy = 40;
		pdir = 0;
		control.display();

		if(level == 1){
			enemyList[0] = new Enemy(random(80), random(80)); // first stage enemies
			enemyList[1] = new Enemy(random(80), random(80));
		}
		if(level%5 == 3){
			enemyList[enemyCt] = new Enemy(random(80), random(80)); // additional enemies at specified interval
			enemyList[enemyCt+1] = new Enemy(random(80), random(80));
			enemyCt+=2;			
		}
		if(level%5 == 0){ // if the stage is a multiple of 5
			enemyList[enemyCt] = new Enemy(random(80), random(80)); // additional enemies with boss
			enemyList[enemyCt+1] = new Enemy(random(80), random(80));
			enemyCt+=2;
			eTail+=3;
			//var bx = random(80);
			//var by = random(80);
			bossList[level/5-1] = new Boss(random(70)+5, random(70)+5, random(1)); //create a new boss
			//adjust(bossList, 25, random(5)+5);
			for(var i = 0; i < level/5; i++){
				if (bossList[i].cx > 25 && bossList[i].cx < 80-25 && bossList[i].cy > 25 && bossList[i].cy < 80-25){ // check if the boss is too close to the player
					if (bossList[i].cx < 40){
						bossList[i].cx-=10;
					}
					else{
						bossList[i].cx+=10;
					}
					if (bossList[i].cy < 40){
						bossList[i].cy-=10;
					}
					else{
						bossList[i].cy+=10;
					}
				}
				bossList[i].display();
			}
		}
		else{
			//adjust(enemyList, 30, random(5)+20);

			for(var i = 0; i < enemyCt; i++){
				if (enemyList[i].cx > 30 && enemyList[i].cx < 80-30 && enemyList[i].cy > 30 && enemyList[i].cy < 80-30){ // check if the enemy is too close to the player
					if (enemyList[i].cx < 40){
						enemyList[i].cx-=25;
						enemyList[i].dir = 3;
					}
					else{
						enemyList[i].cx+=25;
						enemyList[i].dir = 1;
					}
					if (enemyList[i].cy < 40){
						enemyList[i].cy-=25;
						enemyList[i].dir = 0;
					}
					else{
						enemyList[i].cy+=25;
						enemyList[i].dir = 2;
					}
				}
				enemyList[i].display();
			}
		}
		control.display();
		/*
		const pause = frameCount;
		var time;
		if (rules < 2){
			stroke(3);
			fill (255);
			textSize(80);
			text("You are blue. Use the Arrowkeys to move and avoid the trails.", 300, 300, 200, 200);
			noStroke();
			print("RULES");
		}
		if(rules == 1){
			do{
				time = frameCount;
			} while (time-pause < 72);

		}
		if(rules > 0){
			endStage = false;
			stageTime = frameCount + 240;
		}
		else{
			rules++;
		}*/
		endStage = false;
		stageTime = frameCount + 240;
	}
	for (let x = 0; x < 80; x++){ // display the trails
		for (let y = 0; y < 80; y++){
			//print('x, y: ' + x + ' ' + y);
			board[x][y].display();
		}
	}
	for(var i = 0; i < enemyCt; i++){ // display enemies
		//print('displaying');
		enemyList[i].display();
	}
	//if(level > 4){}
	for(var i = 0; i < Math.floor(level/5); i++){ // display bosses
		print(level);
		bossList[i].display();
	}

	

	control.display(); //display player
	//print('moving');
	if(frameCount>stageTime){ // track time in stage (10 seconds)
		level++;
		endStage = true;
	}

}
/* 	unused
function sleep(milliseconds) { // sleep function, from https://www.sitepoint.com/delay-sleep-pause-wait/
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
    //print('waiting');
  } while (currentDate - date < milliseconds);
}*/
/* unused
function adjust(arr, border, adj){ // if an element of the array is too close to the player (border), it is adjusted (adj) away
	for(var curr in arr){
		if (curr.cx > border && curr.cx < 80-border && curr.cy > border && curr.cy < 80-border){ // check if the boss is too close to the player
			if (curr.cx < 40){
				curr.cx-=adj;
			}
			else{
				curr.cx+=adj;
			}
			if (curr.cy < 40){
				curr.cy-=adj;
			}
			else{
				curr.cy+=adj;
			}
		}				
		//curr.display();
	}
}
*/
function keyPressed(){ //check change in directions from arrowkey press
	switch(keyCode){
		case UP_ARROW:
			pdir = 0;
			break;
		case RIGHT_ARROW:
			pdir = 1;
			break;
		case DOWN_ARROW:
			pdir = 2;
			break;
		case LEFT_ARROW:
			pdir = 3;
			break;
	}
}

class Tile{ // tiles contain objects, standardizing movement. Tiles are 10x10 pixels
	constructor(x, y){
		this.tx = x; // coordinates of the tile
		this.ty = y;

		this.pDecay = 0; // tracks when the tile will become passable. If nonzero, it is an obstacle
		this.r = 0; // colors
		this.g = 0;
		this.b = 0;
		this.rdir = 1; // color iteration direction
		this.gdir = 1;
		this.bdir = 1;
	}
	display(){
		fill(color(this.r, this.g, this.b)); // display color
		rect(this.tx, this.ty, 10); // draw tile
		if(this.pDecay>0){ // decay the trail
			this.pDecay--;
			this.itCol(); // iterate the color
		}
		else{
			this.r = 0; // when no longer a trail, set to black
			this.g = 0;
			this.b = 0;
		}
	}
	itCol(){ // iterates colors within a boundary
		if(this.r > 240){ 
			this.rdir = -1;
		}
		if(this.r < 40){
			this.rdir = 1;
		}
		this.r += this.rdir*3;

		if(this.g > 175){
			this.gdir = -1;
		}
		if(this.g < 50){
			this.gdir = 1;
		}
		this.g += this.gdir*5;

		if(this.b > 200){
			this.bdir = -1;
		}
		if(this.b < 25){
			this.bdir = 1;
		}
		this.b += this.bdir*2;
		//print(this.r +" " + this.g + " " + this.b + "\n");
		
	}
}

class Enemy{ //enemy will place down tails
	constructor(x, y){
		this.cx = Math.floor(x); // current location of the enemy
		this.cy = Math.floor(y);

		this.dir = Math.floor(random(4)); // direction is random, determined by numbers 0 through 3. Up is 0, right is 1, down is 2, left is 3

		this.turnDelay = 0; //odds of making a turn on the next tile, goes up every tile traveled without turning

		this.r = random(200)+40;
		this.g = random(125)+50;
		this.b = random(175)+25;
	}

	display(){
		board[this.cx][this.cy].pDecay = eTail; // set the current tile to a trail
		board[this.cx][this.cy].r = this.r;
		board[this.cx][this.cy].g = this.g;
		board[this.cx][this.cy].b = this.b;

		if(!endStage){ // if the stage is active, move
			//print('bop ' + this.dir);
			switch(this.dir){ // move based on direction
				case 0:
					//print('up');
					this.cy-=1;
					break;
				case 1:
					this.cx+=1;
					break;
				case 2:
					//print('why');
					this.cy+=1;
					break;
				case 3:
					this.cx-=1;
					break;
			}
			if(this.cy > 79){ // loop at boundaries
				this.cy = 1;
			}
			if(this.cx > 79){
				this.cx = 1;
			}
			if(this.cy < 1){
				this.cy = 79;
			}
			if(this.cx < 1){
				this.cx = 79;
			}
			if(random(60)>this.turnDelay){ // odds of making a turn, increasing each frame a turn isn't made
				this.turnDelay++;
			}
			else{
				let tHold = Math.floor(random(3)); //change to a random direction
				if (tHold >= this.dir){ // if the opposite direction of the current one, choose the next one.
					tHold++;
				}
				this.dir = tHold;
				this.turnDelay = 0; //reset turn chance
			}			
		}
		fill(color(this.r, this.g, this.b));
		circle(this.cx*10+5, this.cy*10+5, 10); // draw the body of an enemy, a circle with r of 10
	}

}

class Player{
	constructor(x, y){
		this.cx = x; // location of the player, always the same
		this.cy = y;
	}
	display(){
		if(!endStage){ // display and move if stage is active
			switch(pdir){
				case 0:
					this.cy-=1;
					break;
				case 1:
					this.cx+=1;
					break;
				case 2:
					this.cy+=1;
					break;
				case 3:
					this.cx-=1;
					break;
			}
			if(this.cy > 79){ // loop at boundaries
				this.cy = 1;
			}
			if(this.cx > 79){
				this.cx = 1;
			}
			if(this.cy < 1){
				this.cy = 79;
			}
			if(this.cx < 1){
				this.cx = 79;
			}
			if(board[this.cx][this.cy].pDecay > 0){
				lose = true;
			}
		}
		fill(color(50, 50, 230)); // change direction of arrow
		switch(pdir){
			case 0:
				quad(this.cx*10+5, this.cy*10, this.cx*10+10, this.cy*10+10, this.cx*10+5, this.cy*10+7, this.cx*10, this.cy*10+10);
				break;
			case 1:
				quad(this.cx*10+10, this.cy*10+5, this.cx*10, this.cy*10+10, this.cx*10+3, this.cy*10+5, this.cx*10, this.cy*10);
				break;
			case 2:
				quad(this.cx*10+5, this.cy*10+10, this.cx*10+10, this.cy*10, this.cx*10+5, this.cy*10+3, this.cx*10, this.cy*10);
				break;
			case 3:
				quad(this.cx*10, this.cy*10+5, this.cx*10+10, this.cy*10, this.cx*10+7, this.cy*10+5, this.cx*10+10, this.cy*10+10);
				break;
		}
	}
}

class Boss extends Enemy{
	constructor(x, y, id){
		super(x, y); // location of the boss

		this.dir = 3; // direction the boss is moving, always starting left (3)
		this.type = id; // indicates which boss this is
	}
	display(){
		for (var x = -2; x < 3; x++){ // mark a 5x5 trail
			for (var y = -2; y < 3; y++){
				board[this.cx+x][this.cy+y].pDecay = eTail;
				board[this.cx+x][this.cy+y].r = this.r;
				board[this.cx+x][this.cy+y].g = this.g;
				board[this.cx+x][this.cy+y].b = this.b;				
			}
		}

		if(!endStage){ // move if stage is active
			//print('bop ' + this.dir);
			switch(this.dir){
				case 0:
					//print('up');
					this.cy-=1;
					break;
				case 1:
					this.cx+=1;
					break;
				case 2:
					//print('why');
					this.cy+=1;
					break;
				case 3:
					this.cx-=1;
					break;
			}
			if(this.cy > 74){ // loop at boundaries
				this.cy = 6;
			}
			if(this.cx > 74){
				this.cx = 6;
			}
			if(this.cy < 6){
				this.cy = 74;
			}
			if(this.cx < 6){
				this.cx = 74;
			}
			if(random(60)>this.turnDelay){ // chance of making a turn, increasing each frame a turn isn't made
				this.turnDelay++;
			}
			else{
				let tHold = Math.floor(random(3)); // turn a random direction
				if (tHold >= this.dir){ // if it is the opposite of the current direction, choose the next one
					tHold++;
				}
				this.dir = tHold;
				this.turnDelay = 0; // reset turn chance
			}			
		}
		fill(color(this.r, this.g, this.b));
		circle(this.cx*10+5, this.cy*10+5, 50); // draw the body of a boss, a circle with width of 50
	}
}