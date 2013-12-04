Moped
=====

Moped is a responsive web client for the [Mopidy](http://mopidy.com) music server. It is inspired by [Mopidy-Webclient](https://github.com/woutervanwijk/Mopidy-Webclient), but built from scratch based on a different technology stack with [Durandal](http://durandaljs.com/) and [Bootstrap 3](http://getbootstrap.com).

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

Copy all files from the [/dist](dist) directory to your web client directory (/opt/webclient) and you're good to go. Browse to your server (e.g. http://servername:6680) to see Moped in action.

### Known issues

- The Mopidy HTTP frontend uses Web Sockets. Most modern browsers support this but not the default Android browser (4.3 and older). To use Moped on Android you have to use a different browser like Firefox or Chrome;
- Searching radio streams is highly experimental.

### Security warning

(from the Mopidy web site)

As a simple security measure, the web server is by default only available from localhost. To make it available from other computers, change the http/hostname config value. Before you do so, note that the HTTP extension does not feature any form of user authentication or authorization. Anyone able to access the web server can use the full core API of Mopidy. Thus, you probably only want to make the web server available from your local network or place it behind a web proxy which takes care or user authentication. You have been warned.

Development
-----------
Clone the repository to your local machine:

	git clone https://github.com/martijnboland/moped.git

Navigate to the [/durandal](durandal) directory and enter:

	make start
	
This will start a local web server on port 3000 with a watcher that monitors any changes. 