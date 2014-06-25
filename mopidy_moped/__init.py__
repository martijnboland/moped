from __future__ import unicode_literals

import os

from mopidy import ext

__version__ = '0.3.0'

class MopedExtension(ext.Extension):
	dist_name = 'Mopidy-Moped'
    ext_name = 'moped'
    version = __version__

    def setup(self, registry):
        registry.add('http:static', {
            'name': self.ext_name,
            'path': os.path.join(os.path.dirname(__file__), 'static'),
        })
