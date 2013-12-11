angular.module(['moped.util'], [])
.factory('util', function() {
  return {
    timeFromMilliSeconds: function(length) {
      if (length === undefined) {
        return '';
      }
      var d = Number(length/1000);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);
      return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
    },
    getTrackArtistsAsString: function(track) {
      return this.getArtistsAsString(track.artists);
    },
    getArtistsAsString: function(artists) {
      return _.map(artists, 'name').join(',');
    },
    getTrackDuration: function(track) {
      return this.timeFromMilliSeconds(track.length);
    },
    isValidStreamUri: function(uri) {
      var regexp = /(mms|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(uri);
    }
  };
});