'use strict';
var fontCarrier = require('font-carrier');
var filePlus = require('file-plus');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var fontType = {
	'eot':'embedded-opentype',
	'woff':'woff',
	'ttf':'truetype',
	'svg':'svg'
}
class Svg {

	// constructor(svgDir,tname,startChar){
	constructor(config){
		// config = {
		// 	svgDir:'', //svg目录
		// 	name:'',//字体名称
		// 	nameToMD5:true, //字体文件md5命名
		// 	startChar:''	//字符起始
		// }
		if(!config.nameToMD5){
			this.name = config.name;
		}
		this.fontFaceName = config.fontFaceName;
		this.nameToMD5 = config.nameToMD5;
		//this.name = tname;
		this.infos = [];
		this.font = fontCarrier.create();
		var self = this;
		var char = "&#xe";
		var startChar = config.startChar || '900';

		var files = filePlus.getAllFilesSync(config.svgDir);
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
	 * @return {String} 文件名   [description]
	 */
	outPut(outPut){
		if(!fs.existsSync(outPut)){
			//创建目录
			filePlus.mkdirsSync(outPut,'0777');
		}
		//var fontPath = path.join(outPut,this.name);
		// var fontBuffer = this.font.output({
		//   path:fontPath
		// });
		if(this.nameToMD5){
			var fontBuffer = this.font.output();
			var hash = crypto.createHash('md5').update(fontBuffer.svg.toString("utf-8")).digest('hex');
			this.name = hash.substring(0,6);
			if(fs.existsSync(path.join(outPut,this.name+'.svg'))){
				console.log('字体未改变');
				return this.name
			}
		}
		var fontPath = path.join(outPut,this.name);

		this.font.output(
			{
				path:fontPath
			}
		);
		//console.log(aa);
		return this.name;
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

		var fontFace = '@font-face {\n'+'font-family: "'+this.fontFaceName+'";\n';
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



