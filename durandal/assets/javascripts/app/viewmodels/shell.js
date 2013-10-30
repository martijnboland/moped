define(['plugins/router', 'durandal/app', 'touchscroll/touchscroll'], function (router, app, touchscroll) {
  return {
    router: router,
    touchscroll: touchscroll,
    isSidebarVisible: true,
    search: function() {
      //It's really easy to show a message box.
      //You can add custom options too. Also, it returns a promise for the user's response.
      app.showMessage('Search not yet implemented...');
    },
    activate: function() {
      router.map([
        { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
        { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true }
      ]).buildNavigationModel();
      
      return router.activate();
    },
    attached: function(view) {
      this.touchscroll.fixScroll('menu');
      this.touchscroll.fixScroll('maincontent');
    },
    toggleSidebar: function() {
      this.isSidebarVisible = ! this.isSidebarVisible;
    }
  };
});