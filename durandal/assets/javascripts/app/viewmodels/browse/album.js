define(['services/mopidyservice', 'services/artservice', 'durandal/app', 'lodash', 'util'], function (mopidyservice, artservice, app, _, util) {
  
  var defaultAlbumImageUrl = 'images/noalbum.png';

  var ctor = function () {
    this.album = {};
    this.artist = '';
    this.discs = [];
    this.albumImageUrl = defaultAlbumImageUrl;
    self = this;
  };

  ctor.prototype.activate = function(uri) {
    mopidyservice.getAlbum(uri).then(function(data) {

      // data comes as a list of tracks.
      if (data.length > 0) {
 
        // Extract album and artist(s) from first track.
        var firstTrack = data[0];
        self.album = firstTrack.album;
        self.artist = util.getTrackArtistsAsString(firstTrack);

        artservice.getAlbumImage(self.album, 'extralarge', function(albumImageUrl, err) {
          if (albumImageUrl !== undefined && albumImageUrl !== '') {
            self.albumImageUrl = albumImageUrl;
          }
          else
          {
            self.albumImageUrl = defaultAlbumImageUrl;
          }
        });

       // Group album into discs
        var discNo = 1;
        var currentTrackNo = 1;
        var discs = _.groupBy(data, function(track) {
          if (track.track_no < currentTrackNo) {
            discNo++;
          }
          currentTrackNo = track.track_no;
          return discNo;
        });
        _.forEach(discs, function(disc, index) {
          self.discs.push({ disc: index, items: disc });
        });
      }
    }, console.error);
  };

  ctor.prototype.compositionComplete = function() {
    setTimeout(function() {
      mopidyservice.getCurrentTrack().then(function(track) {
        app.trigger('moped:currenttrackrequested', track);
      });
    }, 500);
  };

  return ctor;
});
