var request = require('request');




exports.cache=function(URL,callback){
  var agreement=URL.match(/http(s)?:\/\//)[0];//协议头
  var domain=URL.replace(agreement,"").split(/\//)[0]||url;//域名
  var path=URL.split(domain)[1]||"/";//路径
  //console.log("爬取  "+URL+"  中");

  var insites=[];//站内连接
  var inoutsites=[];//站外同域网站（不访问）
  var outsites=[];//外域网站（不访问）
  var srouces=[];//资源列表
  var interfaces=[];//接口列表
  request(URL,{timeout: 3000}, function (error, response, body){


    if(error||response.statusCode==404) {
      console.log(URL+" error!!");
      callback({
        agreement:agreement,
        domain:domain,
        path:path,
        insites:insites,
        inoutsites:inoutsites,
        outsites:outsites,
        srouces:srouces,
        interfaces:interfaces,
        statusCode:404
      });
      return;
    }
    if(response.headers['content-type']&&response.headers['content-type'].match("text/html")==-1){
      console.log("!!!!!!!!!!!!!!!!",URL);
      callback({
        agreement:agreement,
        domain:domain,
        path:path,
        insites:insites,
        inoutsites:inoutsites,
        outsites:outsites,
        srouces:srouces,
        interfaces:interfaces,
        statusCode:404
      });
      return;
    }
    //console.log(URL);
    var hrefs=body.match(/("(http(s)?|\/)[^" ]+"|'(http(s)?|\/)[^' ]+')/g);

    if(hrefs){
      hrefs.forEach(function(a,index){
        a=a.replace(/("|')/g,"");
        if(a[0]=="/"){
          a=agreement+domain+a;
        }

        //检测是否为域外站点
        var outsite_reg=new RegExp(/http(s)?:\/\/(([^\.]+\.)+swust\.([^\.]+\.)+|\d(.\d)+)/g);
        if(!outsite_reg.test(a)){
          outsites.push(a);
          return true;
        }

        //检测是否为资源
        var srouces_reg=new RegExp("((\.(jpg|js|css|gif|swf|png|doc|pdf|JPG|xls|xlsx|docx|doc|ppt|pptx|rar|zip|wmv|mp4))$)","g");
        if(srouces_reg.test(a)){
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
    if(callback)callback({
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
