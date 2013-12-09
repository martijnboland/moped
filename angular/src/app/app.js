var connectionStates = { 
  online: 'Online',
  offline: 'Offline'
};

angular.module( 'moped', [
  'templates-app',
  'templates-common',
  'moped.search',
  'moped.home'
])
  .config( function myAppConfig ( ) {
  
  })

  .run( function run () {
  
  })
  
  .controller('AppCtrl', function AppController ($scope, $location, $window) {
    $scope.isSidebarVisibleForMobile = false;
    $scope.isBackVisible = false;
    $scope.connectionState = connectionStates.offline;

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
  });