(function(){
	var Map = window.Map = function(){
		//26*26矩阵，实际上是一个26维数组。
		this.code = [];
		//读取tkm文件，根据关卡编号来读取
		var self = this;
		$.get("maps/" + game.stage + ".tkm",function(data){
			self.code = JSON.parse(data);
		});
	}
	//渲染地图
	Map.prototype.render = function(){
		for(var i = 0 ; i < 26 ; i++){
			for(var j = 0 ; j < 26 ; j++){
				if(this.code[i][j] != 0){
					game.ctx.drawImage(game.R["block"],(this.code[i][j] - 1) * 32,0,16,16,j * 16,i * 16,16,16);
				}
			}
		}
	}
	//改变某一个字符
	Map.prototype.changecode = function(row,col,landtype){
		this.code[row] = this.code[row].substr(0,col) + landtype + this.code[row].substr(col + 1);
	}
})();