import {
  BrainCircuit,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Cloud,
  Copy,
  DatabaseZap,
  FileText,
  Github,
  GraduationCap,
  Home,
  Layers3,
  Menu,
  Rocket,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { isValidElement, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { FloatControls } from './components/FloatControls'
import './styles.css'

const homeUrl = 'https://qeedu.tech'
const cloudUrl = 'https://cloud.qeedu.tech'

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

const docsFlowSignals: Array<{ title: string; detail: string; metric: string; icon: IconComponent }> = [
  {
    title: '快速体验',
    detail: 'Cloud 试用、核心概念、版本边界',
    metric: 'Start',
    icon: Cloud,
  },
  {
    title: '部署路径',
    detail: '社区自部署、私有化、环境变量',
    metric: 'Deploy',
    icon: DatabaseZap,
  },
  {
    title: '校园试点',
    detail: '试点手册、知识库初始化、成效指标',
    metric: 'Pilot',
    icon: School,
  },
  {
    title: '安全复核',
    detail: '数据边界、权限隔离、人工确认',
    metric: 'Trust',
    icon: ShieldCheck,
  },
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

const landingHeadings = [
  { text: '快速开始', id: 'start-here' },
  { text: '阅读路径', id: 'reading-paths' },
  { text: '产品线地图', id: 'product-tracks' },
  { text: '试点与交付', id: 'delivery-docs' },
]

const docsCommandRuns: Array<{
  title: string
  command: string
  detail: string
  accent: 'mint' | 'blue' | 'amber' | 'violet'
  icon: IconComponent
  steps: string[]
  outputs: string[]
}> = [
  {
    title: '新用户快速试用',
    command: 'cloud.run --path quick-start',
    detail: '从 Cloud 入口、快速开始、核心概念到人工复核说明，形成第一次演示的最短路线。',
    accent: 'mint',
    icon: Cloud,
    steps: ['打开 Cloud', '选择校园场景', '确认输出边界'],
    outputs: ['快速开始', '核心概念', 'Cloud 版本'],
  },
  {
    title: '社区版自部署排障',
    command: 'deploy.trace --env gateway',
    detail: '把仓库、环境变量、模型网关和 Cloudflare Pages 发布顺序串起来，方便定位部署卡点。',
    accent: 'blue',
    icon: Github,
    steps: ['拉取仓库', '配置模型网关', '发布前端'],
    outputs: ['部署总览', '社区自部署', '环境变量'],
  },
  {
    title: '教育版试点准备',
    command: 'pilot.plan --scope college',
    detail: '把低风险场景、知识库初始化、培训交付和验收指标放在同一条试点准备线里。',
    accent: 'amber',
    icon: School,
    steps: ['确定试点部门', '整理校本资料', '定义成效指标'],
    outputs: ['试点手册', '知识库初始化', '教育版交付'],
  },
  {
    title: '安全审计问答',
    command: 'trust.review --human-in-loop',
    detail: '围绕数据边界、权限隔离、日志留痕和人工复核准备管理者常见问题回答。',
    accent: 'violet',
    icon: ShieldCheck,
    steps: ['划分数据边界', '确认权限隔离', '保留复核记录'],
    outputs: ['数据边界', '私有化部署', '成效指标'],
  },
]

const readingPaths: Array<{
  title: string
  desc: string
  icon: IconComponent
  accent: 'mint' | 'blue' | 'amber' | 'violet'
  docs: Array<{ label: string; href: string; note: string }>
  outcome: string
  checks: string[]
}> = [
  {
    title: 'Cloud 快速试用',
    desc: '面向第一次接触 QeEdu 的用户，先跑通登录、场景选择、任务输入和结果确认。',
    icon: Cloud,
    accent: 'mint',
    docs: [
      { label: '快速开始', href: '/zh/getting-started/quick-start', note: '5 分钟完成第一条任务' },
      { label: '核心概念', href: '/zh/getting-started/key-concepts', note: '理解智能体、知识库、人工复核' },
      { label: 'Cloud 版本', href: '/zh/editions/cloud', note: '明确托管服务边界' },
    ],
    outcome: '能独立完成一次云端演示，并知道哪些结果需要人工确认。',
    checks: ['账号与空间', '样例任务', '导出结果'],
  },
  {
    title: '社区版自部署',
    desc: '面向开发者和学生团队，从仓库、环境变量、模型配置到 Cloudflare Pages 发布。',
    icon: Github,
    accent: 'blue',
    docs: [
      { label: '部署总览', href: '/zh/deployment/overview', note: '理解前端、后端、网关分层' },
      { label: '社区自部署', href: '/zh/deployment/community-self-hosting', note: '本地或服务器启动' },
      { label: '环境变量', href: '/zh/deployment/environment-variables', note: '配置模型、域名、存储' },
    ],
    outcome: '能跑起社区版基础环境，并具备排查模型和前端部署问题的入口。',
    checks: ['仓库拉取', '模型网关', '前端发布'],
  },
  {
    title: '教育版试点',
    desc: '面向院系、实验室和创新创业平台，先定义低风险场景，再组织知识库和交付包。',
    icon: School,
    accent: 'amber',
    docs: [
      { label: '试点手册', href: '/zh/delivery/pilot-playbook', note: '确定部门、场景、指标' },
      { label: '教育版交付', href: '/zh/delivery/education-package', note: '部署、模板、培训、复盘' },
      { label: '知识库初始化', href: '/zh/delivery/knowledge-base-init', note: '整理制度、模板、FAQ、案例' },
    ],
    outcome: '能把“想试 AI”转成可执行的试点范围、交付清单和验收指标。',
    checks: ['试点边界', '校本资料', '成效指标'],
  },
  {
    title: '安全与审计',
    desc: '面向管理者和技术负责人，把数据边界、权限、日志、模型接入和人工确认讲清楚。',
    icon: ShieldCheck,
    accent: 'violet',
    docs: [
      { label: '数据边界', href: '/zh/security/data-boundary', note: '区分云端、团队、私有化' },
      { label: '私有化部署', href: '/zh/deployment/private-deployment', note: '校内环境和模型网关' },
      { label: '成效指标', href: '/zh/delivery/success-metrics', note: '结合调用、复核、反馈复盘' },
    ],
    outcome: '能回答试点前最常见的数据安全、责任边界和复核机制问题。',
    checks: ['权限隔离', '日志留痕', '人工复核'],
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

const dynamicButtonSelector = [
  '.landing-primary',
  '.landing-secondary',
  '.sidebar section a',
  '.docs-command-center__tabs button',
  '.reading-path-lab__nav button',
  '.track-lab__nav button',
  '.mobile-header__button',
  '.float-controls__button',
  '.scroll-spy__nav button',
  '.route-path a',
  '.md-code-copy',
].join(', ')

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

function useDynamicButtonEffects() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!finePointer.matches || reduceMotion.matches) {
      return undefined
    }

    let activeButton: HTMLElement | null = null

    function getButton(target: EventTarget | null) {
      if (!(target instanceof Element)) {
        return null
      }

      return target.closest(dynamicButtonSelector) as HTMLElement | null
    }

    function clearActiveButton() {
      activeButton?.classList.remove('is-button-lit')
      activeButton = null
    }

    function onPointerMove(event: PointerEvent) {
      const button = getButton(event.target)

      if (!button) {
        clearActiveButton()
        return
      }

      const rect = button.getBoundingClientRect()
      button.style.setProperty('--button-x', `${event.clientX - rect.left}px`)
      button.style.setProperty('--button-y', `${event.clientY - rect.top}px`)

      if (activeButton && activeButton !== button) {
        activeButton.classList.remove('is-button-lit')
      }

      activeButton = button
      button.classList.add('is-button-lit')
    }

    function onPointerDown(event: PointerEvent) {
      const button = getButton(event.target)
      if (!button) {
        return
      }

      button.classList.remove('is-button-tapped')
      void button.offsetWidth
      button.classList.add('is-button-tapped')
      window.setTimeout(() => button.classList.remove('is-button-tapped'), 420)
    }

    function onPointerOut(event: PointerEvent) {
      if (!event.relatedTarget) {
        clearActiveButton()
      }
    }

    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('blur', clearActiveButton)

    return () => {
      clearActiveButton()
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', clearActiveButton)
    }
  }, [])
}

function AppLayout() {
  useDynamicButtonEffects()

  const location = useLocation()
  const previousPath = useRef(location.pathname)
  const isLanding = location.pathname === '/'
  const current = pages.find((page) => `/${page.slug}` === location.pathname) ?? fallbackPage
  const headings = isLanding ? landingHeadings : getHeadings(current.content)
  const [navOpen, setNavOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    setNavOpen(false)
    setTocOpen(false)

    if (previousPath.current !== location.pathname) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      previousPath.current = location.pathname
    }
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
      <DocsProgress />
      <FloatControls />
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
      <RoutePathBar key={location.pathname} isLanding={isLanding} page={current} />

      {(navOpen || tocOpen) && (
        <button className="drawer-overlay" type="button" aria-label="关闭菜单" onClick={closeDrawers} />
      )}

      <aside className={navOpen ? 'mobile-drawer is-open' : 'mobile-drawer'} aria-label="移动端菜单">
        <DocsSidebar isLanding={isLanding} page={current} onNavigate={() => setNavOpen(false)} />
      </aside>

      <aside className={tocOpen ? 'mobile-toc-drawer is-open' : 'mobile-toc-drawer'} aria-label="移动端本页目录">
        <Toc headings={headings} onNavigate={() => setTocOpen(false)} mobile />
      </aside>

      <div className="docs-layout">
        <DocsSidebar isLanding={isLanding} page={current} />

        <main className="content">
          <div className="content__page" key={location.pathname}>
            <Routes>
              <Route path="/" element={<DocsLanding pageCount={pages.length} groupCount={groups.length} />} />
              {pages.map((page) => (
                <Route key={page.slug} path={`/${page.slug}`} element={<DocArticle page={page} />} />
              ))}
              <Route path="*" element={<DocArticle page={current} />} />
            </Routes>
          </div>
        </main>

        {isLanding ? <DocsLandingAside /> : <Toc headings={headings} />}
      </div>
    </div>
  )
}

function DocsProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setProgress(maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="docs-progress" aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
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
      <a href="#reading-paths">阅读路径</a>
      <a href="#product-tracks">产品线地图</a>
      <a href="#delivery-docs">试点与交付</a>
    </aside>
  )
}

function RoutePathBar({ page, isLanding }: { page: DocPage; isLanding: boolean }) {
  const groupStartSlug = groups.find((group) => group.title === page.group)?.pages[0]
  const groupHref = isLanding || !groupStartSlug ? '/' : `/${groupStartSlug}`
  const pageHref = isLanding ? '/' : `/${page.slug}`

  return (
    <nav className="route-path" aria-label="当前页面路径">
      <Link to={groupHref}>{isLanding ? '文档中心' : page.group}</Link>
      <ChevronRight size={14} />
      <Link aria-current="page" className="route-path__current" to={pageHref}>
        {isLanding ? '首页' : page.title}
      </Link>
    </nav>
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
          <div className="landing-flow-map" aria-label="文档任务流">
            <div className="landing-flow-map__grid" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span key={`docs-flow-dot-${index}`} />
              ))}
            </div>
            <div className="landing-flow-map__status">
              <span>live map</span>
              <strong>阅读到交付的文档链路</strong>
            </div>
            <div className="landing-flow-map__steps">
              {docsFlowSignals.map((signal, index) => (
                <article key={signal.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <signal.icon size={17} />
                  <div>
                    <strong>{signal.title}</strong>
                    <small>{signal.detail}</small>
                  </div>
                  <em>{signal.metric}</em>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <DocsCommandCenter pageCount={pageCount} groupCount={groupCount} />

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

      <ReadingPathLab />

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
        <div className="track-lab__panel" key={activeTrack.title}>
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

function DocsCommandCenter({ pageCount, groupCount }: { pageCount: number; groupCount: number }) {
  const [activeRunIndex, setActiveRunIndex] = useState(0)
  const activeRun = docsCommandRuns[activeRunIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRunIndex((index) => (index + 1) % docsCommandRuns.length)
    }, 3400)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className={`docs-command-center accent-${activeRun.accent}`} aria-label="文档操作态势">
      <div className="docs-command-center__copy">
        <span>Docs Command</span>
        <h2>把阅读入口组织成可执行的文档任务</h2>
        <p>每条路线都对应一个实际交付动作：试用、部署、试点或安全复核。用户不需要在目录里盲找，先选目标，再进入文档链路。</p>
        <div className="docs-command-center__metrics">
          <strong>
            {pageCount}
            <small>文档页</small>
          </strong>
          <strong>
            {groupCount}
            <small>导航分组</small>
          </strong>
          <strong>
            {docsCommandRuns.length}
            <small>任务路线</small>
          </strong>
        </div>
      </div>
      <div className="docs-command-center__screen">
        <div className="docs-command-center__bar">
          <span />
          <span />
          <span />
          <strong>{activeRun.command}</strong>
        </div>
        <div className="docs-command-center__map" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <span key={`docs-command-node-${index}`} />
          ))}
        </div>
        <div className="docs-command-center__tabs">
          {docsCommandRuns.map((run, index) => (
            <button
              className={index === activeRunIndex ? 'active' : undefined}
              key={run.title}
              type="button"
              onClick={() => setActiveRunIndex(index)}
            >
              <run.icon size={16} />
              {run.title}
            </button>
          ))}
        </div>
        <div className="docs-command-center__run" key={activeRun.title}>
          <div>
            <activeRun.icon size={26} />
            <span>{activeRun.command}</span>
          </div>
          <h3>{activeRun.title}</h3>
          <p>{activeRun.detail}</p>
          <div className="docs-command-center__steps">
            {activeRun.steps.map((step, index) => (
              <span key={step}>
                {String(index + 1).padStart(2, '0')}
                <em>{step}</em>
              </span>
            ))}
          </div>
          <div className="docs-command-center__outputs">
            {activeRun.outputs.map((output) => (
              <strong key={output}>{output}</strong>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ReadingPathLab() {
  const [activePathIndex, setActivePathIndex] = useState(0)
  const activePath = readingPaths[activePathIndex]

  return (
    <section className={`reading-path-lab accent-${activePath.accent}`} id="reading-paths" aria-label="文档阅读路径">
      <div className="landing-section__head">
        <span>Reading Paths</span>
        <h2>按目标选择阅读路线</h2>
      </div>
      <div className="reading-path-lab__shell">
        <div className="reading-path-lab__nav">
          {readingPaths.map((path, index) => (
            <button
              className={index === activePathIndex ? 'active' : undefined}
              key={path.title}
              type="button"
              onClick={() => setActivePathIndex(index)}
            >
              <path.icon size={18} />
              <span>{path.title}</span>
            </button>
          ))}
        </div>
        <div className="reading-path-lab__panel" key={activePath.title}>
          <div className="reading-path-lab__copy">
            <span>{activePath.title}</span>
            <h3>{activePath.desc}</h3>
            <p>{activePath.outcome}</p>
            <div>
              {activePath.checks.map((check) => (
                <strong key={check}>{check}</strong>
              ))}
            </div>
          </div>
          <div className="reading-path-lab__steps">
            {activePath.docs.map((doc, index) => (
              <Link key={doc.href} to={doc.href}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{doc.label}</strong>
                <small>{doc.note}</small>
                <ChevronRight size={15} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MobileHeader({ onOpenNav, onOpenToc }: { onOpenNav: () => void; onOpenToc: () => void }) {
  return (
    <header className="mobile-header">
      <button className="mobile-header__button" type="button" aria-label="打开菜单" onClick={onOpenNav}>
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

function DocsSidebar({ page, isLanding, onNavigate }: { page: DocPage; isLanding: boolean; onNavigate?: () => void }) {
  const currentHeadings = isLanding ? landingHeadings : getHeadings(page.content).slice(0, 5)
  const currentIndex = pages.findIndex((item) => item.slug === page.slug)
  const nextPage = !isLanding && currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined

  return (
    <aside className="sidebar">
      <Link className="sidebar-profile" to="/" onClick={onNavigate}>
        <span>
          <strong>QeEdu Docs</strong>
          <small>启育文档中心</small>
        </span>
      </Link>
      {currentHeadings.length > 0 && (
        <section className="sidebar-page-context" aria-label="本页目录">
          <h2>本页目录</h2>
          {currentHeadings.map((heading, index) => (
            <a href={`#${heading.id}`} key={heading.id} onClick={onNavigate}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {heading.text}
            </a>
          ))}
          {nextPage && (
            <Link className="sidebar-page-context__next" to={`/${nextPage.slug}`} onClick={onNavigate}>
              <span>Next</span>
              {nextPage.title}
            </Link>
          )}
        </section>
      )}
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

      const threshold = window.scrollY + (mobile ? 118 : 56)
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

    const offset = mobile ? 118 : 56
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

type MarkdownElementProps = {
  children?: React.ReactNode
  className?: string
}

function flattenMarkdownText(value: React.ReactNode): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(flattenMarkdownText).join('')
  }

  if (isValidElement<MarkdownElementProps>(value)) {
    return flattenMarkdownText(value.props.children)
  }

  return ''
}

function readCodeBlock(children: React.ReactNode) {
  const firstChild = Array.isArray(children) ? children.find((child) => isValidElement(child)) : children
  const className = isValidElement<MarkdownElementProps>(firstChild) ? firstChild.props.className ?? '' : ''
  const language = className.match(/language-([^\s]+)/)?.[1] ?? ''
  const code = flattenMarkdownText(children).replace(/\n$/, '')

  return { code, language }
}

async function writeClipboardText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = value
    textArea.setAttribute('readonly', 'true')
    textArea.style.position = 'fixed'
    textArea.style.top = '-9999px'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.select()

    try {
      return document.execCommand('copy')
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

function MarkdownPre({ children }: { children?: React.ReactNode }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const resetTimer = useRef<number | undefined>(undefined)
  const { code, language } = readCodeBlock(children)

  useEffect(() => {
    return () => window.clearTimeout(resetTimer.current)
  }, [])

  async function copyCode() {
    if (!code) {
      return
    }

    window.clearTimeout(resetTimer.current)

    try {
      const copied = await writeClipboardText(code)
      if (!copied) {
        throw new Error('copy failed')
      }
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }

    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 1600)
  }

  const copyLabel = copyState === 'copied' ? '已复制' : copyState === 'failed' ? '失败' : '复制'

  return (
    <div className="md-code-block">
      {language && <span className="md-code-lang">{language}</span>}
      <button
        className={copyState === 'idle' ? 'md-code-copy' : `md-code-copy is-${copyState}`}
        disabled={!code}
        type="button"
        onClick={copyCode}
      >
        {copyState === 'copied' ? <Check size={14} /> : <Copy size={14} />}
        {copyLabel}
      </button>
      <pre>{children}</pre>
    </div>
  )
}

function DocArticle({ page }: { page: DocPage }) {
  const currentIndex = pages.findIndex((item) => item.slug === page.slug)
  const previousPage = currentIndex > 0 ? pages[currentIndex - 1] : undefined
  const nextPage = currentIndex >= 0 && currentIndex < pages.length - 1 ? pages[currentIndex + 1] : undefined
  const relatedPages = pages.filter((item) => item.group === page.group && item.slug !== page.slug).slice(0, 3)
  const articleHeadings = getHeadings(page.content).slice(0, 4)
  const readingMinutes = estimateReadingMinutes(page.content)

  return (
    <article className="doc-article">
      <h1>{page.title}</h1>
      <p className="lead">{page.description}</p>
      <div className="article-top-meta" aria-label="阅读信息">
        <span>
          <strong>{readingMinutes}</strong>
          分钟阅读
        </span>
        <span>{page.group}</span>
        <span>{articleHeadings.length} 个重点</span>
      </div>
      <ReactMarkdown
        components={{
          h2: ({ children }) => {
            const text = flattenNodeText(children)
            return <h2 id={slugifyHeading(text)}>{children}</h2>
          },
          pre: ({ children }) => <MarkdownPre>{children}</MarkdownPre>,
        }}
        remarkPlugins={[remarkGfm]}
      >
        {page.content}
      </ReactMarkdown>
      <DocFooterNav previousPage={previousPage} nextPage={nextPage} relatedPages={relatedPages} />
    </article>
  )
}

function DocFooterNav({
  previousPage,
  nextPage,
  relatedPages,
}: {
  previousPage?: DocPage
  nextPage?: DocPage
  relatedPages: DocPage[]
}) {
  return (
    <footer className="doc-footer-nav" aria-label="继续阅读">
      {(previousPage || nextPage) && (
        <div className="doc-footer-nav__pager">
          {previousPage ? (
            <Link to={`/${previousPage.slug}`}>
              <span>上一篇</span>
              <strong>{previousPage.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {nextPage ? (
            <Link to={`/${nextPage.slug}`}>
              <span>下一篇</span>
              <strong>{nextPage.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
      {relatedPages.length > 0 && (
        <section className="doc-related">
          <div>
            <span>Related</span>
            <h2>继续阅读同组文档</h2>
          </div>
          <div>
            {relatedPages.map((related) => (
              <Link key={related.slug} to={`/${related.slug}`}>
                <FileText size={17} />
                <strong>{related.title}</strong>
                <small>{related.description}</small>
              </Link>
            ))}
          </div>
        </section>
      )}
    </footer>
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

function stripMarkdown(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[`*_>~-]/g, ' ')
}

function estimateReadingMinutes(content: string) {
  const normalized = stripMarkdown(content).replace(/\s+/g, '')
  return Math.max(2, Math.ceil(normalized.length / 520))
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
