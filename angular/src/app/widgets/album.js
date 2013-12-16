angular.module('moped.widgets')
.directive('mopedAlbum', function(util, lastfmservice) {

  var defaultAlbumImageUrl = 'assets/images/noalbum.png';
  var defaultAlbumImageSize = 'large';

  return {
    restrict: 'E',
    scope: {
      album: '=',
      tracks: '=',
      hideArtist: '=',
      linkAlbumTitle: '=',
      imageSize: '@'
    },
    replace: true,
    templateUrl: 'widgets/album.tpl.html',
    link: function(scope, element, attrs) {

      scope.$watch('album', function(newAlbum, oldAlbum) {
        if (newAlbum.name) {
          scope.discs = [];
          scope.album = scope.album || (scope.tracks.length > 0 ? scope.tracks[0].album : null);  
          scope.artist = util.getArtistsAsString(scope.album.artists);
          scope.albumImageUrl = defaultAlbumImageUrl;
          scope.albumImageSize = scope.imageSize || defaultAlbumImageSize;

          // Group album into discs
          if (scope.tracks.length > 0) {
            var discNo = 1;
            var currentTrackNo = 1;
            var groupedTracks = _.groupBy(scope.tracks, function(track) {
              if (track.track_no < currentTrackNo) {
                discNo++;
              }
              currentTrackNo = track.track_no;
              return discNo;
            });
            
            _.forEach(groupedTracks, function(tracksOnDisc, index) {
              scope.discs.push({ disc: index, tracksOnDisc: tracksOnDisc });
            });
          }

          // Album image
          lastfmservice.getAlbumImage(scope.album, scope.albumImageSize, function(err, albumImageUrl) {
            if (! err && albumImageUrl !== undefined && albumImageUrl !== '') {
              scope.albumImageUrl = albumImageUrl;
            }
            else
            {
              scope.albumImageUrl = defaultAlbumImageUrl;
            }
            scope.$apply();
          });

        }
      });
    }
  };
});