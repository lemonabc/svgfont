'use strict';
var fontCarrier = require('font-carrier');
var filePlus = require('file-plus');
var fs = require('fs');
var path = require('path');
class Svg {
	/**
	 * 将目录下的svg文件合并成字体
	 * @param  {string} svgDir svg目录
	 * @param  {string} outPut 输出的字体目录
	 * @param  {string} name 输出的字体名称
	 * @param  {string} startChar 启始字符默认位900;
	 */
	static svgToFont(svgDir,outPut,name,startChar){
		var font = fontCarrier.create();
		var files = filePlus.getAllFilesSync(svgDir);
		startChar = startChar || '900';
		var char = "&#xe";
		var self = this;
		var infos = [];
		if(files.length == 0){
			return
		}
		files.forEach(function(file) {
			var tempJson = {};
			var tempChar = char + startChar;
			var fileName = path.basename(file,'.svg');
			tempJson.fileName = fileName;
			tempJson.content = '\e'+startChar;
			font.setSvg(tempChar,{
				svg:fs.readFileSync(file).toString(),
				glyphName:fileName
			});
			startChar = self.next(startChar);
			infos.push(tempJson);
		})
		//判断font目录是否存在
		if(!fs.existsSync(outPut)){
			//创建目录
			filePlus.createFileSync(outPut);
		}
		var fontPath = path.join(outPut,name);
		
		font.output({
		  path:fontPath
		})
		return infos;
	};
	static next(char){
		var num = parseInt(char,'16');
		num++;
		return parseInt(num).toString(16);
	};
	static getClassHead(urlPath,name,version){
		var fontFacr = "@font-face {\n"+
							"font-family: '"+name+"';\n"+
							"src:url('"+urlPath+name+".eot?v="+version+"');\n"+
							"src:url('"+urlPath+name+".eot?v="+version+"') format('embedded-opentype'),\n"+
								"url('"+urlPath+name+".woff?v="+version+"') format('woff'),\n"+
								"url('"+urlPath+name+".ttf?v="+version+"') format('truetype'),\n"+
								"url('"+urlPath+name+".svg?v="+version+"') format('svg');\n"+
							"font-weight: normal;\n"+
							"font-style: normal;\n"+
						 "}\n"
		return fontFacr;
	}
}

module.exports = Svg;



