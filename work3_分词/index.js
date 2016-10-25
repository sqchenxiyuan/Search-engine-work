// // 载入模块
// var Segment = require('segment');
// // 创建实例
// var segment = new Segment();
// // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
// segment.useDefault();
//
// // 开始分词
// console.log(segment.doSegment('这是一个基于Node.js的中文分词模块。'));


var path=require('path'),
 iconv = require('iconv-lite'),
  fs=require('fs');

// fs.readFile(__dirname+'/演示语料/(国际)(1)探访日本大型太阳能电池试验场.txt',"utf-8", function(err, data) {
//     // 读取文件失败/错误
//     if (err) {
//         throw err;
//     }
//     // 读取文件成功
//     // var str="";
//     console.log(data);
//     var buf=iconv.encode(data,'gbk');
//     console.log(buf);
//     var str1=iconv.decode(buf,'utf-8');
//     console.log(str1);
//     // var buf=iconv.encode(data.toString());
//
//
//     // console.log(data.toString());
//     // console.log(data.toString());
//
//     // str = iconv.decode(new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]), 'win1251');
//     //
//     // buf = iconv.encode("Sample input string", 'win1251');
//     //
//     // iconv.encodingExists("us-ascii");
// });

var readStream=fs.createReadStream(__dirname+'/演示语料/(国际)(1)探访日本大型太阳能电池试验场.txt');
var writeStream=fs.createWriteStream(__dirname+'/演示语料转码后/(国际)(1)探访日本大型太阳能电池试验场.txt');

readStream.on("data",function(data){
});
readStream.on("end",function(){
  console.log(123);
});

readStream.pipe(iconv.decodeStream('gbk'))
    .pipe(iconv.encodeStream('utf-8'))
    .pipe(writeStream);
