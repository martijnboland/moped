define(['bootstraplib/bootstrap-slider'], function (slider) {
  return {
    attached: function(view) {

      $(view).find('.slider').slider();
    }
  };
});