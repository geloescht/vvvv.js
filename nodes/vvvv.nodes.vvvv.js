// VVVV.js -- Visual Web Client Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.
// Boygrouping (c) 2014 Lukas Winter under the MIT license.

//AMD compatibility

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) { return function(VVVV) {

//actual code begins here

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: BoyGroup (VVVV Server)
 Author(s): Lukas Winter
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.BoyGroup = function(id, graph) {
  this.constructor(id, "BoyGroup (VVVV Server)", graph);
  
  this.meta = {
    authors: ['Lukas Winter'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: ['Basically everything', 'Uses Websockets instead of UDP']
  };
  
  this.auto_evaluate = true;
  
  var clientsIn = this.addInputPin("Clients", [], VVVV.PinTypes.String);
  var logIn = this.addInputPin("Log to TTY", [ 'FIXME' ], VVVV.PinTypes.Enum);
  var broadcastModeIn = this.addInputPin("Broadcast Mode", [ 'FIXME' ], VVVV.PinTypes.Enum);
  var clearIn = this.addInputPin("ClearWarnings", [ 0 ], VVVV.PinTypes.Value);
  var broadcastIPIn = this.addInvisiblePin("Broadcast IP", [], VVVV.PinTypes.String);
  var portIn = this.addInvisiblePin("Network Port", [ 3333 ], VVVV.PinTypes.Value);
  var packetSizeIn = this.addInvisiblePin("Maximum UDP Packet Size", [ 1472 ], VVVV.PinTypes.Value);
  var enabledIn = this.addInputPin("Enabled", [ 0 ], VVVV.PinTypes.Value);
  
  var connectedOut = this.addOutputPin("Connected", [ 0 ], VVVV.PinTypes.Value);
  var bridgeCountOut = this.addOutputPin("Bridge Count", [ 0 ], VVVV.PinTypes.Value);
  var activeBridgesOut = this.addOutputPin("Active Bridges", [ 0 ], VVVV.PinTypes.Value);
  var warningsOut = this.addOutputPin("Warnings", [], VVVV.PinTypes.String);
  var idOut = this.addOutputPin("ID", [ 0 ], VVVV.PinTypes.Value);
  
  var connections = {};
  var connectionsChanged = false;
  
  this.sendPatch = function(ws)
  {
    var patch = this.parentPatch;
    ws.send(patch.toXML());
  }

  this.evaluate = function() {
    var self = this;
    if(VVVV.Config.mode != 'server')
      return;
  
    connectionsChanged = connectionsChanged || clientsIn.pinIsChanged();
    
    if(connectionsChanged)
    {
      var clientNum = clientsIn.getSliceCount();
      connectedOut.setSliceCount(clientNum);
      for(var i = 0; i < clientNum; i++)
      {
        var host = clientsIn.getValue(i);
        if(host == "") continue;
        
        var con = connections[host];
        
        if(!con)
        {
          var port = portIn.getValue(i);
          var url = "ws://" + host + ":" + port;
          
          con = { ws: new VVVV.Host.Network.WebSocket(url) };
          connections[host] = con;
          
          console.log("Establishing connection:", con);
          
          con.ws.onopen = function()
          {
            console.log("Connection successfully opened!", this);
            self.sendPatch(this);
            connectionsChanged = true;
          };
          con.ws.onerror = function(host)
          {
            console.log("Connection failed!", this);
            delete connections[host];
            connectionsChanged = true;
          }.bind(host);
          con.ws.onclose = function(host)
          {
            console.log("Connection closed");
            delete connections[host];
            connectionsChanged = true;
          }.bind(host);
        }
        
        con.sliceNo = i;
        
        if(con.ws.readyState == 1)
          connectedOut.setValue(i, 1);
        else
          connectedOut.setValue(i, 0);
      }
      
      connectionsChanged = false;
    }
  }

}
VVVV.Nodes.BoyGroup.prototype = new VVVV.Core.Node();

}});
