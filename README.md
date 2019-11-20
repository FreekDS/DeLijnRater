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

<img src="./doc/Services diagram.svg>

The web ui service provides an interface for the user to access the application. The user services communicates with the Nginx service that behaves as a reversed proxy. The reversed proxy redirects the request to the correct Flask applications. There are three Flask applications in total. One handles the API calls that manipulates entities. The entities are the bus stops and the vehicles. Another Flask app is used to handle the rating related functionality. The last Flask app is the user service which is used for logging in and registering. The API calls are described further in this document.
The last two services are databases. One is used for persistence data, this are the entities and the ratings, and the other one is the users database.

## API structure
