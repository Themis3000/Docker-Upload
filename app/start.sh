#!/bin/bash

if [ -z "$PORT" ]; then
  PORT="5001"
fi

echo "Starting on port ${PORT}"
gunicorn wsgi:app -b ":${PORT}"