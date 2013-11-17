define(['bootstraplib/bootstrap-slider', 'durandal/app', 'services/mopidyservice', 'jquery'], function (slider, app, mopidyservice, $) {
  function updateCurrentTrack(track, thisObj) {
    thisObj.currentTrack = track.name;
    thisObj.currentAlbumUri = track.album.uri;
    thisObj.currentArtists = track.artists;
  }

  return {
    currentTrack: '',
    currentAlbumUri: '',
    currentArtists: [],
    attached: function(view) {
      var self = this;

      $(view).find('.time-slider').slider()
        .on('slideStop', function(ev) {
          
        });
      app.on('mopidy:state:online')
        .then(function(data) {
          mopidyservice.getCurrentTrack()
            .then(function(track) {
              updateCurrentTrack(track, self);   
            });
          mopidyservice.getTimePosition()
            .then(function (timePosition) {
              
            });
        });
      app.on('mopidy:event:trackPlaybackStarted')
        .then(function(data) {
          updateCurrentTrack(data.tl_track.track, self);
        });
    }
  };
});