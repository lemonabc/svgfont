'use strict';
var fontCarrier = require('font-carrier');
var filePlus = require('file-plus');
var fs = require('fs');
var path = require('path');

var fontType = {
	'eot':'embedded-opentype',
	'woff':'woff',
	'ttf':'truetype',
	'svg':'svg'
}
class Svg {

	constructor(svgDir,tname,startChar){
		this.name = tname;
		this.infos = [];
		this.font = fontCarrier.create();
		var self = this;
		var char = "&#xe";
		startChar = startChar || '900';
		var self = this;

		var files = filePlus.getAllFilesSync(svgDir);
		if(files.length == 0){
			return null;
		}
		files.forEach(function(file) {
			var tempJson = {};
			var tempChar = char + startChar;
			var fileName = path.basename(file,'.svg');
			tempJson.fileName = fileName;
			tempJson.content = '\e'+startChar;
			self.font.setSvg(tempChar,{
				svg:fs.readFileSync(file).toString(),
				glyphName:fileName
			});
			startChar = self.next(startChar);
			self.infos.push(tempJson);
		})

	}

	getInfos(){
		return this.infos;
	}
	/**
	 * 输出字体文件
	 * @param  {[type]} outPut [description]
	 * @param  {[type]} name   [description]
	 * @return {[type]}        [description]
	 */
	outPut(outPut){
		if(!fs.existsSync(outPut)){
			//创建目录
			filePlus.mkdirsSync(outPut,'0777');
		}
		var fontPath = path.join(outPut,this.name);
		this.font.output({
		  path:fontPath
		})
		return true;
	}
	/**
	 * 获取下一个字符码
	 * @param  {[type]}   char [description]
	 * @return {Function}      [description]
	 */
	next(char){
		var num = parseInt(char,'16');
		num++;
		return parseInt(num).toString(16);
	}
	/**
	 * 获取@font-face
	 * @param  {String} urlPath 字体路径
	 * @param  {Bool} base64  是否输出字体的base64编码
	 * @return {String}        @font-face属性
	 */

	getClassHead(urlPath,version,only64){

		var fontFace = '@font-face {\n'+'font-family: "'+this.name+'";\n';
		var last = '';
		if(only64){
			var object = this.font.output();
			fontFace = fontFace + 'src:url(\'data:application/x-font-ttf;base64,'+object['ttf'].toString('base64')+'\') format(\''+fontType['ttf']+'\');\n'
		}else{
			fontFace = fontFace + 'src:url("'+urlPath+this.name+'.eot");\nsrc:';
			for(var item in fontType){
				fontFace = fontFace + last;
				fontFace = fontFace + 'url("'+urlPath+this.name+'.'+item+'") format("'+fontType[item]+'")';

				last = ',\n';
			}
			fontFace = fontFace + ';\n';
		}
		fontFace = fontFace + "font-weight: normal;\n"+"font-style: normal;\n"+"}\n"

		return fontFace;
	}
}

module.exports = Svg;



