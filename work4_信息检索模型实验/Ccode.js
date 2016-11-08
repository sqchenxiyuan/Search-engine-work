var path=require('path'),
 iconv = require('iconv-lite'),
  fs=require('fs'),
  Q=require('./Qcallback').Qc;

var qc=new Q();
qc.setmaxrunnum(300);
qc.setrunFun(function(data,callback){
    console.log("开始 "+data);
    var readStream=fs.createReadStream(__dirname+'/演示语料/'+data);
    var writeStream=fs.createWriteStream(__dirname+'/演示语料转码后/'+data);
    readStream.on("data",function(data){
    });
    readStream.on("end",function(){
      console.log("完成 "+data);
      callback();
    });
    readStream.pipe(iconv.decodeStream('gbk'))
        .pipe(iconv.encodeStream('utf-8'))
        .pipe(writeStream);
});
qc.setendFun(function(){
  console.log("完成！");
});

fs.readdir(__dirname+'/演示语料',function(err,files){
  if(err){
    console.log(err);
    return;
  }
  var x=0;
  files.forEach(function(a){
    if(!x){
      qc.start();
      x=1;
    }
    qc.addData(a);
  });
  qc.end();
});
