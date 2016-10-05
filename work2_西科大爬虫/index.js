var spider = require('./spider');


var domains={};
var urllist=["http://www.swust.edu.cn/"];



var cachingnum=0;
var cachedurl={};

var cachedurlnum=0;

function run(){
  if(urllist.length===0&&cachingnum===0){
    console.log("爬取完毕~~");
    var x=0;
    var errornum=0;
    for(var domain in domains){
      console.log(domain);
      x++;
      //if(domains[domain].statusCode==404) errornum++;
    }
    console.log(x,errornum);
    return;
  }
  if(urllist.length>0){
    var url=urllist.shift();
    if(cachingnum<100){
      console.log(cachingnum,urllist.length,cachedurlnum);
      cachedurl[url]=true;
      cachingnum++;
      spider.cache(url,function(data){
        cachingnum--;
        cachedurlnum++;
        console.log("完毕",cachingnum,urllist.length,cachedurlnum);
        var domain=data.domain;
        if(!domains[domain]){
          domains[domain]={};
        }
        var insites=data.insites;//站内连接
        var inoutsites=data.inoutsites;//站外同域网站
        var outsites=data.outsites;//外域网站（不访问）
        var srouces=data.srouces;//资源列表
        var interfaces=data.interfaces;//接口列表
        domains[domain][data.path]={
          insites:insites,
          inoutsites:inoutsites,
          outsites:outsites,
          srouces:srouces,
          interfaces:interfaces,
          statusCode:data.statusCode
        };

        insites.forEach(addUrl);
        inoutsites.forEach(addUrl);

        function addUrl(url){
          if(!cachedurl[url]) {
            urllist.push(url);
            cachedurl[url]=true;
          }
        }
      });
    }
  }
  setTimeout(function(){
    run();
  },10);
}

run();
