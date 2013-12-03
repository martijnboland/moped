define(['plugins/router', 'durandal/app', 'touchscroll/touchscroll', 'services/mopidyservice', 'jquery'], 
  function (router, app, touchscroll, mopidyservice, $) {

  var connectionStates = { 
    online: 'Online',
    offline: 'Offline'
  };

  return {
    router: router,
    isSidebarVisible: false,
    connectionState: connectionStates.offline,
    activate: function() {
      var self = this;
      app.on('mopidy:state:online').then(function() {
        self.connectionState = connectionStates.online;
      });
      app.on('mopidy:state:offline', function() {
        self.connectionState = connectionStates.offline;
      });
      mopidyservice.start();
      app.on('settings:saved', function() {
        mopidyservice.restart();
      });

      router.map([
        { route: '', title: 'Start', moduleId: 'viewmodels/home', nav: true },
        { route: 'radio(/:stationName)', moduleId: 'viewmodels/radio/radio', nav: true },
        { route: 'settings', moduleId: 'viewmodels/settings', nav: true },
        { route: 'playlist/:uri', moduleId: 'viewmodels/playlists/list' },
        { route: 'album/:uri', moduleId: 'viewmodels/browse/album' },
        { route: 'artist/:uri/:name', moduleId: 'viewmodels/browse/artist' },
        { route: 'search/:query', moduleId: 'viewmodels/search/results' }
      ]).buildNavigationModel();

      router.on('router:route:activating').then(function(instance, instruction, router) {
        self.isSidebarVisible = false;
      });
      
      return router.activate();
    },
    attached: function(view) {
      touchscroll.fixScroll('menu');
      touchscroll.fixScroll('maincontent');
    },
    toggleSidebar: function() {
      this.isSidebarVisible = ! this.isSidebarVisible;
    }
  };
});