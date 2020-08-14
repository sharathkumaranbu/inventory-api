# Inventory API

## Prerequisites

- node 12.x
- npm 6.x
- Mongo DB 4.4
- Postman for Verification

## Configuration

Configuration of the Inventory API is available at `config/default.js`. The following parameters can be set in config files or in env variables:

| Config Variable | Enviroment Variable | Description                      |
| --------------- | ------------------- | -------------------------------- |
| HOST            | HOST                | Base url of API host             |
| API_PREFIX      | API_PREFIX          | REST API Prefix                  |
| LOG_LEVEL       | LOG_LEVEL           | Logging level of the application |
| PORT            | PORT                | PORT in which API will be served |
| MONGODB_URL     | MONGODB_URL         | Mongo Database URL               |

**Note: Application related constants are present in `src/constants.js`**

## Setup

1. Ensure that Mongo DB is up and running, be it local or in remote server.

```
If you are using docker to set up MongoDB, Navigate to local directory and run `docker-compose up` to bring up the local instance of MongoDB in docker
```

2. Install project dependencies, From the root of the project, execute

```
npm i
```

4. Refer to `config/default.js` or Configuration section in readme file and set up the environment variables as necessary in `.env` file in the root of the project or in the shell

In .env file:

```
MONGODB_URL=<Mongo DB URL>
```

In Shell:

```
export MONGODB_URL=<Mongo DB URL>
```

6. Start the application using the command

```
npm start
```

#### Lint JS files and fix possible lint errors

```
npm run lint
```

### Verification

1. Open Postman

2. Import the environment file and postman collection in `docs` directory into Postman

3. Trigger the requests and verify the end points
