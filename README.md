# Inbox Comics
Your favorite comics emailed to you each morning.

## Services & Frameworks used
### Client (UI)
1. ES6 Typescript & TSLint
1. Vercel CLI for deployment
1. Vercel Next.js for SSR (server-side-rendered) React framework and routing
1. Apollo Client (GraphQL) with react-hooks library for communication with server
1. SCSS modules

### Server (Back-End)
1. ES6 Typescript & TSLint
1. Vercel CLI for deployment
1. Apollo Server (GraphQL) for communication with client
1. MongoDB Atlas for our database cluster
1. Mongoose for interacting with mongodb database
1. ElasticEmail for sending emails-- would not recommend, but is the cheapest option and we have very basic needs.

## Why this project is open-sourced
Simply because it's a good template for creating modern web apps. Feel free to fork this as a template for your own
project (deleting all the business logic of course).
  
## Developer Instructions
### Getting environment set up.
1. Clone the repo with `$ git clone https://github.com/elijahcarrel/inbox-comics.git`.
1. `$ cd ./inbox-comics`
1. Install tools you might or might not already have.
    1. Install Homebrew by following the instructions at <https://brew.sh>.
    1. Install npm with `$ brew install npm`.
    1. Install MongoDB with:
       - `$ brew tap mongodb/brew`
       - `$ brew install mongodb-community`
    1. Install Vercel CLI with `$ npm install -g vercel`
1. Install client package dependencies with `$ npm install`.
1. Install api package dependencies with `$ cd ./api` and `$ npm install`.
1. Get a production database dump from the server by following the instructions on <https://cloud.mongodb.com> after
   logging in with your credentials.
1. Start the mongo daemon with `$ brew services start mongodb-community`. By default, homebrew will now keep this
   service alive at all times, even after a restart. To stop it at any time, you can run
   `$ brew services stop mongodb-community`.

### Prerequisites to starting server locally
1. Create a `.env` file in the root directory. This file is not tracked in git because it contains secrets. Put the
   following there as contents:
```bash
mongodb_url="mongodb://127.0.0.1:27017/ic"
elasticemail_api_key="<get this from @elijahcarrel>"
domain="http://localhost:3000"
```
   The `elasticemail_api_key` parameter is empty because it is the same as production and therefore secret-- ask
   @elijahcarrel directly what the API key is. The other information is local-specific and do not match the (secret)
   production values. 

### Starting the app locally
1. Start the app with `$ vercel dev`.
1. App is now running on <http://localhost:3000>, using a local database and production elasticemail credentials.

### Deploying the app to a preview deployment
1. `$ vercel`
1. App is now deployed to app.inboxcomics.vercel.app, using the production database and production elasticemail credentials.

### Deploying the app
1. `$ vercel --prod`
1. App is now deployed to <https://www.inboxcomics.com>.

### Opening a local database console.
1. Open a local database console with `$ mongo ic`. Note that this connects to your local database, not to the production one.
1. In the database console, you can run commands like `> db.users.find({});` or `> db.syndications.findOne({ identifier: "calvinandhobbes" });`

### Opening a production database console.
1. The URL and password for the production database are, of course, secret. Ask @elijahcarrel.
