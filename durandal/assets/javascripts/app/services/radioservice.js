define(['lodash', 'jquery'], function(_, $) {	

  var DIRBLE_API_KEY= '58617094d08a7c1699efe88cbde26467901cbd19';

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
    },
    findStations: function(searchQuery, callback) {
      var searchUrl = 'http://dirble.com/dirapi/search/apikey/' + DIRBLE_API_KEY + '/search/' + searchQuery + '/count/100';

      $.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(searchUrl) + '&callback=?')
        .done(function(data) {
          callback(null, data.contents);
        })
        .fail(function(jqxhr, textStatus, error) {
          callback({ message: textStatus + ', ' + error }, null);
        });
    }
  };

});