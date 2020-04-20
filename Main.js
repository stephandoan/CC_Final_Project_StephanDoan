

function setup(){
	createCanvas(800,800);
	background(0);
	framerate(24);

	int board = [];
	for (int x = 0; x < 80; x++){
		board[x] = [];
		for (int y = 0; y < 80; y++){
			board[x][y] = new Tile(x,y);
		}
	}
}

class Tile{ // tiles contain objects, standardizing movement. Tiles are 10x10 pixels

	constructor(x, y){
		this.tx = x; // coordinates of the tile
		this.ty = y;

		this.tail = false;	// whether or not this is a tail
		this.pDecay = 0; // tracks when the path will become passable
	}

}

class enemy{ //enemy will place down tails
	constructor(x, y, tail){
		this.ex = x; // current location of the enemy
		this.ey = y;

		this.len = tail; // length of the produced tail in tiles;
	}


}