TODO(ecarrel):
- Fix the fact that I need to move my server-side environment variables inside the "build" object to run it locally but move it outside of the "build" object in order to deploy it.
- Make some sort of CommonQuery wrapper so that I don't write the same loading-handling and error-handling in every query wrapper.
- Remove the dozens of `: any`s from the codebase that I used when I was trying to get things running.
- Remove CORS and add a proxy instead.