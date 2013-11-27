define(['services/mopidyservice', 'services/artservice', 'durandal/app', 'lodash', 'util'], function (mopidyservice, artservice, app, _, util) {

  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () {
    this.artist = {};
    this.albums = [];
    self = this;
  };

  ctor.prototype.activate = function(uri) {
    mopidyservice.getArtist(uri).then(function(data) {

      // data comes as a list of tracks.
      if (data.length > 0) {
        // Get artist object from list of tracks
        self.artist = _.chain(data)
          .map(function(track) {
            return track.artists[0];
          })
          .find({ uri: uri })
          .value();

        // Extract albums from list of tracks
        var albums = _.chain(data)
          .map(function(track) {
            return track.album;
          })
          .uniq(function(album) {
            return album.uri;
          })
          .where(function(album) {
            return album.artists[0].uri === uri;
          })
          .sortBy('date')
          .value();

        var tracksByAlbum = _.groupBy(data, function(track) {
          return track.album.uri;
        });

        _.forEach(albums, function(album) {
          self.albums.push( { album: album, tracks: tracksByAlbum[album.uri] } );
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