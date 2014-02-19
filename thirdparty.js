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

// Define 3rd party libraries, that should be loaded on demand here
// Use
// VVVV.Nodes.YourNode.requirements = ["exampleLib"]
// after your nodes's code to define, that the library is required.

VVVV.ThirdPartyLibs = {
  //"exampleLib": "lib/examplelib.js"
}

// ... and just leave this
VVVV.LoadedLibs = {};

}});
