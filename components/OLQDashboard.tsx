// "use client"

// import {
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
//   ResponsiveContainer
// } from "recharts"

// type Props = {
//   olqScores: any
//   consistency: number
//   insights: string[]
// }



// export default function OLQDashboard({ olqScores, consistency, insights }: Props) {

//   const data = Object.keys(olqScores).map((key) => ({
//     subject: key,
//     value: olqScores[key]
//   }))

//   return (
//     <div className="space-y-6">

//       {/* 🔥 Radar Chart */}
//       <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
//         <h2 className="text-lg font-semibold mb-4">OLQ Analysis</h2>

//         <div className="h-[300px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <RadarChart data={data}>
//               <PolarGrid stroke="#444" />
//               <PolarAngleAxis dataKey="subject" tick={{ fill: "#ccc", fontSize: 12 }} />
//               <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#666" }} />
//               <Radar
//                 name="OLQ"
//                 dataKey="value"
//                 stroke="#F97316"
//                 fill="#F97316"
//                 fillOpacity={0.6}
//               />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* 📊 Consistency */}
//       <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
//         <h3 className="text-md font-semibold mb-2">Consistency Score</h3>

//         <div className="h-2 bg-white/10 rounded-full">
//           <div
//             className="h-2 bg-green-500 rounded-full"
//             style={{ width: `${consistency}%` }}
//           />
//         </div>

//         <p className="text-sm text-gray-400 mt-2">
//           {consistency}% behavioral consistency
//         </p>
//       </div>

//       {/* 🧠 Insights */}
//       <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
//         <h3 className="text-md font-semibold mb-3">Behavioral Insights</h3>

//         <ul className="space-y-2 text-sm text-gray-300">
//           {insights.map((insight, i) => (
//             <li key={i} className="bg-white/5 p-2 rounded-lg">
//               {insight}
//             </li>
//           ))}
//         </ul>
//       </div>

//     </div>
//   )
// }


"use client"

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from "recharts"

type Props = {
  olqScores: Record<string, number>
  consistency: number
  insights: string[]
}

export default function OLQDashboard({ olqScores, consistency, insights }: Props) {

  // 🔥 Format keys nicely
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
  }

  // 🔥 Normalize values (0–10 safe)
  const data = Object.keys(olqScores || {}).map((key) => ({
    subject: formatLabel(key),
    value: Math.min(10, Math.max(0, olqScores[key] || 0))
  }))

  // 🔥 Consistency color logic
  const getConsistencyColor = () => {
    if (consistency < 60) return "bg-red-500"
    if (consistency < 80) return "bg-yellow-400"
    return "bg-green-500"
  }

  if (!data.length) {
    return (
      <div className="text-gray-400 text-sm">
        No OLQ data available yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 🔥 Radar Chart */}
      <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
        <h2 className="text-lg font-semibold mb-4">
          OLQ Analysis
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#ccc", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 10]}
                tick={{ fill: "#666", fontSize: 10 }}
              />
              <Radar
                name="OLQ"
                dataKey="value"
                stroke="#F97316"
                fill="#F97316"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Consistency */}
      <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
        <h3 className="text-md font-semibold mb-2">
          Consistency Score
        </h3>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-2 ${getConsistencyColor()} rounded-full transition-all duration-500`}
            style={{ width: `${consistency}%` }}
          />
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {consistency}% behavioral consistency
        </p>
      </div>

      {/* 🧠 Insights */}
      <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10">
        <h3 className="text-md font-semibold mb-3">
          Behavioral Insights
        </h3>

        {insights.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No insights generated yet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm text-gray-300">
            {insights.map((insight, i) => (
              <li
                key={i}
                className="bg-white/5 p-2 rounded-lg border border-white/5"
              >
                {insight}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}