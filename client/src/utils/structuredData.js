// Organization Schema (for Home page)
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DataPulse AI",
  "alternateName": "DataPulse",
  "url": "https://datapulseai.co",
  "logo": "https://datapulseai.co/og-image.png",
  "description": "Expert AI and software team, powered by our proprietary Acceleration Engine, delivering your most critical projects with unparalleled speed and value.",
  "email": "arthur@datapulseai.co",
  "founders": [
    {
      "@type": "Person",
      "name": "Arthur Procopos",
      "jobTitle": "Co-founder and Director"
    },
    {
      "@type": "Person",
      "name": "Calvin Nigrini",
      "jobTitle": "Co-founder and Director"
    },
    {
      "@type": "Person",
      "name": "Dr. Riaan Conradie",
      "jobTitle": "Co-founder",
      "honorificPrefix": "Dr."
    }
  ],
  "foundingDate": "2020",
  "slogan": "From Backlog to Bottom Line, Faster",
  "sameAs": []
});

// Service Schema (for Services page)
export const getServiceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "AI & Software Development Services",
  "provider": {
    "@type": "Organization",
    "name": "DataPulse AI"
  },
  "offers": {
    "@type": "Offer",
    "price": "13500",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "billingDuration": "P1M",
      "billingIncrement": 1
    },
    "description": "Tech & ML Partnership - Dedicated multi-disciplinary team for AI and software development"
  },
  "areaServed": "Worldwide",
  "description": "Expert AI and software development team providing strategic design, prototyping, full-stack development, machine learning solutions, and quality assurance."
});

// LocalBusiness Schema (for Contact page)
export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "DataPulse AI",
  "url": "https://datapulseai.co",
  "telephone": "",
  "email": "arthur@datapulseai.co",
  "priceRange": "$$$$",
  "description": "Expert AI and software team delivering innovation projects with unparalleled speed and value."
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
    "item": `https://datapulseai.co${item.path}`
  }))
});

// WebPage Schema (general page schema)
export const getWebPageSchema = (name, description, url) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": name,
  "description": description,
  "url": url,
  "publisher": {
    "@type": "Organization",
    "name": "DataPulse AI"
  }
});
