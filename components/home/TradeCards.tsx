import Link from 'next/link'
import {
  Zap, Wind, Droplets, Flame, Sun, HardHat,
  TrendingUp, Clock, DollarSign, ArrowRight, type LucideIcon
} from 'lucide-react'
import type { Trade } from '@/types'
import { formatSalary, TRADE_COLORS } from '@/utils/trades'
import { cn } from '@/utils/cn'

const TRADE_ICON_MAP: Record<string, LucideIcon> = {
  Zap, Wind, Droplets, Flame, Sun, HardHat,
}

interface TradeCardProps {
  trade: Trade
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export default function TradeCard({ trade, variant = 'default', className }: TradeCardProps) {
  const Icon = TRADE_ICON_MAP[trade.icon] ?? HardHat
  const colors = TRADE_COLORS[trade.color] ?? TRADE_COLORS.slate

  if (variant === 'compact') {
    return (
      <Link
        href={`/trades/${trade.slug}`}
        className={cn(
          'card-interactive flex items-center gap-3 p-4 group',
          className
        )}
      >
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colors.bg)}>
          <Icon size={20} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-forge-navy truncate">{trade.name}</div>
          <div className="text-xs text-forge-steel">{formatSalary(trade.median_salary)}/yr median</div>
        </div>
        <ArrowRight size={14} className="text-slate-300 group-hover:text-forge-orange transition-colors flex-shrink-0" />
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/trades/${trade.slug}`}
        className={cn(
          'relative overflow-hidden rounded-2xl border border-slate-100 p-6',
          'bg-gradient-to-br from-white to-slate-50',
          'hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 group cursor-pointer',
          className
        )}
      >
        {/* Trade color accent bar */}
        <div className={cn('absolute top-0 left-0 right-0 h-1', colors.bg.replace('bg-', 'bg-').replace('-50', '-400'))} />

        {/* Icon */}
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', colors.bg)}>
          <Icon size={24} className={colors.text} />
        </div>

        {/* Name + tagline */}
        <h3 className="font-display text-xl font-bold text-forge-navy mb-1">
          {trade.name}
        </h3>
        <p className="text-sm text-forge-steel mb-4 leading-relaxed">
          {trade.tagline}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-white border border-slate-100">
            <div className="font-display text-sm font-bold text-forge-navy">
              {formatSalary(trade.median_salary / 1000)}K
            </div>
            <div className="text-[10px] text-forge-steel">median/yr</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white border border-slate-100">
            <div className="font-display text-sm font-bold text-forge-navy">
              +{trade.job_growth_rate}%
            </div>
            <div className="text-[10px] text-forge-steel">job growth</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-white border border-slate-100">
            <div className="font-display text-sm font-bold text-forge-navy">
              $0
            </div>
            <div className="text-[10px] text-forge-steel">debt to start</div>
          </div>
        </div>

        {/* Training duration badge */}
        <div className="flex items-center justify-between">
          <div className={cn('badge text-xs', colors.bg, colors.text, `border ${colors.border}`)}>
            <Clock size={11} />
            {trade.training_duration}
          </div>
          <ArrowRight
            size={16}
            className="text-slate-300 group-hover:text-forge-orange group-hover:translate-x-1 transition-all"
          />
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link
      href={`/trades/${trade.slug}`}
      className={cn(
        'card-interactive block p-5 group',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', colors.bg)}>
          <Icon size={22} className={colors.text} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-forge-navy mb-0.5">
            {trade.name}
          </h3>
          <p className="text-sm text-forge-steel line-clamp-2 mb-3 leading-relaxed">
            {trade.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-forge-steel">
              <DollarSign size={12} className="text-green-600" />
              {formatSalary(trade.median_salary)}/yr
            </span>
            <span className="flex items-center gap-1 text-xs text-forge-steel">
              <TrendingUp size={12} className="text-blue-500" />
              +{trade.job_growth_rate}% growth
            </span>
            <span className="flex items-center gap-1 text-xs text-forge-steel">
              <Clock size={12} className="text-slate-400" />
              {trade.training_duration}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {trade.key_skills.slice(0, 2).map(skill => (
            <span key={skill} className="badge-slate text-xs">
              {skill}
            </span>
          ))}
        </div>
        <ArrowRight
          size={16}
          className="text-slate-300 group-hover:text-forge-orange group-hover:translate-x-1 transition-all flex-shrink-0"
        />
      </div>
    </Link>
  )
}