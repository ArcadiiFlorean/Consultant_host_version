import { useEffect } from 'react';

const SEOHead = ({ 
  title = "Consultant Alăptare Online - Susținere Mame România, Moldova, Anglia",
  description = "Consultanță expertă în alăptare și îngrijirea nou-născutului online. Susținere pre și postnatală în română și rusă. Servicii pentru mame din România, Moldova și Anglia.",
  keywords = "consultant alăptare online, îngrijire nou născut, susținere prenatală, consultant lactație română rusă, alăptare moldova",
  image = "/og-image.jpg",
  type = "website"
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update or create meta tag
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'Consultant Alăptare Online');
    updateMetaTag('geo.region', 'RO-MD-GB');
    updateMetaTag('geo.placename', 'România, Moldova, Anglia');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', window.location.origin + image, true);
    updateMetaTag('og:url', window.location.href, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'Consultant Alăptare Online', true);
    updateMetaTag('og:locale', 'ro_RO', true);
    updateMetaTag('og:locale:alternate', 'ru_RU', true);

    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', window.location.origin + image);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', window.location.href);
      document.head.appendChild(canonical);
    }

    // Add structured data based on page type
    let structuredData;
    
    if (type === 'article') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Person",
          "name": "Consultant Alăptare Online"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Consultant Alăptare Online"
        },
        "datePublished": new Date().toISOString(),
        "dateModified": new Date().toISOString()
      };
    } else {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "HealthAndBeautyBusiness",
        "name": "Consultant Alăptare Online",
        "description": description,
        "url": window.location.href,
        "serviceType": ["Consultanță în Alăptare", "Îngrijirea Nou-Născutului", "Susținere Prenatală", "Susținere Postnatală"],
        "areaServed": ["România", "Moldova", "Anglia", "Regatul Unit"],
        "availableLanguage": ["Romanian", "Russian"],
        "serviceArea": {
          "@type": "Place",
          "name": "Online - România, Moldova, Anglia"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["Romanian", "Russian"],
          "serviceType": "Online Consultation"
        },
        "offers": {
          "@type": "Offer",
          "description": "Consultanță online în alăptare și îngrijirea nou-născutului",
          "availability": "https://schema.org/OnlineOnly"
        }
      };
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'structured-data');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

  }, [title, description, keywords, image, type]);

  // Component doesn't render anything visible
  return null;
};

export default SEOHead;