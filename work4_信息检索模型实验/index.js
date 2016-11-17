var path=require('path'),
fs=require('fs'),
Q=require('./Qcallback').Qc;

var Dictionarys={};
var files=[];
var loadD;
var strt=0;

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

    //树状哈希
    for(var i=0;i<l;i++){
      var char=a.charAt(i);
      if(dc[char]) dc=dc[char];
      else{
        dc[char]={};
        dc=dc[char];
      }
    }

  });
  if(typeof callback == 'function')callback();
}

function participle(str){
  str=str.replace(/\s/g,"");
  var result={};
  while(str){
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

    var ci=str.substring(0,l);
    var reg=new RegExp(/^(\.|,|!|;|，|。|！|；|、|——)/);//去除一些标点符号
    if(result[ci]&&!reg.test(ci)){
      result[ci]++;
    }
    else {
      result[ci]=1;
    }
    str=str.substring(l,str.length);
  }
  return result;
}

function startparticiple(){
  var qc=new Q();

  qc.setdelay(3);
  qc.setmaxrunnum(100);
  qc.setrunFun(function(name,callback){

    //console.time("分词时间--"+name);
    fs.readFile(__dirname+'/演示语料转码后/'+name,"utf-8", function(err, data) {
        if (err) {
            throw err;
        }
        // 开始分词
        //var resulttxt=segment.doSegment(data).join("\r\n");
        var date=new Date();
        var results=participle(data);
        files.push({
          name:name,
          words:results
        });
        strt+=new Date().getTime()-date.getTime();
        //console.timeEnd("分词时间--"+name);
        callback();
    });
  });
  qc.setendFun(function(){
    console.log("分词结束");
    Calculate();
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
        console.log("分词中:loading");
        x=1;
      }
      qc.addData(a);
    });
    qc.end();
  });
}



function Calculate(){
  var i,j,a,b;
  var l=files.length;
  var xsd;
  var out=[];
  var same=[];

  files.sort(function(a,b){
    if(!a.wordl){
      a.wordl=Object.keys(a.words).length;
    }
    if(!b.wordl){
      b.wordl=Object.keys(b.words).length;
    }
    return a.wordl>b.wordl;
  });

  console.time("计算相似度总时间");
  console.log("计算中");
  for(i=0;i<l;i++){
    a=files[i];
    // console.time("计时间--"+a.name);
    for(j=i+1;j<l;j++){
      b=files[j];

      xsd=ComputSimilarity(a,b);
      if(out[parseInt(xsd*10)])out[parseInt(xsd*10)]++;
      else out[parseInt(xsd*10)]=1;
      //console.log("相熟度--"+a.name+" X "+b.name+" : "+xsd);
      if(xsd>0.8){
        same.push({
          a:a,
          b:b,
          xsd:xsd
        });
      }
    }
    //console.timeEnd("计时间--"+a.name);
  }
  console.timeEnd("计算相似度总时间");
  console.log("加载词典用时 "+loadD+" ms");
  console.log("分词时间累计 "+strt+" ms");
  console.log("完成！");

  out.forEach(function(a,index){
    console.log('介于'+index/10+"到"+(index+1)/10+'之间有 '+a);
  });

  console.log("其中相识度大于0.8的有以下文章:");
  same.forEach(function(a,index){
    console.log((index+1)+". "+a.a.name+" x "+a.b.name+' = '+a.xsd);
  });
}

function ComputSimilarity(a,b){
  var x1=0,x2=0,x3=0;
  var name;
  for(name in a.words) {
    if(b.words[name]) x1+=a.words[name]*b.words[name];
  }
  if(!a.sum){
    for(name in a.words) {
      x2+=a.words[name]*a.words[name];
    }
    a.sum=x2;
  }else{
    x2=a.sum;
  }
  if(!b.sum){
    for(name in b.words) {
      x3+=b.words[name]*b.words[name];
    }
    b.sum=x3;
  }else{
    x3=b.sum;
  }
  return x1/Math.sqrt(x2*x3);
}
