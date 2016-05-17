GNS3 WEB
========

Web GUI for GNS3 2.0 and later.


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
