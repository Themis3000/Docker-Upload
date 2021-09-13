#!/bin/sh

chown -R appuser:appgroup /app/uploads
exec runuser -u appuser "$@"