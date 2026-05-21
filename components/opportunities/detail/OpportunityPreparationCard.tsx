import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function OpportunityPreparationCard() {
  return (
    <div className="dark-panel p-6">
      <div className="dark-panel-content">
        <h3 className="text-2xl font-bold">Still preparing?</h3>

        <p className="mt-3 leading-7 text-slate-300">
          Explore training programs and trade paths before applying.
        </p>

        <Link href="/programs" className="btn-light mt-6">
          Explore programs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}