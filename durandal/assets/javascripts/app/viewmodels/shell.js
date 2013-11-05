define(['plugins/router', 'durandal/app', 'touchscroll/touchscroll', 'services/mopidyservice'], 
  function (router, app, touchscroll, mopidyservice) {
  return {
    router: router,
    isSidebarVisible: true,
    connectionState: 'Offline',
    search: function() {
      //It's really easy to show a message box.
      //You can add custom options too. Also, it returns a promise for the user's response.
      app.showMessage('Search not yet implemented...');
    },
    activate: function() {
      var self = this;
      app.on('mopidy:state:online', function() {
        self.connectionState = 'Online';
      });
      app.on('mopidy:state:offline', function() {
        self.connectionState = 'Offline';
      });
      mopidyservice.start();
      app.on('settings:saved', function() {
        mopidyservice.restart();
      });
      router.map([
        { route: '', title: 'Start', moduleId: 'viewmodels/home', nav: true },
        { route: 'radio', moduleId: 'viewmodels/radio/radio', nav: true },
        { route: 'settings', moduleId: 'viewmodels/settings', nav: true }
      ]).buildNavigationModel();
      
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