angular.module(['moped.filters'], [
  'moped.util'
])
.filter('urlEncode', function (util) {
  return util.urlEncode;
})
.filter('doubleUrlEncode', function (util) {
  return util.doubleUrlEncode;
});
