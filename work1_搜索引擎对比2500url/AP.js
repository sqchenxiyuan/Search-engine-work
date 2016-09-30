var arr=[
0,
0,
0,
0,
0,
0,
0,
0,
0,
0
];
var i=0;
do{
  //console.log(arr);
  out();
}while(add(9));


function add(index){
  if(index===0&&arr[index]===1){
    return false;
  }
  arr[index]++;
  if(arr[index]==2){
    arr[index]=0;
    return add(index-1);
  }
  return true;
}

function out(){
  var t=0;
  var x=0;
  for(var i=0;i<10;i++){
    if(arr[i]===1){
      t++;
      x+=t/(i+1);
    }
  }
  //console.log(t);
  if(x/t>0.4){
    console.log(parseInt((x/t)*100)/100);
  }
}
