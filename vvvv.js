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

define(function(require) {

//actual code begins here

// some prerequisites ...
/*
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
  if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
      options.cache = true;
  }
});*/

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

VVVV.onNotImplemented = function(nodename) {
  console.log("Warning: "+nodename+" is not implemented.");
};


/**
 * Adds the neccessary JavaScripts to the head, calls the callback once everything is in place.
 * @param {String} path_to_vvvv points to the folder of your vvvv.js. This is relative to your html-file
 * @param {String} mode. Can be either "full", "vvvviewer" or "run". Depends on what you want to do 
 * @param {Function} callback will be called once all the scripts and initialisations have been finished.
 */
VVVV.init = function (mode, callback) {
  VVVV.Root = require.toUrl('.');

  if (VVVV_ENV=='development') console.log('loading vvvv.js ...');

  if (VVVV_ENV=='development') {
  
    //Use relative paths within VVVV.js so requireJS's baseUrl parameter can be set to anything
    require('./thirdparty')(VVVV);
    require('./lib/underscore/underscore-min');
    
    //Collect all the packages we need to load
    var packages = ['./core/vvvv.core', './core/vvvv.core.vvvvconnector'];
    if (mode=='run' || mode=='full') {
      require('./lib/glMatrix-0.9.5.min');
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
      require('./lib/d3-v1.14/d3.min');
      packages.push('./vvvviewer/vvvv.vvvviewer'); 
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
    console.log(VVVV);
    var p = new VVVV.Core.Patch('');
    _(VVVV.Nodes).each(function(n) {
      var x = new n(0, p);
      if (VVVV_ENV=='development') console.log("Registering "+x.nodename);
      VVVV.NodeLibrary[x.nodename.toLowerCase()] = n;
    });

    if (VVVV_ENV=='development') console.log('done ...');

    VVVV.Patches = [];
    VVVV.MainLoops = [];

    $("script[language='VVVV']").each(function() {
      var p = new VVVV.Core.Patch($(this).attr('src'), function() {
        var m = new VVVV.Core.MainLoop(this);
        VVVV.MainLoops.push(m);
      });
      VVVV.Patches.push(p);
    });

    if (typeof callback === 'function') callback.call();
  }
  
  if (VVVV_ENV=='production')
    initialisationComplete();
};

return VVVV;

});


