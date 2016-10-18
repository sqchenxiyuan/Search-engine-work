var request = require('request');
var iconv=require('iconv-lite');




exports.cache=function(URL,callback){
  var agreement=URL.match(/http(s)?:\/\//)[0];//协议头
  var domain=URL.replace(agreement,"").split(/\//)[0]||url;//域名
  var path=URL.split(domain)[1]||"/";//路径
  //console.log("爬取  "+URL+"  中");

  var title="";//标题
  var date="";
  var insites=[];//站内连接
  var inoutsites=[];//站外同域网站（不访问）
  var outsites=[];//外域网站（不访问）
  var srouces=[];//资源列表
  var interfaces=[];//接口列表
  request(URL,{timeout: 20000}, function (error, response, body){
    var data;
    if(error) {
      data={
        title:"错误！无法获取",
        date:"错误！无法获取",
        body:"错误！无法获取",
        agreement:agreement,
        domain:domain,
        path:path,
        insites:insites,
        inoutsites:inoutsites,
        outsites:outsites,
        srouces:srouces,
        interfaces:interfaces,
        statusCode:404
      };
      if(error.code === 'ETIMEDOUT'){
        data.title="连接超时！";
        data.body="连接超时！";
        data.statusCode=10001;
      }else{
        console.log(URL+" error!!");
      }
      callback(data);
      return;
    }
    if(response.statusCode==404){
       data={
        title:"错误！无法获取",
        date:"错误！无法获取",
        body:"错误！无法获取",
        agreement:agreement,
        domain:domain,
        path:path,
        insites:insites,
        inoutsites:inoutsites,
        outsites:outsites,
        srouces:srouces,
        interfaces:interfaces,
        statusCode:404
      };
      callback(data);
      return;
    }

    if(response.headers){
      var x=new Date(response.headers.date);
      date=x.getFullYear()+'-'+(x.getMonth()+1)+'-'+x.getDate()+" "+x.getHours()+":"+x.getMinutes()+":"+x.getSeconds();
    }

    if(response.headers&&response.headers['content-type']&&response.headers['content-type'].match("text/html")==-1){
      console.log("!!!!!!!!!!!!!!!!",URL);
      callback({
        title:"错误！不是有效网页",
        date:date,
        body:"错误！不是有效网页",
        agreement:agreement,
        domain:domain,
        path:path,
        insites:insites,
        inoutsites:inoutsites,
        outsites:outsites,
        srouces:srouces,
        interfaces:interfaces,
        statuscode:10002
      });
      return;
    }
    //console.log(URL);
    if(response.headers&&response.headers['content-type']){
      var types=response.headers["content-type"].replace(" ","").split(";");
      types.forEach(function(a){
        var reg=new RegExp(/charset=/g);
        if(reg.test(a)){
          a=a.replace("charset=","").toLowerCase();
          if(a!="utf-8")
          {
            if(iconv.encodingExists(a)){
              body = iconv.encode(body,a);
              body = iconv.decode(body,'utf-8');
            }else{
              callback({
                title:"网页编码有误",
                date:date,
                body:"网页编码有误",
                agreement:agreement,
                domain:domain,
                path:path,
                insites:insites,
                inoutsites:inoutsites,
                outsites:outsites,
                srouces:srouces,
                interfaces:interfaces,
                statuscode:10003
              });
              return;
            }

          }
        }
      });
    }

    var hrefs=body.match(/("(http(s)?|\/)[^" ]+"|'(http(s)?|\/)[^' ]+')/g);
    try{
      title=body.match(/<title>[\s\S]*?<\/title>/)[0].replace(/(<title>|<\/title>)/g,"");
    }catch(e){
      console.log(URL);
      title=URL;
    }
    if(hrefs){
      hrefs.forEach(function(a,index){
        a=a.replace(/("|'|(\/$))/g,"");
        if(a[0]=="/"){
          a=agreement+domain+a;
        }

        //检测是否为域外站点
        var outsite_reg=new RegExp(/http(s)?:\/\/(([^\.]+\.)+swust\.([^\.]+\.)+|\d(.\d)+(\/)?$)/g);
        if(!outsite_reg.test(a)){
          outsites.push(a);
          return true;
        }

        //检测是否为资源
        var srouces_reg=new RegExp("((\.(jpg|js|css|gif|swf|png|doc|pdf|xls|xlsx|docx|doc|ppt|pptx|rar|zip|wmv|wma|mp4|exe))$)","g");
        var b=a.toLowerCase();
        if(srouces_reg.test(b)){
          srouces.push(a);
          return true;
        }

        //检测是否为接口
        var interface_reg=new RegExp(/\?|#/g);
        if(interface_reg.test(a)){
          interfaces.push(a);
          return true;
        }


        //检测是否为域内站外路径
        var inoutsite_reg=new RegExp(domain,"g");
        if(!inoutsite_reg.test(a)){
          inoutsites.push(a);
          return true;
        }


        //剩下的为站内网站
        insites.push(a);
      });
    }
    // console.log("站内=============================================");
    // console.log(insites);
    // console.log(insites.length);
    // console.log("资源列表=============================================");
    // console.log(srouces);
    // console.log(srouces.length);
    // console.log("接口列表=============================================");
    // console.log(interfaces);
    // console.log(interfaces.length);
    // console.log("域外列表=============================================");
    // console.log(outsites);
    // console.log(outsites.length);
    // console.log("域内站外列表=============================================");
    // console.log(inoutsites);
    // console.log(inoutsites.length);
    //console.log("爬取  "+URL+"  完毕");
    var bodystr;
    if(body.match(/<body>/)){
      bodystr=body.split(/<body[^>]*>/)[1].substr(0,1000);
    }else{
      bodystr=body.substr(0,1000);
    }


    if(callback)callback({
      title:title,
      date:date,
      body:bodystr,
      agreement:agreement,
      domain:domain,
      path:path,
      insites:insites,
      inoutsites:inoutsites,
      outsites:outsites,
      srouces:srouces,
      interfaces:interfaces,
      statusCode:response.statusCode
    });
  });
};
