##说明
svg字体目录级处理
##api
* **svgToFont** 将目录下的svg文件合并成字体
 	* 参数：
		* **svgDir**：svg的文件夹路径；
		* **outPut**：输出的字体目录；
		* **name**： 输出的字体名称；
		* **startChar**： 启始字符，默认位900；
	* 返回值：
		* **array**:svg字体对应的字符集,[{'i-button':'e900'},['i-top':'e9001']]
* **getClassHead** 获取css的@font-face。
	* 参数：
		* **urlPath**：字体文件url；
		* **name**：字体名称，字体文件名和font-family同名；
		* **version**：字体版本号；
	* 返回值：
		* **string**:@font-face完整属性;
		