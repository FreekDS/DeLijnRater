#!/bin/bash

winpty docker-compose -f docker-compose.yml exec entities python start.py fill_db
winpty docker-compose -f docker-compose.yml exec ratings python start.py fill_db
winpty docker-compose -f docker-compose.yml exec users python start.py fill_db
