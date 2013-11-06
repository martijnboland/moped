define(['services/mopidyservice', 'durandal/app', 'knockout'], function (mopidyservice, app, ko) {
  return {
    playlists: [],
    activate: function() {
      var self = this;
      app.on('mopidy:state:online', function() {
        mopidyservice.getPlaylists().then(function(data) {
          self.playlists = data;
        }, console.error);
      });
    },
    showPlaylist: function(uri) {
      alert(uri);
    }
  };
});