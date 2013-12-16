angular.module('moped.widgets')
.directive('mopedArtistImage', function(util, lastfmservice) {
  var defaultArtistImageUrl = 'assets/images/noalbum.png';
  var defaultArtistImageSize = 'large';

  return {
    restrict: 'A',
    transclude: true,
    scope: {
      artistName: '=',
      imageSize: '@'
    },
    template: '<img class="img-responsive" ng-src="{{artistImageUrl}}" /><div ng-transclude></div>',
    link: function(scope, element, attrs) {
      scope.artistImageUrl = defaultArtistImageUrl;
      scope.artistImageSize = scope.imageSize || defaultArtistImageSize;

      // Get artist image
      lastfmservice.getArtistInfo(scope.artistName, function(err, artistInfo) {
        if (! err) {
          var img = _.find(artistInfo.artist.image, { size: scope.artistImageSize });
          if (img !== undefined) {
            scope.artistImageUrl = img['#text'];
            scope.$apply();
          }        
        }
      });
    }
  };

});