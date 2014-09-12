angular.module(['moped.util'], [])
.factory('util', function($window) {
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
    },
    safeApply: function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } 
      else {
        if (fn) {
          $scope.$apply(fn);
        } else {
          $scope.$apply();
        }
      }
    },
    urlEncode: function(textToEncode) {
      return $window.encodeURIComponent(textToEncode);
    },
    doubleUrlEncode: function(textToEncode) {
      return $window.encodeURIComponent($window.encodeURIComponent(textToEncode));
    },
    urlDecode: function(textToDecode) {
      return $window.decodeURIComponent(textToDecode);
    }
  };
});