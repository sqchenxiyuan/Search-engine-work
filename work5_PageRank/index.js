const fs=require('fs');

fs.readFile(__dirname+'/DATA/web-BerkStan.txt',"utf-8", function(err, data) {
    if (err) {
        throw err;
    }
    var arr=data.split('\n');
    console.log(arr.length);
    init(arr);
});


function init(arr){
  arr.forEach(function(edge){
    if(edge[0] === '#'||edge[0] === ''){
      console.log(edge);
    }
  });
}
