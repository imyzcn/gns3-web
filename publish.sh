#!/bin/bash
#
# Publish on github pages the last build
#

git checkout gh-pages
git merge master
git push
git checkout master
