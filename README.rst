************
Mopidy-Moped
************

Moped is response HTML5 + JavaScript client for the `Mopidy <http://www.mopidy.com/>`_ music server.

.. image:: https://github.com/martijnboland/moped/raw/master/screenshots/moped-all-720.png?raw=true

Installation
============

Make sure to have Mopidy 0.19 or higher `installed <http://docs.mopidy.com/en/latest/installation/>`_ on your music server. Also make sure that the `HTTP extension <http://docs.mopidy.com/en/latest/ext/http/>`_ is enabled. 

Install from PyPI on your music server::

    sudo pip install Mopidy-Moped

Alternatively, clone the `GitHub repository <https://github.com/martijnboland/moped.git>`_ and copy all files from the /dist/ directory to the webclient directory on your server.

Usage
=====

Browse to the Moped app on your Mopidy server (e.g. http://localhost:6680/moped).

Known issues
============

- The Mopidy HTTP frontend uses Web Sockets. Most modern browsers support this but not the default Android browser (4.3 and older). To use Moped on Android you have to use a different browser like Firefox or Chrome;
- Searching radio streams is still experimental.

Security warning
================

(from the Mopidy web site)

As a simple security measure, the web server is by default only available from localhost. To make it available from other computers, change the http/hostname config value. Before you do so, note that the HTTP extension does not feature any form of user authentication or authorization. Anyone able to access the web server can use the full core API of Mopidy. Thus, you probably only want to make the web server available from your local network or place it behind a web proxy which takes care or user authentication. You have been warned.

Development
===========

1. Install `Nodejs <http://nodejs.org/>`_
2. Install grunt-cli, karma and bower::

    npm install -g grunt-cli karma bower

3. Clone the repository to your local machine::

    git clone https://github.com/martijnboland/moped.git

4. Install dependencies::

    npm install
    bower install
    
5. Start the build and watch process::

    grunt watch
    
This will start a local web server on port 3001.


To build the compiled distribution, just enter::

    grunt

and to build the Mopidy extension::

    grunt build-mopidy-extension

Project resources
=================

- `Source code <https://github.com/martijnboland/moped/angular>`_
- `Issue tracker <https://github.com/martijnboland/moped/issues>`_
- `Download development snapshot <https://github.com/martijnboland/moped/tarball/master#egg=Mopidy-Moped-dev>`_

Changelog
=========

0.4.0 (2014-10-10)
------------------

Support for Mopidy browsing (David Tischler, https://github.com/tischlda)
Fix for search queries (David Tischler)
Backend provider is displayed in track list (Julien Bordellier)
Allow special characters in search
Interpolation of track position and checking every 10 seconds

0.3.3 (2014-08-03)
------------------

Reduced default amount of logging

0.3.2 (2014-08-03)
------------------

Fixed volume slider

0.3.1 (2014-07-23)
------------------

Fixed PyPI package manifest
Support for playlist folders in PyPI package

0.3.0 (2014-06-24)
------------------

Moped as installable Mopidy extension

0.2.0 (2013-12-18)
------------------

Angular version added.


0.1.0 (2013-12-04)
------------------

Initial Durandal version.
