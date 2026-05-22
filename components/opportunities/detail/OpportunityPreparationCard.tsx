import Link from 'next/link'
import { ArrowRight, GraduationCap } from 'lucide-react'

export default function OpportunityPreparationCard() {
  return (
    <div className="dark-panel p-6">
      <div className="dark-panel-content">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
          <GraduationCap className="h-6 w-6" />
        </div>

        <h3 className="mt-5 text-2xl font-bold">Still preparing?</h3>

        <p className="mt-3 leading-7 text-slate-300">
          Compare training programs before applying if this listingrequires
          more preparation, certification, or trade experience.
        </p>

        <Link href="/programs" className="btn-light mt-6">
          Compare training programs
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}