(function(){
	var Enermy = window.Enermy = function(){
		this.image = game.R["enemy"];
		//位置。注意，坦克在拐弯的时候，x、y都会被自动修正到16的倍数上去
		this.x = 0;
		this.y = 0;
		//方向URDL
		//随机一个方向
		this.direction = _.sample(["D"],1)[0];
		if(this.direction == "R"){
			this.directionNumber = 1;
		}else if(this.direction == "D"){
			this.directionNumber = 2;
		} 
		//速度
		this.speed = 3;
		//履带状态0、1
		this.step = 0;
		//自己的子弹，游戏规定，一个子弹没有消失的时候，不能继续开火。
		this.bullet = null;
		//防止自己在同一个路口多次判断，此时就加一个锁
		this.lock = true;
		//上锁的这一帧的帧编号
		this.lockfno = 0;
	}
	//开火！
	Enermy.prototype.fire = function(){
		if(this.bullet == null){
			if(this.direction == "R" || this.direction == "L"){
				this.bullet = new Bullet(this.x,this.y + 8,this.direction,this);
			}else{
				this.bullet = new Bullet(this.x + 8,this.y,this.direction,this);
			}
		}
	}
	//更改方向
	Enermy.prototype.changeDirection = function(fangxiangzimu){
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
	Enermy.prototype.update = function(){

		//锁如果已经超过了32像素应有的帧数，开锁
		if((game.fno - this.lockfno) > parseInt(32 / this.speed)){
		 
			this.lock = true;
		}
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
			this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
			return;
		}
		if(this._y < 0){
			this.y = 0;
			this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
			return;
		}
		if(this._x < 0){
			this.x = 0;
			this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
			return;
		}
		if(this._x > 16 * 24){
			this.x =  16 * 24;
			this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
			return;
		}


		//看看地图上这里有没有东西
		switch(this.direction){
			case "U" :
				//验证右侧是否有路
				if(
					(col + 2 < 26 && game.map.code[row][col + 2] == 0 || game.map.code[row][col + 2] == 3) &&
					(row + 1 < 26 && (game.map.code[row + 1][col + 2] == 0 || game.map.code[row + 1][col + 2] == 3))
				){
					if(this.lock && Math.random() > 0.5){
						 
						this.changeDirection("R");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}
				//验证左侧是否有路
				if(
					(col > 0 && game.map.code[row][col] == 0 || game.map.code[row][col] == 3) &&
					(row + 1 < 26 && (game.map.code[row + 1][col] == 0 || game.map.code[row + 1][col] == 3))
				){
					if(this.lock && Math.random() > 0.5){
						this.changeDirection("L");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}


				//向上走，正前方有没有人阻挡我
				if(
					game.map.code[row][col] != 0 && game.map.code[row][col] != 3 ||
					col + 1 < 26 && (game.map.code[row][col + 1] != 0 && game.map.code[row][col + 1] != 3)
				){
					this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
					return;
				}
				break;
			case "R" :
				//判断上方是否有路
				if(
					(row - 1 > 0 && (game.map.code[row - 1][col] == 0 || game.map.code[row  - 1][col] == 3 || game.map.code[row  - 1][col] == 1)) &&
					(row - 1 > 0 && col + 1 < 26 && (game.map.code[row - 1][col + 1] == 0 || game.map.code[row - 1][col + 1] == 3 || game.map.code[row - 1][col + 1] == 1))
				){	
			 		 
					if(this.lock && Math.random() > 0.5){
						this.changeDirection("U");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}
				//判断下方是否有路
				if(
					(row + 2 < 26 && (game.map.code[row + 2][col] == 0 || game.map.code[row + 2][col] == 3)) &&
					(row + 2 < 26 && col + 1 < 26  && (game.map.code[row + 2][col + 1] == 0 || game.map.code[row + 2][col + 1] == 3))
				){
					 
					if(this.lock && Math.random() > 0.5){
						
						this.changeDirection("D");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}

				//向右走，正前方有没有人阻挡我
				if(
					col + 2 < 26 && (game.map.code[row][col + 2] != 0 && game.map.code[row][col + 2] != 3) ||
					row + 1 < 26 && (game.map.code[row + 1][col + 2] != 0 && game.map.code[row + 1][col + 2] != 3)
				){
					this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
					return;
				}
				break;
			case "D" :
				//验证右侧是否有路
				if(
					(col + 2 < 26 && game.map.code[row][col + 2] == 0 || game.map.code[row][col + 2] == 3) &&
					(row + 1 < 26 && game.map.code[row + 1][col + 2] == 0 || game.map.code[row + 1][col + 2] == 3)
				){
					if(this.lock && Math.random() > 0.5){
						 
						this.changeDirection("R");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}
				//验证左侧是否有路
				if(
					(col > 0 && game.map.code[row][col] == 0 || game.map.code[row][col] == 3) &&
					(row + 1 < 26 && game.map.code[row + 1][col] == 0 || game.map.code[row + 1][col] == 3)
				){
					if(this.lock && Math.random() > 0.5){
						this.changeDirection("L");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}


				//向下走，正前方有没有人阻挡我
				if(
					row + 2 < 26 && (game.map.code[row + 2][col] != 0 && game.map.code[row + 2][col] != 3) ||
					row + 2 < 26 && (game.map.code[row + 2][col + 1] != 0 && game.map.code[row + 2][col + 1] != 3)
				){
					this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
					return;
				}
				break;
			case "L" :
				//判断上方是否有路
				if(
					(row - 1 > 0 && (game.map.code[row - 1][col] == 0 || game.map.code[row  - 1][col] == 3)) &&
					(row - 1 > 0 && (game.map.code[row - 1][col + 1] == 0 || game.map.code[row - 1][col + 1] == 3))
				){	
			 		 
					if(this.lock && Math.random() > 0.5){
						this.changeDirection("U");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}
				//判断下方是否有路
				if(
					(row + 2 < 26 && (game.map.code[row + 2][col] == 0 || game.map.code[row + 2][col] == 3)) &&
					(row + 2 < 26 && (game.map.code[row + 2][col + 1] == 0 || game.map.code[row + 2][col + 1] == 3))
				){
					 
					if(this.lock && Math.random() > 0.5){
						
						this.changeDirection("D");
					}
					this.lock = false;
					this.lockfno = game.fno;
				}
				
				//向左走，正前方有没有人阻挡我
				if(
					game.map.code[row][col] != 0 && game.map.code[row][col] != 3 ||
					row + 1 < 26 && (game.map.code[row + 1][col] != 0 && game.map.code[row + 1][col] != 3)
				){
					this.changeDirection(_.sample(["U","R","D","L"],1)[0]);
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
		 

		//更新自己的子弹
		this.bullet && this.bullet.update();
	}
	//渲染玩家
	Enermy.prototype.render = function(){
		//渲染自己
		game.ctx.drawImage(this.image,28 * this.step,28 * this.directionNumber,28,28,this.x + 2,this.y + 2,28,28);
		//渲染子弹
		if(this.bullet){
			this.bullet.render();
		}else{
			this.fire();
		}
	}
	//动
	Enermy.prototype.move = function(){
		this.isMoving = true;
	}
})();