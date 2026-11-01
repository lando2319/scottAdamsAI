# functions

from inside `web-app/functions`

to Deploy
`firebase deploy --only functions`

# web-app

cd to web-app

to run locally

`npm run dev`

### App Check on localhost

The development app enables Firebase's App Check debug provider on `localhost`,
`127.0.0.1`, and `[::1]`. Production builds use reCAPTCHA Enterprise.

1. Open the local app and your browser's developer console. Find the
   `AppCheck debug token` message (submit a question if it has not appeared).
2. In Firebase Console, select project `scottadamsai-a33bb`, open App Check,
   find the web app, and choose **Manage debug tokens** from its overflow menu.
3. Register the browser's token, then reload the local app and try a question.

Keep the token private; it is stored in your browser and does not belong in source
control. Each browser/profile needs its own registration. Do not add localhost
to the reCAPTCHA allowed domains.

Local development currently calls the deployed `ask` function. To activate the
App Check enforcement fix on that backend, run from `web-app`:

`firebase deploy --only functions:ask`

After deployment, missing or invalid App Check tokens are rejected. Register
your local debug token before testing the enforced function from localhost.

See [Firebase's debug provider guide](https://firebase.google.com/docs/app-check/web/debug-provider).

### Background image

The background is bundled from `web-app/src/assets/background.webp`; replace
that file to change it. Vite processes the CSS reference and includes the image
in `dist/assets` during builds, so no separate storage bucket is needed.

to build

`npm run build`

to deploy

`firebase deploy`

# OpenAI

Do a back of the napkin check on the number in my vector store
should be blogPosts + cwsa_transcripts

# Tumblr

Tumblr api pull said scottadamsblog has 1962 posts but we ran it and it only created 1961 files
not sure, maybe it was deleted, or maybe the code's wrong

Maybe it's looping and misses the next post because it has the same date

I confirmed the first and last posts are the same comparing to the acutal website

Not sure about the discrepency

Long term, I'd like to grab the missing one if we can

