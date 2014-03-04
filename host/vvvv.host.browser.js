// VVVV.js -- Visual Web Client Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.
// Host module for browsers (c) 2014 Lukas Winter distributed under the MIT license.

//AMD compatibility

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) { return function(VVVV) {

//actual code begins here

require('jquery');
var $ = jQuery.noConflict();

// do all host specific startup code here

// some prerequisites ...
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
  if ( options.dataType == 'script' || originalOptions.dataType == 'script' ) {
      options.cache = true;
  }
});



var lT = 0,
    a = ['ms', 'moz', 'webkit', 'o'],
    i = a.length,
    requestAnimationFrame = window.requestAnimationFrame,
    cancelAnimationFrame = window.cancelAnimationFrame;


while( --i > -1 && !requestAnimationFrame )
{
  requestAnimationFrame = window[a[i]+'RequestAnimationFrame'];
  cancelAnimationFrame = window[a[i]+'CancelAnimationFrame'] || window[a[i]+'CancelRequestAnimationFrame'];
}

if (!requestAnimationFrame)
{
  requestAnimationFrame = function(callback, element)
  {
    var cT = new Date().getTime(),
    tTC = Math.max(0, 16 - (cT - lT)),
    id = w.setTimeout(function() { callback(cT + tTC); },tTC);
    lT = cT + tTC;
    return id;
  };
}

requestAnimationFrame = requestAnimationFrame.bind(window);
cancelAnimationFrame = cancelAnimationFrame.bind(window);

if ( !cancelAnimationFrame )
{
  cancelAnimationFrame = function(id)
  {
    clearTimeout(id);
  };
}
  
VVVV.Host =
{
  Input:
  {
    on: function(eventName, cb)
    {
      $(window).on(eventName, cb);
      
      if(eventName == "resize")
        $(document).ready(cb);
    }
  },
  
  FileSystem:
  {
    read: function(name, success, error)
    {
      $.get(name, success, 'text').fail(error);
    }
  },
  
  Markup:
  {
    parseXML: function(code)
    {
      return $(code);
    },
    
    get $()
    {
      return $;
    }
  },
  
  JSON: JSON, //FIXME
  
  Graphics:
  {
    getContext: function(type, options, selector)
    {
      var targetElement = $(selector).get(0);
      var canvas;
      if (!targetElement || targetElement.nodeName!='CANVAS') {
        var w = options.width;
        var h = options.height;
        w = w > 0 ? w : 512;
        h = h > 0 ? h : 512;
        canvas = $('<canvas width="'+w+'" height="'+h+'" id="vvvv-js-generated-renderer-'+(new Date().getTime())+'" class="vvvv-js-generated-renderer"></canvas>');
        if (!targetElement) targetElement = 'body';
        $(targetElement).append(canvas);
      }
      else
        canvas = $(targetElement);
      
      
      if (!canvas)
        return;
      
      var canvasCtx;
      try {
        canvasCtxt = canvas.get(0).getContext(type, options);
        canvasCtxt.viewportWidth = parseInt(canvas.get(0).width);
        canvasCtxt.viewportHeight = parseInt(canvas.get(0).height);
      } catch (e) {
        console.log(e);
      }
      
      canvasCtxt.canvas.on = function(eventName, cb)
      {
        $(this).on(eventName, cb);
      };
      
      canvasCtxt.canvas.destroy = function()
      {
        if ($(this).hasClass('vvvv-js-generated-renderer'))
          $(this).remove();
      };
      
      return canvasCtxt;
    },
    
    WebGLImage: Image,
    CanvasImage: Image,
    
    getScreenSize: function()
    {
      return { width: $(window).width(), height: $(window).height };
    },
    
    getWorkingAreaSize: function()
    {
      return { width: $(document).width(), height: $(document).height };
    }
  },
  
  Network:
  {
    WebSocket: (typeof MozWebSocket != 'undefined') ? MozWebSocket : WebSocket
  },
  
  onInitialisationComplete: function(VVVV)
  {
    $("script[language='VVVV']").each(function(i) {
      var p = new VVVV.Core.Patch($(this).attr('src'), function() {
        var m = new VVVV.Core.MainLoop(this);
        VVVV.MainLoops.push(m);
      });
      VVVV.Patches[i] = p;
    });
  },
  
  requestAnimationFrame: function(cb, t)
  {
    requestAnimationFrame(cb, t);
  }
};

return VVVV;

}});
