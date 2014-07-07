angular.module('moped.widgets')
.directive('mopedAlbumImage', function(util, lastfmservice) {

  var defaultAlbumImageUrl = 'assets/images/noalbum.png';
  var defaultAlbumImageSize = 'large';

  return {
    restrict: 'A',
    scope: {
      album: '=',
      imageSize: '@'
    },
    templateUrl: 'widgets/albumimage.tpl.html',
    link: function(scope, element, attrs) {
      scope.albumImageUrl = defaultAlbumImageUrl;
      scope.albumImageSize = scope.imageSize || defaultAlbumImageSize;

      // Album image
      lastfmservice.getAlbumImage(scope.album, scope.albumImageSize, function(err, albumImageUrl) {
        if (! err && albumImageUrl !== undefined && albumImageUrl !== '') {
          scope.albumImageUrl = albumImageUrl;
          scope.$digest();
        }
        else
        {
          scope.albumImageUrl = defaultAlbumImageUrl;
        }
      });
    }
  };

});