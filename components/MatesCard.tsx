"use client"

export default function MatesCard() {
  return (
    <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10 col-span-1 lg:col-span-2">

      <h2 className="text-lg font-semibold mb-4">Your Study Mates</h2>

      <div className="flex gap-4">

        {["Aman", "Rohit", "Neha"].map((name, i) => (
          <div key={i} className="bg-white/5 px-4 py-2 rounded-lg">
            {name}
          </div>
        ))}

      </div>

    </div>
  )
}