# Base image
FROM postgres:10.4-alpine

RUN apk add postgresql-dev

# run create sql on init
ADD create.sql /docker-entrypoint-initdb.d