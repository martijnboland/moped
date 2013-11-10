define(['services/mopidyservice', 'durandal/app', 'lodash'], function (mopidyservice, app, _) {
  function timeFromMilliSeconds(length) {
    var d = Number(length/1000);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
  }

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
    },
    getArtistsAsString: function(artists) {
      return _.map(artists, 'name').join(',');
    },
    timeFromMilliSeconds: timeFromMilliSeconds
  };
});