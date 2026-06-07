import { ArrowUp, Languages, Moon, Settings, Snowflake, Sun } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type Theme = 'dark' | 'light'

const themeStorageKey = 'qeedu-docs-theme'
const snowEffectStorageKey = 'qeedu-docs-snow-effect'

const docsLanguageLinks = [
  { code: 'zh', label: 'CN', name: '简体中文', href: '/zh/getting-started/introduction' },
  { code: 'en', label: 'EN', name: 'English', href: '/en/getting-started/introduction' },
]

const landingLanguageLinks = [
  { code: 'zh', label: 'CN', name: '简体中文', href: '/' },
  { code: 'en', label: 'EN', name: 'English', href: '/en' },
]

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.localStorage.getItem(themeStorageKey) === 'light' ? 'light' : 'dark'
}

function readStoredSnowEffect() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(snowEffectStorageKey) === 'true'
}

type SnowParticle = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  opacity: number
}

function SnowEffect({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) {
      return undefined
    }

    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      return undefined
    }

    const canvasEl: HTMLCanvasElement = canvas
    const context: CanvasRenderingContext2D = ctx
    let frameId = 0
    let resizeTimer = 0
    let width = 0
    let height = 0
    let dpr = 1
    let particles: SnowParticle[] = []
    const mouse = { active: false, x: -99999, y: -99999 }

    function random(min: number, max: number) {
      return min + Math.random() * (max - min)
    }

    function createParticle(initial = false): SnowParticle {
      const radius = random(1.4, 4.2)
      return {
        x: random(0, width / dpr),
        y: initial ? random(-20, height / dpr) : random(-20, -radius),
        r: radius,
        vx: random(-0.38, 0.38),
        vy: random(0.28, 0.82),
        opacity: random(0.34, 0.78),
      }
    }

    function targetCount() {
      const area = (width / dpr) * (height / dpr)
      return Math.max(18, Math.round((72 * area) / 800000))
    }

    function resize() {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth * dpr
      height = window.innerHeight * dpr
      canvasEl.width = width
      canvasEl.height = height
      canvasEl.style.width = `${window.innerWidth}px`
      canvasEl.style.height = `${window.innerHeight}px`
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.scale(dpr, dpr)

      const expected = targetCount()
      while (particles.length < expected) particles.push(createParticle(true))
      if (particles.length > expected) particles = particles.slice(0, expected)
    }

    function drawFrame() {
      const logicalWidth = width / dpr
      const logicalHeight = height / dpr
      context.clearRect(0, 0, logicalWidth, logicalHeight)

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -particle.r) particle.x = logicalWidth + particle.r
        if (particle.x > logicalWidth + particle.r) particle.x = -particle.r
        if (particle.y - particle.r > logicalHeight) {
          particle.x = random(0, logicalWidth)
          particle.y = random(-20, -particle.r)
        }
      }

      if (mouse.active) {
        const maxDistance = 132
        const maxDistanceSq = maxDistance * maxDistance
        for (const particle of particles) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distanceSq = dx * dx + dy * dy
          if (distanceSq > maxDistanceSq) continue
          const ratio = 1 - distanceSq / maxDistanceSq
          context.beginPath()
          context.moveTo(mouse.x, mouse.y)
          context.lineTo(particle.x, particle.y)
          context.strokeStyle = `rgba(255,255,255,${(0.42 * ratio).toFixed(3)})`
          context.lineWidth = 1
          context.stroke()
        }
      }

      for (const particle of particles) {
        context.beginPath()
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        context.fillStyle = `rgba(255,255,255,${particle.opacity.toFixed(2)})`
        context.fill()
      }

      frameId = window.requestAnimationFrame(drawFrame)
    }

    function onMouseMove(event: MouseEvent) {
      mouse.active = true
      mouse.x = event.clientX
      mouse.y = event.clientY
    }

    function onMouseLeave() {
      mouse.active = false
    }

    function onResize() {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 120)
    }

    resize()
    frameId = window.requestAnimationFrame(drawFrame)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return <canvas ref={canvasRef} className="docs-snow-canvas" aria-hidden="true" />
}

export function FloatControls() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())
  const [snowEffect, setSnowEffect] = useState(() => readStoredSnowEffect())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('docs-snow-enabled', snowEffect)
    window.localStorage.setItem(snowEffectStorageKey, String(snowEffect))
  }, [snowEffect])

  useEffect(() => {
    function onScroll() {
      setAtTop(window.scrollY < 60)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSettingsOpen(false)
    setLanguageOpen(false)
  }, [location.pathname])

  function toggleSettings() {
    setSettingsOpen((open) => {
      if (open) setLanguageOpen(false)
      return !open
    })
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isLandingPath = location.pathname === '/' || location.pathname === '/zh' || location.pathname === '/en'
  const activeLanguage = location.pathname === '/en' || location.pathname.startsWith('/en/') ? 'en' : 'zh'
  const languageLinks = isLandingPath ? landingLanguageLinks : docsLanguageLinks

  return (
    <>
      <SnowEffect enabled={snowEffect} />
      <div className={atTop ? 'float-controls is-top-hidden' : 'float-controls'} aria-label="页面快捷操作">
        <div className={languageOpen ? 'float-controls__langs is-open' : 'float-controls__langs'}>
          {languageLinks.map((lang) => (
            <Link
              aria-label={lang.name}
              className={
                activeLanguage === lang.code
                  ? 'float-controls__button float-controls__lang is-active'
                  : 'float-controls__button float-controls__lang'
              }
              key={lang.code}
              title={lang.name}
              to={lang.href}
            >
              {lang.label}
            </Link>
          ))}
        </div>

        <button
          aria-label="切换下雪特效"
          className={
            settingsOpen
              ? snowEffect
                ? 'float-controls__button float-controls__opt-dynamic is-visible is-active'
                : 'float-controls__button float-controls__opt-dynamic is-visible'
              : snowEffect
                ? 'float-controls__button float-controls__opt-dynamic is-active'
                : 'float-controls__button float-controls__opt-dynamic'
          }
          title="切换下雪特效"
          type="button"
          onClick={() => setSnowEffect((enabled) => !enabled)}
        >
          <Snowflake size={19} />
        </button>

        <button
          aria-label="切换语言"
          className={
            settingsOpen
              ? 'float-controls__button float-controls__opt-language is-visible'
              : 'float-controls__button float-controls__opt-language'
          }
          title="切换语言"
          type="button"
          onClick={() => setLanguageOpen((open) => !open)}
        >
          <Languages size={19} />
        </button>

        <button
          aria-label="切换主题"
          className={
            settingsOpen
              ? 'float-controls__button float-controls__opt-theme is-visible'
              : 'float-controls__button float-controls__opt-theme'
          }
          title="切换主题"
          type="button"
          onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          aria-label="设置"
          className="float-controls__button float-controls__settings"
          title="设置"
          type="button"
          onClick={toggleSettings}
        >
          <Settings size={20} />
        </button>

        <button
          aria-label="回到顶部"
          className="float-controls__button float-controls__top"
          title="回到顶部"
          type="button"
          onClick={scrollToTop}
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </>
  )
}
