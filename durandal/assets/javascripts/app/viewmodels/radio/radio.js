define(['services/mopidyservice', 'services/radioservice', 'durandal/app', 'plugins/observable', 'util', 'lodash'], 
  function (mopidyservice, radioservice, app, observable, util, _) {

  return {
    currentStreamName: '',
    currentStreamUri: '',
    currentStation: null,
    searchQuery: '',
    searchResults: [],
    activate: function(stationName) {
      var self = this;
      if (stationName) {
        radioservice.getRadioStation(stationName, function(err, station) {
          if (err) {
            console.log(err.message);
          }
          else if (station) {
            self.currentStreamUri = station.uri;
            self.currentStreamName = station.name;
            self.currentStation = station;
            self.play();
          }
        });
      }
      observable.defineProperty(this, 'canAddToFavourites', function() {
        return window.localStorage && this.currentStreamUri !== '' && this.currentStation === null;
      });
      observable.defineProperty(this, 'canRemoveFromFavourites', function() {
        return window.localStorage && this.currentStreamName !== '' && this.currentStation !== null;
      });
      observable(this, 'currentStreamUri').subscribe(function(value){
        if (self.currentStation !== null && value !== self.currentStation.name) {
          self.currentStreamName = '';
          self.currentStation = null;
        }
      });
    },
    play: function() {
      if (util.isValidStreamUri(this.currentStreamUri)) {
        mopidyservice.playStream(this.currentStreamUri);
      }
      else {
        alert('Invalid stream address');
      }
    },
    addToFavourites: function() {
      var self = this;
      if (self.currentStreamName === '') {
        alert('Please enter a name for the radio station.');
        return;
      }
      radioservice.saveRadioStation(self.currentStreamName, self.currentStreamUri, function(err, station) {
        if (err) {
          alert(err.message);
        }
        else {
          self.currentStation = station;
          self.currentStreamName = station.name;
          self.currentStreamUri = station.uri;
          app.trigger('moped:radiostationadded', station);
        }
      });
    },
    removeFromFavourites: function() {
      var self = this;
      if (confirm('Are you sure?')) {
        radioservice.removeRadioStation(self.currentStreamName, function(err, stationName) {
          if (err) {
            alert(err.message);
          }
          else {
            app.trigger('moped:radiostationremoved', self.currentStreamName);
            self.currentStation = null;
            alert('Station ' + stationName + ' is removed from the favourites.');
          }
        });
      }
    },
    findStream: function() {
      
      document.activeElement.blur();

      var self = this;
      self.searchResults.removeAll();
      radioservice.findStations(this.searchQuery, function(err, stations) {
        if (err) {
          alert(err.message);
        }
        else {
          _.forEach(stations, function(station) {
            if (station.status == 1) {
              self.searchResults.push(station);
            }
          });
        }
      });
    },
    playStream: function(name, streamUri) {
      this.currentStreamUri = streamUri;
      this.currentStreamName = name;
      this.play();
    }
  };

});