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
    currentTlTracks: [],
    start: function() {
      var self = this;
      app.trigger('moped:mopidystarting');

      if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
        this.mopidy = new Mopidy({
          webSocketUrl: localStorage['moped.mopidyUrl']
        });
      }
      else {
        this.mopidy = new Mopidy();
      }
      //this.mopidy.on(consoleLog);
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
      
      app.trigger('moped:mopidystarted');
    },
    stop: function() {
      app.trigger('moped:mopidystopping');
      this.mopidy.close();
      this.mopidy.off();
      this.mopidy = null;
      app.trigger('moped:mopidystopped');
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
    getAlbum: function(uri) {
      return wrapMopidyFunc("mopidy.library.lookup", this)(uri);
    },
    getArtist: function(uri) {
      return wrapMopidyFunc("mopidy.library.lookup", this)(uri);
    },
    search: function(query) {
      return wrapMopidyFunc("mopidy.library.search", this)({ any : query });
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

      // Check if a playlist change is required. If not cust change the track.
      if (self.currentTlTracks.length > 0) {
        var trackUris = _.pluck(surroundingTracks, 'uri');
        var currentTrackUris = _.map(self.currentTlTracks, function(tlTrack) { 
          return tlTrack.track.uri;
        });
        if (_.difference(trackUris, currentTrackUris).length === 0) {
          // no playlist change required, just play a different track.
          self.mopidy.playback.stop(false)
            .then(function () {
              var tlTrackToPlay = _.find(self.currentTlTracks, function(tlTrack) {
                return tlTrack.track.uri === track.uri;
              });
              self.mopidy.playback.changeTrack(tlTrackToPlay);
              self.mopidy.playback.play();              
            });
        }
      }

      self.mopidy.playback.stop(true)
        .then(self.mopidy.tracklist.clear(), consoleError)
        .then(self.mopidy.tracklist.add(surroundingTracks), consoleError)
        .then(function() {
          self.mopidy.tracklist.getTlTracks()
            .then(function(tlTracks) {
              self.currentTlTracks = tlTracks;
              var tlTrackToPlay = _.find(tlTracks, function(tlTrack) {
                return tlTrack.track.uri === track.uri;
              });
              self.mopidy.playback.changeTrack(tlTrackToPlay);
              self.mopidy.playback.play();
            }, consoleError);
        } , consoleError);
    },
    playStream: function(streamUri) {
      var self = this;

      self.stopPlayback(true)
        .then(self.mopidy.tracklist.clear(), consoleError)
        .then(self.mopidy.tracklist.add(null, 0, streamUri), consoleError)
        .then(self.mopidy.playback.play(), consoleError);
    },
    play: function() {
      return wrapMopidyFunc("mopidy.playback.play", this)();
    },
    pause: function() {
      return wrapMopidyFunc("mopidy.playback.pause", this)();
    },
    stopPlayback: function(clearCurrentTrack) {
      return wrapMopidyFunc("mopidy.playback.stop", this)(clearCurrentTrack);
    },
    previous: function() {
      return wrapMopidyFunc("mopidy.playback.previous", this)();
    },
    next: function() {
      return wrapMopidyFunc("mopidy.playback.next", this)();
    }
  };
});