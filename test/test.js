var svg = require("../");
var assert = require("assert");
describe("svgToFont", function() {
    it("把目录内svg合并生成到指定目录", function() {
        var tempSvg = new svg('svg','font');
        var res = tempSvg.getInfos();
        console.log(res);
        tempSvg.outPut('./');
    });
});

describe("getClassHead", function() {
    it("获取字体的style", function() {
        var tempSvg = new svg('svg','font');

        var res = tempSvg.getClassHead('icon',true);

        console.log(res);
        assert.equal(true,true);
    });
});