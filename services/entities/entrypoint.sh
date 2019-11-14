#!/bin/bash

echo "Wating for postgres on port 5432..."

while ! nc -z users-db 5432; do
	sleep 0.1
done

echo "PostgreSQL started"

python start.py run -h 0.0.0.0