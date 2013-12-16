angular.module('moped', [
  'moped.mopidy',
  'moped.search',
  'moped.playlists',
  'moped.settings',
  'moped.home',
  'moped.browse',
  'moped.nowplaying',
  'moped.playercontrols',
  'moped.widgets',
  'templates-app',
  'templates-common'
])

.config(function ($provide) {

  return $provide.decorator('$rootScope', function($delegate) {
    $delegate.safeApply = function(fn) {
      var phase = $delegate.$$phase;
      if (phase === "$apply" || phase === "$digest") {
        if (fn && typeof fn === 'function') {
          fn();
        }
      } else {
        $delegate.$apply(fn);
      }
    };
    return $delegate;
  });
  
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
  };

  mopidyservice.start();

});