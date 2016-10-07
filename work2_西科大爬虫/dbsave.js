var mysql=require('mysql'),
    dbconfig=require('./data/dbconfig.json');

var db=mysql.createConnection(dbconfig);




exports.addURL=function(URL,TITEL,STATE){
  db.query('INSERT INTO URLDatas SET URL = ?, titel = ?,state = ?',[URL,TITEL,STATE],function(err,results){
    if(err)console.log(err);
  });
};
