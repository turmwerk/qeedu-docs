import { ArrowUp, Languages, Moon, Settings, Sparkles, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type Theme = 'dark' | 'light'

const themeStorageKey = 'qeedu-docs-theme'
const backgroundStorageKey = 'qeedu-docs-simple-background'

const languageLinks = [
  { code: 'zh', label: 'CN', name: '简体中文', href: '/zh/getting-started/introduction' },
  { code: 'en', label: 'EN', name: 'English', href: '/en/getting-started/introduction' },
]

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.localStorage.getItem(themeStorageKey) === 'light' ? 'light' : 'dark'
}

function readStoredBackgroundMode() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(backgroundStorageKey) !== 'false'
}

export function FloatControls() {
  const location = useLocation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme())
  const [simpleBackground, setSimpleBackground] = useState(() => readStoredBackgroundMode())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('docs-simple-background', simpleBackground)
    window.localStorage.setItem(backgroundStorageKey, String(simpleBackground))
  }, [simpleBackground])

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

  const activeLanguage = location.pathname.startsWith('/en/') ? 'en' : 'zh'

  return (
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
        aria-label="切换简洁背景"
        className={
          settingsOpen
            ? simpleBackground
              ? 'float-controls__button float-controls__opt-dynamic is-visible is-active'
              : 'float-controls__button float-controls__opt-dynamic is-visible'
            : simpleBackground
              ? 'float-controls__button float-controls__opt-dynamic is-active'
              : 'float-controls__button float-controls__opt-dynamic'
        }
        title="切换简洁背景"
        type="button"
        onClick={() => setSimpleBackground((enabled) => !enabled)}
      >
        <Sparkles size={19} />
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
  )
}
