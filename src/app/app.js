angular.module('moped', [
  'ngTouch',
  'moped.mopidy',
  'moped.search',
  'moped.library',
  'moped.playlists',
  'moped.radio',
  'moped.settings',
  'moped.home',
  'moped.browse',
  'moped.nowplaying',
  'moped.playercontrols',
  'moped.widgets',
  'moped.filters',
  'templates-app',
  'templates-common'
])

.config(function ($provide) {

  // Decorator for promises so the ui knows when one or more promises are pending.
  $provide.decorator('$q', ['$delegate', '$rootScope', function($delegate, $rootScope) {
    var pendingPromises = 0;
    $rootScope.$watch(function() {
      return pendingPromises > 0;
    }, function(working) {
      $rootScope.working = working;
    });
    var $q = $delegate;
    var origDefer = $q.defer;
    $q.defer = function() {
      var defer = origDefer();
      pendingPromises++;
      defer.promise['finally'](function() {
        pendingPromises--;
      });
      return defer;
    };
    return $q;
  }]);
})

.run(function run () {

})

.controller('AppCtrl', function AppController ($scope, $location, $window, mopidyservice) {
  var connectionStates = {
    online: 'Online',
    offline: 'Offline'
  };
  var defaultPageTitle = 'Moped';

  $scope.isSidebarVisibleForMobile = false;
  $scope.isBackVisible = false;
  $scope.connectionState = connectionStates.offline;
  $scope.pageTitle = defaultPageTitle;

  $scope.$on('mopidy:state:online', function() {
    $scope.connectionState = connectionStates.online;
    $scope.$apply();
  });

  $scope.$on('mopidy:state:offline', function() {
    $scope.connectionState = connectionStates.offline;
    $scope.$apply();
  });

  $scope.$on('settings:saved', function() {
    mopidyservice.restart();
  });

  $scope.$on('$locationChangeSuccess', function(ev, newUrl, currentUrl) {
    var path = $location.path();
    $scope.isSidebarVisibleForMobile = false;
    $scope.isBackVisible = $window.navigator.standalone && path !== '/';
  });

  $scope.$on("$routeChangeSuccess", function(ev, currentRoute, previousRoute) {
    $scope.pageTitle = currentRoute.title || defaultPageTitle;
  });

  $scope.toggleSidebar = function() {
    $scope.isSidebarVisibleForMobile = ! $scope.isSidebarVisibleForMobile;
  };

  $scope.goBack = function() {
    $window.history.back();
    return false;
  };

  mopidyservice.start();

  window.addEventListener('load', function() {
    FastClick.attach(document.body);
  }, false);

});
