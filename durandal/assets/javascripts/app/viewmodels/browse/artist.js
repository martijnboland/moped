define(['services/mopidyservice', 'services/lastfmservice', 'durandal/app', 'lodash', 'util'], function (mopidyservice, lastfmservice, app, _, util) {

  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () {
    this.artist = {};
    this.artistSummary = '';
    this.albums = [];
    this.singles = [];
    this.appearsOn = [];
    self = this;
  };

  ctor.prototype.activate = function(uri, name) {
    self.artist = { name: name };

    lastfmservice.getArtistInfo(name, function(artistInfo, err) {
      if (! err) {
        self.artistSummary = artistInfo.artist.bio.summary;
      }
    });

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
        var allAlbums = _.chain(data)
          .map(function(track) {
            return track.album;
          })
          .uniq(function(album) {
            return album.uri;
          })
          .sortBy('date')
          .value();

        var tracksByAlbum = _.groupBy(data, function(track) {
          return track.album.uri;
        });

        _.forEachRight(allAlbums, function(album) {
          var tracks = tracksByAlbum[album.uri];
          var albumObject = { album: album, tracks: tracks };
          if (album.artists[0].uri === uri) {
            if (tracks.length > 4) {
              self.albums.push(albumObject);
            }
            else {
              self.singles.push(albumObject);
            }
          }
          else {
            self.appearsOn.push(albumObject);
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
    }, 2000);
  };

  return ctor;
});