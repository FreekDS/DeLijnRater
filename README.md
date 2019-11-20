# DeLijnRater

## Installation and running
#### Requirements
This application needs both Docker and Docker Compose to be able to run. The requirements of each container are installed automatically.
#### Running the project
To run the project, call one of the following function in the project root

> docker-compose -f docker-compose.yml up

This command can be run with an optional -d tag to run in the background. The application will be visible on http://localhost:80/

The project can be stopped using the following function

> docker-compose -f docker-compose.yml stop


## Project structure
This project consists of 7 independent microservices. The microservices communicate via HTTP requests. A visualization of the project structure can be seen below.
