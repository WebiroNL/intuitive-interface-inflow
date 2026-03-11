import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Service' | 'LocalBusiness' | 'BlogPosting';
  data?: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const id = data?.slug ? `${type}-${data.slug}` : type;
    const existingScript = document.querySelector(`script[data-structured-data="${id}"]`);
    if (existingScript) existingScript.remove();

    let schemaData: object;

    switch (type) {
      case 'Organization':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Webiro',
          url: 'https://www.webiro.nl',
          logo: 'https://www.webiro.nl/logo.png',
          description: 'Webiro maakt moderne, professionele websites voor ondernemers. Betaalbaar, snel en zonder gedoe.',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+31-85-505-5054',
            contactType: 'sales',
            areaServed: 'NL',
            availableLanguage: 'Dutch',
          },
          sameAs: [
            'https://www.instagram.com/webiro.nl',
            'https://www.linkedin.com/company/webiro'
          ]
        };
        break;
      case 'WebSite':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Webiro',
          url: 'https://www.webiro.nl',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.webiro.nl/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        };
        break;
      case 'Service':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Web Design & Development',
          provider: {
            '@type': 'Organization',
            name: 'Webiro',
            url: 'https://www.webiro.nl',
          },
          areaServed: 'NL',
          description: 'Professionele website binnen 7 dagen. Modern design, SEO geoptimaliseerd en volledig responsive.',
          offers: {
            '@type': 'Offer',
            price: '449',
            priceCurrency: 'EUR',
            description: 'Website pakket vanaf €449',
          },
        };
        break;
      case 'LocalBusiness':
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Webiro',
          url: 'https://www.webiro.nl',
          telephone: '+31855055054',
          email: 'info@webiro.nl',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        };
        break;
      case 'BlogPosting':
        if (!data) return;
        schemaData = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description: data.excerpt,
          image: data.image_url,
          author: {
            '@type': 'Organization',
            name: data.author || 'Webiro',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Webiro',
            logo: { '@type': 'ImageObject', url: 'https://www.webiro.nl/logo.png' },
          },
          datePublished: data.published_at,
          dateModified: data.updated_at || data.published_at,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://www.webiro.nl/blog/${data.slug}`,
          },
        };
        break;
      default:
        return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', id);
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => { script.remove(); };
  }, [type, data]);

  return null;
}
