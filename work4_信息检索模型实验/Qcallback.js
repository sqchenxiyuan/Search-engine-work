var Qcall=function(){
  this.list=[];
  this.runnum=0;
  this.maxrunnum=0;

  this.delay=1;
  this.runfun=null;
  this.endfun=null;
  this.running=false;
};

Qcall.prototype={
  addData:function(data){
    this.list.push(data);
  },
  setdelay:function(delay){
    this.delay=delay;
  },
  setmaxrunnum:function(num){
    this.maxrunnum=num;
  },
  setrunFun:function(fun){
    this.runfun=fun;
  },
  setendFun:function(fun){
    this.endfun=fun;
  },
  start:function(){
    this.running=true;
    this._run();
  },
  end:function(){
    this.running=false;
  },
  _run:function(){
    if(!this.running&&!this.list.length&&!this.runnum){
      this.endfun();
      return;
    }
    if(this.runnum<this.maxrunnum&&this.list.length>0){
      var that=this;
      var data=this.list.shift();
      this.runnum++;
      this.runfun(data,function(){that.runnum--;});
    }
    var that=this;
    setTimeout(function(){
      that._run();
    },this.delay);
  }
};

exports.Qc=Qcall;
