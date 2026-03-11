export const updatePageMeta = (
  title: string,
  description: string,
  canonicalPath?: string,
  ogImage?: string
) => {
  // Update title
  document.title = title.includes('Webiro') ? title : `${title} | Webiro`;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description.substring(0, 160));
  
  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  const canonicalUrl = canonicalPath 
    ? `https://www.webiro.nl${canonicalPath}`
    : `https://www.webiro.nl${window.location.pathname}`;
  canonical.setAttribute('href', canonicalUrl);
  
  // OG tags
  const setMeta = (attr: string, key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description.substring(0, 160));
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:type', 'website');
  
  if (ogImage) {
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:image', ogImage);
  }

  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description.substring(0, 160));
  setMeta('name', 'twitter:card', 'summary_large_image');
};
