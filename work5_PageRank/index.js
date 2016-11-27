var fs=require('fs');
var net={};
var num=0;

fs.readFile(__dirname+'/DATA/web-Stanford.txt',"utf-8", function(err, data) {
    if (err) {
        throw err;
    }
    var arr=data.split('\r\n');
    console.log(arr.length);
    init(arr);
});


function init(arr){
  console.log('构建数据中...');
  console.time('构建用时');
  arr.forEach(function(edge){
    if(edge[0] === '#'||edge[0] === ''){
      console.log(edge);
    }
    var nodes=edge.split("\t");
    var from=nodes[0];
    var to=nodes[1];

    if(!net[from]){
      net[from]={
        from:{},
        to:{},
        outdegree:0
      };
      num++;
    }
    //
    if(!net[to]){
      net[to]={
        from:{},
        to:{},
        outdegree:0
      };
      num++;
    }

    net[from].to[to]=true;
    net[from].outdegree++;
    net[to].from[from]=true;
  });

  console.log('构建完成...');
  console.timeEnd('构建用时');

  simpleRP(net);
}


function simpleRP(net){

  console.log('PageRank(简化)计算中...');
  console.time('PageRank(简化)计算用时');

  var arr=[];
  var a=1/2;
  var b=1-a;

  var initPR=1/num;
  var p_a=a*initPR;

  for(var name in net){
    net[name].PR=initPR;
    arr.push(net[name]);
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
    arr.forEach(function(node){
      node.outp=node.PR/node.outdegree;
    });

    arr.forEach(function(node){
      var oldPR=node.PR;

      var pagein=0;
      for(var name in node.from){
        pagein+=net[name].outp;
      }
      node.PR=p_a+b*pagein;

      var x=Math.abs(1-(oldPR/node.PR));
      if(x>0.0001)end=false;
      if(x>maxchange)maxchange=x;
    });
  }

  console.log('PageRank(简化)完成');
  console.timeEnd('PageRank(简化)计算用时');

  var max=0;
  arr.forEach(function(node){
    if(max<node.PR)max=node.PR;
  });
  console.log(max);
}
