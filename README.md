# Inbox Comics
Your favorite comics emailed to you each morning.

# Developer Instructions
## Getting environment set up.
1. Clone the repo with `$ git clone https://github.com/elijahcarrel/inbox-comics.git`.
1. `$ cd ./inbox-comics`
1. Install tools you might or might not already have.
    1. Install Homebrew by following the instructions at <https://brew.sh/>.
    1. Install npm with `$ brew install npm`.
    1. Install MongoDB with `$ brew install mongodb`.
    1. Install Zeit Now with `$ npm install -g now`
1. Install client package dependencies with `$ cd ./client` and `$ npm install`.
1. Install server package dependencies with `$ cd ./server` and `$ npm install`.
1. Get a database dump from the server. TODO(ecarrel): write instructions for this.

## Starting the server locally
1. First, start the mongo daeomon with `$ mongod --config /usr/local/etc/mongod.conf` 
1. `$ cd ./server`
1. Start the server with `$ npm run start`
1. Server is now running on `localhost:3000`.

## Starting the client locally
1. `$ cd ./client`
1. Start the client with `$ npm run start`
1. Client is now running, and visible in a web browser, on `localhost:4000`.

## Deploying the server
1. `$ cd ./server`
1. `$ now`
1. Server is now deployed to <https://api.inboxcomics.now.sh>.

## Deploying the client
1. `$ cd ./client`
1. `$ now`
1. Client is now deployed to <https://app.inboxcomics.now.sh>.

## Opening the database console.
1. Open the database console with `$ mongo`
1. In the database console, run `> use ic;`
