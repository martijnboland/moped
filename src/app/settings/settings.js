angular.module('moped.settings', [
  'ngRoute'
])
  .config(function config($routeProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: 'settings/settings.tpl.html',
        controller: 'SettingsCtrl',
        title: 'Settings'
      });
  })

  .controller('SettingsCtrl', function SettingsController($scope, $rootScope, $window) {
    $scope.settings = {
      mopidyUrl: ''
    };

    if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
      $scope.settings.mopidyUrl = localStorage['moped.mopidyUrl'];
    }

    $scope.saveSettings = function() {
      if (window.localStorage) {
        if ($scope.settings.mopidyUrl !== '' && $scope.settings.mopidyUrl !== null) {
          localStorage['moped.mopidyUrl'] = $scope.settings.mopidyUrl;
        }
        else {
          localStorage['moped.mopidyUrl'] = '';  
        }

        $window.alert('Settings are saved.');
        $rootScope.$broadcast('settings:saved');
      }
    };

    $scope.verifyConnection = function(e) {
      e.preventDefault();
      
      var mopidy = new Mopidy({ 
        autoConnect: false,
        webSocketUrl: $scope.settings.mopidyUrl
      });
      mopidy.on(console.log.bind(console));
      mopidy.on('state:online', function() {
        $window.alert('Connection successful.');
      });
      mopidy.on('websocket:error', function(error) {
        $window.alert('Unable to connect to Mopidy server. Check if the url is correct.');
      });

      mopidy.connect();

      setTimeout(function() {
        mopidy.close();
        mopidy.off();
        mopidy = null;
        console.log('Mopidy closed.');
      }, 1000);
    };
  });