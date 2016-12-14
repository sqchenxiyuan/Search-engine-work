var fs=require('fs');
var net={};
var num=0;

var simplePR =require('./SimplePR.js').index;
var standardPR =require('./StandardPR.js').index;
var fastPR =require('./FastPR.js').index;

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
      return;
    }
    var nodes=edge.split("\t");
    var from=nodes[0];
    var to=nodes[1];

    if(!net[from]){
      net[from]={
        id:from,
        from:{},
        to:{},
        outdegree:0
      };
      num++;
    }
    //
    if(!net[to]){
      net[to]={
        id:to,
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

  // simplePR(net,1/2);//简单PageRanke
  // standardPR(net,1/2);//标准
  // console.log('当随机选取=1时');
  // fastPR(net,1);//快速
  // console.log('当随机选取=0.9时');
  // fastPR(net,0.9);//快速
  // console.log('当随机选取=0.8时');
  // fastPR(net,0.8);//快速
  // console.log('当随机选取=0.7时');
  // fastPR(net,0.7);//快速
  // console.log('当随机选取=0.6时');
  // fastPR(net,0.6);//快速
  // console.log('当随机选取=0.5时');
  // fastPR(net,0.5);//快速
  // console.log('当随机选取=0.4时');
  // fastPR(net,0.4);//快速
  // console.log('当随机选取=0.3时');
  // fastPR(net,0.3);//快速
  // console.log('当随机选取=0.2时');
  // fastPR(net,0.2);//快速
  // console.log('当随机选取=0.1时');
  fastPR(net,0.15);//快速
  // console.log('当随机选取=0时');
  // fastPR(net,0);//快速
}

var x=
{
  form:"hash",//连接向该节点的节点集合
  to:"hash",//连接到的节点集合
  outdegree:"number",//出度
  PR:"number"//当前轮的PageRank值
};
