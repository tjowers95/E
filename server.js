const htp       = require('http');
const {spawn}   = require('child_process');
const sys       = require('fs');
const net       = require('net');
const prt       = 1111;
const host      = '127.0.0.1';
const port      = 1212;
const client    = new net.Socket();

htp.createServer((re,rs)=>
{

  if (re.method == 'POST')
  {

    let buf = '';

    re.on('data',(c)=>
    {
      buf += c.toString();
    });
    
    re.on('end',()=>
    {
      console.log("REQUEST: POST " + buf);
      const con = client.connect(port,host,()=>
      {
        console.log('CONNECTED TO DATABASE CLIENT-SERVER');
        client.write(buf);
      });
      client.on('data',(data)=>
      {
        console.log('DATA: ' + data);
        client.destroy(); 
      });
      client.on('close',()=>
      {
        console.log('DATABASE CLIENT: Connection Closed'); 
      });
      var iii = 0;
      client.on('error',(e)=>
      {
        
        while (!(client.connection))
        {
          client.connect(port+iii,host,()=>
          {
            client.write(buf);
          });
        }
        console.log(`CONNECTED ON /tmp/s${i}`);
      });
    });

  }





  if (re.method == 'GET')
  { 
    console.log('REQUEST: GET ' + re.url);
    if (re.url == '/')
    {
      sys.readFile('index.html', (e,o)=>
          { 
             rs.writeHead(200, {'Content-Type':'text/html'});
             rs.write(o);
             rs.end();
          });
    }
    if (re.url == '/x?')
    {
       sys.readFile('info.html',(e,o)=>
           {
             rs.writeHead(200,{'Content-Type':'text/html'});
             rs.write(o);
             rs.end();
           });
    }
    if (re.url == '/xxx?')
    {
      sys.readFile('signup.html',(e,o)=>
     {
       rs.writeHead(200,{'Content-Type':'text/html'});
       rs.write(o);
       rs.end();
     });
    }
    if (re.url == '/main?')
    {
      sys.readFile('main.html',(e,o)=>
      {
        rs.writeHead(200,{'Content-Type':'text/html'});
        rs.write(o);
        rs.end();
      });
    }
     if (re.url == '/login?')
     {
       sys.readFile('login.html',(e,o)=>
       {
         rs.writeHead(200,{'Content-Type':'text/html'});
         rs.write(o);
         rs.end();
       });
     }
  } 
}).listen(prt);
