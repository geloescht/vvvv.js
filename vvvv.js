// VVVV.js -- Visual Webclient Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.

/** @define {string} */
VVVV_ENV = 'development';

// some prerequisites ...
/*$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
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
VVVV = {};
VVVV.Runtime = typeof global !== 'undefined' ? "node" : "browser";
VVVV.Config = {};
VVVV.Config.auto_undo = false;
VVVV.Nodes = {};
VVVV.PinTypes = {};
VVVV.NodeLibrary = {};

VVVV.onNotImplemented = function(nodename) {
  console.log("Warning: "+nodename+" is not implemented.");
};

VVVV.loadCounter = 0;
VVVV.loadScript = function(url, callback) {
  if(VVVV.Runtime == "browser")
  {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.async = false;
    script.src = VVVV.Root + '/' +url;
    if (callback)
      script.addEventListener('load', callback);
    VVVV.loadCounter++;
    head.appendChild(script);
  }
  else
  {
    VVVV.loadCounter++;
    setImmediate( function() {
      var fs = require("fs");
      console.log("Loading " + url);
      eval.call(null, fs.readFileSync(VVVV.Root + url,'utf8'));
      if (callback)
        callback();
    });
  }
};

/**
 * Adds the neccessary JavaScripts to the head, calls the callback once everything is in place.
 * @param {String} path_to_vvvv points to the folder of your vvvv.js. This is relative to your html-file
 * @param {String} mode. Can be either "full", "vvvviewer" or "run". Depends on what you want to do 
 * @param {Function} callback will be called once all the scripts and initialisations have been finished.
 */
VVVV.init = function (path_to_vvvv, mode, callback) {
  VVVV.Root = path_to_vvvv || './';

  if (VVVV_ENV=='development') console.log('loading vvvv.js ...');

  if (VVVV_ENV=='development') {
  
    function loadMonitor(event) {
      if(event)
        event.target.removeEventListener('load', loadMonitor);
      if (--VVVV.loadCounter <= 0) {
        initialisationComplete();
      };
    }
    
    function isLoaded(name, by)
    {
      if(VVVV.Runtime == "browser")
        return !!(document.querySelector('script[src*="' + name + '"]'));
      else
      {
        if(!by)
          by = require.main;
        
        var ret = false;
        by.children.forEach(function(item)
        {
          if(item.filename.indexOf(name) != -1)
            ret = true;
          else
            ret = isLoaded(name, item);
        });
        return ret;
      }
    }
    
    if (!isLoaded('thirdparty'))
      VVVV.loadScript('thirdparty.js', loadMonitor);
    if (!isLoaded('underscore'))
      VVVV.loadScript('lib/underscore/underscore-min.js', loadMonitor);
    if (!isLoaded('d3.js') && (mode=='full' || mode=='vvvviewer'))
      VVVV.loadScript('lib/d3-v1.14/d3.min.js', loadMonitor);
    if (!isLoaded('glMatrix') && (mode=='full' || mode=='run'))
      VVVV.loadScript('lib/glMatrix-0.9.5.min.js', loadMonitor);
  
    if (!isLoaded('vvvv.core.js')) {
      VVVV.loadScript('core/vvvv.core.js', loadMonitor);
      VVVV.loadScript('core/vvvv.core.vvvvconnector.js', loadMonitor);
      if (mode=='run' || mode=='full') {
        VVVV.loadScript('mainloop/vvvv.mainloop.js', loadMonitor);
        VVVV.loadScript('mainloop/vvvv.dominterface.js', loadMonitor);
  
        VVVV.loadScript('nodes/vvvv.nodes.value.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.string.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.boolean.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.color.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.spreads.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.animation.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.network.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.system.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.canvas.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.html5.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.transform.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.vectors.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.webgl.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.complex.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.enumerations.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.2d.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.3d.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.node.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.astronomy.js', loadMonitor);
        VVVV.loadScript('nodes/vvvv.nodes.xml.js', loadMonitor);
      }
      if (mode=='vvvviewer' || mode=='full') {
        VVVV.loadScript('vvvviewer/vvvv.vvvviewer.js', loadMonitor);
      }
    }
  }

  function initialisationComplete() {
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

if(VVVV.Runtime == "node")
{
  WebSocket = require("ws");
  http = require('http');
  fs = require("fs");
  var nodeEnv = require("./node-env");
  $ = nodeEnv.$;
  window = nodeEnv.window;
  document = nodeEnv.document;
  
  exports = VVVV;
}


