define(['durandal/composition','jquery', 'util'], function(composition, $, util) {
  
  var ctor = function() { };

  ctor.prototype.activate = function(settings) {
      this.track = settings.track;
      this.idx = settings.idx;
  };

  ctor.prototype.getArtistsAsString = function() {
    return util.getTrackArtistsAsString(this.track);
  };

  ctor.prototype.getDuration = function() {
    return util.getTrackDuration(this.track);
  };

  ctor.prototype.getItemIndex = function() {
    return this.idx + 1;
  };

  return ctor;
});
