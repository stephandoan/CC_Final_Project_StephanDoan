var level; //determines the difficulty of the current stage. Bosses appear and enemy tail lengths increase on multiples of 5
// every multiple of 5 and every 3rd stage after that (3, 8, 13, etc.), the number of enemies increases by 2.

var stageTime; // tracks how long the stage will last (10 seconds);

var enemyCt; // number of enemies
var eTail; // length of the tail

var safety; //determines how close the enemies can spawn to the player
var pdir; // storing player direction

var control; // player variable
var endStage; // when the stage is over, becomes true, and initiates the next level
var lose; // loss state
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
}

function draw(){
	background(0);
	if(lose){
		fill(255);
		textSize(40);

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
		/*
		var wait = frameCount+240;
		print(wait);
		while(frameCount < wait){
			//print("waiting");
		}*/
		endStage = true;
		print(endStage);
		sleep(5000);
		lose = false;
		level = 0;
	}
	if(endStage){

		level++;

		control.x = 400;
		control.y = 400;
		pdir = 0;
		control.display();

		if(level == 1){
			enemyList[0] = new Enemy(random(80), random(80));
			enemyList[1] = new Enemy(random(80), random(80));
		}
		if(level%5 == 3){
			enemyList[enemyCt] = new Enemy(random(80), random(80));
			enemyList[enemyCt+1] = new Enemy(random(80), random(80));
			enemyCt+=2;			
		}
		if(level%5 == 0){ // if the stage is a multiple of 5
			enemyList[enemyCt] = new Enemy(random(80), random(80));
			enemyList[enemyCt+1] = new Enemy(random(80), random(80));
			enemyCt+=2;
			eTail+=3;
			//var bx = random(80);
			//var by = random(80);
			bossList[level%5-1] = new Boss(random(70)+5, random(70)+5, random(1)); //create a new boss
			adjust(bossList, 25, random(5)+5);
			for(var i = 0; i < level/5; i++){
				bossList[i].display();
			}
		}
		else{
			adjust(enemyList, 30, random(15)+5);
			for(var i = 0; i < enemyCt; i++){
				enemyList[i].display();
			}
		}
		endStage = false;
	}
	for(var i = 0; i < enemyCt; i++){
		//print('displaying');
		enemyList[i].display();
	}
	for (let x = 0; x < 80; x++){
		for (let y = 0; y < 80; y++){
			//print('x, y: ' + x + ' ' + y);
			board[x][y].display();
		}
	}
	control.display();
	//print('moving');

}

function sleep(milliseconds) { // sleep function, from https://www.sitepoint.com/delay-sleep-pause-wait/
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
    //print('waiting');
	text('You lost', 300, 300);
	text('The game will restart in 10 seconds', 100, 400);
  } while (currentDate - date < milliseconds);
}

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

function keyPressed(){
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
		fill(color(this.r, this.g, this.b));
		rect(this.tx, this.ty, 10);
		if(this.pDecay>0){
			this.pDecay--;
			this.itCol();
		}
		else{
			this.r = 0;
			this.g = 0;
			this.b = 0;
		}
	}
	itCol(){
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
		if(!endStage){
			print('bop ' + this.dir);
			switch(this.dir){
				case 0:
					print('up');
					this.cy-=1;
					break;
				case 1:
					this.cx+=1;
					break;
				case 2:
					print('why');
					this.cy+=1;
					break;
				case 3:
					this.cx-=1;
					break;
			}
			if(this.cy > 79){
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
			if(random(60)>this.turnDelay){
				this.turnDelay++;
			}
			else{
				let tHold = Math.floor(random(3));
				if (tHold >= this.dir){
					tHold++;
				}
				this.dir = tHold;
				this.turnDelay = 0;
			}			
		}
		fill(color(this.r, this.g, this.b));
		circle(this.cx*10+5, this.cy*10+5, 10); // draw the body of an enemy, a circle with r of 10
		board[this.cx][this.cy].pDecay = eTail;
		board[this.cx][this.cy].r = this.r;
		board[this.cx][this.cy].g = this.g;
		board[this.cx][this.cy].b = this.b;

	}

}

class Player{
	constructor(x, y){
		this.cx = x; // location of the player, always the same
		this.cy = y;
	}
	display(){
		if(!endStage){
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
			if(this.cy > 79){
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
		fill(color(50, 50, 230));
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
}