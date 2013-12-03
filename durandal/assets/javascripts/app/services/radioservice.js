define(['lodash'], function(_) {	

  function getStations() {
    var stationsFromStorage = window.localStorage['stations'];
    if (stationsFromStorage && stationsFromStorage !== '') {
      return JSON.parse(stationsFromStorage);
    }
    else {
      return [];
    }
  }

  function storeStations(stations) {
    window.localStorage['stations'] = JSON.stringify(stations);
  }

  return {
    getRadioStations: function(callback) {
      var stations = getStations();
      callback(null, stations);
    },
    getRadioStation: function(stationName, callback) {
      var stations = getStations();
      var station = _.find(stations, { name: stationName });
      if (station) {
        callback(null, station);
      }
      else {
        callback({ message: 'Radio station ' + stationName + ' could not be found.' }, null);
      }
    },
    saveRadioStation: function(stationName, stationUri, callback) {
      this.getRadioStation(stationName, function(err, station) {
        var stations = getStations();
        if (station) {
          callback({ message: 'Radio station ' + stationName + ' already exists.'}, null);
        }
        else {
          var newStation = { name: stationName, uri: stationUri };
          stations.push(newStation);
          storeStations(stations);
          callback(null, newStation);
        }
      });
    },
    removeRadioStation: function(stationName, callback) {
      var stations = getStations();
      _.remove(stations, function(station) {
        return station.name === stationName;
      });
      storeStations(stations);
      callback(null, stationName);
    }
  };

});