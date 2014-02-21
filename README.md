Moped
=====

Moped is a responsive web client for the [Mopidy](http://mopidy.com) music server. It is inspired by [Mopidy-Webclient](https://github.com/woutervanwijk/Mopidy-Webclient), but built from scratch based on different technology stacks with [Durandal](http://durandaljs.com/), [Angular](http://angularjs.com) and [Bootstrap 3](http://getbootstrap.com).

![Moped responsive](screenshots/moped-all-720.png?raw=true)

Installation 
------------

Make sure to have Mopidy 0.16 or higher [installed](http://docs.mopidy.com/en/latest/installation/) on your music server. Also make sure that the [HTTP extension](http://docs.mopidy.com/en/latest/ext/http/) is enabled. The configuration should look like:

	[http]
	enabled = true
	hostname = 127.0.0.1
	port = 6680
	static_dir = /opt/webclient
	zeroconf = Mopidy HTTP server on $hostname

Now get the files with git:
	
	git clone https://github.com/martijnboland/moped.git

or [download the files from this repository](https://github.com/martijnboland/moped/archive/master.zip).

There are two different versions of Moped. One built with [Angular](http://angularjs.org) and one built with [Durandal](http://durandaljs.org). Both versions are in their own directory. To install your version of choice, copy all files from the [/dist/angular](/dist/angular) directory or [/dist/durandal](dist/durandal) directory to your web client directory (/opt/webclient) and you're good to go. Browse to your server (e.g. http://servername:6680) to see Moped in action.

*2014-02-21: From now on, all new development is only done in the Angular version, so this will be the preferred version.*

### Known issues

- The Mopidy HTTP frontend uses Web Sockets. Most modern browsers support this but not the default Android browser (4.3 and older). To use Moped on Android you have to use a different browser like Firefox or Chrome;
- Searching radio streams is highly experimental.

### Security warning

(from the Mopidy web site)

As a simple security measure, the web server is by default only available from localhost. To make it available from other computers, change the http/hostname config value. Before you do so, note that the HTTP extension does not feature any form of user authentication or authorization. Anyone able to access the web server can use the full core API of Mopidy. Thus, you probably only want to make the web server available from your local network or place it behind a web proxy which takes care or user authentication. You have been warned.

Development
-----------

Moped is originally developed as a learning excercise and to compare [Durandal](http://durandaljs.com) and [Angular](http://angularjs.org). Therefore, there are two versions that are about the same functionality-wise.

### Angular

1. Install [Node.js](http://nodejs.org/)
2. Install grunt-cli, karma and bower:

		npm install -g grunt-cli karma bower

3. Clone the repository to your local machine:

		git clone https://github.com/martijnboland/moped.git

4. Navigate to the [/angular](angular) directory.
5. Install dependencies:

		npm install
		bower install
		
6. Start the build and watch process:

		grunt watch
		
This will start a local web server on port 3001.

### Durandal

1. Install [Node.js](http://nodejs.org/)
2. Install Mimosa

		npm install -g mimosa

3. Clone the repository to your local machine:

		git clone https://github.com/martijnboland/moped.git

4. Navigate to the [/durandal](durandal) directory and enter:

		make start
	
This will start a local web server on port 3000 with a watcher that monitors any changes. 
