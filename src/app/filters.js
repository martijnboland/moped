angular.module(['moped.filters'], [
  'moped.util'
])
.filter('urlEncode', function (util) {
  return util.urlEncode;
})
.filter('urlDecode', function (util) {
  return util.urlDecode;
})
.filter('doubleUrlEncode', function (util) {
  return util.doubleUrlEncode;
})
.filter('directoryUrlEncode', function (util) {
  return util.directoryUrlEncode;
});
