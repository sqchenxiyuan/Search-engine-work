var spider = require('./spider');
var dbsave = require('./dbsave');

var domains={};
var urllist=["http://www.swust.edu.cn/"];



var cachingnum=0;
var cachedurl={};

var cachedurlnum=0;


start(run);
function run(){
  if(urllist.length===0&&cachingnum===0){
    console.log("爬取完毕~~");
    var x=0;
    var errornum=0;
    for(var domain in domains){
      console.log(domain,Object.keys(domains[domain]).length);
    }
    end();
    //console.log(x,errornum);
    return;
  }
  if(urllist.length>0){
    var url=urllist.shift();
    if(cachingnum<50){
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
        var title=data.title;
        var insites=data.insites;//站内连接
        var inoutsites=data.inoutsites;//站外同域网站
        var outsites=data.outsites;//外域网站（不访问）
        var srouces=data.srouces;//资源列表
        var interfaces=data.interfaces;//接口列表

        var statuscode=data.statusCode;

        var domaindata={
          title:title,
          insites:insites,
          inoutsites:inoutsites,
          outsites:outsites,
          srouces:srouces,
          interfaces:interfaces,
          statuscode:statuscode,
        };
        if(domains[domain][data.path]){
          if(domaindata.title!=domains[domain][data.path].title||
            // Object.keys(domaindata.insites).length!=Object.keys(domains[domain][data.path].insites).length||
            // Object.keys(domaindata.inoutsites).length!=Object.keys(domains[domain][data.path].inoutsites).length||
            // Object.keys(domaindata.outsites).length!=Object.keys(domains[domain][data.path].outsites).length||
            // Object.keys(domaindata.interfaces).length!=Object.keys(domains[domain][data.path].interfaces).length||
            domaindata.statuscode!=domains[domain][data.path].statuscode){
              domains[domain][data.path]=domaindata;
              domains[domain][data.path].datatype="update";
            }else{
              domains[domain][data.path].datatype="old";
            }
        }else{
          domains[domain][data.path]=domaindata;
          domains[domain][data.path].datatype="new";
        }

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



function start(callback){
  dbsave.getDomain(function(dodata){
    var x={};
    dodata.forEach(function(a){
      domains[a.domain]={
        id:a.id,
        updatenum:a.updatenum
      };
      x[a.id]=domains[a.domain];
    });

    dbsave.getPath(function(pathdata){
      pathdata.forEach(function(b){
        x[b.domainId][b.path]={
          title:b.title,
          insites:JSON.parse(b.insites),
          inoutsites:JSON.parse(b.inoutsites),
          outsites:JSON.parse(b.outsites),
          srouces:JSON.parse(b.srouces),
          interfaces:JSON.parse(b.interfaces),
          statuscode:b.statuscode
        };
      });
      callback();
    });

  });
}



function end(){
  var adddomain=0;
  var addpath=0;
  var updatepath=0;
  var oldnumpath=0;
  var delnumpath=0;

  var err=0;
  var err_outtime=0;
  var err_nothtml=0;
  var err_404=0;
  var err_code=0;

  for(var name in domains){
    if(domains[name].id){
      dbsave.updateDomain(domains[name].id,Object.keys(domains[name]).length-2);
      for(var path in domains[name]){
        if(path=="id"||path=="updatenum") continue;
        switch(domains[name][path].datatype){
          case "old":{
            oldnumpath++;
          }break;
          case "new":{
            dbsave.addPath(domains[name].id,path,domains[name][path]);
            addpath++;
          }break;
          case "update":{
            dbsave.updatePath(domains[name].id,path,domains[name][path]);
            updatepath++;
          }break;
          default :{
            delnumpath++;
          }
        }
        switch(domains[name][path].statuscode){
          case 10001:{
            err++;
            err_outtime++;
          }break;
          case 10002:{
            err++;
            err_nothtml++;
          }break;
          case 10003:{
            err++;
            err_code++;
          }break;
          case 404:{
            err++;
            err_404++;
          }break;
          default :{

          }
        }
      }
    }
    else
    {
      adddomain++;
      addpath+=Object.keys(domains[name]).length;
      dbsave.addDomain(name,Object.keys(domains[name]).length,function(a){
        domains[a.domain].id=a.id;
        domains[a.domain].updatenum=a.updatenum;
        for(var path in domains[a.domain]){
          if(path=="id"||path=="updatenum")return;
          dbsave.addPath(a.id,path,domains[a.domain][path]);
        }
      });
    }
  }
  console.log("域名总数："+Object.keys(domains).length+" 路径总数："+Object.keys(cachedurl).length);
  console.log("新增域名："+adddomain+" 新增路径："+addpath+" 更新路径："+updatepath+" 无变化路径："+oldnumpath+" 丢失路径："+delnumpath);
  console.log("错误总数："+err+" 超时总数："+err_outtime+" 404总数："+err_404+" 编码有错总数："+err_code+" 非HTML总数："+err_nothtml);
}
