define(['durandal/composition','jquery'], function(composition, $) {
  
  function timeFromMilliSeconds(length) {
    var d = Number(length/1000);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  }

  var ctor = function() { };

  ctor.prototype.activate = function(settings) {
      this.track = settings.track;
      this.idx = settings.idx;
  };

  ctor.prototype.getArtistsAsString = function() {
    return _.map(this.track.artists, 'name').join(',');
  };

  ctor.prototype.getDuration = function() {
    return timeFromMilliSeconds(this.track.length);
  };

  ctor.prototype.getItemIndex = function() {
    return this.idx + 1;
  };

  return ctor;
});
