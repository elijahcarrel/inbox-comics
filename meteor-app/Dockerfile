FROM gcr.io/google_appengine/nodejs
COPY . /app/
RUN (cd programs/server && npm install --unsafe-perm)
CMD node main.js