import parseTweet from 'twitter-text/dist/parseTweet.js';
import { SITE_URL } from './site.js';

const attribution = 'Scott Adams AI (fan-made):\n\n';
const homepage = `${SITE_URL}/`;

export function createXShare(response) {
  const answer = response.normalize('NFC').replace(/[\uFFFE\uFEFF\uFFFF]/gu, '').trim();
  // Reserve space for the attribution and the homepage's shortened URL.
  const fits = text => parseTweet(`${attribution}${text}\n\n${homepage}`).valid;
  const truncated = !fits(answer);
  let excerpt = answer;

  if (truncated) {
    excerpt = '';
    // Keep whole graphemes, including emoji sequences and combining characters.
    const segments = new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(answer);
    for (const { segment } of segments) {
      if (!fits(`${excerpt}${segment}…`)) break;
      excerpt += segment;
    }
    excerpt = `${excerpt.trimEnd()}…`;
  }

  const text = `${attribution}${excerpt}`;
  const intent = new URL('https://x.com/intent/tweet');
  intent.searchParams.set('text', text);
  intent.searchParams.set('url', homepage);

  return { href: intent.toString(), truncated };
}
