# STILL WIP
# Base this container on a specific Node 6 image
FROM node:8


# Build arguments
ARG VERSION_NUMBER
ARG NPM_AUTH_TOKEN


# Ensure system is fully up-to-date
RUN apt-get update


# Create a non-root user for running the service
RUN adduser --system service

# Set where the service will be installed
WORKDIR /opt/service


# Install application dependencies
COPY package.json ./
RUN npm set registry https://registry.npmjs.org/ \
 && npm set //registry.npmjs.org/:_authToken="$NPM_AUTH_TOKEN" \
 && npm install --prod --verbose \
 && npm install modclean \
 && node_modules/.bin/modclean -r \
 && npm remove modclean \
 && npm cache clean --force \
 && npm rm -rf ~/.npmrc


# Place the application code itself
COPY common common
COPY env env
COPY server server

# Make a config dir that mounted json configs should be placed in
RUN mkdir -p config

# Insert the version number
RUN sed -i "s|\"version\": \".*\"|\"version\": \"$VERSION_NUMBER\"|" package.json


# Execute the service as a particular user
EXPOSE 3000
USER service
CMD [ "npm", "run", "container" ]
