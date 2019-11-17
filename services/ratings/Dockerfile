# base image
FROM python:3.6.5-alpine

# Install dependencies
RUN apk update && apk add --virtual build-deps gcc python-dev musl-dev && apk add postgresql-dev && apk add netcat-openbsd

# set working directory
RUN mkdir -p /usr/src/ratings
WORKDIR /usr/src/ratings

# Add and install requirements
COPY ./requirements.txt /usr/src/ratings/requirements.txt
RUN pip install -r requirements.txt

# Add entrypoint
COPY ./entrypoint.sh /usr/src/ratings/entrypoint.sh
RUN chmod +x /usr/src/ratings/entrypoint.sh

# Add app
COPY . /usr/src/entities

# Run server
CMD ["sh", "/usr/src/ratings/entrypoint.sh"]