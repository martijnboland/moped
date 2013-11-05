define(['durandal/app'], function (app) {
  return {
    settings: {
      mopidyUrl: ''
    },
    activate: function() {
      if (window.localStorage && localStorage['moped.mopidyUrl'] !== null) {
        this.settings.mopidyUrl = localStorage['moped.mopidyUrl'];
      }
    },
    saveSettings: function() {
      if (window.localStorage) {
        if (this.settings.mopidyUrl !== '' && this.settings.mopidyUrl !== null) {
          localStorage['moped.mopidyUrl'] = this.settings.mopidyUrl;
        }
        else {
          localStorage['moped.mopidyUrl'] = '';  
        }
        app.showMessage('Settings are saved.', 'Settings').then(function(){
          app.trigger('settings:saved');
        });
      }
    },
    verifyConnection: function() {
      var mopidy = new Mopidy({
        webSocketUrl: this.settings.mopidyUrl
      });
      mopidy.on(console.log.bind(console));
      mopidy.on('state:online', function() {
        app.showMessage('Connection successful.', 'Verify connection');
      });
      mopidy.on('websocket:error', function(error) {
        app.showMessage('Unable to connect to Mopidy server. Check if the url is correct.', 'Verify connection');
      });

      setTimeout(function() {
        mopidy.close();
        mopidy.off();
        mopidy = null;
        console.log('Mopidy closed.');
      }, 1000);
    }
  };
});