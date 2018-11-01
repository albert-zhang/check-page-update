#!/bin/bash

export PATH=./node_modules/.bin/:$PATH

rm -Rf dist && \
rm -Rf dist1 && \
rm -Rf dist2 && \
mkdir dist && \
\
tsc --outDir dist1 && \
babel dist1 --out-dir dist2 && \
for f in dist2/*.js; \
  do uglifyjs --verbose --output dist/${f##*/} -b max_line_len=100 -b beautify=false -c -m -- $f; \
done && \
\
rm -Rf dist1 && \
rm -Rf dist2
