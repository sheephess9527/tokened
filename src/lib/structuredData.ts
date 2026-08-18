import type { Article } from '../data/articles'
import type { Language } from '../i18n'
import { localizePath } from '../i18n/paths'
import { absoluteUrl, OG_IMAGE, SITE_NAME, SITE_URL } from './site'

const localUrl = (path: string, lang: Language) => absoluteUrl(localizePath(path, lang))

const localeCode = (lang: Language) => (lang === 'zh' ? 'zh-CN' : 'en')

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: OG_IMAGE,
  }
}

export function webApplicationSchema(lang: Language, description: string) {
  return {
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#app`,
    name: SITE_NAME,
    url: localUrl('/', lang),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    publisher: { '@id': `${SITE_URL}/#organization` },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description,
    inLanguage: localeCode(lang),
  }
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  lang: Language,
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: localUrl(crumb.path, lang),
    })),
  }
}

export function blogPostingSchema(article: Article, lang: Language) {
  const url = localUrl(`/blog/${article.slug}`, lang)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: article.title[lang],
    description: article.description[lang],
    datePublished: article.published,
    dateModified: article.published,
    mainEntityOfPage: url,
    url,
    image: OG_IMAGE,
    inLanguage: localeCode(lang),
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function blogIndexSchema(articles: Article[], lang: Language, name: string) {
  return {
    '@type': 'Blog',
    '@id': `${localUrl('/blog', lang)}#blog`,
    name,
    url: localUrl('/blog', lang),
    inLanguage: localeCode(lang),
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title[lang],
      url: localUrl(`/blog/${article.slug}`, lang),
      datePublished: article.published,
    })),
  }
}

/** Wrap schema nodes in a single @graph so one script tag carries the page. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
