import { BookOpen, ChevronRight, FileText, Github, Home, Menu, Search } from 'lucide-react'
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

const pages: DocPage[] = []

const groups = [
  { title: '开始使用', pages: ['zh/getting-started/introduction'] },
]

function AppLayout() {
  const location = useLocation()
  const current = pages.find((page) => `/${page.slug}` === location.pathname) ?? pages[0]

  return (
    <div className="docs-app">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">Q</span>
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
          <a href={cloudUrl}>Cloud</a>
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
          <a href="#overview">概览</a>
          <a href="#next">下一步</a>
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
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{page.content}</ReactMarkdown>
    </article>
  )
}

export function App() {
  return <AppLayout />
}

