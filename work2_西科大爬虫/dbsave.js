var mysql=require('mysql'),
    dbconfig=require('./data/dbconfig.json');

var db=mysql.createConnection(dbconfig);


exports.getPath=function(callback){
  db.query('select * from paths',[],function(err,results){
    if(err)console.log(err);
    callback(results);
  });
};

exports.addPath=function(domainId,path,obj){
  db.query('INSERT INTO paths SET domainId = ?, path = ?,title = ?,date=?, body = ?,insites=?,insitesnum=?,inoutsites=?,inoutsitesnum=?,'+
  'outsites=?,outsitesnum=?,srouces=?,sroucesnum=?,interfaces=?,interfacesnum=?,statuscode=?,createtime=NOW(),updatetime=NOW()',
  [domainId,path,obj.title,obj.date,obj.body,JSON.stringify(obj.insites),Object.keys(obj.insites).length,
  JSON.stringify(obj.insites),Object.keys(obj.insites).length,
  JSON.stringify(obj.inoutsites),Object.keys(obj.inoutsites).length,
  JSON.stringify(obj.srouces),Object.keys(obj.srouces).length,
  JSON.stringify(obj.interfaces),Object.keys(obj.interfaces).length,
  obj.statuscode],
  function(err,results){
    //if(err)console.log(err,domainId,path);
  });
};

exports.updatePath=function(domainId,path,obj){
  db.query('update paths SET title = ?,date=?,body = ?,insites=?,insitesnum=?,inoutsites=?,inoutsitesnum=?,'+
  'outsites=?,outsitesnum=?,srouces=?,sroucesnum=?,interfaces=?,interfacesnum=?,statuscode=?,updatetime=NOW() where domainId=? and path=? ',
  [obj.title,obj.date,obj.body,JSON.stringify(obj.insites),Object.keys(obj.insites).length,
  JSON.stringify(obj.insites),Object.keys(obj.insites).length,
  JSON.stringify(obj.inoutsites),Object.keys(obj.inoutsites).length,
  JSON.stringify(obj.srouces),Object.keys(obj.srouces).length,
  JSON.stringify(obj.interfaces),Object.keys(obj.interfaces).length,
  obj.statuscode,domainId,path],
  function(err,results){
    //if(err)console.log(err,domainId,path);
  });
};


exports.getDomain=function(callback){
  db.query('select * from domains',[],function(err,results){
    if(err)console.log(err);
    //console.log(results);
    callback(results);
  });
};

exports.addDomain=function(domain,pathnum,callback){
  db.query('INSERT INTO domains SET domain = ?,pathnum = ?,updatenum=0,createtime=NOW(),updatetime=NOW()',[domain,pathnum],function(err,results){
    if(err)console.log(err);
    if(callback){
      db.query('select * from domains where domain=?',[domain],function(err,results){
        //if(err)console.log(err);
        //console.log(results);
        callback(results[0]);
      });
    }
  });
};

exports.updateDomain=function(id,pathnum){
  db.query('UPDATE domains SET pathnum = ?,updatenum=updatenum+1, updatetime=NOW() where id= ?',[pathnum,id],function(err,results){
    if(err)console.log(err);
  });
};


exports.closeDB=function(){
  db.destroy();
};
