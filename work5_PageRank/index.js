var fs=require('fs');
var net={};
var num=0;

var simplePR =require('./SimplePR.js').index;
var standardPR =require('./StandardPR.js').index;

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

  // simplePR(net,1/2);
  standardPR(net,1/2);
}
