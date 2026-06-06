import {
  BookOpen,
  BrainCircuit,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Cloud,
  DatabaseZap,
  FileText,
  Github,
  GraduationCap,
  Home,
  Layers3,
  Menu,
  Rocket,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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

type IconComponent = React.ComponentType<{ size?: number }>

const landingStats = [
  { value: '5', label: '产品线', desc: '助国际、助教、助管、助研、助学' },
  { value: '20+', label: '场景模块', desc: '来自 edu-ai 的真实模块目录' },
  { value: '3', label: '版本路径', desc: 'Community、Cloud、Education' },
]

const quickStartCards: Array<{ title: string; desc: string; href: string; icon: IconComponent }> = [
  {
    title: '5 分钟试用 Cloud',
    desc: '先从云端体验登录、选择场景、输入任务、查看 AI 输出和人工确认。',
    href: '/zh/getting-started/quick-start',
    icon: Cloud,
  },
  {
    title: '理解核心概念',
    desc: '梳理智能体、知识库、模板、工作流、人工复核和私有化部署边界。',
    href: '/zh/getting-started/key-concepts',
    icon: Layers3,
  },
  {
    title: '规划教育版试点',
    desc: '从低风险高频任务切入，定义试点部门、知识库范围、指标和交付清单。',
    href: '/zh/delivery/pilot-playbook',
    icon: Rocket,
  },
]

const productTracks: Array<{
  title: string
  subtitle: string
  desc: string
  icon: IconComponent
  href: string
  accent: 'blue' | 'mint' | 'amber' | 'violet' | 'coral'
  modules: string[]
}> = [
  {
    title: '助国际',
    subtitle: '交换申请、派出支持、返校沉淀',
    desc: '对齐 edu-ai 国际交流模块，覆盖项目中心、智能匹配、流程推进、多语言沟通、行前行后支持。',
    icon: School,
    href: '/zh/scenarios/students',
    accent: 'blue',
    modules: ['项目中心', '项目匹配', '流程助手', '邮件助手', '行前准备', '跨文化培训', '在外支持', '回国收尾', '来华支持'],
  },
  {
    title: '助教',
    subtitle: '大纲、试卷、作业反馈',
    desc: '面向教师的课程建设入口，把教学目标、题库结构、评分标准和反馈草稿沉淀成模板。',
    icon: GraduationCap,
    href: '/zh/scenarios/teachers',
    accent: 'mint',
    modules: ['大纲生成', '试卷设计', '作业批改与反馈'],
  },
  {
    title: '助管',
    subtitle: '事务、公告、材料、节点',
    desc: '服务辅导员和行政人员，把流程说明、通知公告、材料管理、学生问答和进度看板串起来。',
    icon: Building2,
    href: '/zh/scenarios/administration',
    accent: 'amber',
    modules: ['事务处理助手', '通知与公告生成', '材料与表单管理', '学生问答助手', '数据统计与看板', '时间节点管理'],
  },
  {
    title: '助研',
    subtitle: '检索、精读、写作',
    desc: '围绕科研任务组织检索式、筛选记录、结构化阅读卡、证据矩阵和章节草稿。',
    icon: BrainCircuit,
    href: '/zh/scenarios/teachers',
    accent: 'violet',
    modules: ['文献检索', '论文精读', '论文写作'],
  },
  {
    title: '助学',
    subtitle: '资源、进度、生涯',
    desc: '面向学生成长，把学院资源、培养方案、学分进度和目标画像转成阶段性行动。',
    icon: Users,
    href: '/zh/scenarios/students',
    accent: 'coral',
    modules: ['学科资源包', '学业进度雷达', '智能生涯规划'],
  },
]

const deliveryLanes: Array<{ title: string; desc: string; icon: IconComponent; href: string }> = [
  {
    title: '数据边界',
    desc: '区分 Cloud 体验、社区自部署和教育版私有化环境，明确哪些数据适合进入 AI 流程。',
    icon: ShieldCheck,
    href: '/zh/security/data-boundary',
  },
  {
    title: '知识库初始化',
    desc: '把制度文件、模板、FAQ、历史案例和课程材料整理成可检索、可引用的资料底座。',
    icon: DatabaseZap,
    href: '/zh/delivery/knowledge-base-init',
  },
  {
    title: '成效指标',
    desc: '用生成时间、修改比例、复用次数、问题反馈和人工复核记录判断试点是否值得扩大。',
    icon: Check,
    href: '/zh/delivery/success-metrics',
  },
]

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
      'zh/deployment/community-self-hosting',
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
  const isLanding = location.pathname === '/'
  const current = pages.find((page) => `/${page.slug}` === location.pathname) ?? fallbackPage
  const headings = isLanding ? [] : getHeadings(current.content)
  const [navOpen, setNavOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
    setTocOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const drawersOpen = navOpen || tocOpen
    const previousOverflow = document.body.style.overflow

    function onKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setNavOpen(false)
        setTocOpen(false)
      }
    }

    if (drawersOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
    }

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeydown)
    }
  }, [navOpen, tocOpen])

  function closeDrawers() {
    setNavOpen(false)
    setTocOpen(false)
  }

  return (
    <div className="docs-app">
      <MobileHeader
        onOpenNav={() => {
          setTocOpen(false)
          setNavOpen(true)
        }}
        onOpenToc={() => {
          setNavOpen(false)
          setTocOpen(true)
        }}
      />

      {(navOpen || tocOpen) && (
        <button className="drawer-overlay" type="button" aria-label="关闭菜单" onClick={closeDrawers} />
      )}

      <aside className={navOpen ? 'mobile-drawer is-open' : 'mobile-drawer'} aria-label="移动端文档导航">
        <DocsSidebar onNavigate={() => setNavOpen(false)} />
      </aside>

      <aside className={tocOpen ? 'mobile-toc-drawer is-open' : 'mobile-toc-drawer'} aria-label="移动端本页目录">
        <Toc headings={headings} onNavigate={() => setTocOpen(false)} mobile />
      </aside>

      <header className="topbar">
        <DocsSearch />
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
        <DocsSidebar />

        <main className="content">
          <Routes>
            <Route path="/" element={<DocsLanding pageCount={pages.length} groupCount={groups.length} />} />
            {pages.map((page) => (
              <Route key={page.slug} path={`/${page.slug}`} element={<DocArticle page={page} />} />
            ))}
            <Route path="*" element={<DocArticle page={current} />} />
          </Routes>
        </main>

        {isLanding ? <DocsLandingAside /> : <Toc headings={headings} />}
      </div>
    </div>
  )
}

function DocsLandingAside() {
  return (
    <aside className="landing-aside" aria-label="文档路线">
      <div className="landing-aside__progress">
        <span />
        <strong>Docs Map</strong>
      </div>
      <a href="#start-here">快速开始</a>
      <a href="#product-tracks">产品线地图</a>
      <a href="#delivery-docs">试点与交付</a>
    </aside>
  )
}

function DocsLanding({ pageCount, groupCount }: { pageCount: number; groupCount: number }) {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const activeTrack = productTracks[activeTrackIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTrackIndex((index) => (index + 1) % productTracks.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <article className="docs-landing">
      <section className="docs-landing-hero">
        <div>
          <span className="landing-pill">
            <Sparkles size={16} />
            QeEdu Docs
          </span>
          <h1>从产品体验到校园试点，文档按真实交付路径组织</h1>
          <p>
            这里不只是功能说明，而是把 edu-ai 项目里的助国际、助教、助管、助研、助学模块，
            拆成快速开始、场景说明、部署安全和试点交付四类文档入口。
          </p>
          <div className="landing-actions">
            <a className="landing-primary" href={cloudUrl}>
              <Cloud size={18} />
              打开 Cloud
            </a>
            <a className="landing-secondary" href={homeUrl}>
              <Home size={18} />
              返回官网
            </a>
          </div>
        </div>
        <div className="landing-console" aria-label="文档覆盖范围">
          <div className="landing-console__bar">
            <span />
            <span />
            <span />
            <strong>Docs Coverage</strong>
          </div>
          <div className="landing-stats">
            {[...landingStats, { value: String(pageCount), label: '文档页', desc: `${groupCount} 个导航分组` }].map((item) => (
              <article key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="start-here">
        <div className="landing-section__head">
          <span>Start Here</span>
          <h2>先读这三类文档</h2>
        </div>
        <div className="quick-card-grid">
          {quickStartCards.map((card) => (
            <Link className="quick-card" key={card.title} to={card.href}>
              <card.icon size={22} />
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <span>
                进入文档
                <ChevronRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`track-lab accent-${activeTrack.accent}`} id="product-tracks" aria-label="edu-ai 产品线文档地图">
        <div className="track-lab__nav">
          {productTracks.map((track, index) => (
            <button
              className={index === activeTrackIndex ? 'active' : undefined}
              key={track.title}
              type="button"
              onClick={() => setActiveTrackIndex(index)}
            >
              <track.icon size={18} />
              {track.title}
            </button>
          ))}
        </div>
        <div className="track-lab__panel">
          <div className="track-lab__copy">
            <span>{activeTrack.subtitle}</span>
            <h2>{activeTrack.title}</h2>
            <p>{activeTrack.desc}</p>
            <Link to={activeTrack.href}>
              查看相关场景
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="track-module-map">
            {activeTrack.modules.map((module, index) => (
              <div key={module}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{module}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="delivery-lanes" id="delivery-docs">
        <div className="landing-section__head">
          <span>Delivery</span>
          <h2>试点、部署、安全要一起读</h2>
        </div>
        <div className="delivery-lane-grid">
          {deliveryLanes.map((lane) => (
            <Link className="delivery-lane" key={lane.title} to={lane.href}>
              <lane.icon size={22} />
              <h3>{lane.title}</h3>
              <p>{lane.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  )
}

function MobileHeader({ onOpenNav, onOpenToc }: { onOpenNav: () => void; onOpenToc: () => void }) {
  return (
    <header className="mobile-header">
      <button className="mobile-header__button" type="button" aria-label="打开文档导航" onClick={onOpenNav}>
        <Menu size={22} />
      </button>
      <Link className="mobile-header__brand" to="/">
        <img className="brand-logo" src="/qeedu-logo.png" alt="" />
        <span>QeEdu Docs</span>
      </Link>
      <button className="mobile-header__button" type="button" aria-label="打开本页目录" onClick={onOpenToc}>
        <CalendarDays size={21} />
      </button>
    </header>
  )
}

function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="sidebar">
      <Link className="sidebar-profile" to="/" onClick={onNavigate}>
        <img className="sidebar-profile__logo" src="/qeedu-logo.png" alt="" />
        <span>
          <strong>QeEdu Docs</strong>
          <small>启育文档中心</small>
        </span>
      </Link>
      <div className="sidebar-title">
        <Menu size={16} />
        文档导航
      </div>
      <DocsSearch compact />
      {groups.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          {group.pages.map((slug) => {
            const page = pages.find((item) => item.slug === slug)
            if (!page) return null
            return (
              <NavLink key={slug} to={`/${slug}`} onClick={onNavigate}>
                <FileText size={15} />
                {page.title}
              </NavLink>
            )
          })}
        </section>
      ))}
    </aside>
  )
}

function DocsSearch({ compact = false }: { compact?: boolean }) {
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const normalizedQuery = normalizeSearchText(query)
  const results = useMemo(() => searchPages(query), [query])
  const quickLinks = useMemo(
    () =>
      [
        'zh/getting-started/quick-start',
        'zh/deployment/community-self-hosting',
        'zh/delivery/pilot-playbook',
        'zh/security/data-boundary',
      ]
        .map((slug) => pages.find((page) => page.slug === slug))
        .filter((page): page is DocPage => Boolean(page)),
    [],
  )

  useEffect(() => {
    setPanelOpen(false)
  }, [location.pathname])

  function closeLater() {
    window.setTimeout(() => setPanelOpen(false), 120)
  }

  return (
    <div className={compact ? 'search-box search-box--compact' : 'search-box'} onBlur={closeLater}>
      <label className="search-box__input">
        <Search size={16} />
        <input
          value={query}
          placeholder={compact ? '搜索' : '搜索文档、部署、安全、场景'}
          aria-label="搜索文档"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setPanelOpen(true)}
        />
      </label>
      {panelOpen && (
        <div className="search-results" role="region" aria-label="文档搜索结果">
          {normalizedQuery ? (
            <>
              <div className="search-results__meta">
                <strong>{results.length ? `${results.length} 个结果` : '没有匹配结果'}</strong>
                <span>{query}</span>
              </div>
              {results.length > 0 ? (
                results.map(({ page, excerpt }) => (
                  <Link className="search-result" key={page.slug} to={`/${page.slug}`}>
                    <span>{page.group}</span>
                    <strong>{page.title}</strong>
                    <p>{excerpt}</p>
                  </Link>
                ))
              ) : (
                <div className="search-empty">
                  <p>换一个关键词试试，例如“私有化”、“知识库”、“Cloud”或“数据边界”。</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="search-results__meta">
                <strong>常用入口</strong>
                <span>快速跳转</span>
              </div>
              {quickLinks.map((page) => (
                <Link className="search-result" key={page.slug} to={`/${page.slug}`}>
                  <span>{page.group}</span>
                  <strong>{page.title}</strong>
                  <p>{page.description}</p>
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Toc({
  headings,
  mobile = false,
  onNavigate,
}: {
  headings: Array<{ text: string; id: string }>
  mobile?: boolean
  onNavigate?: () => void
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setActiveId(headings[0]?.id ?? '')

    function updateScrollState() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max))
      setProgress(Math.round(ratio * 100))

      const threshold = window.scrollY + (mobile ? 72 : 110)
      let current = headings[0]?.id ?? ''

      for (const heading of headings) {
        const el = document.getElementById(heading.id)
        if (!el) {
          continue
        }

        const top = el.getBoundingClientRect().top + window.scrollY
        if (top > threshold) {
          break
        }
        current = heading.id
      }

      setActiveId(current)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [headings, mobile])

  function scrollToHeading(id: string) {
    const el = document.getElementById(id)
    if (!el) {
      return
    }

    const offset = mobile ? 72 : 110
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
    onNavigate?.()
  }

  return (
    <aside className={mobile ? 'scroll-spy scroll-spy--mobile' : 'scroll-spy'}>
      <div className="scroll-spy__status">
        <div className="scroll-spy__progress">
          <div className="scroll-spy__bar">
            <span style={{ height: `${progress}%` }} />
          </div>
          <span className="scroll-spy__percent">{progress}%</span>
        </div>
      </div>
      <nav className="scroll-spy__nav" aria-label="本页目录">
        {headings.map((heading) => (
          <button
            className={heading.id === activeId ? 'is-active' : undefined}
            key={heading.id}
            type="button"
            onClick={() => scrollToHeading(heading.id)}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </aside>
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

function searchPages(query: string) {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean)

  if (terms.length === 0) {
    return []
  }

  return pages
    .map((page) => {
      const title = normalizeSearchText(page.title)
      const description = normalizeSearchText(page.description)
      const group = normalizeSearchText(page.group)
      const content = normalizeSearchText(stripMarkdown(page.content))
      const slug = normalizeSearchText(page.slug)
      const haystack = `${title} ${description} ${group} ${content} ${slug}`
      let score = 0

      for (const term of terms) {
        if (title.includes(term)) score += 8
        if (description.includes(term)) score += 4
        if (group.includes(term)) score += 3
        if (slug.includes(term)) score += 2
        if (content.includes(term)) score += 1
        if (!haystack.includes(term)) score -= 2
      }

      return {
        page,
        score,
        excerpt: createSearchExcerpt(page, terms),
      }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
    .slice(0, 7)
}

function createSearchExcerpt(page: DocPage, terms: string[]) {
  const body = stripMarkdown(page.content).replace(/\s+/g, ' ').trim()
  const normalizedBody = normalizeSearchText(body)
  const hitIndex = terms
    .map((term) => normalizedBody.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0]

  if (hitIndex === undefined) {
    return page.description || body.slice(0, 96)
  }

  const start = Math.max(0, hitIndex - 36)
  const excerpt = body.slice(start, start + 116)
  return `${start > 0 ? '...' : ''}${excerpt}${start + 116 < body.length ? '...' : ''}`
}

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>~-]/g, ' ')
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
