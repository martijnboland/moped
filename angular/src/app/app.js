var connectionStates = { 
  online: 'Online',
  offline: 'Offline'
};

angular.module( 'moped', [
  'moped.mopidy',
  'moped.search',
  'moped.settings',
  'moped.home',
  'templates-app',
  'templates-common'
])
  .config( function myAppConfig ( ) {
  
  })

  .run( function run () {
  
  })
  
  .controller('AppCtrl', function AppController ($scope, $location, $window, mopidyservice) {

    $scope.isSidebarVisibleForMobile = false;
    $scope.isBackVisible = false;
    $scope.connectionState = connectionStates.offline;

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

    $scope.toggleSidebar = function() {
      $scope.isSidebarVisibleForMobile = ! $scope.isSidebarVisibleForMobile;
    };

    $scope.goBack = function() {
      $window.history.back();
    };

    mopidyservice.start();

  });