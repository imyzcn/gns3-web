GNS3 WEB
========

Web GUI for GNS3 2.0 and later.

Start the dev version without cloning
""""""""""""""""""""""""""""""""""""""

A demo interface connecting to your GNS3 on localhost:3080
http://gns3.github.io/gns3-web/

Beware it's a dev version, could be break at anytime and will
be slow to load.


Running a local dev server
""""""""""""""""""""""""""

You need a simple HTTP server for serving the current directory.

Slow (but already installed on some OS)
---------------------------------------

In the directory:

.. code:: bash

    python -m SimpleHTTPServer
    

Faster (using node.js)
----------------------

.. code:: bash

    npm install http-server -g
    http-server -o -c-1
