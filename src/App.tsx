import { BookOpen, ChevronRight, Cloud, FileText, Github, Home, Menu, Search } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import './styles.css'

const homeUrl = 'https://qeedu.tech'
const cloudUrl = 'https://cloud.qeedu.tech'
const githubUrl = 'https://github.com/turmwerk/qeedu'

type DocPage = {
  slug: string
  title: string
  description: string
  group: string
  content: string
}

const groups = [
  {
    title: '开始使用',
    pages: [
      'zh/getting-started/introduction',
      'zh/getting-started/quick-start',
      'zh/getting-started/key-concepts',
    ],
  },
  {
    title: '版本与商业模式',
    pages: ['zh/editions/community', 'zh/editions/cloud', 'zh/editions/education'],
  },
  {
    title: '部署与安全',
    pages: [
      'zh/deployment/overview',
      'zh/deployment/private-deployment',
      'zh/deployment/cloudflare-pages',
      'zh/deployment/environment-variables',
      'zh/security/data-boundary',
    ],
  },
  {
    title: '试点与交付',
    pages: [
      'zh/delivery/pilot-playbook',
      'zh/delivery/education-package',
      'zh/delivery/knowledge-base-init',
      'zh/delivery/success-metrics',
    ],
  },
  {
    title: '校园场景',
    pages: ['zh/scenarios/teachers', 'zh/scenarios/students', 'zh/scenarios/administration'],
  },
  {
    title: '路线图与 FAQ',
    pages: ['zh/roadmap/version-plan', 'zh/roadmap/faq'],
  },
  {
    title: 'API',
    pages: ['zh/api/overview'],
  },
  {
    title: 'English',
    pages: ['en/getting-started/introduction'],
  },
]

const mdxModules = {
  ...import.meta.glob<string>('../zh/**/*.mdx', { query: '?raw', import: 'default', eager: true }),
  ...import.meta.glob<string>('../en/**/*.mdx', { query: '?raw', import: 'default', eager: true }),
}

const groupBySlug = new Map(groups.flatMap((group) => group.pages.map((slug) => [slug, group.title])))
const orderBySlug = new Map(groups.flatMap((group) => group.pages.map((slug, index) => [slug, index])))

const pages: DocPage[] = Object.entries(mdxModules)
  .map(([path, source]) => {
    const slug = path.replace(/^\.\.\//, '').replace(/\.mdx$/, '')
    const parsed = parseMdx(source)

    return {
      slug,
      group: groupBySlug.get(slug) ?? '文档',
      ...parsed,
    }
  })
  .sort((a, b) => {
    const groupDiff = groups.findIndex((group) => group.title === a.group) - groups.findIndex((group) => group.title === b.group)

    if (groupDiff !== 0) {
      return groupDiff
    }

    return (orderBySlug.get(a.slug) ?? 999) - (orderBySlug.get(b.slug) ?? 999)
  })

const fallbackPage: DocPage = pages.find((page) => page.slug === 'zh/getting-started/introduction') ?? {
  slug: 'zh/getting-started/introduction',
  title: 'QeEdu Docs',
  description: '启育文档中心',
  group: '开始使用',
  content: '## 概览\n\n文档正在整理中。',
}

function parseMdx(source: string) {
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n?/)
  const metadata: Record<string, string> = {}

  if (frontmatter) {
    for (const line of frontmatter[1].split('\n')) {
      const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
      if (pair) {
        metadata[pair[1]] = pair[2].replace(/^["']|["']$/g, '')
      }
    }
  }

  return {
    title: metadata.title ?? 'Untitled',
    description: metadata.description ?? '',
    content: source.slice(frontmatter?.[0].length ?? 0).trim(),
  }
}

function AppLayout() {
  const location = useLocation()
  const current = pages.find((page) => `/${page.slug}` === location.pathname) ?? fallbackPage
  const headings = getHeadings(current.content)

  return (
    <div className="docs-app">
      <header className="topbar">
        <Link className="brand" to="/">
          <img className="brand-logo" src="/qeedu-logo.png" alt="" />
          <span>
            <strong>QeEdu Docs</strong>
            <small>启育文档中心</small>
          </span>
        </Link>
        <label className="search-box">
          <Search size={16} />
          <input placeholder="搜索文档" aria-label="搜索文档" />
        </label>
        <nav className="top-links">
          <a href={homeUrl}>
            <Home size={16} />
            官网
          </a>
          <a href={cloudUrl}>
            <Cloud size={16} />
            Cloud
          </a>
          <a href={githubUrl}>
            <Github size={16} />
            GitHub
          </a>
        </nav>
      </header>

      <div className="docs-layout">
        <aside className="sidebar">
          <div className="sidebar-title">
            <Menu size={16} />
            文档导航
          </div>
          {groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              {group.pages.map((slug) => {
                const page = pages.find((item) => item.slug === slug)
                if (!page) return null
                return (
                  <NavLink key={slug} to={`/${slug}`}>
                    <FileText size={15} />
                    {page.title}
                  </NavLink>
                )
              })}
            </section>
          ))}
        </aside>

        <main className="content">
          <Routes>
            <Route path="/" element={<DocArticle page={current} />} />
            {pages.map((page) => (
              <Route key={page.slug} path={`/${page.slug}`} element={<DocArticle page={page} />} />
            ))}
            <Route path="*" element={<DocArticle page={current} />} />
          </Routes>
        </main>

        <aside className="toc">
          <p>本页</p>
          {headings.map((heading) => (
            <a key={heading.id} href={`#${heading.id}`}>
              {heading.text}
            </a>
          ))}
        </aside>
      </div>
    </div>
  )
}

function DocArticle({ page }: { page: DocPage }) {
  return (
    <article className="doc-article">
      <div className="breadcrumbs">
        <BookOpen size={15} />
        <span>{page.group}</span>
        <ChevronRight size={14} />
        <span>{page.title}</span>
      </div>
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      <ReactMarkdown
        components={{
          h2: ({ children }) => {
            const text = flattenNodeText(children)
            return <h2 id={slugifyHeading(text)}>{children}</h2>
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {page.content}
      </ReactMarkdown>
    </article>
  )
}

function getHeadings(content: string) {
  return content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '').trim()
      return { text, id: slugifyHeading(text) }
    })
}

function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function flattenNodeText(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(flattenNodeText).join('')
  }

  return ''
}

export function App() {
  return <AppLayout />
}
