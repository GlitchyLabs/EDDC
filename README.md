![Discord](https://img.shields.io/discord/845790615420665866?color=%237289da&label=Dicord&logo=Discord&logoColor=%23FFFFFF)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/glitchylabs/eddc/Node.js%20CI)
[![Maintainability](https://api.codeclimate.com/v1/badges/b3f7dac5b8b424c0474c/maintainability)](https://codeclimate.com/github/GlitchyLabs/eddc/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b3f7dac5b8b424c0474c/test_coverage)](https://codeclimate.com/github/GlitchyLabs/eddc/test_coverage)

Elite Dangerous Data Connector
=====================

Elite Dangerous data connector is inteded to allow commanders to send their events to a centralized service to parse those events and provide useful output to different services.  Currently EDDC connects to Discord and allows the commanders to show things like Carrier events (Jumps, Buy/sale orders, etc.) as well as individual log (Jumps, Docking, Merchant, etc) events.  This can be useful for squads that want to see how their commanders are doing without logging into the game.

# Clients
Below are the current (and future) clients EDDC supports.

## Discord

If you provide a Bot Token to the DISCORD_BOT_TOKEN environment variable. The service will login to discord as this bot.  You can then add this bot to any server you need using the link we put in the console and log during startup, or the generator in your Discord Developer Portal's OAuth2 page.

## IRC

_**WIP:** Check back later._

## Web

Nothing special here, just navigate to the server in a browser.  Go to `http://<server_ip>:<server_port>` to view a nice interface to view the stored data.

<br/>

# How to use
We provide a EDMC plugin or a stand-alone application you need to run on the commanders' computers while playing.  These collect the events and send them to the configured server.

## Plugin
---

Download the plugin from [here](download.me/from/here)

Once downloaded, you'll need to unzip into `%AppData%\..\Local\EDMarketConnector\plugins` as an `eddc` folder


<br/>

## Stand-Alone
---
Download the Stand-Alone app from [here](download.me/from/here)

<br />

## Server
---

### Docker

#### CLI
---
You can use the below command to run the docker image.  Just make sure to fill in needed environment variables in .env.production
```
> docker run -it -p 0.0.0.0:1234:31337 --env-file .env.production glitchy/eddc:latest
```

#### Compose
---
The below compose will run the server without a database, read further down if you also want a database.

You will need to fill in needed environment variables in .env.production.
```
version: "3.7"
services:
  server:
    image: glitchy/eddc:latest
    restart: unless-stopped
    user: 65534:65534
    ports:
      - 0.0.0.0:31337:31337/tcp
    cap_drop:
      - ALL
    env_file:
      - .env.production
```
Once you have your compose file ready, just use `docker-compose up` to start your services.

<br/>

We support mysql if you pass MYSQL_DATABASE in your environments.  If you don't pass this, we won't use your database and we won't persist your data through restart.  Here is a sample config for docker to run a database.
```
version: "3.7"
services:
  server:
    image: glitchy/eddc:latest
    restart: unless-stopped
    user: 65534:65534
    ports:
      - 0.0.0.0:31337:31337/tcp
    cap_drop:
      - ALL
    env_file:
      - .env.production
  db:
    image: mariadb:latest
    user: mysql:mysql
    ports:
      - 3306:3306/tcp
    env_file:
      - .env.production
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

Once you have your compose file ready, just use `docker-compose up` to start your services.

### Download

#### Debian
---

#### Fedora
---

#### Source
---
Running the source code requires a few things. Lets go through making sure you have those first.

- NodeJS (we use 14.x)

Really, that's it.  We make sure this runs on very little dependancies.

#### Install and Run:

The below will install all dependant libraries and will build the application.  It will then start the built application.
```
npm i
npm run start
```

Some environment variables can be setup to alter the runtime.  Use these as you need them.  See the .env.sample file for more.

```
DISCORD_BOT_TOKEN # required for Discord Integration
PORT # port for the commander clients to connect
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
```