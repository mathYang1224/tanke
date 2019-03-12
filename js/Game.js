(function(){
	var Game = window.Game = function(params){
		//得到画布
		this.canvas = document.querySelector(params.canvasid);
		//上下文
		this.ctx = this.canvas.getContext("2d");
		//资源文件地址
		this.Rjsonurl = params.Rjsonurl;
		//帧编号
		this.fno = 0;
		//关卡编号
		this.stage = 1;
		//读取资源
		var self = this;
		//读取资源是一个异步函数，所以我们不知道什么时候执行完毕。但是其他的事情必须等到他完毕之后再执行，必须用回调函数。
		this.loadAllResource(function(){
			//我们封装的回调函数，这里表示全部资源读取完毕
			self.start();
			//绑定监听
			self.bindEvent();
		});
	}
	//读取资源
	Game.prototype.loadAllResource = function(callback){
		//准备一个R对象
		this.R = {};
		var self = this;	//备份
		//计数器
		var alreadyDoneNumber = 0;
		//发出请求，请求JSON文件。
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				var Robj = JSON.parse(xhr.responseText);
				//遍历数组
				for (var i = 0; i < Robj.images.length; i++) {
					//创建一个同名的key
					self.R[Robj.images[i].name] = new Image();
					//请求
					self.R[Robj.images[i].name].src = Robj.images[i].url;
					//监听
					self.R[Robj.images[i].name].onload = function(){
						alreadyDoneNumber++;
						//清屏
						self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
						//提示文字
						var txt = "正在加载资源" + alreadyDoneNumber + "/" + Robj.images.length + "请稍后";
						//放置居中的位置，屏幕的黄金分割点
						self.ctx.textAlign = "center";
						self.ctx.font = "20px 微软雅黑";
						self.ctx.fillText(txt, self.canvas.width / 2 ,self.canvas.height * (1 - 0.618));
						//判断是否已经全部加载完毕
						if(alreadyDoneNumber == Robj.images.length){
							callback();
						}
					}
				};
			}
		}
		xhr.open("get",this.Rjsonurl,true);
		xhr.send(null);
	}
	//开始游戏
	Game.prototype.start = function(){
		var self = this;
		//实例化自己的地图类
		this.map = new Map();
		//实例化玩家
		this.player1 = new Player();
		//实例化敌人（一会儿将变为数组）
		this.enermyarr = [new Enermy(),new Enermy(),new Enermy(),new Enermy() ,new Enermy(),new Enermy() ,new Enermy(),new Enermy() ,new Enermy(),new Enermy() ];

		//设置定时器
		this.timer = setInterval(function(){
			//清屏
			self.ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
			//渲染地图
			self.map.render();
			//更新玩家、渲染玩家
			self.player1.update();
			self.player1.render();
			//敌人
			_.each(self.enermyarr,function(enermy){
				enermy.update();
				enermy.render();
			});
				
			//帧编号
			self.fno ++;
			//打印帧编号
			self.ctx.fillStyle = "white";
			self.ctx.font = "16px consolas";
			self.ctx.textAlign = "left";
			self.ctx.fillText("FNO:" + self.fno , 10 ,20);
		},20);
	}
	//绑定监听
	Game.prototype.bindEvent = function(){
		var self = this;
		$(document).keydown(function(event){
			if(event.keyCode == 38){
			 	self.player1.changeDirection("U");
				self.player1.isMoving = true;
			}else if(event.keyCode == 39){
				self.player1.changeDirection("R");
				self.player1.isMoving = true;
			}else if(event.keyCode == 40){
				self.player1.changeDirection("D");
				self.player1.isMoving = true;
			}else if(event.keyCode == 37){
				self.player1.changeDirection("L");
				self.player1.isMoving = true;
			}else if(event.keyCode == 32){
				self.player1.fire();
			}
		});


		$(document).keyup(function(event){
			self.player1.isMoving = false;
		});
	}
})();