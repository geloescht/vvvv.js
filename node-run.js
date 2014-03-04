
var VVVV = require('./vvvv');
VVVV.init('run', function()
{
  patch = new VVVV.Core.Patch(process.argv[2], function() {
    mainloop = new VVVV.Core.MainLoop(this);
  });
});
