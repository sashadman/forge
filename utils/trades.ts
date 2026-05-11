import type { Trade, TradeCategory, QuizQuestion } from '@/types'

// ─────────────────────────────────────────────
// TRADE DATA
// ─────────────────────────────────────────────

export const TRADES: Trade[] = [
  {
    id: '1',
    slug: 'electrical',
    name: 'Electrician',
    tagline: 'Power the future with your hands',
    description: 'Electricians install, maintain, and repair electrical systems in homes, businesses, and factories. With AI data centers booming and EV charging rollout underway, demand is at a historic high.',
    icon: 'Zap',
    color: 'amber',
    median_salary: 62350,
    salary_range: { min: 42000, max: 106000 },
    job_growth_rate: 9.5,
    training_duration: '4–5 year apprenticeship',
    key_skills: ['Wiring & circuits', 'Blueprint reading', 'Code compliance', 'Troubleshooting', 'Safety protocols'],
    day_in_life: 'Start the day reviewing blueprints for a commercial build, wire a new panel by noon, troubleshoot an outage in the afternoon. No two days are the same.',
    pros: ['High job security', 'Earn while you learn', 'No college debt', 'Self-employment potential', 'Needed everywhere'],
    cons: ['Physical demands', 'Some electrical hazards', 'Early morning starts'],
    certifications: ['OSHA 10/30', 'Journeyman License', 'Master Electrician License', 'NABCEP (solar)'],
    top_employers: ['Tesla', 'Siemens', 'Mister Electric', 'Local contractors'],
    is_featured: true,
  },
  {
    id: '2',
    slug: 'hvac',
    name: 'HVAC Technician',
    tagline: 'Keep the world comfortable',
    description: 'HVAC techs install and maintain heating, cooling, and ventilation systems. Heat pump rollout and climate change are creating unprecedented demand for skilled technicians.',
    icon: 'Wind',
    color: 'blue',
    median_salary: 57300,
    salary_range: { min: 38000, max: 98000 },
    job_growth_rate: 8.1,
    training_duration: '6 months–2 year program',
    key_skills: ['Refrigerant handling', 'Ductwork', 'Electrical systems', 'Heat pump tech', 'Customer service'],
    day_in_life: 'Install a new heat pump in the morning, respond to an emergency AC failure in summer, run maintenance checks on commercial systems.',
    pros: ['Recession-resistant', 'Faster to certify', 'Outdoor + indoor work', 'High earning ceiling', 'Clean energy growth'],
    cons: ['Seasonal demand swings', 'On-call requirements', 'Confined spaces'],
    certifications: ['EPA 608', 'NATE Certification', 'OSHA 10', 'R-410A certification'],
    top_employers: ['Carrier', 'Trane', 'ACCO Brands', 'ServiceExpert'],
    is_featured: true,
  },
  {
    id: '3',
    slug: 'plumbing',
    name: 'Plumber',
    tagline: 'Infrastructure the world depends on',
    description: 'Plumbers install and repair the pipe systems that carry water, gas, and waste. Aging infrastructure nationwide means decades of guaranteed work.',
    icon: 'Droplets',
    color: 'teal',
    median_salary: 59880,
    salary_range: { min: 40000, max: 104000 },
    job_growth_rate: 6.3,
    training_duration: '4–5 year apprenticeship',
    key_skills: ['Pipe fitting', 'Blueprint reading', 'Code compliance', 'Problem-solving', 'Customer communication'],
    day_in_life: 'Repair a burst pipe at 7am, rough-in plumbing on a new construction site by afternoon, install a water heater, wrap up with paperwork.',
    pros: ['Excellent job security', 'High emergency rates', 'Self-employment common', 'Physical variety', 'Community respect'],
    cons: ['Unpleasant job conditions sometimes', 'Emergency calls', 'Physical strain'],
    certifications: ['Journeyman Plumber', 'Master Plumber', 'Backflow Prevention', 'Medical Gas'],
    top_employers: ['Roto-Rooter', 'Mr. Rooter', 'Local contractors'],
    is_featured: true,
  },
  {
    id: '4',
    slug: 'welding',
    name: 'Welder',
    tagline: 'Build the structures of tomorrow',
    description: 'Welders fuse metal parts together using heat and pressure. From ships and bridges to aerospace and pipelines — if it\'s metal, a welder built it.',
    icon: 'Flame',
    color: 'orange',
    median_salary: 47010,
    salary_range: { min: 32000, max: 85000 },
    job_growth_rate: 3.0,
    training_duration: '6 months–2 year program',
    key_skills: ['MIG/TIG/stick welding', 'Blueprint reading', 'Metal properties', 'Safety', 'Precision'],
    day_in_life: 'Fabricate custom steel components for a construction project, do structural inspections, weld pipeline sections on location.',
    pros: ['Fast to certify', 'Artistic + technical', 'High-demand specializations', 'Outdoor adventure', 'Strong union path'],
    cons: ['Physical hazards if careless', 'Eye protection critical', 'Fumes management'],
    certifications: ['AWS Certified Welder', 'OSHA 10', 'Certified Welding Inspector (CWI)'],
    top_employers: ['Caterpillar', 'Boeing', 'Pipeline companies', 'Fab shops'],
    is_featured: true,
  },
  {
    id: '5',
    slug: 'solar',
    name: 'Solar Technician',
    tagline: 'Power the clean energy revolution',
    description: 'Solar techs install, maintain, and repair photovoltaic systems on homes and commercial buildings. One of the fastest-growing trades in America with 25%+ annual growth.',
    icon: 'Sun',
    color: 'yellow',
    median_salary: 52400,
    salary_range: { min: 36000, max: 82000 },
    job_growth_rate: 25.0,
    training_duration: '3–6 months program',
    key_skills: ['Panel installation', 'Electrical basics', 'Roofing', 'System design', 'Safety'],
    day_in_life: 'Install a rooftop solar array on a residential home, test inverters and connections, commission the system, meet with a homeowner to explain their new setup.',
    pros: ['Fastest-growing trade', 'Shorter training time', 'Green energy mission', 'Growing pay', 'Tech-forward work'],
    cons: ['Rooftop work risks', 'Market depends on incentives', 'Summer heat'],
    certifications: ['NABCEP PV Installation', 'OSHA 10', 'First Aid/CPR'],
    top_employers: ['SunPower', 'Sunrun', 'Tesla Energy', 'Local solar companies'],
    is_featured: true,
  },
  {
    id: '6',
    slug: 'construction',
    name: 'Construction Worker',
    tagline: 'Build everything around you',
    description: 'Construction workers build and maintain structures — from homes to highways. The most versatile trade entry point with clear paths to specialization and leadership.',
    icon: 'HardHat',
    color: 'slate',
    median_salary: 48000,
    salary_range: { min: 32000, max: 80000 },
    job_growth_rate: 5.0,
    training_duration: '3 months–2 years depending on specialization',
    key_skills: ['Hand/power tools', 'Blueprint reading', 'Safety', 'Physical stamina', 'Teamwork'],
    day_in_life: 'Pour a concrete foundation, frame walls on a new home, operate heavy equipment, work alongside specialists to bring a structure to life.',
    pros: ['Low barrier to entry', 'Team environment', 'Visible results', 'Many advancement paths', 'Strong demand'],
    cons: ['Weather exposure', 'Heavy physical work', 'Variable project workload'],
    certifications: ['OSHA 10/30', 'First Aid/CPR', 'Equipment operator certs'],
    top_employers: ['Turner Construction', 'Bechtel', 'Local GCs'],
    is_featured: true,
  },
]

export const TRADE_MAP = Object.fromEntries(
  TRADES.map(t => [t.slug, t])
) as Record<TradeCategory, Trade>

export const FEATURED_TRADES = TRADES.filter(t => t.is_featured)

// ─────────────────────────────────────────────
// QUIZ DATA
// ─────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    text: 'What kind of work environment excites you most?',
    type: 'single',
    weight: 1.5,
    options: [
      {
        id: 'q1-a',
        text: 'Working indoors with systems and equipment',
        emoji: '🏠',
        trade_weights: { hvac: 2, plumbing: 1.5, electrical: 1.5 },
      },
      {
        id: 'q1-b',
        text: 'Working outdoors on construction sites',
        emoji: '🏗️',
        trade_weights: { construction: 2, solar: 1.5, roofing: 2 },
      },
      {
        id: 'q1-c',
        text: 'Working with fire, heat, and metal',
        emoji: '🔥',
        trade_weights: { welding: 3, carpentry: 1 },
      },
      {
        id: 'q1-d',
        text: 'A mix — some indoors, some outdoors',
        emoji: '🔄',
        trade_weights: { electrical: 1.5, plumbing: 1.5, solar: 1, construction: 1 },
      },
    ],
  },
  {
    id: 'q2',
    text: 'Which of these best describes your personality?',
    type: 'single',
    weight: 1.2,
    options: [
      {
        id: 'q2-a',
        text: 'Analytical — I love solving puzzles and diagnosing problems',
        emoji: '🔍',
        trade_weights: { electrical: 2, hvac: 2, plumbing: 1.5 },
      },
      {
        id: 'q2-b',
        text: 'Creative — I enjoy making and building things',
        emoji: '🎨',
        trade_weights: { welding: 1.5, carpentry: 2, construction: 1 },
      },
      {
        id: 'q2-c',
        text: 'Physical — I love high-energy hands-on work',
        emoji: '💪',
        trade_weights: { construction: 2, roofing: 2, solar: 1.5 },
      },
      {
        id: 'q2-d',
        text: 'Mission-driven — I want my work to matter for the planet',
        emoji: '🌱',
        trade_weights: { solar: 3, electrical: 1.5 },
      },
    ],
  },
  {
    id: 'q3',
    text: 'How soon do you want to start earning money in your trade?',
    type: 'single',
    weight: 1.3,
    options: [
      {
        id: 'q3-a',
        text: 'Immediately — I want to earn while I learn',
        emoji: '⚡',
        trade_weights: { construction: 2, welding: 1.5, solar: 2, hvac: 1.5 },
      },
      {
        id: 'q3-b',
        text: 'Within 6 months of training',
        emoji: '📅',
        trade_weights: { solar: 2, welding: 1.5, hvac: 1.5 },
      },
      {
        id: 'q3-c',
        text: 'I\'m willing to do 2–5 years to maximize long-term earnings',
        emoji: '📈',
        trade_weights: { electrical: 2.5, plumbing: 2.5 },
      },
    ],
  },
  {
    id: 'q4',
    text: 'Which tools or technology interest you most?',
    type: 'multi',
    weight: 1.0,
    options: [
      {
        id: 'q4-a',
        text: 'Wiring, panels, and circuits',
        emoji: '⚡',
        trade_weights: { electrical: 3 },
      },
      {
        id: 'q4-b',
        text: 'Pipes, fittings, and water systems',
        emoji: '💧',
        trade_weights: { plumbing: 3 },
      },
      {
        id: 'q4-c',
        text: 'Heat pumps, AC units, and ductwork',
        emoji: '❄️',
        trade_weights: { hvac: 3 },
      },
      {
        id: 'q4-d',
        text: 'Welding torches and metal fabrication',
        emoji: '🔧',
        trade_weights: { welding: 3 },
      },
      {
        id: 'q4-e',
        text: 'Solar panels and renewable systems',
        emoji: '☀️',
        trade_weights: { solar: 3 },
      },
      {
        id: 'q4-f',
        text: 'Heavy machinery and structural work',
        emoji: '🏗️',
        trade_weights: { construction: 3 },
      },
    ],
  },
  {
    id: 'q5',
    text: 'What matters most to you in a career?',
    type: 'single',
    weight: 1.4,
    options: [
      {
        id: 'q5-a',
        text: 'Job security — I want stable, reliable work forever',
        emoji: '🛡️',
        trade_weights: { electrical: 2, plumbing: 2, hvac: 2 },
      },
      {
        id: 'q5-b',
        text: 'High income — I want to maximize my earning potential',
        emoji: '💰',
        trade_weights: { electrical: 2.5, plumbing: 2, hvac: 1.5 },
      },
      {
        id: 'q5-c',
        text: 'Speed — I want to get certified and working fast',
        emoji: '🚀',
        trade_weights: { solar: 2.5, welding: 2, hvac: 1.5 },
      },
      {
        id: 'q5-d',
        text: 'Entrepreneurship — I want to eventually run my own business',
        emoji: '🏢',
        trade_weights: { plumbing: 2, electrical: 2, hvac: 2, construction: 1.5 },
      },
    ],
  },
  {
    id: 'q6',
    text: 'Do you have any experience with any of these?',
    type: 'multi',
    weight: 0.8,
    options: [
      {
        id: 'q6-a',
        text: 'Home improvement or DIY projects',
        emoji: '🔨',
        trade_weights: { construction: 1.5, carpentry: 1.5, plumbing: 1 },
      },
      {
        id: 'q6-b',
        text: 'Electronics or basic electrical work',
        emoji: '💡',
        trade_weights: { electrical: 2, solar: 1.5 },
      },
      {
        id: 'q6-c',
        text: 'Mechanical work (cars, machines)',
        emoji: '⚙️',
        trade_weights: { hvac: 1.5, automotive: 2, welding: 1 },
      },
      {
        id: 'q6-d',
        text: 'None — I\'m starting completely fresh',
        emoji: '🌱',
        trade_weights: { construction: 0.5, solar: 1, welding: 0.5 },
      },
    ],
  },
]

// ─────────────────────────────────────────────
// QUIZ SCORING ENGINE
// ─────────────────────────────────────────────

export function calculateQuizResults(
  answers: Array<{ question_id: string; selected_options: string[] }>
): Array<{ trade: TradeCategory; score: number; rank: number }> {
  const scores: Partial<Record<TradeCategory, number>> = {}

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find(q => q.id === answer.question_id)
    if (!question) continue

    for (const optionId of answer.selected_options) {
      const option = question.options.find(o => o.id === optionId)
      if (!option) continue

      for (const [trade, weight] of Object.entries(option.trade_weights)) {
        const tradeKey = trade as TradeCategory
        scores[tradeKey] = (scores[tradeKey] || 0) + (weight as number) * question.weight
      }
    }
  }

  // Normalize to 0-100
  const maxScore = Math.max(...Object.values(scores).filter(Boolean) as number[])

  return Object.entries(scores)
    .map(([trade, score]) => ({
      trade: trade as TradeCategory,
      score: Math.round(((score || 0) / maxScore) * 100),
      rank: 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item, idx) => ({ ...item, rank: idx + 1 }))
}

// ─────────────────────────────────────────────
// FORMATTING HELPERS
// ─────────────────────────────────────────────

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSalaryRange(min: number, max: number): string {
  return `${formatSalary(min)} – ${formatSalary(max)}`
}

export const TRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  slate:  { bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200' },
}