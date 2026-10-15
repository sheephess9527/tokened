import { getArticle } from '../data/articles'
import { getDictionary, type Language } from '../i18n'
import { languageFromPath, localizePath, stripLanguage } from '../i18n/paths'
import type { PageMeta } from '../hooks/usePageMeta'

/**
 * One description of every route's head tags, shared by the running app and by
 * the build-time prerender — so the static HTML a crawler sees and the tags the
 * SPA swaps in on navigation cannot drift apart.
 */
export function getRouteMeta(pathname: string, lang?: Language): PageMeta {
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  const language = lang ?? languageFromPath(trimmed)
  const t = getDictionary(language)
  const path = stripLanguage(trimmed)
  const localized = (neutral: string): Pick<PageMeta, 'path' | 'alternates'> => ({
    path: localizePath(neutral, language),
    alternates: {
      en: localizePath(neutral, 'en'),
      zh: localizePath(neutral, 'zh'),
    },
  })

  if (path === '/') {
    return {
      title:
        language === 'zh'
          ? 'Tokened | LLM Token 优化与成本控制平台'
          : 'Tokened | LLM Token Analysis & Cost Optimization',
      description:
        language === 'zh'
          ? '实时 LLM Token 分析与成本优化，多模型对比，100% 浏览器本地运行。'
          : 'Real-time LLM token analysis and cost optimization. Multi-model comparison. 100% browser-local.',
      type: 'website',
      lang: language,
      ...localized('/'),
    }
  }

  if (path === '/blog') {
    return {
      title: language === 'zh' ? '指南与洞察 | Tokened' : 'Guides & Insights | Tokened',
      description: t.blog.indexDescription,
      type: 'website',
      lang: language,
      ...localized('/blog'),
    }
  }

  const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : null
  const article = slug ? getArticle(slug) : undefined

  if (article) {
    return {
      title: `${article.title[language]} | Tokened`,
      description: article.description[language],
      type: 'article',
      lang: language,
      ...localized(`/blog/${article.slug}`),
    }
  }

  return {
    title: `${t.notFound.title} | Tokened`,
    description: t.notFound.desc,
    path: trimmed,
    type: 'website',
    lang: language,
    noindex: true,
  }
}


