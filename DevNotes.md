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

### Automatic deployment versions

Run `firebase deploy --only hosting` from `web-app` to publish the frontend.
Firebase's Hosting `predeploy` hook automatically runs `npm run build:deploy`,
which increases the patch version (for example, `1.0.6` to `1.0.7`), updates both
`package.json` and `package-lock.json`, and builds the frontend with that version
in its footer. You do not need to build separately before deploying.

This also runs when Hosting is included in a full or combined deployment.
Functions-only deployments leave the frontend version unchanged. Normal
`npm run build` and `npm run build:site` builds do not increase the version.

The version command uses `--no-git-tag-version`, so it does not create a Git
commit or tag. Commit the updated package files with your changes. The bump
happens before building and uploading; a failed deployment attempt can still
leave the local version increased, and retrying will increase it again.

### Search visibility

`npm run build` now builds the frontend and prerenders the home page, contact page,
and a 404 page from the same React components used in the browser. This puts public
content and page-specific metadata directly in the HTML. `npm run build:site`
does the same build. Both leave the package version unchanged.

The build also generates `dist/robots.txt` and `dist/sitemap.xml`. Metadata and the
list of indexable routes live in `web-app/src/site.js`. If you add a public route,
add it there as well. Firebase Hosting uses clean URLs for the generated HTML
files and returns a real 404 for unknown paths instead of rewriting every path
to the home page. No server-rendering service or new cloud resource is required.

Firebase and App Check initialize when someone submits a question; reading the
public pages and generating their HTML do not require a token. The callable
backend still enforces App Check.

After deploying this frontend with `firebase deploy --only hosting`:

1. Verify `scottadamsai.com` in [Google Search Console](https://search.google.com/search-console).
   Use a Domain property and the DNS TXT verification record Google supplies.
2. Submit `https://scottadamsai.com/sitemap.xml` in the Sitemaps report.
3. Inspect `https://scottadamsai.com/` with URL Inspection, run a live test, and
   request indexing. Check the indexing report for any exclusions or errors.
4. Track impressions and clicks for `Scott Adams AI` in the Performance report.
   Search results and their order vary, so use that report to measure progress.

Prioritize `Scott Adams AI`, which describes this specific project. Broader
`Scott Adams` searches cover many different intents and established sites.
Publish useful original explanations of the project, its sources, and carefully
checked examples over time. Share it with relevant fan communities and invite
genuine links from people who find it useful. Metadata alone cannot guarantee a
position, and changes can take weeks or longer to show an effect.

See Google's [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
and [Search Console guide](https://developers.google.com/search/docs/monitor-debug/search-console-start).

### Sharing an answer on X

Successful answers include a **Post to X** link. It opens X's composer with the
answer, a fan-made attribution, and `https://scottadamsai.com/`. Long answers use
an excerpt sized for a standard post, including the homepage link. The full
answer remains visible on the site. The visitor can edit the draft and publishes
it from their own X account.

This uses [X's Web Intent](https://docs.x.com/x-for-websites/post-button/guides/web-intent),
so it requires no X API credentials, Firebase function, or additions to
`secrets.json`. Only clicking the link opens X; generating an answer does not post
anything. The link goes to the homepage, not a saved copy of the answer.

The `twitter-text` character counter accounts for X's URL and Unicode weights.
Run its sharing checks from `web-app` with `npm test`. Deploy this frontend change
with `firebase deploy --only hosting`; the deploy hook bumps the version and builds it.

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

