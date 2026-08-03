import { SITE_URL as BASE_URL } from "@/lib/config";

export function articleSchema(story, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt,
    image: story.coverImage,
    datePublished: story.publishedAt,
    // dateModified falls back to datePublished if you're not tracking edits
    // separately yet — swap in a real `updatedAt` field once you have one.
    dateModified: story.updatedAt || story.publishedAt,
    author: story.author.slug
      ? {
          "@type": "Person",
          name: story.author.name,
          url: `${BASE_URL}/authors/${story.author.slug}`,
        }
      : {
          "@type": "Person",
          name: story.author.name,
        },
    // publisher is a Google-recommended (not required) Article field
    publisher: {
      "@type": "Organization",
      name: "The Trip Tales",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href,
    })),
  };
}

/**
 * For app/authors/[author]/page.jsx. `author` matches the shape used in
 * lib/data/stories.js (name, slug, bio, avatar).
 */
export function personSchema(author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    image: author.avatar ? `${BASE_URL}${author.avatar}` : undefined,
    url: `${BASE_URL}/authors/${author.slug}`,
  };
}

/**
 * `questions` shape: [{ question: string, answer: string (plain text,
 * no HTML — Google strips markup from FAQPage answers anyway) }]
 *
 * FAQ is a standalone page at app/faq/page.jsx — add this schema there
 * only. Don't duplicate the same FAQ content/markup on the homepage too;
 * Google may flag duplicate FAQPage markup across two URLs.
 */
export function faqPageSchema(questions) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };
}