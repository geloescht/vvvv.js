/*
Compatibility module for nodejs. It uses cheerio to build a
dummy DOM, and injects special handling for browser objects
like window or document. Also it loads the appropriate module
for WebGL and canvas.
*/

//first, a little helper

function extend(target)
{
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source)
    {
        Object.getOwnPropertyNames(source).forEach(function(propName)
        {
            Object.defineProperty(target, propName,
            Object.getOwnPropertyDescriptor(source, propName));
        });
    });
    return target;
};

//now on to cheerio

var cheerio = require('cheerio');

var $ = cheerio.load((function () {/*
  
  <!DOCTYPE html>
  <html>
    <head>
      <title>Fake DOM</title>
    </head>
    <body>
      <h1>Nothing here!</h1>
    </body>
  </html>
  
  */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]);

//event handling

var EventEmitter = require('events').EventEmitter;

cheerio.prototype.bind = function(name, cb)
{
  for(var i = 0; i < this.length; i++)
  {
    var item = this[i];
    if(item instanceof EventEmitter)
    {
      item.on(name, cb);
    }
  };
};

['keydown', 'mousemove', 'mousedown', 'mouseup', 'ready', 'resize']
.forEach(function(item)
{
  cheerio.prototype[item] = cheerio.prototype.bind.bind(this, item);
});

cheerio.prototype.detach = function(name) {};

//just the bare minimum of access to the "raw DOM" in order to create canvas contexts

cheerio.prototype.get = function(i)
{
  var node = this[i];
  if(node && node.name == 'canvas')
  {
    node.getContext = function(name)
    {
      console.log(name);
      switch(name)
      {
        case "experimental-webgl":
        case "webgl":
        if(typeof WebGL == 'undefined')
        {
          WebGL = require('node-webgl');
          document.platform = WebGL.document();
          
          //redirect events from the windowing system to the "window" and the "document"
          ['keydown', 'mousemove', 'mousedown', 'mouseup', 'ready', 'resize']
          .forEach(function(item)
          {
            if(typeof window !== 'undefined' && window instanceof EventEmitter)
              document.on(item, function() { window.emit.apply(window, [item].concat(arguments)); });
          });
          Image = WebGL.Image;
        }
        
        var canvas = document.createElement('canvas', this.attribs.width, this.attribs.height);
        var context = canvas.getContext(name);
        
        if(!this.hasOwnProperty('context'))
        {
          this.canvas = canvas; this.context = context;
        }
        return context;
        
        case "2d":
        if(typeof Canvas2D == 'undefined')
        {
          Canvas2D = require('canvas');
          Image = Canvas2D.Image;
        }

        var canvas = new Canvas2D(parseInt(this.attribs.width), parseInt(this.attribs.height));
        var context = canvas.getContext(name);
        
        if(!this.hasOwnProperty('context'))
        {
          this.canvas = canvas; this.context = context;
        }
        
        return context;
      }
    };
    node.width = parseInt(node.attribs.width);
    node.height = parseInt(node.attribs.height);
    node.nodeName = 'CANVAS';
  }
  return node;
};

//AJAX maps nicely to asynchronous IO

$.__proto__.ajax = function(args) //TODO: find out how bad this really is
{
  var fs = require('fs');
  fs.readFile(args.url, function(err, result)
  {
    if(err)
    {
      if(typeof args.error === 'function')
        args.error()
      else
        throw err;
    }
    args.success(result);
  });
};

//some stubs

cheerio.prototype.offset = function()
{
  return { left:0, right:0 };
}

//aaaand export everything

exports.$ = $;
exports.window = new EventEmitter();

extend(exports.window,
{
  name: 'window', type: 'special', //for cheerio
  
  location:
  {
    hash: ''
  },
  
  'setTimeout': function(cb, delay)
  {
    exports.document.requestAnimationFrame(cb, delay);
  }
});

exports.document = new EventEmitter();

extend(exports.document,
{
  name: 'document', type: 'special', //for cheerio
  
  createElement: function()
  {
    if(typeof this.platform !== 'undefined')
      return this.platform.createElement.apply(this.platform, arguments);
  },
  
  requestAnimationFrame: function()
  {
    if(typeof this.platform !== 'undefined' && typeof this.platform.requestAnimationFrame == 'function')
      return this.platform.requestAnimationFrame.apply(this.platform, arguments);
    else
      return setTimeout.apply(this, arguments);
  }
});
