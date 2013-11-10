define(['services/mopidyservice', 'durandal/app', 'lodash'], function (mopidyservice, app, _) {
  return {
    playlist: {},
    tracks: [],
    uri: '',
    activate: function(uri) {
      var self = this;
      mopidyservice.getPlaylist(uri).then(function(data) {
        self.playlist = data;
        self.tracks = self.playlist.tracks;
      }, console.error);
    }
  };
});