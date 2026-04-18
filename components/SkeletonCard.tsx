export default function SkeletonCard() {
  return (
    <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 animate-pulse">

      <div className="h-4 w-32 bg-white/10 rounded mb-4"></div>

      <div className="space-y-3">
        <div className="h-3 bg-white/10 rounded w-full"></div>
        <div className="h-3 bg-white/10 rounded w-5/6"></div>
        <div className="h-3 bg-white/10 rounded w-4/6"></div>
      </div>

    </div>
  )
}