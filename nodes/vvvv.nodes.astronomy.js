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

/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: CurrentTime (Astronomy)
 Author(s): 'Zauner'
 Original Node Author(s): 'VVVV Group'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.CurrentTimeAstronomy = function(id, graph) {
  this.constructor(id, "CurrentTime (Astronomy)", graph);
  
  this.meta = {
    authors: ['Zauner'],
    original_authors: ['VVVV Group'],
    credits: ['http://javascript.about.com/library/bldst.htm'],
    compatibility_issues: ['Time Zone index differs from classic VVVV', 'Time Zone Name does not work in Firefox']
  };
  
  this.auto_evaluate = true;
  
  function stdTimeZoneOffset(now) {
    var jan = new Date(now.getFullYear(), 0, 1);
    var jul = new Date(now.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  }
  var now = new Date();
  
  // output pins
  var gmtOut = this.addOutputPin('GMT', [], this);
  var timezoneOut = this.addOutputPin('Time Zone', [0], this);
  var timezonenameOut = this.addOutputPin('Time Zone Name', [''], this);
  var daylightsavingtimeOut = this.addOutputPin('Daylight Saving Time', [now.getTimezoneOffset()<stdTimeZoneOffset(now)?1:0], this);
  var currenttimeOut = this.addOutputPin('Current Time', [], this);
  
  var jsVVVVOffset = 25569;

  this.evaluate = function() {
      
      var localTime = new Date();
      var timeZoneOffset = localTime.getTimezoneOffset()*60*60*1000;
      var now_ms = localTime.getTime();
      
      gmtOut.setValue(0, now_ms/1000/60/60/24+jsVVVVOffset);
      timezoneOut.setValue(0, timeZoneOffset/1000/60/60);
      if (localTime.toString().match(/\((.+)\)$/))
        timezonenameOut.setValue(0, localTime.toString().match(/\((.+)\)$/)[1]);
      else
        timezonenameOut.setValue(0, "n/a");
      //daylightsavingtimeOut.setValue(0, 0);
      currenttimeOut.setValue(0, (now_ms-timeZoneOffset)/1000/60/60/24+jsVVVVOffset);
  }

}
VVVV.Nodes.CurrentTimeAstronomy.prototype = new VVVV.Core.Node();


/*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 NODE: Gregorian (Astronomy Split)
 Author(s): 'Zauner'
 Original Node Author(s): 'VVVV Group'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

VVVV.Nodes.GregorianAstronomySplit = function(id, graph) {
  this.constructor(id, "Gregorian (Astronomy Split)", graph);
  
  this.meta = {
    authors: ['Zauner'],
    original_authors: ['VVVV Group'],
    credits: [],
    compatibility_issues: []
  };
  
  this.auto_evaluate = false;
  
  // input pins
  var timeIn = this.addInputPin('Time', [41491.4301], this);

  // output pins
  var millisecondOut = this.addOutputPin('Millisecond', [0], this);
  var secondOut = this.addOutputPin('Second', [0], this);
  var minuteOut = this.addOutputPin('Minute', [0], this);
  var hourOut = this.addOutputPin('Hour', [0], this);
  var dayofweekOut = this.addOutputPin('DayOfWeek', [0], this);
  var dayOut = this.addOutputPin('Day', [1], this);
  var monthOut = this.addOutputPin('Month', [1], this);
  var yearOut = this.addOutputPin('Year', [2000], this);
  
  var jsVVVVOffset = 25569;

  this.evaluate = function() {
    
    var maxSize = this.getMaxInputSliceCount();
    
    for (var i=0; i<maxSize; i++) {
      var timestamp = (timeIn.getValue(i)-jsVVVVOffset)*24*60*60*1000;
      var d = new Date(timestamp);
      
      x = d.getMilliseconds();
      if (x!=millisecondOut.values[i])
        millisecondOut.setValue(i, x);
      x = d.getSeconds();
      if (x!=secondOut.values[i])
        secondOut.setValue(i, x);
      x = d.getMinutes();
      if (x!=minuteOut.values[i])
        minuteOut.setValue(i, x);
      x = d.getHours();
      if (x!=hourOut.values[i])
        hourOut.setValue(i, x);
      x = d.getDay();
      if (x!=dayofweekOut.values[i])
        dayofweekOut.setValue(i, x);
      x = d.getDate();
      if (x!=dayOut.values[i])
        dayOut.setValue(i, x);
      x = d.getMonth()+1;
      if (x!=monthOut.values[i])
        monthOut.setValue(i, x);
      x = d.getYear()+1900;
      if (x!=yearOut.values[i])
        yearOut.setValue(i, x);
    }
    
    millisecondOut.setSliceCount(maxSize);
    secondOut.setSliceCount(maxSize);
    minuteOut.setSliceCount(maxSize);
    hourOut.setSliceCount(maxSize);
    dayofweekOut.setSliceCount(maxSize);
    dayOut.setSliceCount(maxSize);
    monthOut.setSliceCount(maxSize);
    yearOut.setSliceCount(maxSize);
  }

}
VVVV.Nodes.GregorianAstronomySplit.prototype = new VVVV.Core.Node();

}});
