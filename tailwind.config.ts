import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './types/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS-var-backed palette — usable as Tailwind classes
        // e.g. bg-ara-cyan, text-ara-amber, border-ara-border
        ara: {
          cyan:         'var(--cyan)',
          'cyan-muted': 'var(--cyan-muted)',
          amber:        'var(--amber)',
          'amber-muted':'var(--amber-muted)',
          emerald:      'var(--emerald)',
          coral:        'var(--coral)',
          void:         'var(--bg-void)',
          base:         'var(--bg-base)',
          raised:       'var(--bg-raised)',
          overlay:      'var(--bg-overlay)',
          input:        'var(--bg-input)',
          border:       'var(--border)',
          'border-mid': 'var(--border-mid)',
          'border-cyan':'var(--border-cyan)',
          primary:      'var(--text-primary)',
          secondary:    'var(--text-secondary)',
          muted:        'var(--text-muted)',
        },
        // Legacy forge colors — kept so existing inline classes don't break
        forge: {
          orange:       '#D97706',
          'orange-light':'#FEF3C7',
          'orange-dark': '#92400E',
          navy:         '#0F172A',
          slate:        '#1E293B',
          blue:         '#3B82F6',
          'blue-light': '#DBEAFE',
          'blue-dark':  '#1D4ED8',
          steel:        '#64748B',
          ash:          '#F1F5F9',
          white:        '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'Barlow', 'sans-serif'],
        body:    ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        mono:    ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'ara-cyan':    '0 0 24px rgba(0, 229, 255, 0.35), 0 0 8px rgba(0, 229, 255, 0.2)',
        'ara-amber':   '0 0 20px rgba(255, 179, 0, 0.3)',
        card:          '0 1px 3px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.16)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.2)',
        // Legacy
        forge:         '0 4px 24px rgba(249, 115, 22, 0.15)',
        'forge-lg':    '0 8px 48px rgba(249, 115, 22, 0.2)',
      },
      animation: {
        'xp-shimmer':    'xp-shimmer 2s ease-in-out infinite',
        'pulse-glow':    'pulse-glow 2.5s ease-in-out infinite',
        'fade-in-up':    'fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
