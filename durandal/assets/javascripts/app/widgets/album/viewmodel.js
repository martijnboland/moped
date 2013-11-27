define(['services/mopidyservice', 'services/artservice', 'util'], function(mopidyservice, artservice, util) {
	
  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () { };

  ctor.prototype.activate = function(settings) {
    var self = this;
    self.discs = [];
    var tracks = settings.tracks;
    self.album = settings.album || (tracks.length > 0 ? tracks[0].album : null);  
    self.artist = util.getArtistsAsString(self.album.artists);
    self.albumImageUrl = defaultAlbumImageUrl;

    // Group album into discs
    if (tracks.length > 0) {
      var discNo = 1;
      var currentTrackNo = 1;
      var groupedTracks = _.groupBy(tracks, function(track) {
        if (track.track_no < currentTrackNo) {
          discNo++;
        }
        currentTrackNo = track.track_no;
        return discNo;
      });
      
      _.forEach(groupedTracks, function(tracksOnDisc, index) {
        self.discs.push({ disc: index, tracksOnDisc: tracksOnDisc });
      });
    }

    // Album image
    artservice.getAlbumImage(this.album, 'extralarge', function(albumImageUrl, err) {
      if (albumImageUrl !== undefined && albumImageUrl !== '') {
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