# Inbox Comics
Your favorite comics emailed to you each morning.

## Developer Instructions
### Getting environment set up.
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

### Starting the server locally
#### Prerequisites
1. `$ cd ./server`
1. Create a `.env` file in this directory. This file is not tracked in git because it contains secrets. Put the
   following there as contents:
```bash
mongodb_url="mongodb://127.0.0.1:27017/ic"
elasticemail_api_key=""
domain="http://localhost:4000"
graphql_http_endpoint="http://localhost:3000/graphql"
```
   The `elasticemail_api_key` parameter is empty because it is the same as production and therefore secret-- ask
   @elijahcarrel directly what the API key is. The other information is local-specific and do not match the (secret)
   production values. 
#### Starting the server
1. First, start the mongo daemon with `$ mongod --config /usr/local/etc/mongod.conf` 
1. `$ cd ./server`
1. Start the server with `$ npm run start`
1. Server is now running on <http://localhost:3000>.

### Starting the client locally
1. `$ cd ./client`
1. Start the client with `$ npm run start`
1. Client is now running, and visible in a web browser, on <http://localhost:4000>.

### Deploying the server
1. `$ cd ./server`
1. `$ now --prod`
1. Server is now deployed to <https://api.inboxcomics.com>.

### Deploying the client
1. `$ cd ./client`
1. `$ now --prod`
1. Client is now deployed to <https://www.inboxcomics.com>.

### Opening a local database console.
1. Open a local database console with `$ mongo ic`. Note that this connects to your local database, not to the production one.
1. In the database console, you can run commands like `> db.users.find({});` or `> db.syndications.findOne({ identifier: "calvinandhobbes" });`

### Opening a production database console.
1. The URL and password for the production database are, of course, secret. Ask @elijahcarrel.

## Services & Frameworks used
### Client (UI)
1. ES6 Typescript & TSLint
1. Zeit Now for deployment
1. Zeit Next.js for SSR (server-side-rendered) React framework and routing
1. Apollo Client (GraphQL) with react-hooks library for communication with server
1. SCSS modules as CSS-in-JS solution of choice
### Server (Back-End)
1. ES6 Typescript & TSLint
1. Zeit Now for deployment
1. Apollo Server (GraphQL) for communication with client
1. MongoDB Atlas for our database cluster
1. Mongoose for interacting with mongodb database
1. ElasticEmail for sending emails-- would not recommend, but is the cheapest option and we have very basic needs.
