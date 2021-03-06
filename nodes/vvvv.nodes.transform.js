// VVVV.js -- Visual Web Client Programming
// (c) 2011 Matthias Zauner
// VVVV.js is freely distributable under the MIT license.
// Additional authors of sub components are mentioned at the specific code locations.

//AMD compatibility

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) { return function(VVVV) {

//actual code begins here

var glm = require('gl-matrix');

VVVV.PinTypes.Transform = {
  typeName: "Transform",
  reset_on_disconnect: true,
  defaultValue: function() {
    return glm.mat4.create();
  }
}

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Rotate (Transform)
 Author(s): Matthias Zauner
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.Rotate = function(id, graph) {
  this.constructor(id, "Rotate (Transform)", graph);
  
  this.meta = {
    authors: ['Matthias Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: []
  };
  
  var ident = glm.mat4.create();
  
  this.trIn = this.addInputPin("Transform In", [], VVVV.PinTypes.Transform);
  this.xIn = this.addInputPin("X", [0.0], VVVV.PinTypes.Value);
  this.yIn = this.addInputPin("Y", [0.0], VVVV.PinTypes.Value);
  this.zIn = this.addInputPin("Z", [0.0], VVVV.PinTypes.Value);
  
  this.trOut = this.addOutputPin("Transform Out", [], VVVV.PinTypes.Transform);

  this.evaluate = function() 
  { 
		
	  var maxSize = this.trIn.isConnected() ? this.getMaxInputSliceCount() : Math.max(this.xIn.getSliceCount(),this.yIn.getSliceCount(),this.zIn.getSliceCount());
    
    for (var i=0; i<maxSize; i++) {
    
      var transformin = this.inputPins["Transform In"].getValue(i);
      var x = parseFloat(this.inputPins["X"].getValue(i));
      var y = parseFloat(this.inputPins["Y"].getValue(i));
      var z = parseFloat(this.inputPins["Z"].getValue(i));
      
      var t = glm.mat4.create();
      
      glm.mat4.rotate(t, t, y*Math.PI*2, [0, 1, 0]);
      glm.mat4.rotate(t, t, x*Math.PI*2, [1, 0, 0]);
      glm.mat4.rotate(t, t, z*Math.PI*2, [0, 0, 1]);
      
      if (this.trIn.isConnected())
        glm.mat4.multiply(t, transformin, t);
      
      this.trOut.setValue(i, t);
    }
    this.trOut.setSliceCount(maxSize);
  }

}
VVVV.Nodes.Rotate.prototype = new VVVV.Core.Node();

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Translate (Transform)
 Author(s): Matthias Zauner
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.Translate = function(id, graph) {
  this.constructor(id, "Translate (Transform)", graph);
  
  this.meta = {
    authors: ['Matthias Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: []
  };
  
  var ident = glm.mat4.create();
  
  this.trIn = this.addInputPin("Transform In", [], VVVV.PinTypes.Transform);
  this.xIn = this.addInputPin("X", [0.0], VVVV.PinTypes.Value);
  this.yIn = this.addInputPin("Y", [0.0], VVVV.PinTypes.Value);
  this.zIn = this.addInputPin("Z", [0.0], VVVV.PinTypes.Value);
  
  this.trOut = this.addOutputPin("Transform Out", [], VVVV.PinTypes.Transform);
  
  this.evaluate = function() {
		
	  var maxSize = this.trIn.isConnected() ? this.getMaxInputSliceCount() : Math.max(this.xIn.getSliceCount(),this.yIn.getSliceCount(),this.zIn.getSliceCount());
	  
	  for (var i=0; i<maxSize; i++) {
		
		  var x = parseFloat(this.xIn.getValue(i));
			var y = parseFloat(this.yIn.getValue(i));
			var z = parseFloat(this.zIn.getValue(i));
			
			var t = glm.mat4.create();
			
			glm.mat4.translate(t, t, [x, y, z]);
			
			if (this.trIn.isConnected())
			{
				var transformin = this.trIn.getValue(i);
				glm.mat4.multiply(t, transformin, t);
			}
			
			this.trOut.setValue(i, t);
	  }
	  this.trOut.setSliceCount(maxSize);
  }
 
}
VVVV.Nodes.Translate.prototype = new VVVV.Core.Node();

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Scale (Transform)
 Author(s): Matthias Zauner
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.Scale = function(id, graph) {
  this.constructor(id, "Scale (Transform)", graph);
  
  this.meta = {
    authors: ['Matthias Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: []
  };
  
  var ident = glm.mat4.create();
  
  this.trIn = this.addInputPin("Transform In", [], VVVV.PinTypes.Transform);
  this.xIn = this.addInputPin("X", [1.0], VVVV.PinTypes.Value);
  this.yIn = this.addInputPin("Y", [1.0], VVVV.PinTypes.Value);
  this.zIn = this.addInputPin("Z", [1.0], VVVV.PinTypes.Value);
  
  this.trOut = this.addOutputPin("Transform Out", [], VVVV.PinTypes.Transform);

  this.evaluate = function() {
		
		var maxSize = this.trIn.isConnected() ? this.getMaxInputSliceCount() : Math.max(this.xIn.getSliceCount(),this.yIn.getSliceCount(),this.zIn.getSliceCount());
    
    for (var i=0; i<maxSize; i++) {
      var x = parseFloat(this.inputPins["X"].getValue(i));
      var y = parseFloat(this.inputPins["Y"].getValue(i));
      var z = parseFloat(this.inputPins["Z"].getValue(i));
      
      var t = glm.mat4.create();
      glm.mat4.scale(t, t, [x, y, z]);
	
  		if (this.inputPins["Transform In"].isConnected())
  		{
  			var transformin = this.inputPins["Transform In"].getValue(i);
  			glm.mat4.multiply(t, transformin, t);
  		}
	    
      this.trOut.setValue(i, t);
    }
    this.trOut.setSliceCount(maxSize);
  }

}
VVVV.Nodes.Scale.prototype = new VVVV.Core.Node();

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Perspective (Transform)
 Author(s): Matthias Zauner
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.Perspective = function(id, graph) {
  this.constructor(id, "Perspective (Transform)", graph);
  
  this.meta = {
    authors: ['Matthias Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: ['Not spreadable']
  };
  
  var ident = glm.mat4.create();
  

  this.addInputPin("Transform In", [], VVVV.PinTypes.Transform);
  this.addInputPin("FOV", [0.25], VVVV.PinTypes.Value);
  this.addInputPin("Near Plane", [0.05], VVVV.PinTypes.Value);
  this.addInputPin("Far Plane", [100.0], VVVV.PinTypes.Value);
  
  this.addOutputPin("Transform Out", [], VVVV.PinTypes.Transform);

  this.evaluate = function() {
    
    var fov = parseFloat(this.inputPins["FOV"].getValue(0));
    var near = parseFloat(this.inputPins["Near Plane"].getValue(0));
    var far = parseFloat(this.inputPins["Far Plane"].getValue(0));
    
    var t = glm.mat4.create();
    
    glm.mat4.perspective(t, fov*Math.PI*2, 1, near, far);
  
    if (this.inputPins["Transform In"].isConnected())
    {
     	var transformin = this.inputPins["Transform In"].getValue(0);
     	glm.mat4.multiply(transformin, t, t);
    }

    this.outputPins["Transform Out"].setValue(0, t);
  }

}
VVVV.Nodes.Perspective.prototype = new VVVV.Core.Node();


/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Inverse (Transform)
 Author(s): Matthias Zauner
 Original Node Author(s): VVVV Group
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.InverseTransform = function(id, graph) {
  this.constructor(id, "Inverse (Transform)", graph);
  
  this.meta = {
    authors: ['Matthias Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: []
  };
  
  var trIn = this.addInputPin("Transform In", [], VVVV.PinTypes.Transform);
  var sourceIn = this.addInputPin("Source", [], VVVV.PinTypes.Transform);
  
  var trOut = this.addOutputPin("Transform Out", [], VVVV.PinTypes.Transform);

  this.evaluate = function() {
    var maxSize = this.getMaxInputSliceCount();
    
    for (var i=0; i<maxSize; i++) {
      var s = mat4.create();
      mat4.set(sourceIn.getValue(i), s);
      mat4.multiply(trIn.getValue(i), mat4.inverse(s, s), s);
      trOut.setValue(i, s);
    }
    trOut.setSliceCount(maxSize);
  }

}
VVVV.Nodes.InverseTransform.prototype = new VVVV.Core.Node();

}});
