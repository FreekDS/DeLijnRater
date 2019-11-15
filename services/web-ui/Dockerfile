# Base image
FROM node:10.4.1-alpine

# Set working directory
WORKDIR /usr/src/web-ui

# Add node modules to $PATH
ENV PATH /usr/src/web-ui/node-modules/.bin:$PATH

# Install and cache app dependencies
COPY package.json /usr/src/web-ui/package.json
RUN npm install --silent
RUN npm install react-scripts@3.2.0 -g --silent

# Start the react app
CMD ["npm", "start"]