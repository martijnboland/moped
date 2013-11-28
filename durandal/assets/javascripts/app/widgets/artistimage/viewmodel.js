define(['services/lastfmservice'], function(lastfmservice) {

  var defaultArtistImageUrl = 'images/noalbum.png';
  var defaultArtistImageSize = 'large';

  var ctor = function () { };

  ctor.prototype.activate = function(settings) {
    var self = this;
    self.artistName = settings.artistName;
    self.artistImageUrl = defaultArtistImageUrl;
    self.artistImageSize = settings.imageSize || defaultArtistImageSize;

    // Get artist image
    lastfmservice.getArtistInfo(self.artistName, function(artistInfo, err) {
      if (! err) {
        var img = _.find(artistInfo.artist.image, { size: self.artistImageSize });
        if (img !== undefined) {
          self.artistImageUrl = img['#text'];
        }        
      }
    });
  };

  return ctor;
});