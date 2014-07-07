angular.module('moped.widgets')
.directive('mopedSlider', function(util) {
  return {
    restrict: 'A',
    scope: {
      sliderValue: '='
    },
    link: function(scope, element, attrs) {
      var $slider = $(element).slider(scope.$eval(attrs.mopedSlider));

      $slider.on('slideStart', function(ev) {
        scope.$emit('moped:slidervaluechanging', ev.value);
      });

      $slider.on('slideStop', function(ev) {
        scope.$emit('moped:slidervaluechanged', ev.value);
      });

      scope.$watch('sliderValue', function(val) {
        $slider.slider('setValue', val);
      });
    }
  };
});