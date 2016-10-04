var request = require('request');

request("http://www.swust.edu.cn/", function (error, response, body){
  //console.log(body.match(/<a[^>]*>((.|\n)*?)<\/a>/g));

  // var href=body.match(/http:\/\/([\w\d]+\.)+swust\.edu\.cn(\/(([^"']+\/)+([^"']+)?)?(?=("|')))?/g);
  // console.log(href);
  // console.log(href.length);

  // var href=body.match(/href=("|')\/[^"']+("|')/g);
  // console.log(href);
  // console.log(href.length);
  var out=[];
  var srouces=[];//资源列表
  var interfaces=[];//接口列表
  var outsites=[];//外域网站（不访问）
  var inoutsites=[];//站外同域网站（不访问）
  var hrefs=body.match(/("(http|\/)[^" ]+"|'(http|\/)[^' ]+')/g);
  hrefs.forEach(function(a,index){
    a=a.replace(/("|')/g,"");
    if(a[0]=="/"){
      a="http://www.swust.edu.cn"+a;
    }
    var srouces_reg=new RegExp("((\.(jpg|js|css|gif|swf))$)","g");
    if(srouces_reg.test(a)){
      srouces.push(a);
      return true;
    }
    var interface_reg=new RegExp(/\?|#/g);
    if(interface_reg.test(a)){
      interfaces.push(a);
      return true;
    }
    var outsite_reg=new RegExp(/http:\/\/(([^\.]+\.)+swust\.([^\.]+\.)+|\d(.\d)+)/g);
    if(!outsite_reg.test(a)){
      outsites.push(a);
      return true;
    }
    var inoutsite_reg=new RegExp(/http:\/\/www.swust.edu.cn/g);
    if(!inoutsite_reg.test(a)){
      inoutsites.push(a);
      return true;
    }
    out.push(a);
  });
  console.log("网站=============================================");
  console.log(out);
  console.log(out.length);
  console.log("资源列表=============================================");
  console.log(srouces);
  console.log(srouces.length);
  console.log("接口列表=============================================");
  console.log(interfaces);
  console.log(interfaces.length);
  console.log("域外列表=============================================");
  console.log(outsites);
  console.log(outsites.length);
  console.log("域内站外列表=============================================");
  console.log(inoutsites);
  console.log(inoutsites.length);
});
