import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'Organization' | 'WebSite' | 'Service' | 'LocalBusiness';
}

export function StructuredData({ type }: StructuredDataProps) {
  useEffect(() => {
    const existingScript = document.querySelector(`script[data-structured-data="${type}"]`);
    if (existingScript) return;

    let data: object;

    switch (type) {
      case 'Organization':
        data = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Webiro',
          url: 'https://www.webiro.nl',
          logo: 'https://www.webiro.nl/logo.png',
          description: 'Webiro maakt moderne, professionele websites voor ondernemers. Betaalbaar, snel en zonder gedoe.',
          sameAs: [
            'https://www.instagram.com/webiro.nl',
            'https://www.linkedin.com/company/webiro'
          ]
        };
        break;
      case 'WebSite':
        data = {
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
        data = {
          '@context': 'https://schema.org',
          '@type': 'Service',
          serviceType: 'Web Design',
          provider: {
            '@type': 'Organization',
            name: 'Webiro'
          },
          areaServed: 'NL',
          description: 'Professionele website binnen 7 dagen. Modern design, SEO geoptimaliseerd en volledig responsive.'
        };
        break;
      case 'LocalBusiness':
        data = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Webiro',
          url: 'https://www.webiro.nl',
          telephone: '+31612345678',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'NL'
          }
        };
        break;
      default:
        return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', type);
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [type]);

  return null;
}
