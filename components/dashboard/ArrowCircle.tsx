import { ArrowRight } from 'lucide-react'

export default function ArrowCircle() {
  return (
    <div className="rounded-full bg-white p-3 ring-1 ring-slate-200 transition group-hover:ring-orange-200">
      <ArrowRight className="h-5 w-5 text-slate-700 group-hover:text-orange-700" />
    </div>
  )
}