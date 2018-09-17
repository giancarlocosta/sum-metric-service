# Sum Metric Service

> Logging and reporting service that sums metrics by time window for the most recent hour.

## Contents

*   [Overview](#overview)
*   [API Documentation](#apis-provided)
*   [Service Configuration](doc/configuration.md)
*   [Usage](#usage)
*   [Project Structure](#project-structure)


## Overview

This project contains all of the tools and boilerplate I have built up as I've done
project and is the starting point I use for all of my projects.
I have also built a lot of extra useful tooling for automatically creating markdown
docs from Swagger specifications, test tools, etc. This is a stripped down version
of what I usually use - I have scripts and deployment/testing tools for containerizing
this project with Docker too.

## API Documentation

For API specs see the [Markdown API Docs](doc/api.md) and/or run the application
and visit `http://0.0.0.0:3000/api-docs` for interactive Swagger API docs.
See [doc/](#doc) for auto generating documentation.


## Usage

_See [bin/](#bin) for all utility scripts and commands._

### Setup

Requirements for running the application:

* Node.js >= 8
* Docker

### Building

`npm i` - Installs app dependencies so you can run the server locally

### Running

`npm run develop` - Run server locally. Increased logging and auto restart on file changes.

### Testing

Unit tests can be executed by running
``bin/test-local.sh` - runs the tests on a locally running service (not in a container).
If the COVERAGE=true then a code coverage report will also be created after the tests run


A common workflow is:
```
$ export IMAGE_BRANCH=$(whoami)/metric-service:latest
$ bin/build.sh
...
$ bin/test.sh
...
```

## Project Structure

### bin

Convenience/utility scripts:

*   `document.sh`: Creates markdown from Swagger API spec + adds all errors from server/configs/errors.json
*   `test-local.sh`: Run tests on this app running locally with it's dependency containers + optionally report coverage
*   (TODO)`test.sh`: Run tests on this app in a container with it's dependency containers
*   `killservice.sh`: Kill any instance of this app running locally (using logged process PIDs)
*   `build.sh`: Create a docker container for this service given an image name via IMAGE_BRANCH variable
*   `get-coverage-report.sh` - Download and display the coverage report for the running service

### doc

Contains API docs/Swagger spec, deployment files, possibly JSDocs.
API markdown docs can be created from the JSON Swagger spec using `bin/document.sh`
**You should edit the swagger doc for api changes and then convert to markdown because
Swagger spec file will also be used for Swagger interactive api docs and you want those to
be in sync with your markdown!!**

### common

Contains scripts and artifacts shared by server, tests, etc.

### env

Contains .env files that can be used for local dev, testing, etc.
NOTE: the server will set production environment variables by default.
In a local dev and/or testing context you can use the env files for convenience.
_In a Kubernetes context however, you should set environment variables that you want
to change on the fly from the Kubernetes deployment files!_

### server

#### `configs/`

Configuration files, etc.
See [Configuration Doc](doc/configuration.md) for service runtime configuration options.

##### `configs/errors.js`

All API errors will be defined here. They will have a code that represents the
HTTP code, a code for more specific error information, a message, a name, and
more properties as you choose, such as 'details'. See the "NotFound" Errors in
`errors.json` to see an example of how we may define similar errors with
differing codes and messages.

The middleware error handler defined at the top level of the app (or in specific
routers) will refer to this config file when an Error is thrown and if the Error
name matches with one of the entries in this file it will send that error.
Otherwise a 500 will be sent if the routers didn't specify a status code.

By defining all API errors in one file we can ensure that we control which
errors are exposed to the client. It will also be easy to update that file and
use it to display an /errors route or something similar to an interested client.

This also allows us to just throw Error objects with the name of an error entry
in `errors.json`. For example, we can throw (or reject) an Error like this:

```javascript
const err = new Error('UnauthorizedError');
err.clientMessage = 'The client will see this message in err.details';
throw err;
```

Our error handling middleware can then be written to parse the thrown Error,
try to match it to an entry in error-config.json and return an appropriate Error
to the client. See error.js in middleware for some basic code to perform
this handling.

In addition, we can add properties to the thrown Error and handle those
specially in the error handler. For example by adding a "clientMessage"
property when we throw, we can check for this property in the error handler
and send that custom message to a client if we need to. See ModelValidator
for another example.

##### `server/controllers/`

The Controller will optionally extend ModelController which will allow you to
perform CRUD operations on the model represented by that route. Then for any
other functions, such as non-CRUD functions you want to perform, you can define
other functions in the Controller you have extended and/or create special Controllers.

##### `server/datasources/`

Where connections to dbs will be made. Then just require the modules to use the
db from Controllers, Validators, etc

##### `server/middleware/`

Where all Middleware for various routes will be defined. Middleware may be used
for filtering requests, adding information to requests, formatting responses,
error handling etc. Of particular importance is the error.js file defined in this
directory. Refer to that file and 'Errors' section above for more info.

##### `server/routes/`

Routes will be able to be defined in files and/or folders for better
organization. A utility function will allow you to automatically wire
routes together. (See `/server/middleware/util.js` for an in depth
explanation and `/server/routes/api/index.js` for example use)

Each route _should_ have a Controller associated with it. These components can
"know" about the API  (i.e. they will be able to return Errors that are specific
to the API, they'll be able to optionally handle Express components such as Request,
Response, etc) More on Errors above.
