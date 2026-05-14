export default function StyleTestPage() {
  return (
    <main className="min-h-screen bg-red-500 p-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[2rem] bg-slate-950 p-10 shadow-2xl">
        <p className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold uppercase tracking-wide text-white">
          Tailwind test
        </p>

        <h1 className="mt-8 text-6xl font-black tracking-tight">
          If Tailwind works, this page is red, dark, orange, and huge.
        </h1>

        <p className="mt-6 text-2xl text-slate-300">
          This should not look like plain links or plain text.
        </p>

        <button className="mt-10 rounded-full bg-white px-8 py-4 text-xl font-bold text-slate-950">
          Big white button
        </button>
      </div>
    </main>
  )
}
