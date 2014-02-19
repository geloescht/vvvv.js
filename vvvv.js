// VVVV.js -- Visual Webclient Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.

/** @define {string} */
var VVVV_ENV = 'development';

//AMD compatibility

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// define libs for browser
else
{
  require = require.config(
  {
    paths:
    {
      'underscore': './lib/underscore/underscore-min',
      'gl-matrix' : './lib/glMatrix-2.0.min',
      'jquery'    : './lib/jquery/jquery-1.8.2.min'
    }
  });
}

define(function(require) {

//actual code begins here

var hostName = (typeof window != 'undefined' && window.window === window) ? 'browser' : 'node';

if(!console) {
  console = {
    log : function(str) {
    }
  };
}

// actual VVVV.js initialization code
var VVVV = {};
VVVV.Config = {};
VVVV.Config.auto_undo = false;
VVVV.Nodes = {};
VVVV.PinTypes = {};
VVVV.NodeLibrary = {};
VVVV.NodeNames = [];
VVVV.Patches = {};
VVVV.Editors = {};

VVVV.onNotImplemented = function(nodename) {
  console.log("Warning: "+nodename+" is not implemented.");
};


/**
 * Adds the neccessary JavaScripts to the head, calls the callback once everything is in place.
 * @param {String} mode. Can be either "full", "vvvviewer" or "run". Depends on what you want to do 
 * @param {Function} callback will be called once all the scripts and initialisations have been finished.
 */
VVVV.init = function (mode, callback) {
  VVVV.Root = require.toUrl('.');

  if (VVVV_ENV=='development') console.log('loading vvvv.js ...');

  if (VVVV_ENV=='development') {  
    //Collect all the packages we need to load
    //Use relative paths within VVVV.js so requireJS's baseUrl parameter can be set to anything
    var packages = ['./host/vvvv.host.' + hostName, './thirdparty', './core/vvvv.core'];
    if (mode=='run' || mode=='full') {
      packages = packages.concat(['./mainloop/vvvv.mainloop', 
                                  './mainloop/vvvv.dominterface', 
                                  './nodes/vvvv.nodes.value', 
                                  './nodes/vvvv.nodes.string', 
                                  './nodes/vvvv.nodes.boolean', 
                                  './nodes/vvvv.nodes.color', 
                                  './nodes/vvvv.nodes.spreads', 
                                  './nodes/vvvv.nodes.animation', 
                                  './nodes/vvvv.nodes.network', 
                                  './nodes/vvvv.nodes.system', 
                                  './nodes/vvvv.nodes.canvas', 
                                  './nodes/vvvv.nodes.html5', 
                                  './nodes/vvvv.nodes.transform', 
                                  './nodes/vvvv.nodes.vectors', 
                                  './nodes/vvvv.nodes.webgl', 
                                  './nodes/vvvv.nodes.complex', 
                                  './nodes/vvvv.nodes.enumerations', 
                                  './nodes/vvvv.nodes.2d', 
                                  './nodes/vvvv.nodes.3d', 
                                  './nodes/vvvv.nodes.node', 
                                  './nodes/vvvv.nodes.astronomy', 
                                  './nodes/vvvv.nodes.xml' ]);
    }
    if (mode=='vvvviewer' || mode=='full') {
      require('./lib/d3-v3/d3.v3.min');
    }
    
    require(packages, function()
    {
      //Run all packages on the VVVV object
      for(var i = 0; i < arguments.length; i++)
        arguments[i](VVVV);
      
      initialisationComplete();
    });
    
  }

  function initialisationComplete() {
    var p = new VVVV.Core.Patch('');
    for(var nodeName in VVVV.Nodes)
    {
      var n = VVVV.Nodes[nodeName];
      var x = new n(0, p);
      if (VVVV_ENV=='development') console.log("Registering "+x.nodename);
      VVVV.NodeLibrary[x.nodename.toLowerCase()] = n;
      VVVV.NodeNames.push(x.nodename);
    }

    if (VVVV_ENV=='development') console.log('done ...');

    VVVV.MainLoops = [];

    $("script[language='VVVV']").each(function(i) {
      var p = new VVVV.Core.Patch($(this).attr('src'), function() {
        var m = new VVVV.Core.MainLoop(this);
        VVVV.MainLoops.push(m);
      });
      VVVV.Patches[i] = p;
    });

    if (typeof callback === 'function') callback.call();
  }
  
  if (VVVV_ENV=='production')
    initialisationComplete();
};

return VVVV;

});


