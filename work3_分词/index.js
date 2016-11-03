var path=require('path'),
iconv = require('iconv-lite'),
fs=require('fs'),
Q=require('./Qcallback').Qc;

var Dictionarys={};
var maxlength=0;
var loadD;

start();
function start(){
  var sd=new Date();
  console.time("加载字典");
  getDictionary(function(data){
    initDictionary(data,function(){
      console.timeEnd("加载字典");
      loadD=new Date().getTime()-sd.getTime();
      startparticiple();
    });
  });
}

function getDictionary(callback){
  fs.readFile(__dirname+'/中文分词词库/30万中文分词词库.txt',"utf-8", function(err, data) {
      if (err) {
          throw err;
      }
      //console.log(data.split('\n')[1].split('\t')[0]);
      var outdata=[];
      data.split('\n').forEach(function(a){
        outdata.push(a.split('\t')[1]);
      });
      if(typeof callback == 'function')callback(outdata);
  });
}

function initDictionary(data,callback){
  data.forEach(function(a){

    var dc=Dictionarys;
    var l=a.length;
    if(l>maxlength)maxlength=l;

    //树状哈希
    for(var i=0;i<l;i++){
      var char=a.charAt(i);
      if(dc[char]) dc=dc[char];
      else{
        dc[char]={};
        dc=dc[char];
      }
    }

    //纯哈希
    //dc[a]=true;

    //长度分组哈希
    // if(!dc[l])dc[l]={};
    // dc[l][a]=true;

  });
  if(typeof callback == 'function')callback();
}

function participle(str){
  str=str.replace(/\s/g,"");
  var result=[];
  while(str){
    //var ci;
    //var l=Math.min(maxlength-1,str.length);
    // for(;l>=1;l--){
    //
    //   ci=str.substring(0,l);
    //   if(l==1){
    //     break;
    //   }
    //
    //   var dc=Dictionarys;
    //
    //
    //   //纯哈希
    //   //if(dc[ci])break;
    //
    //   //长度分组哈希
    //   if(dc[l][ci])break;
    //
    //   //判断为英文或者数字
    //   var ref=new RegExp(/^[\d\w\.]*$/);
    //   if(ref.test(ci))break;
    //
    // }

    //树状哈希
    var l=0;
    var tree=Dictionarys;
    for(;l<str.length;l++){
      if(!tree[str[l]]){
        break;
      }
      tree=tree[str[l]];
    }

    if(l===0){
      //判断数字
      var s=str.match(/^[\d\w\.]*/)[0];
      l=s.length;
      if(!l)l=1;
    }

    result.push(str.substring(0,l));
    str=str.substring(l,str.length);
  }
  return result;
}

// 载入模块
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

function startparticiple(){
  var qc=new Q();
  var strl=0;
  var strt=0;
  qc.setdelay(3);
  qc.setmaxrunnum(100);
  qc.setrunFun(function(name,callback){
    console.time("分词时间"+name);
    fs.readFile(__dirname+'/演示语料转码后/'+name,"utf-8", function(err, data) {
        if (err) {
            throw err;
        }
        // 开始分词
        //var resulttxt=segment.doSegment(data).join("\r\n");
        strl+=data.length;
        var date=new Date();
        var resulttxt=participle(data).join("\r\n");
        strt+=new Date().getTime()-date.getTime();
        fs.writeFile(__dirname+'/分词结果/'+name,resulttxt,'utf-8',function(err){
          if(err)console.log(err);
          console.timeEnd("分词时间"+name);
          callback();
        });
    });
  });
  qc.setendFun(function(){
    console.log("加载词典用时 "+loadD+" ms");
    console.timeEnd("分词总时间(IO)");
    console.log("分词量累计 "+strl+" 字");
    console.log("分词时间累计 "+strt+" ms");
    console.log("完成！");
  });

  fs.readdir(__dirname+'/演示语料转码后',function(err,files){
    if(err){
      console.log(err);
      return;
    }
    var x=0;
    files.forEach(function(a){
      if(!x){
        qc.start();
        console.time("分词总时间(IO)");
        x=1;
      }
      qc.addData(a);
    });
    qc.end();
  });
}
