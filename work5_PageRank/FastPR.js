exports.index=function(net,a){
  if(!a)a=1/2;
  console.log('PageRank(快速)计算中...');
  console.time('PageRank(快速)计算用时');

  var arr=[];
  for(var name in net){
    arr.push(net[name]);
  }

  var nodenum=arr.length;//节点数目
  var b=1-a;
  var initPR=1/nodenum;
  var p_a=a*initPR;

  arr.forEach(function(node){
    node.PR=initPR;
  });

  var I={};
  for(name in net){
    I[name]=p_a;
  }

  var end,maxchange;
  var prnum=0;
  while(true){
    prnum++;

    end=true;
    maxchange=0;

    PR();
    console.log('完成第 '+prnum+' 次迭代: 最大偏差为 '+maxchange);
    if(end)break;
  }


  function PR(){
    var pn=0;
    arr.forEach(function(node){
      var name,x;
      if(node.outdegree===0){
        pn+=node.PR/nodenum;
      }else{
        x=node.PR/node.outdegree;
        for(name in node.to){
          I[name]+=b*x;
        }
      }
    });

    arr.forEach(function(node){
      var oldPR=node.PR;
      node.PR=I[node.id]+b*pn;
      I[node.id]=p_a;
      var x=Math.abs(1-(node.PR/oldPR));
      if(x>0.0001)end=false;
      if(x>maxchange)maxchange=x;
    });

  }

  console.log('PageRank(快速)完成');
  console.timeEnd('PageRank(快速)计算用时');

  var max=0;
  arr.forEach(function(node){
    if(max<node.PR)max=node.PR;
  });
  console.log('完成 '+prnum+' 次迭代');
  console.log('最大PR值：'+max);
};
