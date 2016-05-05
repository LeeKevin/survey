# Survey widget

##Introduction

This widget can be applied to your webpage to prompt your users with unique survey questions whenever they visit. An admin panel is provided to allow you to view, create, and archive your survey questions.

The app is separated into two parts: a server directory for serving and storing survey questions, and a static client folder that can be served from gh-pages or a CDN.

## Installation

Currently this is a work in progress.

## Demo

[Here's a running demo.](http://leekevin.github.io/survey/)

If you want to do it yourself:

###Copy the project files

First, fork this repo and clone it to your local machine by typing git clone `https://github.com/<YOUR-GITHUB-HANDLE>/survey.git`. This will clone the project files for your use.

Alternatively, you can just download the project files and copy it somewhere on your machine.


###Server

Make sure your server machine is running [mysql](https://dev.mysql.com/downloads/mysql/) and has [node.js](http://nodejs.org/download/) installed before continuing. (You might run into an issue while installing `bcrypt`. Create a symlink by executing `sudo ln -s /usr/bin/nodejs /usr/bin/node` after installing node.)

Copy the contents of `server` to wherever you'll be serving this from.

Check your configuration files in `config/config.json`:

#### `app.json`

```
{
  "port": 55555,
  "cors": {
    "AllowOrigin": [
      "http://survey.app"
    ]
  }
}
```

Set the listening port for the node server and specify any permitted request origins for CORS, if necessary.

#### `auth.json`

```
{
  "token": {
    "secret": "aRandomString",
    "options": {
      "expiresIn": "1d"
    }
  }
}
```

Set a secret string from which to generate authentication tokens, and set the expiry time. For more information on options, see [https://github.com/auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

#### `database.json`

```
{
  "database": "survey",
  "username": "homestead",
  "password": "secret",
  "host": "localhost",
  "port": "33060"
}
```

Set the database information for your instance of mysql. You will need to create a mysql database on the server.

#### Server Set-up

Once your configuration files are in place, run from within the folder

```
npm install
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:seed:all
```

This will set up your database schema, create an admin user with the credentials `admin//kevinisawesome`, and populate a sample survey question for you.

To start the server, run

```
node server.js
```

###Client

In the `app` folder, create a `config/config.json` file that contains the server url (don't include the protocol) and port (should be the same as the specified port for the server, above).

Example:
```
{
  "server": {
    "url": "127.0.0.1",
    "port": 55555,
    "api": "api"
  }
}
```

Then, run

```
npm install
gulp --production
```

And copy the contents of `public` to wherever you'll be serving the pages from.

## Usage

In the demo, you'll see a small blue tab on the left hand side of your screen. This is the button to access the Admin dashboard to manage the survey questions.

I used [evercookie](http://samy.pl/evercookie/) to recognize unique visitors to the site. Visitors will automatically be prompted to answer a unique survey question once they visit the site.