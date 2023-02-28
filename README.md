# Node.js - Sequelize - ES6

This is a starter project for quickly building REST APIs in Node.js using Express and Sequelize ORM using ES6 via Babel

## Features

-   SQL database: Mysql using Sequelize ORM

-   Validation: request data validation using express-validator

-   ES6 via Babel

-   Logging: using winston

-   Testing: unit and integration tests using Jest

-   API documentation: with swagger

-   Environment variables: using dotenv

-   CORS: Cross-Origin Resource-Sharing enabled using cors

-   Linting: with ESLint and Prettier

-   Instant feedback and reload with Nodemon

-   Process management: advanced production process management using PM2

-   Docker support

-   Authentication and Authorization

-   Uses yarn over npm

## TODO:

-   Validation all endpoints.
-   Refactoring.

## Environment

-   Sequelize CLI: 6.6.0
-   Sequelize version: 6.28.0
-   Node.js version: 16.19.0
-   Express version: 4.18.2
-   Operating System: Debian Linux 11

## Getting Started

### Clone the repository

```console
git clone git@github.com:MarcosSDD/node.js-sequelize-ES6.git
```

### Enter into the directory

```console
cd nodejs-sequelize-ES6
```

### Install yarn:

npm install -g yarn

### Install the dependencies

```console
yarn install
```

### Set the environment variables

```console
cp default.env .env
```

### Configuration

Variables for the environment

```console
DB_HOST=localhost                       # database connection host
DB_USER=root                            # database username
DB_PASS=secret123                       # database password
DB_NAME=db_api                          # database name
DB_NAME_TEST=db_api_staging             # database name testing
DB_DIALECT=mysql                        # database dialect
DB_PORT=3306                            # database port
MYSQL_ROOT_PASSWORD=secret123           # mysql enviroment root password
MYSQL_DATABASE=default_db               # mysql enviroment database name
APP_HOST=localhost                      # application host name
APP_PORT=3000                           # application port
SECRET_JWT=secret                       # secret key for encrypt/decrypt JWT token
CATEGORY='Rest Web Service'             # service name
EMAIL_HOST=smtp.mailtrap.io             # email delivery platform
EMAIL_PORT=2525                         # port email delivery
EMAIL_USER=xxxxxxxxxxxx                 # email account username
EMAIL_PASS=xxxxxxxxxxxx                 # email account password
FRONTEND_URL=http://localhost:3000      # front end domain name
ALLOWED_HOSTS=https://localhost:3001    # allowed domains by CORS (Postman host)
```

### Run Data Base Docker

```console
yarn docker:db
```

### Migration and Seeders run

```console
yarn db:create

yarn db:migrate

yarn db:seed:all
```

-   Users created by seeds: user::secretUser001 / demo::secretDemo001

### Run Develop Enviroment

```console
yarn dev
```

### Testing

Create and migrate data base for testing

\*Make sure you have the corresponding docker running

```console
yarn db:create:test

yarn db:migrate:test
```

#### Run tests

```console
yarn test
```

#### Watch and run tests

```console
yarn test:watch
```

#### Test coverage

```console
yarn test:cover
```

### Lint

```console
yarn lint

yarn format
```

### Compile to ES5

```console
yarn build
```

### Run Server Locally PM2

PM2 process manager is used to start its services

```console
yarn start
```

### API documentation

To view the list of available endpoints and their specifications, run the corresponding docker and go to `http://localhost:8080/swagger/` in your browser.
