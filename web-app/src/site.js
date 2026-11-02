export const SITE_URL = 'https://scottadamsai.com';
export const CONTRIBUTION_URL = 'https://github.com/lando2319/scottAdamsAI/blob/main/CONTRIBUTING.md';

export const pages = {
  '/': {
    title: 'Scott Adams AI | Fan-Made AI Chat',
    description: 'Explore Scott Adams\'s ideas with a fan-made AI informed by his blog posts and Coffee with Scott Adams transcripts. Ask questions and help improve the project.',
  },
  '/contact': {
    title: 'Contact the Scott Adams AI Fan Project',
    description: 'Contact the fans building Scott Adams AI. Share feedback, suggest source material, or get involved in this independent AI project.',
  },
};

export function getPageMetadata(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  return pages[path]
    ? { ...pages[path], url: `${SITE_URL}${path}`, robots: 'index, follow' }
    : {
        title: 'Page Not Found | Scott Adams AI',
        description: 'This page could not be found. Visit Scott Adams AI to explore the fan-made project.',
        robots: 'noindex, follow',
      };
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Scott Adams AI',
  url: `${SITE_URL}/`,
  description: pages['/'].description,
  inLanguage: 'en',
};

export function getMetaTags(page) {
  return {
    description: page.description,
    robots: page.robots,
    'og:type': 'website',
    'og:site_name': 'Scott Adams AI',
    'og:title': page.title,
    'og:description': page.description,
    'og:url': page.url,
    'twitter:card': 'summary',
    'twitter:title': page.title,
    'twitter:description': page.description,
  };
}
