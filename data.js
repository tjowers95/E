const net  = require('net');
const sql  = require("mysql");
const port = 1212;
const host = '127.0.0.1';
const db   = sql.createConnection(
{
  host: "localhost",
  user: "root",
  password: "Tcj06478218"
});

const server = net.createServer((sock)=>
{
  console.log('LISTENING . . .');
  
  sock.on('data',(data)=>
  {
    console.log('DATA: ' + data.toString());
    var p  = data.toString().split("&");
    console.log(p);
    var kv = [];
    for (i=0;i<p.length;i++)
    {
      kv[i] = p[i].split('=');
      console.log(kv[i]);
    }
    console.log(kv);
    db.connect((e)=>
    { 
      console.log("CONNECTED TO MYSQL SERVER");
      db.query('use ps');
      var q = `insert into users (${kv[0][0]},${kv[1][0]}) values ('${kv[0][1]}','${kv[1][1]}');`;
      console.log("DBQUERY: " + q);
      db.query(q,(e,r)=>
        {
          if (e) throw e;
          console.log(r);
        });
    });
 });
  
  sock.on('close',(data)=>
  {
    console.log('CLOSED: ' + sock)
    db.end();
  });
});

server.listen(port,host);
var iii = 0;
server.on('error',(e)=>
{
    console.log('SOCKET IN USE, RETRYING . . .');
    server.close();
    while(!(server.connection))
    {
      server.listen(port+iii,host);
      iii++;
    }
    console.log(`CONNECTED ON /tmp/s${iii}`);
});
console.log('DataJS Server Listening On ' + host + ':' + port);
