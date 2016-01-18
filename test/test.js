var svg = require("../");
var assert = require("assert");
describe("svgToFont", function() {
    it("把目录内svg合并生成到指定目录", function() {
        var res = svg.svgToFont('svg','./','icon');
        console.log(res);
        assert.equal(true,res.length>0);
    });
});

describe("getClassHead", function() {
    it("获取字体的style", function() {
        var res = svg.getClassHead('icon','2008');
        console.log(res);
        assert.equal(true,true);
    });
});