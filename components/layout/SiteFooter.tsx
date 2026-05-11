'use client'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {currentYear} Shadman Consulting. All rights reserved.</p>
        <p>Skilled trades career discovery and workforce pipeline platform.</p>
      </div>
    </footer>
  )
}