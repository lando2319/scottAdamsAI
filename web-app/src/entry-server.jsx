import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { SiteContent } from './App';

export function render(pathname) {
  return renderToString(
    <StaticRouter location={pathname}>
      <SiteContent />
    </StaticRouter>
  );
}
