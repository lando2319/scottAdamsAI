import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMetadata, getMetaTags, websiteSchema } from './site';

// Keep metadata correct when navigating without a full page load.
export default function PageMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = getPageMetadata(pathname);
    document.title = page.title;

    for (const [name, content] of Object.entries(getMetaTags(page))) {
      const attribute = name.startsWith('og:') ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!content) {
        tag?.remove();
        continue;
      }
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
      }
      tag.content = content;
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (page.url) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = page.url;
    } else {
      canonical?.remove();
    }

    let schema = document.getElementById('website-schema');
    if (page.url === websiteSchema.url) {
      if (!schema) {
        schema = document.createElement('script');
        schema.id = 'website-schema';
        schema.type = 'application/ld+json';
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(websiteSchema);
    } else {
      schema?.remove();
    }
  }, [pathname]);

  return null;
}
