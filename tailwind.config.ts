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
        forge: {
          orange: '#F97316',
          'orange-light': '#FED7AA',
          'orange-dark': '#C2410C',
          navy: '#0F172A',
          slate: '#1E293B',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
          'blue-dark': '#1D4ED8',
          steel: '#64748B',
          ash: '#F1F5F9',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        forge: '0 4px 24px rgba(249, 115, 22, 0.15)',
        'forge-lg': '0 8px 48px rgba(249, 115, 22, 0.2)',
        card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':
          '0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config