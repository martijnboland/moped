define(['plugins/router'], function (router) {
  return {
    query: '',
    find: function () {
      if (this.query !== '' && this.query.length > 2) {
        document.activeElement.blur();
        router.navigate('#/search/' + this.query);
      }
      else {
        alert('Enter at least 3 characters');
      }
    }
  };
});