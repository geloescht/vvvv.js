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

//do all host specific startup code here

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
    read: function(name, success, error)
    {
      return fs.readFile(name, { encoding: 'utf8' }, function(err, data)
      {
        if(err)
          error(err);
        else
          success(data);
      });
    }
  },
  
  Markup:
  {
    parseXML: function(code)
    {
      var cheerio = require('cheerio');
      return cheerio.load(code, {xmlMode: true, lowerCaseTags: true}).root();
    },
    
    get $()
    {
      return require('cheerio');
    }
  },
  
  Graphics:
  {
    getContext: function(type, options, selector)
    {
      var canvas;
      var w = options.width;
      var h = options.height;
      w = w > 0 ? w : 512;
      h = h > 0 ? h : 512;
      switch(type)
      {
        case 'webgl':
        case 'experimental-webgl':
          var WebGL = require('node-webgl');
          var doc = WebGL.document();
          canvas = doc.createElement('canvas', w, h);
          this.WebGLImage = WebGL.Image;
          VVVV.Host.requestAnimationFrame = doc.requestAnimationFrame.bind(doc);
        break;
        
        case '2d':
          var Canvas = require('canvas');
          canvas = new Canvas(w, h);
          
          canvas.on = function()
          {
            //FIXME
          };
          
          this.CanvasImage = Canvas.Image;
        break;
        default:
        //throw unknown context type
      }
      
      if (!canvas)
        return;
      
      canvas.destroy = function()
      {
        //FIXME
      };
      
      var canvasCtxt;
      try {
        canvasCtxt = canvas.getContext(type, options);
        canvasCtxt.viewportWidth = parseInt(canvas.width);
        canvasCtxt.viewportHeight = parseInt(canvas.height);
      } catch (e) {
        console.log(e);
      }
      return canvasCtxt;
    },
    
    get WebGLImage()
    {
      Object.defineProperty(this, 'WebGLImage', { value:  require('node-webgl').Image, getter: undefined });
      return this.WebGLImage;
    },
    
    get CanvasImage()
    {
      Object.defineProperty(this, 'CanvasImage', { value: require('canvas').Image, getter: undefined });
      return this.CanvasImage;
    },
    
    getScreenSize: function()
    {
      //FIXME
      return { width: 0, height: 0 };
    },
    
    getWorkingAreaSize: function()
    {
      //FIXME
      return { width: 0, height: 0 };
    }
  },
  
  Network:
  {
    get WebSocket()
    {
      Object.defineProperty(this, 'WebSocket', { value: require('ws'), getter: undefined });
      return this.WebSocket;
    }
  },
  
  onInitialisationComplete: function(VVVV)
  {
    //process command line options etc.
  },
  
  requestAnimationFrame: function(cb, t)
  {
    setTimeout(cb, t);
  }
};

return VVVV;

}});
