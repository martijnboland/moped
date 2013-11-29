define(['services/mopidyservice', 'util'], function (mopidyservice, util) {

  return {
    currentStreamUri: '',
    play: function() {
      if (util.isValidStreamUri(this.currentStreamUri)) {
        mopidyservice.playStream(this.currentStreamUri);
      }
      else {
        alert('Invalid stream address');
      }
    }
  };
});