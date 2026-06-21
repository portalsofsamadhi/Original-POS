import { FC } from 'react';

interface JsonLdProps {
  type: 'Organization' | 'LocalBusiness' | 'Article' | 'BreadcrumbList';
  data: Record<string, any>;
}

const JsonLd: FC<JsonLdProps> = ({ type, data }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLd;
