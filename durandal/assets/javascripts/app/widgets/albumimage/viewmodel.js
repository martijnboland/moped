define(['services/lastfmservice'], function(lastfmservice) {

  var defaultAlbumImageUrl = 'images/noalbum.png';
  var defaultAlbumImageSize = 'large';

  var ctor = function () { };

  ctor.prototype.activate = function(settings) {
    var self = this;
    self.album = settings.album || (tracks.length > 0 ? tracks[0].album : null);  
    self.albumImageUrl = defaultAlbumImageUrl;
    self.albumImageSize = settings.imageSize || defaultAlbumImageSize;

    // Album image
    lastfmservice.getAlbumImage(self.album, self.albumImageSize, function(err, albumImageUrl) {
      if (! err && albumImageUrl !== undefined && albumImageUrl !== '') {
        self.albumImageUrl = albumImageUrl;
      }
      else
      {
        self.albumImageUrl = defaultAlbumImageUrl;
      }
    });
  };

  return ctor;
});