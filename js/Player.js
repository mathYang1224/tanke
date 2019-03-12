(function(){
	var Player = window.Player = function(){
		this.image = game.R["player1"];
		//位置。注意，坦克在拐弯的时候，x、y都会被自动修正到16的倍数上去
		this.x = 16 * 10;
		this.y = 16 * 24;
		//是否在移动
		this.isMoving = false;
		//方向URDL
		this.direction = "U";
		this.directionNumber = 0;
		//速度
		this.speed = 3;
		//履带状态0、1
		this.step = 0;
		//自己的子弹，游戏规定，一个子弹没有消失的时候，不能继续开火。
		this.bullet = null;
	}
	//开火！
	Player.prototype.fire = function(){
		if(this.bullet == null){
			if(this.direction == "R" || this.direction == "L"){
				this.bullet = new Bullet(this.x,this.y + 8,this.direction,this);
			}else{
				this.bullet = new Bullet(this.x + 8,this.y,this.direction,this);
			}
		}
	}
	//更改方向
	Player.prototype.changeDirection = function(fangxiangzimu){
		if(fangxiangzimu == "U"){
			this.directionNumber = 0;
		}else if(fangxiangzimu == "R"){
			this.directionNumber = 1;
		}else if(fangxiangzimu == "D"){
			this.directionNumber = 2;
		}else if(fangxiangzimu == "L"){
			this.directionNumber = 3;
		}
		//拉到16的倍数上面去
		if(fangxiangzimu != this.direction){
			this.x = Math.round(this.x / 16) * 16;
			this.y = Math.round(this.y / 16) * 16;
		}

		this.direction = fangxiangzimu;
	}
	//更新玩家
	Player.prototype.update = function(){
		if(this.isMoving){
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
			if(this._y > 16 * 24){
				this.y = 16 * 24;
				return;
			}
			if(this._y < 0){
				this.y = 0;
				return;
			}
			if(this._x < 0){
				this.x = 0;
				return;
			}
			//看看地图上这里有没有东西
			switch(this.direction){
				case "U" :
					//阻挡
					if(
						game.map.code[row][col] != 0 && game.map.code[row][col] != 3 ||
						game.map.code[row][col + 1] != 0 && game.map.code[row][col + 1] != 3
					){
						return;
					}
					break;
				case "R" :
					if(
						game.map.code[row][col + 2] != 0 && game.map.code[row][col + 2] != 3 ||
						row + 1 < 26 && game.map.code[row + 1][col + 2] != 0 && game.map.code[row + 1][col + 2] != 3
					){
						return;
					}
					break;
				case "D" :
					if(
						row + 2 < 26 && game.map.code[row + 2][col] != 0 && game.map.code[row + 2][col] != 3 ||
						row + 2 < 26 && game.map.code[row + 2][col + 1] != 0 && game.map.code[row + 2][col + 1] != 3
					){
						return;
					}
					break;
				case "L" :
					if(
						game.map.code[row][col] != 0 && game.map.code[row][col] != 3 ||
						row + 1 < 26 &&game.map.code[row + 1][col] != 0 && game.map.code[row + 1][col] != 3
					){
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

			//履带状态
			this.step = this.step == 0 ? 1 : 0;
		}

		//更新自己的子弹
		this.bullet && this.bullet.update();
	}
	//渲染玩家
	Player.prototype.render = function(){
		//渲染自己
		game.ctx.drawImage(this.image,28 * this.step,28 * this.directionNumber,28,28,this.x + 2,this.y + 2,28,28);
		//渲染子弹
		this.bullet && this.bullet.render();
	}
	//动
	Player.prototype.move = function(){
		this.isMoving = true;
	}
})();