#!/bin/bash

echo "Wating for postgres on port 5431..."

while ! nc -z users-db 5431; do
	sleep 0.1
done

echo "PostgreSQL started"

python start.py run -h 0.0.0.0