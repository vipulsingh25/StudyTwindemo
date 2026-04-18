// "use client"

// import { useEffect, useState } from "react"

// type Question = {
//   question: string
//   options: string[]
//   answer: string
// }

// const questions: Question[] = [
//   {
//     question: "Where was the hospital located?",
//     options: ["North", "South", "East", "West"],
//     answer: "North"
//   },
//   {
//     question: "What was near the school?",
//     options: ["Park", "Bank", "Hospital", "Mall"],
//     answer: "Park"
//   },
//   {
//     question: "Which building was in center?",
//     options: ["Library", "School", "Temple", "Office"],
//     answer: "School"
//   }
// ]

// export default function CSSSMemoryTest() {
//   const [phase, setPhase] = useState<"image" | "questions" | "result">("image")
//   const [time, setTime] = useState(10)
//   const [qIndex, setQIndex] = useState(0)
//   const [answers, setAnswers] = useState<string[]>([])
//   const [selected, setSelected] = useState("")
//   const [score, setScore] = useState(0)

//   // ⏱ TIMER LOGIC
//   useEffect(() => {
//     if (phase === "result") return

//     if (time === 0) {
//       if (phase === "image") {
//         setPhase("questions")
//         setTime(8)
//       } else if (phase === "questions") {
//         handleNext()
//       }
//       return
//     }

//     const timer = setTimeout(() => {
//       setTime((prev) => prev - 1)
//     }, 1000)

//     return () => clearTimeout(timer)
//   }, [time, phase])

//   // ➡ NEXT QUESTION
//   const handleNext = () => {
//     const updated = [...answers, selected]
//     setAnswers(updated)
//     setSelected("")

//     if (qIndex + 1 < questions.length) {
//       setQIndex(qIndex + 1)
//       setTime(8)
//     } else {
//       calculateScore(updated)
//       setPhase("result")
//     }
//   }

//   // 🧮 SCORE
//   const calculateScore = (ans: string[]) => {
//     let s = 0
//     ans.forEach((a, i) => {
//       if (a === questions[i].answer) s++
//     })
//     setScore(s)
//   }

//   return (
//     <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 max-w-md mx-auto">

//       {/* TIMER */}
//       <div className="flex justify-between mb-3">
//         <p className="text-sm text-gray-400">
//           {phase === "image" ? "Observe Carefully" : `Q${qIndex + 1}`}
//         </p>
//         <p className="text-sm text-orange-400">{time}s</p>
//       </div>

//       {/* PROGRESS BAR */}
//       <div className="h-2 bg-white/10 rounded mb-4">
//         <div
//           className="h-2 bg-[#F97316] rounded"
//           style={{ width: `${(time / 10) * 100}%` }}
//         />
//       </div>

//       {/* 🖼 IMAGE PHASE */}
//       {phase === "image" && (
//         <div className="text-center">
//           <img
//             src="/map.png" // 👉 replace with your image
//             alt="memory"
//             className="rounded-lg border border-white/10"
//           />
//           <p className="text-xs text-gray-400 mt-2">
//             Memorize the map
//           </p>
//         </div>
//       )}

//       {/* ❓ QUESTION PHASE */}
//       {phase === "questions" && (
//         <div>
//           <p className="mb-3">{questions[qIndex].question}</p>

//           <div className="space-y-2">
//             {questions[qIndex].options.map((opt) => (
//               <button
//                 key={opt}
//                 onClick={() => setSelected(opt)}
//                 className={`w-full text-left p-2 rounded-lg border ${
//                   selected === opt
//                     ? "bg-[#F97316] text-white"
//                     : "bg-white/5 border-white/10"
//                 }`}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* 📊 RESULT */}
//       {phase === "result" && (
//         <div className="text-center">
//           <h2 className="text-lg font-semibold mb-2">
//             Result
//           </h2>

//           <p className="text-orange-400 text-xl mb-2">
//             {score} / {questions.length}
//           </p>

//           <p className="text-sm text-gray-400">
//             {score === questions.length
//               ? "Excellent memory!"
//               : score >= 2
//               ? "Good recall ability"
//               : "Needs improvement"}
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import OLQDashboard from "./OLQDashboard"

type MemoryQ = {
  question: string
  options: string[]
  answer: string
}

type SituationalQ = {
  question: string
  options: string[]
}

type Analysis = {
  initiative: number
  responsibility: number
  social: number
  emotional: number
  practicality: number
  decisionType: "passive" | "reactive" | "proactive" | "leader"
  tags: string[]
}

export const analyzeResponse = (text: string): Analysis => {
  const lower = text.toLowerCase()

  let score = {
    initiative: 0,
    responsibility: 0,
    social: 0,
    emotional: 0,
    practicality: 0
  }

  let tags: string[] = []

  // 🔹 Initiative
  if (lower.includes("i will") || lower.includes("i'll")) {
    score.initiative += 2
  }

  if (lower.includes("start") || lower.includes("take action")) {
    score.initiative += 2
    tags.push("action-oriented")
  }

  // 🔹 Responsibility
  if (lower.includes("responsibility") || lower.includes("ensure")) {
    score.responsibility += 2
    tags.push("ownership")
  }

  // 🔹 Social Behavior
  if (lower.includes("team") || lower.includes("help") || lower.includes("support")) {
    score.social += 2
    tags.push("team-player")
  }

  // 🔹 Emotional Stability
  if (lower.includes("calm") || lower.includes("handle")) {
    score.emotional += 2
    tags.push("composed")
  }

  if (lower.includes("angry") || lower.includes("fight")) {
    score.emotional -= 2
    tags.push("reactive")
  }

  // 🔹 Practicality
  if (lower.includes("divide") || lower.includes("plan") || lower.includes("step")) {
    score.practicality += 2
    tags.push("structured")
  }

  if (text.length < 20) {
    score.practicality -= 2
    tags.push("vague")
  }

  // 🔹 Decision Type
  let decisionType: Analysis["decisionType"] = "passive"

  if (lower.includes("ignore") || lower.includes("leave")) {
    decisionType = "passive"
  } else if (lower.includes("react") || lower.includes("respond")) {
    decisionType = "reactive"
  } else if (lower.includes("plan") || lower.includes("organize")) {
    decisionType = "proactive"
  } else if (lower.includes("lead") || lower.includes("guide")) {
    decisionType = "leader"
  }

  return {
    ...score,
    decisionType,
    tags,
    
  }
}

export function analyzeResponses(responses: string[]) {

  let olqScores = {
    Initiative: 0,
    Responsibility: 0,
    Leadership: 0,
    Social: 0,
    DecisionMaking: 0
  }

  let consistencyFlags = 0

  responses.forEach((res) => {
    const r = res.toLowerCase()

    // Initiative
    if (r.includes("start") || r.includes("take action")) {
      olqScores.Initiative += 2
    }

    // Responsibility
    if (r.includes("responsible") || r.includes("finish task")) {
      olqScores.Responsibility += 2
    }

    // Leadership
    if (r.includes("guide") || r.includes("lead")) {
      olqScores.Leadership += 2
    }

    // Social
    if (r.includes("team") || r.includes("help others")) {
      olqScores.Social += 2
    }

    // Decision making
    if (r.includes("decide") || r.includes("choose")) {
      olqScores.DecisionMaking += 2
    }

    // ❌ detect avoidance
    if (r.includes("ignore") || r.includes("leave")) {
      consistencyFlags += 1
    }
  })

  const consistency = Math.max(0, 100 - consistencyFlags * 10)

  const insights = []

  if (olqScores.Initiative < 5) insights.push("You show low initiative in situations")
  if (olqScores.Leadership < 5) insights.push("Leadership presence is weak")
  if (consistency < 70) insights.push("Your responses show inconsistency")

  return {
    olqScores,
    consistency,
    insights
  }
}

type OLQ = {
  effectiveIntelligence: number
  initiative: number
  responsibility: number
  socialAdaptability: number
  courage: number
}

export const mapToOLQ = (analysis: Analysis): OLQ => {
  return {
    effectiveIntelligence: analysis.practicality,
    initiative: analysis.initiative,
    responsibility: analysis.responsibility,
    socialAdaptability: analysis.social,
    courage: analysis.decisionType === "leader" ? 2 : 0
  }
}

const memoryQuestions: MemoryQ[] = [
  {
    question: "Where was the hospital located?",
    options: ["North", "South", "East", "West"],
    answer: "North"
  },
  {
    question: "What was near the school?",
    options: ["Park", "Bank", "Hospital", "Mall"],
    answer: "Park"
  }
]

const situationalQuestions: SituationalQ[] = [
  {
    question: "Your teammate is underperforming. What do you do?",
    options: [
      "Ignore and focus on your work",
      "Help him and guide him",
      "Report him immediately",
      "Do his work yourself"
    ]
  },
  {
    question: "You have a deadline tomorrow and team is slow",
    options: [
      "Push team and divide work",
      "Do everything yourself",
      "Blame team",
      "Wait and hope"
    ]
  }
]

export const checkConsistency = (history: Analysis[]) => {
  let inconsistencies = 0

  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1]
    const curr = history[i]

    // Example rule
    if (
      prev.social > 2 &&
      curr.social === 0
    ) {
      inconsistencies++
    }

    if (
      prev.decisionType === "leader" &&
      curr.decisionType === "passive"
    ) {
      inconsistencies++
    }
  }

  const score = Math.max(0, 100 - inconsistencies * 10)

  return {
    score,
    inconsistencies
  }
}

export const calculateFinal = (history: Analysis[]) => {
  const total = history.reduce(
    (acc, curr) => {
      acc.initiative += curr.initiative
      acc.responsibility += curr.responsibility
      acc.social += curr.social
      acc.emotional += curr.emotional
      acc.practicality += curr.practicality
      return acc
    },
    {
      initiative: 0,
      responsibility: 0,
      social: 0,
      emotional: 0,
      practicality: 0
    }
  )

  const consistency = checkConsistency(history)

  return {
    ...total,
    consistencyScore: consistency.score
  }
}

export default function CSSSModule() {
  const [phase, setPhase] = useState<
    "image" | "memory" | "situational" | "result"
  >("image")
const [history, setHistory] = useState<Analysis[]>([])
  const [time, setTime] = useState(10)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState("")

  const [responses, setResponses] = useState<any[]>([])

  const result = analyzeResponses(responses.map((r) => r.selected))


  // ⏱ TIMER
  useEffect(() => {
    if (phase === "result") return

    if (time === 0) {
      handleNext()
      return
    }

    const t = setTimeout(() => setTime(time - 1), 1000)
    return () => clearTimeout(t)
  }, [time, phase])

  // ➡ NEXT
  const handleNext = () => {
    if (phase === "image") {
      setPhase("memory")
      setTime(8)
      return
    }

    const currentQ =
      phase === "memory"
        ? memoryQuestions[index]
        : situationalQuestions[index]

    // 📊 store response
    // setResponses((prev) => [
    //   ...prev,
    //   {
    //     type: phase,
    //     question: currentQ.question,
    //     selected,
    //     timeTaken: 10 - time
    //   }
    // ])


let analysisData: Analysis | null = null



if (phase === "situational") {
  analysisData = analyzeResponse(selected)

  if (analysisData) {
setHistory((prev) => [...prev, analysisData!])  }
}

setResponses((prev) => [
  ...prev,
  {
    type: phase,
    question: currentQ.question,
    selected,
    timeTaken: 10 - time,
    analysis: analysisData,
    olq: analysisData ? mapToOLQ(analysisData) : null
  }
])

    setSelected("")

    if (phase === "memory") {
      if (index + 1 < memoryQuestions.length) {
        setIndex(index + 1)
        setTime(8)
      } else {
        setIndex(0)
        setPhase("situational")
        setTime(8)
      }
    } else if (phase === "situational") {
      if (index + 1 < situationalQuestions.length) {
        setIndex(index + 1)
        setTime(8)
      } else {
        setPhase("result")
      }
    }
  }

  // 🧠 ANALYSIS
  const getAnalysis = () => {
    let correct = 0
    let totalTime = 0

    let proactive = 0
    let passive = 0

    responses.forEach((r, i) => {
      totalTime += r.timeTaken

      // memory scoring
      if (r.type === "memory") {
        if (r.selected === memoryQuestions[i]?.answer) {
          correct++
        }
      }

      // behavior analysis
      if (r.type === "situational") {
        if (r.selected?.includes("help") || r.selected?.includes("push")) {
          proactive++
        }
        if (r.selected?.includes("ignore") || r.selected?.includes("wait")) {
          passive++
        }
      }
    })

    return {
      accuracy: correct,
      avgTime: (totalTime / responses.length).toFixed(2),
      decision:
        proactive > passive ? "Proactive" : passive > proactive ? "Passive" : "Balanced"
    }
  }

  // const analysis = getAnalysis()
  const final = calculateFinal(history)

  return (
    <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 max-w-md mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-3">
        <p className="text-sm text-gray-400">
          {phase === "image"
            ? "Observe"
            : phase === "memory"
            ? "Memory Test"
            : phase === "situational"
            ? "Decision Test"
            : "Result"}
        </p>
        {phase !== "result" && (
          <p className="text-orange-400 text-sm">{time}s</p>
        )}
      </div>

      {/* PROGRESS */}
      {phase !== "result" && (
        <div className="h-2 bg-white/10 rounded mb-4">
          <div
            className="h-2 bg-[#F97316]"
            style={{ width: `${(time / 10) * 100}%` }}
          />
        </div>
      )}

      {/* IMAGE */}
      {phase === "image" && (
        <img src="/map.png" className="rounded-lg" />
      )}

      {/* MEMORY */}
      {phase === "memory" && (
        <div>
          <p className="mb-3">{memoryQuestions[index].question}</p>

          {memoryQuestions[index].options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`block w-full text-left p-2 mb-2 rounded ${
                selected === opt
                  ? "bg-[#F97316]"
                  : "bg-white/5"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* SITUATIONAL */}
      {phase === "situational" && (
        <div>
          <p className="mb-3">{situationalQuestions[index].question}</p>

          {situationalQuestions[index].options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`block w-full text-left p-2 mb-2 rounded ${
                selected === opt
                  ? "bg-[#F97316]"
                  : "bg-white/5"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* RESULT */}
      {/* {phase === "result" && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Analysis</h2>

          <p className="text-sm text-gray-400 mb-1">
            Memory Accuracy: {analysis.accuracy}/{memoryQuestions.length}
          </p>

          <p className="text-sm text-gray-400 mb-1">
            Avg Response Time: {analysis.avgTime}s
          </p>

          <p className="text-sm text-gray-400 mb-3">
            Decision Style: {analysis.decision}
          </p>

          <div className="text-xs text-gray-500">
            This is a behavioral estimate based on your responses under time pressure.
          </div>
        </div>
      )} */}

      {phase === "result" && (
  <div>
    <h2 className="text-lg font-semibold mb-3">SSB Analysis</h2>

    <p className="text-sm text-gray-400">
      Initiative: {final.initiative}
    </p>

    <p className="text-sm text-gray-400">
      Responsibility: {final.responsibility}
    </p>

    <p className="text-sm text-gray-400">
      Social Adaptability: {final.social}
    </p>

    <p className="text-sm text-gray-400">
      Emotional Stability: {final.emotional}
    </p>

    <p className="text-sm text-gray-400">
      Practicality: {final.practicality}
    </p>

    <p className="text-sm text-orange-400 mt-2">
      Consistency Score: {final.consistencyScore}%
    </p>

    <div className="text-xs text-gray-500 mt-3">
      This is behavioral evaluation based on response patterns, not correct answers.
    </div>

    <OLQDashboard
  olqScores={result.olqScores}
  consistency={result.consistency}
  insights={result.insights}
/>
  </div>

  
)}
    </div>
  )
}