define(['services/mopidyservice', 'services/lastfmservice', 'durandal/app', 'lodash', 'util'], 
  function (mopidyservice, lastfmservice, app, _, util) {
  
  var ctor = function () {
    self = this;
    self.artists = [];
    self.albums = [];
    self.tracks = [];
    this.query = '';
  };

  ctor.prototype.activate = function(query) {
    self.query = query;
    if (self.query.length > 3) {
      mopidyservice.search(self.query).then(function(results) {
        _.forEach(results, function(result) {
          _.chain(result.artists)
            .first(6)
            .forEach(function(artist) {
              self.artists.push(artist);
            });
          _.chain(result.albums)
            .first(6)
            .forEach(function(album) {
              self.albums.push(album);
            });
          _.chain(result.tracks)
            .first(20)
            .forEach(function(track) {
              self.tracks.push(track);
            });
        });
      });
    }
  };

  return ctor;
});