define(['services/mopidyservice','durandal/app', 'module', 'util'], function(mopidyservice, app, module, util) {
  
  var ctor = function() { };

  ctor.prototype.activate = function(settings) {
    this.track = settings.track;
    this.tracklist = settings.tracklist;
    this.idx = settings.idx;
    this.isPlaying = false;

    var self = this;

    app.on('mopidy:event:trackPlaybackStarted')
      .then(function(data) {
        self.isPlaying = data.tl_track.track.uri === self.track.uri;
      });

    app.on('mopidy:event:trackPlaybackPaused')
      .then(function(data) {
        self.isPlaying = data.tl_track.track.uri === self.track.uri;
      });

    app.on('moped:currenttrackrequested')
      .then(function(track) {
        self.isPlaying = track.uri === self.track.uri;
      });
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

  ctor.prototype.playTrack = function() {
    mopidyservice.playTrack(this.track, this.tracklist);
  };

  return ctor;
});
