define(['durandal/app', 'durandal/system', 'lodash'], function (app, system, _) {

  var consoleLog = console.log.bind(console);
  var consoleError = console.error.bind(console);

  // Wraps calls to mopidy api and converts mopidy's promise to Durandal promise.
  // Mopidy method calls are passed as a string because some methods are not 
  // available yet when this method is called, due to the introspection.
  // See also http://blog.mbfisher.com/2013/06/mopidy-websockets-and-introspective-apis.html
  function wrapMopidyFunc(functionNameToWrap, thisObj) {
    return function() {
      var deferred = new system.defer();
      var args = Array.prototype.slice.call(arguments);
      var self = thisObj || this;

      if (self.isConnected) {
        executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
          deferred.resolve(data);
        }, function(err) { 
          deferred.reject(err);
        });
      }
      else
      {
        self.mopidy.on("state:online", function() {
          executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
            deferred.resolve(data);
          }, function(err) { 
            deferred.reject(err);
          });
        });
      }
      return deferred.promise();
    };
  }

  function executeFunctionByName(functionName, context, args) {
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

	return {
    mopidy: {},
    isConnected: false,
    start: function() {
      var self = this;
      app.trigger('mopidy:starting');

      if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
        this.mopidy = new Mopidy({
          webSocketUrl: localStorage['moped.mopidyUrl']
        });
      }
      else {
        this.mopidy = new Mopidy();
      }
      this.mopidy.on(consoleLog);
      // Convert Mopidy events to Durandal events
      this.mopidy.on(function(ev, args) {
        app.trigger('mopidy:' + ev, args);
        if (ev === 'state:online') {
          self.isConnected = true;
        }
        if (ev === 'state:offline') {
          self.isConnected = false;
        }
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
      return wrapMopidyFunc("mopidy.playlists.getPlaylists", this)();
    },
    getPlaylist: function(uri) {
      return wrapMopidyFunc("mopidy.playlists.lookup", this)(uri);
    },
    getCurrentTrack: function() {
      return wrapMopidyFunc("mopidy.playback.getCurrentTrack", this)();
    },
    getTimePosition: function() {
      return wrapMopidyFunc("mopidy.playback.getTimePosition", this)();
    },
    seek: function(timePosition) {
      return wrapMopidyFunc("mopidy.playback.seek", this)(timePosition);
    },
    getVolume: function() {
      return wrapMopidyFunc("mopidy.playback.getVolume", this)();
    },
    setVolume: function(volume) {
      return wrapMopidyFunc("mopidy.playback.setVolume", this)(volume);
    },
    getState: function() {
      return wrapMopidyFunc("mopidy.playback.getState", this)();
    },
    playTrack: function(track, surroundingTracks) {
      var self = this;
      self.mopidy.playback.stop(true)
        .then(self.mopidy.tracklist.clear(), consoleError)
        .then(self.mopidy.tracklist.add(surroundingTracks), consoleError)
        .then(function() {
          var tlTracks = self.mopidy.tracklist.getTlTracks()
            .then(function(tlTracks) {
              var tlTrackToPlay = _.find(tlTracks, function(tlTrack) {
                return tlTrack.track.uri === track.uri;
              });
              self.mopidy.playback.changeTrack(tlTrackToPlay);
              self.mopidy.playback.play();
            }, consoleError);
        } , consoleError);
    },
    play: function() {
      return wrapMopidyFunc("mopidy.playback.play", this)();
    },
    pause: function() {
      return wrapMopidyFunc("mopidy.playback.pause", this)();
    },
    previous: function() {
      return wrapMopidyFunc("mopidy.playback.previous", this)();
    },
    next: function() {
      return wrapMopidyFunc("mopidy.playback.next", this)();
    }
  };
});