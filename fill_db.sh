#!/bin/bash

docker-compose -f docker-compose.yml exec entities start.py fill_db
docker-compose -f docker-compose.yml exec ratings start.py fill_db
docker-compose -f docker-compose.yml exec users start.py fill_db
