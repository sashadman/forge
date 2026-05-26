'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  isLight: boolean
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'forge-theme'
const LEGACY_MISSION_THEME_KEY = 'mission-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  const legacyMissionTheme = window.localStorage.getItem(LEGACY_MISSION_THEME_KEY)

  if (legacyMissionTheme === 'day') return 'light'
  if (legacyMissionTheme === 'night') return 'dark'

  return 'dark'
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('theme-light', theme === 'light')
  document.documentElement.classList.toggle('theme-dark', theme === 'dark')
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setThemeState(initialTheme)
    applyThemeToDocument(initialTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, initialTheme)
  }, [])

  function setTheme(nextTheme: Theme) {
    setThemeState(nextTheme)
    applyThemeToDocument(nextTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const value = useMemo(
    () => ({
      theme,
      isLight: theme === 'light',
      isDark: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.')
  }

  return context
}