import { SITE_URL, CONTACT_EMAILS } from '../constants/config';

// Organization Schema (for Home page)
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DataPulse AI",
  "alternateName": "DataPulse",
  "url": SITE_URL,
  "logo": `${SITE_URL}/og-image.png`,
  "description": "A human and data science consultancy with proprietary data sciences, machine learning, and AI technology, partnering with leaders to implement strategic data, ML, and AI agendas.",
  "email": CONTACT_EMAILS.PRIMARY,
  "founders": [
    {
      "@type": "Person",
      "name": "Arthur Procopos",
      "jobTitle": "CEO and Innovation Officer"
    },
    {
      "@type": "Person",
      "name": "Calvin Nigrini",
      "jobTitle": "CTO and Information Officer"
    }
  ],
  "foundingDate": "2020",
  "slogan": "The Joy of Creation",
  "sameAs": []
});

// Service Schema (for Offerings page)
// No `offers` block: the site no longer publishes pricing, so advertising a
// price here would misrepresent what a visitor can actually see.
export const getServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Data, Machine Learning & AI Services",
  "provider": {
    "@type": "Organization",
    "name": "DataPulse AI"
  },
  "areaServed": "Worldwide",
  "description": "Advanced analytics, insights, and AI services alongside design, product, and software services — covering data discovery, ML and AI architecture, model build and training, and software delivery."
});

// LocalBusiness Schema (for Contact page)
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "DataPulse AI",
  "url": SITE_URL,
  "telephone": "",
  "email": CONTACT_EMAILS.PRIMARY,
  "priceRange": "$$$$",
  "description": "A human and data science consultancy implementing data, machine learning, and AI technology alongside your people."
});

// Person Schema (for About page team members)
export const getPersonSchema = (name, jobTitle, image) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": name,
  "jobTitle": jobTitle,
  "image": image,
  "worksFor": {
    "@type": "Organization",
    "name": "DataPulse AI"
  }
});

// BreadcrumbList Schema (for all pages)
export const getBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${SITE_URL}${item.path}`
  }))
});

// WebPage Schema (general page schema)
// `path` is the route path ('/', '/about', …); the absolute URL is built from
// it so the emitted node always matches the route and sitemap.xml.
export const getWebPageSchema = (path, name, description) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": name,
  "description": description,
  "url": `${SITE_URL}${path}`,
  "publisher": {
    "@type": "Organization",
    "name": "DataPulse AI"
  }
});
