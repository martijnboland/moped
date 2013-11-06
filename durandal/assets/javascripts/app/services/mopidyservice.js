define(['durandal/app'], function (app) {
	return {
    mopidy: {},
    start: function() {
      app.trigger('mopidy:starting');

      if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
        this.mopidy = new Mopidy({
          webSocketUrl: localStorage['moped.mopidyUrl']
        });
      }
      else {
        this.mopidy = new Mopidy();
      }
      // Convert Mopidy events to Durandal events
      this.mopidy.on(function(ev, args) {
        app.trigger('mopidy:' + ev, args);
      });
      
      app.trigger('mopidy:started');
    },
    stop: function() {
      app.trigger('mopidy:stopping');
      this.mopidy.close();
      this.mopidy.off();
      this.mopidy = null;
      app.trigger('mopidy:stopped');
    },
    restart: function() {
      this.stop();
      this.start();
    },
    getPlaylists: function() {
      return this.mopidy.playlists.getPlaylists();
    }
  };
});