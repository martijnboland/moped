define(['services/mopidyservice', 'durandal/app', 'lodash'], function (mopidyservice, app, _) {
  
  var ctor = function () {
    this.playlist = {};
    this.tracks = [];
    this.uri = '';
    self = this;
  };

  ctor.prototype.activate = function(uri) {
    mopidyservice.getPlaylist(uri).then(function(data) {
      self.playlist = data;
      self.tracks = self.playlist.tracks;
    }, console.error);
  };

  ctor.prototype.canReuseForRoute = function() {
    return true;
  };

  return ctor;
});
