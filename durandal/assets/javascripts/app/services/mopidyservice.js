define(['durandal/app', 'durandal/system'], function (app, system) {

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
        }, console.error);
      }
      else
      {
        self.mopidy.on("state:online", function() {
          executeFunctionByName(functionNameToWrap, self, args).then(function(data) {
            deferred.resolve(data);
          }, console.error);
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
      this.mopidy.on(console.log.bind(console));
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
    }
  };
});