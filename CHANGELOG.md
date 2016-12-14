# 0.7.0 (2016-10-21)

- Added stop button in player controls (#45)
- Removed (experimental) radio station search

# 0.6.4 (2015-10-30)

- Fixed navigation issue on iOS 9 when running from start screen (using UIWebView)

# 0.6.3 (2015-09-25)

- Fixed rescaling issue on iOS 9 when using left menu
- Improved experience on iOS by removing hover effect on the playback buttons

# 0.6.2 (2015-09-11)

- Fixed seek issue with Mopidy (#55)
- Browsing now supports all ref types (#54, #56)

# 0.6.1 (2015-06-10)

- Optimized loading of playlists

# 0.6.0 (2015-05-12)

- Added list of current tracks to home screen
- Added Moped version to browser title bar
- New icon and support for favicon in windows phone
- Fixed back button behaviour in standalone mode

# 0.5.0 (2015-04-05)

- Updated mopidy.js to 0.5.0
- Mopidy 1.0.0 compatibility
- Updated player controls active and hover styles (Sebastian) 

# 0.4.4 (2015-03-14)

- Fixed search

# 0.4.3 (2015-03-14)

- Min. characters for search is now 2 instead of 3
- Use protocol relative urls for fonts (André Gaul)
- Updated Angular to 1.3.x
- Updated various other js libs to latest version
- Try to display Mopidy album images before requesting album images from LastFM
- Removed clear_current_track parameter from mopidy.stop() method for Mopidy 0.20 compatibility

# 0.4.2 (2014-11-17)

- Fixed accidentally disabled error logger

# 0.4.1 (2014-11-16)

- Added random toggle switch
- Fixed browsing of playlists (David Tischler)
- Reverted interpolation of track position due to instability
- Search query is passed to mopidy as an array to support new Spotify backend

# 0.4.0 (2014-10-10)

- Support for Mopidy browsing (David Tischler, https://github.com/tischlda)
- Fix for search queries (David Tischler)
- Backend provider is displayed in track list (Julien Bordellier)
- Allow special characters in search
- Interpolation of track position and checking every 10 seconds

# 0.3.3 (2014-08-03)

- Reduced default amount of logging

# 0.3.2 (2014-08-03)

- Fixed volume slider

# 0.3.1 (2014-07-23)

- Fixed PyPI package manifest
- Support for playlist folders in PyPI package

# 0.3.0 (2014-06-24)

- Moped as installable Mopidy extension

# 0.2.0 (2013-12-18)

- Angular version added.

# 0.1.0 (2013-12-04)

- Initial Durandal version.
