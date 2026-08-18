import { getArticle } from '../data/articles'
import { getDictionary, type Language } from '../i18n'
import type { PageMeta } from '../hooks/usePageMeta'

/**
 * One description of every route's head tags, shared by the running app and by
 * the build-time prerender — so the static HTML a crawler sees and the tags the
 * SPA swaps in on navigation cannot drift apart.
 */
export function getRouteMeta(pathname: string, lang: Language): PageMeta {
  const t = getDictionary(lang)
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === '/') {
    return {
      title:
        lang === 'zh'
          ? 'Tokened | LLM Token 优化与成本控制平台'
          : 'Tokened | LLM Token Analysis & Cost Optimization',
      description:
        lang === 'zh'
          ? '实时 LLM Token 分析与成本优化，多模型对比，100% 浏览器本地运行。'
          : 'Real-time LLM token analysis and cost optimization. Multi-model comparison. 100% browser-local.',
      path: '/',
      type: 'website',
      lang,
    }
  }

  if (path === '/blog') {
    return {
      title: lang === 'zh' ? '指南与洞察 | Tokened' : 'Guides & Insights | Tokened',
      description: t.blog.indexDescription,
      path: '/blog',
      type: 'website',
      lang,
    }
  }

  const slug = path.startsWith('/blog/') ? path.slice('/blog/'.length) : null
  const article = slug ? getArticle(slug) : undefined

  if (article) {
    return {
      title: `${article.title[lang]} | Tokened`,
      description: article.description[lang],
      path: `/blog/${article.slug}`,
      type: 'article',
      lang,
    }
  }

  return {
    title: `${t.notFound.title} | Tokened`,
    description: t.notFound.desc,
    path,
    type: 'website',
    lang,
    noindex: true,
  }
}

/** Every path the prerenderer emits as static HTML. */
export const PRERENDER_ROUTES = ['/', '/blog'] as const
