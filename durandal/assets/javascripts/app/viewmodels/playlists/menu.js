define(['services/mopidyservice', 'durandal/app'], function (mopidyservice, app) {
  return {
    playlists: [],
    activate: function() {
      var self = this;
      app.on('mopidy:state:online', function() {
        mopidyservice.getPlaylists().then(function(data) {
          self.playlists = data;
        }, console.error);
      });
    }
  };
});