#!/bin/sh

echo Building theme YAML...
NODE_NO_WARNINGS=1 node ./githooks/pre-commit.js
echo Done!
