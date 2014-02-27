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
  
VVVV.Host =
{
  Input:
  {
    on: function(eventName, cb)
    {
      $(window).on(eventName, cb);
    }
  },
  
  FileSystem:
  {
    read: function(name, cb)
    {
      $.get(name, cb, 'text');
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
  
  onInitialisationComplete: function(VVVV)
  {
    $("script[language='VVVV']").each(function(i) {
      var p = new VVVV.Core.Patch($(this).attr('src'), function() {
        var m = new VVVV.Core.MainLoop(this);
        VVVV.MainLoops.push(m);
      });
      VVVV.Patches[i] = p;
    });
  }
};

return VVVV;

}});
