(function(){
	var Bullet = window.Bullet = function(x,y,direction,owner){
		this.image = game.R["bullet"];
		//位置。注意，坦克在拐弯的时候，x、y都会被自动修正到16的倍数上去
		this.x = x == 0 ? 8 : x;
		this.y = y == 0 ? 8 : y;
		//方向URDL
		this.direction = direction;
		if(this.direction == "U"){
			this.directionNumber = 0;
		}else if(this.direction == "R"){
			this.directionNumber = 1;
		}else if(this.direction == "D"){
			this.directionNumber = 2;
		}else if(this.direction == "L"){
			this.directionNumber = 3;
		}
		//速度
		this.speed = 10;
		//履带状态0、1
		this.step = 0;
		//拥有者
		this.owner = owner;
	}

	//更新玩家
	Bullet.prototype.update = function(){
		 
		//验证即将达到的16*16小格上是不是空气、草地
		//试着减去一下
		this._y = this.y;
		this._x = this.x;
		switch(this.direction){
			case "U" :
				this._y = this.y - this.speed;
				break;
			case "R" :
				this._x = this.x + this.speed;
				break;
			case "D" :
				this._y = this.y + this.speed;
				break;
			case "L" :
				this._x = this.x - this.speed;
				break;
		}
		//看看试着减去的这个东西对应的地图位置
		var row = parseInt(this._y / 16);
		var col = parseInt(this._x / 16);
		if(this._y > 16 * 25 - 8){
			this.y = 16 * 25 - 8;
			this.owner.bullet = null;
			return;
		}
		if(this._y < 8){
			this.y = 8;
			this.owner.bullet = null;
			return;
		}
		if(this._x < 8){
			this.x = 8;
			this.owner.bullet = null;
			return;
		}
		if(this._x > 16 * 25 - 8){
			this.x = 16 * 25 - 8;
			this.owner.bullet = null;
			return;
		}
		//看看地图上这里有没有东西
		switch(this.direction){
			case "U" :
				//打砖块
				if(game.map.code[row][col] == "1"){
					game.map.changecode(row,col,"0");
					this.owner.bullet = null;	//让自己的所有者不再携带自己
				}
				//打砖块
				if(
					game.map.code[row][col + 1] == 1
				){
					game.map.changecode(row,col + 1,"0");
					this.owner.bullet = null;
				}

				if(
					game.map.code[row][col] != 0 && game.map.code[row][col] != 3  && game.map.code[row][col] != 4 ||
					game.map.code[row][col + 1] != 0 && game.map.code[row][col  + 1] != 3  && game.map.code[row][col + 1] != 4
				){
					this.owner.bullet = null;
					return;
				}
				break;
			case "R" :
				//打砖块
				if(game.map.code[row][col + 1] == 1){
					game.map.changecode(row,col+1,"0");
					this.owner.bullet = null;	//让自己的所有者不再携带自己
				}
				//打砖块
				if(
					game.map.code[row + 1][col + 1] == 1
				){
					game.map.changecode(row + 1,col + 1,"0");
					this.owner.bullet = null;
				}

				if(
					game.map.code[row][col + 1] != 0 && game.map.code[row][col + 1] != 3 && game.map.code[row][col + 1] != 4 ||
					row + 1 < 26 && game.map.code[row + 1][col + 1] != 0 && game.map.code[row + 1][col + 1] != 3 && game.map.code[row + 1][col + 1] != 4
				){
					this.owner.bullet = null;
					return;
				}
				break;
			case "D" :
				//打砖块
				if(row + 1 < 26 && game.map.code[row + 1][col] == 1){
					game.map.changecode(row + 1,col,"0");
					this.owner.bullet = null;	//让自己的所有者不再携带自己
				}
				//打砖块
				if(
					row + 1 < 26 && game.map.code[row + 1][col + 1] == 1
				){
					game.map.changecode(row + 1,col + 1,"0");
					this.owner.bullet = null;
				}

				if(
					row + 1 < 26 && game.map.code[row + 1][col] != 0 && game.map.code[row + 1][col] != 3  && game.map.code[row + 1][col] != 4 ||
					row + 1 < 26  && game.map.code[row + 1][col + 1] != 0 && game.map.code[row + 1][col + 1] != 3   && game.map.code[row + 1][col + 1] != 4 
					){
					this.owner.bullet = null;
					return;
				}
				break;
			case "L" :
				//打砖块
				if(game.map.code[row][col] == 1){
					game.map.changecode(row,col,"0");
					this.owner.bullet = null;	//让自己的所有者不再携带自己
				}
				//打砖块
				if(
					row + 1 < 26 && game.map.code[row + 1][col] == 1
				){
					game.map.changecode(row + 1,col,"0");
					this.owner.bullet = null;
				}

				if(
					game.map.code[row][col] != 0 && game.map.code[row][col] != 3 && game.map.code[row][col] != 4 || 
					row + 1 < 26  && game.map.code[row + 1][col] != 0 && game.map.code[row + 1][col] != 3   && game.map.code[row + 1][col] != 4 
				){
					this.owner.bullet = null;
					return;
				}
				break;
		}

		//根据方向来改变x、y
		switch(this.direction){
			case "U" :
				this.y -= this.speed;
				break;
			case "R" :
				this.x += this.speed;
				break;
			case "D" :
				this.y += this.speed;
				break;
			case "L" :
				this.x -= this.speed;
				break;
		}
	}
	//渲染子弹
	Bullet.prototype.render = function(){
		game.ctx.drawImage(this.image,0,16 * this.directionNumber,16,16,this.x,this.y,16,16);
	}
})();