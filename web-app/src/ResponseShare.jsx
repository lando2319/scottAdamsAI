import { useMemo } from 'react';
import { createXShare } from './shareResponse';

export default function ResponseShare({ response }) {
  const share = useMemo(() => createXShare(response), [response]);

  return (
    <div className="response-actions">
      <a className="share-link" href={share.href} target="_blank" rel="noopener noreferrer" aria-describedby="share-note">
        Post to X <span aria-hidden="true">↗</span>
      </a>
      <p className="share-note" id="share-note">
        {share.truncated
          ? 'Opens a draft with an excerpt and a link to the homepage.'
          : 'Opens a draft with this answer and a link to the homepage.'}
        {' '}You can edit before posting.
      </p>
    </div>
  );
}
