define(['durandal/app', 'services/radioservice', 'lodash'], function (app, radioservice, _) {
  return {
    radiostations: [],
    activate: function() {
      var self = this;
      radioservice.getRadioStations(function(err, stations) {
        if (! err) {
          _.forEach(stations, function(station) {
            self.radiostations.push(station);
          });
        }
      });
      app.on('moped:radiostationadded', function(station) {
        self.radiostations.push(station);
      });
      app.on('moped:radiostationremoved', function(stationName) {
        self.radiostations.remove(function(station) {
          return station.name === stationName;
        });
      });
    }
  };
});