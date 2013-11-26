define(['services/mopidyservice', 'services/artservice', 'durandal/app', 'lodash', 'util'], function (mopidyservice, artservice, app, _, util) {
  
  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () {
    this.album = {};
    this.artist = '';
    this.tracks = [];
    this.albumImageUrl = defaultAlbumImageUrl;
    self = this;
  };

  ctor.prototype.activate = function(uri) {
    mopidyservice.getAlbum(uri).then(function(data) {
      // data comes as a list of tracks. Extract album and artist(s) from first track.
      if (data.length > 0) {
        var firstTrack = data[0];
        self.album = firstTrack.album;
        self.artist = util.getTrackArtistsAsString(firstTrack);
        self.tracks = data;

        artservice.getAlbumImage(self.album, 'extralarge', function(albumImageUrl, err) {
          if (albumImageUrl !== undefined && albumImageUrl !== '') {
            self.albumImageUrl = albumImageUrl;
          }
          else
          {
            self.albumImageUrl = defaultAlbumImageUrl;
          }
        });
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
