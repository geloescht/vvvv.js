require("../../vvvv.js");

//override the fake document
var fs = require('fs');
$ = $.load(fs.readFileSync('index.html','utf8'));

VVVV.init("../../", 'run', function () {
// load the .v4p file and run the mainloop. this paragraph is basically all you need to run a vvvv patch
  patch = new VVVV.Core.Patch("example01.v4p", function() {
  mainloop = new VVVV.Core.MainLoop(this);
  });
});
