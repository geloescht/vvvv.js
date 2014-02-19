// VVVV.js -- Visual Web Client Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.
// Host module for node.js (c) 2014 Lukas Winter distributed under the MIT license.

//AMD compatibility

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) { return function(VVVV) {

//actual code begins here

var fs = require('fs');
  
VVVV.Host =
{
  Input:
  {
    on: function(eventName, cb)
    {
      console.log("on"+ eventName);
    }
  },
  
  FileSystem:
  {
    read: function(name, cb)
    {
      return fs.readFile(name, sb);
    }
  },
  
  Markup:
  {
    parseXML: function(code)
    {
      var cheerio = require('cheerio');
      return cheerio.load(code, {xmlMode: true, lowerCaseTags: true}).root();
    }
  }
};

return VVVV;

}});
