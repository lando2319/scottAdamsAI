import assert from 'node:assert/strict';
import test from 'node:test';
import parseTweet from 'twitter-text/dist/parseTweet.js';
import { createXShare } from './shareResponse.js';

function draftFor(answer) {
  const share = createXShare(answer);
  const intent = new URL(share.href);
  assert.equal(intent.origin, 'https://x.com');
  assert.equal(intent.pathname, '/intent/tweet');
  assert.deepEqual([...intent.searchParams.keys()], ['text', 'url']);
  assert.equal(intent.searchParams.get('url'), 'https://scottadamsai.com/');
  const text = intent.searchParams.get('text');
  assert.ok(text.startsWith('Scott Adams AI (fan-made):\n\n'));
  assert.ok(parseTweet(`${text}\n\n${intent.searchParams.get('url')}`).valid);
  return { ...share, text };
}

test('short answers round-trip through URL encoding with attribution and homepage', () => {
  const answer = 'Systems > goals? A&B + "small steps" #habits\nTry café ☕.';
  const draft = draftFor(answer);
  assert.equal(draft.truncated, false);
  assert.equal(draft.text, `Scott Adams AI (fan-made):\n\n${answer}`);
});

test('long answers use an excerpt that fits with the homepage link', () => {
  const answer = 'Build useful systems and keep improving them. '.repeat(100);
  const draft = draftFor(answer);
  assert.equal(draft.truncated, true);
  assert.ok(draft.text.endsWith('…'));
  assert.ok(answer.startsWith(draft.text.split('\n\n')[1].slice(0, -1)));
});

test('truncation preserves whole emoji sequences and accounts for CJK character weights', () => {
  const family = '👨‍👩‍👧‍👦';
  const draft = draftFor(family.repeat(200));
  assert.equal(draft.truncated, true);
  const excerpt = draft.text.split('\n\n')[1].slice(0, -1);
  assert.ok(excerpt.length > 0);
  assert.equal(excerpt, family.repeat(excerpt.length / family.length));
  assert.equal(draftFor('系统'.repeat(200)).truncated, true);
});

test('URLs inside the answer count at X\'s shortened URL length', () => {
  assert.equal(draftFor('https://t.co/a '.repeat(20)).truncated, true);
  const longUrl = `https://example.com/${'a'.repeat(300)}`;
  const draft = draftFor(`See this source: ${longUrl}`);
  assert.equal(draft.truncated, false);
  assert.ok(draft.text.includes(longUrl));
});
