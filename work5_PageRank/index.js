var fs=require('fs');
var net={};
var num=0;

fs.readFile(__dirname+'/DATA/web-BerkStan.txt',"utf-8", function(err, data) {
    if (err) {
        throw err;
    }
    var arr=data.split('\r\n');
    console.log(arr.length);
    init(arr);
});


function init(arr){
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
        to:{}
      };
      num++;
    }
    //
    if(!net[to]){
      net[to]={
        from:{},
        to:{}
      };
      num++;
    }

    net[from].to[to]=true;
    net[to].from[from]=true;
  });

  console.log(num);
}
