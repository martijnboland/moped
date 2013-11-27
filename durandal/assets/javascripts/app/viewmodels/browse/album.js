define(['services/mopidyservice', 'services/artservice', 'durandal/app', 'lodash', 'util'], function (mopidyservice, artservice, app, _, util) {
  
  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () {
    this.albums = [];
    this.tracks = [];
    self = this;
  };

  ctor.prototype.activate = function(uri) {
    mopidyservice.getAlbum(uri).then(function(data) {

      // data comes as a list of tracks.
      if (data.length > 0) {

        _.forEach(data, function(track) {
          self.tracks.push(track);
        });
 
        // Extract album and artist(s) from first track.
        var firstTrack = data[0];
        self.albums.push(firstTrack.album);
      }
    }, console.error);
  };

  ctor.prototype.compositionComplete = function() {
    setTimeout(function() {
      mopidyservice.getCurrentTrack().then(function(track) {
        app.trigger('moped:currenttrackrequested', track);
      });
    }, 500);
  };

  return ctor;
});
