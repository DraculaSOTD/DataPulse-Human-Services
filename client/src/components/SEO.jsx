import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../constants/config';

const SEO = ({
  title,
  description,
  keywords,
  ogImage = '/og-image.png',
  ogType = 'website',
  canonical,
  structuredData
}) => {
  // Derived from the route rather than passed per page, so a new page cannot
  // forget it and no page can drift from its own URL. `canonical` overrides.
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | DataPulse AI` : 'DataPulse AI - The Joy of Creation';
  const canonicalUrl = canonical || `${SITE_URL}${pathname}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${SITE_URL}${ogImage}`} />
      <meta property="og:site_name" content="DataPulse AI" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${SITE_URL}${ogImage}`} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
