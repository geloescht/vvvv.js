
var VVVV = require('./vvvv');
VVVV.init('client', function()
{
  var WebSocket = require('ws');
  var server = new WebSocket.Server({ port: 3333 });
  
  var mainloop;
  var patch = new VVVV.Core.Patch('', function()
  {
    mainloop = new VVVV.Core.MainLoop(this);
  });;
  
  server.once('connection', function(con)
  {
    console.log('Connection opened');
    con.on('message', function(msg)
    {
      
      if(msg[msg.length-1] != '}')
      {
        var dataBegin = msg.indexOf('}\n\n') + 3;
        var data = msg.slice(dataBegin);
        msg = JSON.parse(msg.slice(0, dataBegin));
        msg.data = data;
      }
      else
      {
        msg = JSON.parse(msg);
      }
      console.log(msg);
      switch(msg.message)
      {
        case 'patch':
          patch.doLoad(msg.data);
          patch.afterUpdate();
        break;
        case 'heidiho':
          console.log("heidiho!");
        break;
      }
    });
    
    server.on('connection', function(con) { con.close(); } );
  });
});
