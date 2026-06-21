import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BRAND_NAME,
  ORGANIZATION_SCHEMA,
  SITE_URL,
  WEBSITE_SCHEMA,
  resolveCanonicalUrl,
  resolvePath,
} from '../../data/seoConfig';

const createBlogPostSchema = (post: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}) => ({
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  image: post.image,
  datePublished: post.datePublished,
  dateModified: post.dateModified || post.datePublished,
  author: {
    '@type': 'Person',
    name: post.authorName,
  },
  publisher: {
    '@type': 'Organization',
    name: BRAND_NAME,
    logo: `${SITE_URL}/samadhi-productions-logo.webp`,
  },
  url: post.url,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': post.url,
  },
});

const createCourseSchema = (course: {
  title: string;
  description: string;
  image: string;
  url: string;
  provider: string;
  duration?: string;
  educationalLevel?: string;
}) => ({
  '@type': 'Course',
  name: course.title,
  description: course.description,
  image: course.image,
  url: course.url,
  provider: {
    '@type': 'Organization',
    name: course.provider,
    url: SITE_URL,
  },
  educationalLevel: course.educationalLevel || 'Beginner to Advanced',
  timeRequired: course.duration || 'P6W',
  courseMode: 'online',
  inLanguage: 'en-US',
  offers: {
    '@type': 'Offer',
    category: 'online course',
    availability: 'https://schema.org/InStock',
  },
});

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string;
  article?: boolean;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  noindex?: boolean;
  nofollow?: boolean;
  alternateUrls?: { [lang: string]: string };
  schemaType?: 'Organization' | 'BlogPosting' | 'Service' | 'WebPage' | 'LocalBusiness' | 'Course';
  schemaData?: Record<string, unknown>;
  canonical?: string;
  keywords?: string[];
  locale?: string;
  siteName?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const SEO: FC<SEOProps> = ({
  title,
  description,
  image = '/samadhi-productions-logo.webp',
  url,
  canonical,
  type = 'website',
  article = false,
  datePublished,
  dateModified,
  authorName,
  noindex = false,
  nofollow = false,
  alternateUrls = {},
  schemaType = 'WebPage',
  schemaData,
  keywords = [],
  locale = 'en_US',
  siteName = BRAND_NAME,
  imageAlt,
  imageWidth = 1200,
  imageHeight = 630,
}) => {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const socialMediaCrawlers = [
    'facebookexternalhit', 'Twitterbot', 'LinkedInBot', 'WhatsApp', 'Applebot',
    'SkypeUriPreview', 'Slackbot', 'TelegramBot', 'DiscordBot', 'Googlebot', 'bingbot',
  ];

  const isSocialCrawler = socialMediaCrawlers.some((crawler) =>
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  );

  if (isSocialCrawler) {
    return null;
  }

  const canonicalUrl = canonical || resolveCanonicalUrl(url);
  const pagePath = resolvePath(url);
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const finalImageAlt = imageAlt || `${title} | ${BRAND_NAME}`;
  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  const getImageType = (imgUrl: string): string => {
    if (imgUrl.includes('.webp')) return 'image/webp';
    if (imgUrl.includes('.jpg') || imgUrl.includes('.jpeg')) return 'image/jpeg';
    if (imgUrl.includes('.png')) return 'image/png';
    if (imgUrl.includes('.gif')) return 'image/gif';
    return 'image/webp';
  };

  const imageType = getImageType(imageUrl);

  const organizationNode = {
    ...ORGANIZATION_SCHEMA,
    '@id': `${SITE_URL}/#organization`,
  };

  const websiteNode = {
    ...WEBSITE_SCHEMA,
    '@id': `${SITE_URL}/#website`,
  };

  const defaultSchemaData = () => {
    switch (schemaType) {
      case 'BlogPosting':
        return createBlogPostSchema({
          title,
          description,
          image: imageUrl,
          datePublished: datePublished || new Date().toISOString(),
          dateModified,
          authorName: authorName || BRAND_NAME,
          url: canonicalUrl,
        });
      case 'Organization':
        return organizationNode;
      case 'LocalBusiness':
        return {
          '@type': 'LocalBusiness',
          ...organizationNode,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '45.5152',
            longitude: '-122.6784',
          },
        };
      case 'Service':
        return {
          '@type': 'Service',
          name: title,
          provider: organizationNode,
          description,
          url: canonicalUrl,
          image: imageUrl,
          serviceType: 'Creative and Wellness Services',
          areaServed: 'Worldwide',
        };
      case 'Course':
        return createCourseSchema({
          title,
          description,
          image: imageUrl,
          url: canonicalUrl,
          provider: BRAND_NAME,
        });
      default:
        return {
          '@type': 'WebPage',
          '@id': canonicalUrl,
          name: title,
          description,
          url: canonicalUrl,
          image: imageUrl,
          isPartOf: { '@id': `${SITE_URL}/#website` },
          about: { '@id': `${SITE_URL}/#organization` },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: SITE_URL,
              },
              ...(pagePath !== '/'
                ? [
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: title.split('|')[0].trim(),
                      item: canonicalUrl,
                    },
                  ]
                : []),
            ],
          },
        };
    }
  };

  const pageSchema = schemaData || defaultSchemaData();
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationNode,
      websiteNode,
      ...(schemaType === 'Organization' && pagePath === '/'
        ? []
        : [pageSchema]),
    ],
  };
  const structuredData =
    schemaData && '@context' in schemaData ? schemaData : graphSchema;

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

      <meta name="author" content={authorName || BRAND_NAME} />
      <meta name="theme-color" content="#0A0A0A" />
      <meta httpEquiv="content-language" content={locale.split('_')[0]} />

      <meta name="robots" content={robotsContent} />
      <meta
        name="googlebot"
        content={
          noindex
            ? robotsContent
            : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
        }
      />
      <meta
        name="bingbot"
        content={
          noindex
            ? robotsContent
            : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
        }
      />

      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {Object.entries(alternateUrls).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:locale" content={locale} />

      {article && datePublished && (
        <>
          <meta property="article:published_time" content={datePublished} />
          {dateModified && <meta property="article:modified_time" content={dateModified} />}
          {authorName && <meta property="article:author" content={authorName} />}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      <meta name="twitter:site" content="@portalsofsamadhi" />
      <meta name="twitter:creator" content="@portalsofsamadhi" />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
};

export default SEO;