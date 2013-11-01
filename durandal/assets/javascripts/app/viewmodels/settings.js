define(['durandal/app'], function (app) {
  return {
    settings: {
      mopidyUrl: ''
    },
    activate: function () {
      if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
        this.settings.mopidyUrl = localStorage['moped.mopidyUrl'];
      }
    },
    saveSettings: function() {
      var self = this;
      if (window.localStorage) {
        if (self.settings.mopidyUrl !== '' && self.settings.mopidyUrl !== null) {
          // validate
          var mopidy = new Mopidy({
            webSocketUrl: self.settings.mopidyUrl
          });
          mopidy.on("state:online", function () {
            localStorage['moped.mopidyUrl'] = self.settings.mopidyUrl;
            app.showMessage('Settings are saved.', 'Settings');
          });
        }
        else {
          localStorage['moped.mopidyUrl'] = '';  
        }
      }
    }
  };
});