var path=require('path'),
 iconv = require('iconv-lite'),
  fs=require('fs');

fs.readdir(__dirname+'/演示语料',function(err,files){
  if(err){
    console.log(err);
    return;
  }
  files.forEach(function(a){
    add(a);
  });
  start();
  stop();
});


var list=[];
var doing=0;
var max=10;
var running;

function add(a){
  list.push(a);
}

function start(){
   running=true;
   run();
}
function stop(){
  running=false;
}

function run(){
  if(!running&&!list.length&&!doing){
    console.log("完成！");
    return ;
  }
  if(doing<max&&list.length>0){
    var name=list.shift();
    console.log("开始转码  "+name);
    doing++;


    var readStream=fs.createReadStream(__dirname+'/演示语料/'+name);
    var writeStream=fs.createWriteStream(__dirname+'/演示语料转码后/'+name);
    readStream.on("data",function(data){
    });
    readStream.on("end",function(){
      console.log("完成转码  "+name);
      doing--;
    });

    readStream.pipe(iconv.decodeStream('gbk'))
        .pipe(iconv.encodeStream('utf-8'))
        .pipe(writeStream);
  }

  setTimeout(function(){
    run();
  },1);
}
