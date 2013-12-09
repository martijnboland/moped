describe( 'Test app module', function() {
  describe( 'Test AppCtrl controller', function() {
    var ctrl, $location, $scope;

    var windowMock = {
      navigator: {
        standalone: false
      },
      history: {
        back: jasmine.createSpy()
      }
    };

    beforeEach(module(function($provide) {
      $provide.value('$window', windowMock);
    }));

    beforeEach(module('moped'));

    beforeEach(inject(function($controller, _$location_, $rootScope) {
      $location = _$location_;
      $scope = $rootScope.$new();
      ctrl = $controller('AppCtrl', { $location: $location, $scope: $scope, $window: windowMock });
    }));

    it('should pass a dummy test', inject( function() {
      expect(ctrl).toBeTruthy();
    }));

    it('should make the backbutton visible when location is not home and device is standalone', function() {
      $location.path('/');
      expect($scope.isBackVisible).toBe(false);

      windowMock.navigator.standalone = true;
      $scope.$apply();

      expect($scope.isBackVisible).toBe(false);

      $location.path('/test');
      $scope.$apply();

      expect($scope.isBackVisible).toBe(true);      
    });

    it('should call history.back when back is clicked.', function() {
      $scope.goBack();
      expect(windowMock.history.back).toHaveBeenCalled();
    });

    it('should toggle the sidebar visibility when toggle button is clicked', function() {
      var currentVisibility = $scope.isSidebarVisibleForMobile;
      $scope.toggleSidebar();

      expect($scope.isSidebarVisibleForMobile).not.toBe(currentVisibility);
    });

    it('should hide the sidebar on location change', function() {
      $scope.isSidebarVisibleForMobile = true;

      $location.path('/whatever');
      $scope.$apply();

      expect($scope.isSidebarVisibleForMobile).toBe(false);
    });

  });
});
