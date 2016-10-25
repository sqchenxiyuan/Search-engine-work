var path=require('path'),
iconv = require('iconv-lite'),
fs=require('fs');

var Dictionarys=[];
var maxlength;

start();
function start(){
  getDictionary(function(data){
    initDictionary(data,function(){
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
    if(!Dictionarys[a.length]) Dictionarys[a.length]=[];
    Dictionarys[a.length].push(a);
  });
  maxlength=Dictionarys.length-1;
  if(typeof callback == 'function')callback();
}

function startparticiple(){
  fs.readFile(__dirname+'/演示语料转码后/(国际)(1)探访日本大型太阳能电池试验场.txt',"utf-8", function(err, data) {
      if (err) {
          throw err;
      }
      console.log(data);

      // // 载入模块
      // var Segment = require('segment');
      // // 创建实例
      // var segment = new Segment();
      // // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
      // segment.useDefault();
      //
      // // 开始分词
      // console.log(segment.doSegment(data));
      participle(data);


  });
}

function participle(str){
  str=str.replace(/\s/g,"");
  var result=[];
  while(str){
    var ci;
    var l=Math.min(maxlength-1,str.length);
    for(;l>=1;l--){
      ci=str.substring(0,l);
      if(l==1){
        break;
      }
      if(Dictionarys[l]){
        var ok=false;
        Dictionarys[l].forEach(function(a){
          if(a==ci){
            //console.log(a);
            ok=true;
          }
        });
        if(ok)break;
      }
      //判断为英文或者数字
      var ref=new RegExp(/^[\d\w\.]*$/);
      if(ref.test(ci))break;
    }
    result.push(ci);
    str=str.substring(l,str.length);
  }
  console.log(result);
}
