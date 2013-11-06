define(['services/mopidyservice', 'durandal/app'], function (mopidyservice, app) {
  return {
    playlist: {},
    uri: '',
    activate: function(uri) {
      var self = this;
      mopidyservice.getPlaylist(uri).then(function(data) {
        self.playlist = data;
      }, console.error);
    }
  };
});