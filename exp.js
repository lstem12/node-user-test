const exp = require('express');
const dbInfo = require('./db-config');
const oracleDb = require('oracledb');
const bodyParser = require('body-parser');
const port = 80;
var server = exp();
server.use(bodyParser.json());

var getNodeTests = async function(params){
    console.log(params);
    var con = await oracleDb.getConnection(dbInfo);
    var sql = "select * from node_test";
    if(params){
        sql += ' where 1=1';
        if(params.nt_num){
            sql += ' and nt_num=:nt_num';
        }
        if(params.nt_name){
            sql += ' and nt_name=:nt_name';
        }
    }
    console.log(sql);
    var result = await con.execute(sql,params);
    
    var jsonArr = []; 
    for(var i=0;i<result.rows.length;i++){
        var row = result.rows[i];
        var nt = {};
        for(var j=0;j<result.metaData.length;j++){
            var md = result.metaData[j];
            nt[md.name] = row[j];
        }
        jsonArr.push(nt);
    }
    return jsonArr;
};
server.post('/nodetest',function(req,res){
    console.log(req.body);
    res.send('아아아');
})
server.get('/nodetests',async function(req,res,next){
    console.log(req.query);
    var jsonArr = await getNodeTests(req.query);
    res.json(jsonArr);
})
server.get('/views/*',function(req,res){
    console.log(__dirname);
    console.log(req.url);
    res.sendFile(__dirname + req.url + '.html');
})
server.listen(port,function(){
    console.log(`server started ${port} port`);
})