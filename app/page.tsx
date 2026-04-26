// // "use client"

// // import { motion } from "framer-motion"
// // import { useEffect, useState } from "react"
// // import { signInWithGoogle } from "@/lib/auth"
// // import { useRouter } from "next/navigation"

// // const quotes = [
// //   "Discipline beats motivation",
// //   "Consistency is your real competition",
// //   "Small steps daily = big results",
// //   "Focus. Execute. Repeat."
// // ]

// // export default function LandingPage() {
// //   const [quoteIndex, setQuoteIndex] = useState(0)

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setQuoteIndex((prev) => (prev + 1) % quotes.length)
// //     }, 3000)
// //     return () => clearInterval(interval)
// //   }, [])

// // const router = useRouter()
// // const handleLogin = async () => {
// //   const user = await signInWithGoogle()
// //   if (user) {
// //     router.push("/dashboard")
// //   }
// // }
// //   return (
// //     <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

// //       {/* 🔥 Background Glow Blobs */}
// //       <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-orange-500/20 blur-[120px] rounded-full"></div>
// //       <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-orange-400/10 blur-[120px] rounded-full"></div>

// //       {/* NAVBAR */}
// //       <div className="flex justify-between items-center px-6 md:px-12 py-6 relative z-10">
// //         <h1 className="text-2xl font-bold tracking-wide">
// //           <span className="text-[#F97316]">Study</span>Twin
// //         </h1>

// //         <button
// //   onClick={handleLogin}
// //   className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full"
// // >
// //   <img src="/google.png" className="w-5 h-5" />
// //   Continue with Google
// // </button>
// //       </div>

// //       {/* HERO */}
// //       <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-12 mt-10 md:mt-20 gap-10 md:gap-24 relative z-10">

// //         {/* LEFT */}
// //         <div className="flex-1 max-w-lg">

// //           <h2 className="text-4xl md:text-5xl font-bold leading-tight">
// //             Your Personal{" "}
// //             <span className="text-[#F97316] relative">
// //               Study Twin
// //               <span className="absolute left-0 bottom-0 w-full h-2 bg-orange-500/20 blur-sm"></span>
// //             </span>
// //           </h2>

// //           {/* QUOTES */}
// //           <motion.p
// //             key={quoteIndex}
// //             initial={{ opacity: 0, y: 10 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="mt-6 text-lg text-gray-400"
// //           >
// //             {quotes[quoteIndex]}
// //           </motion.p>

// //           <button className="mt-8 bg-[#F97316] px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:scale-105 transition duration-300">
// //             Start Your Journey
// //           </button>
// //         </div>

// //         {/* RIGHT - CARDS */}
// //         <div className="flex-1 max-w-lg grid grid-cols-2 gap-4">

// //           {/* Card Common Style */}
// //           {[
// //             {
// //               title: "Today's Tasks",
// //               content: (
// //                 <ul className="text-sm space-y-2">
// //                   <li>✅ Polity</li>
// //                   <li>✅ Algebra</li>
// //                   <li className="text-gray-500">⬜ Thermodynamics</li>
// //                 </ul>
// //               )
// //             },
// //             {
// //               title: "Study Connect",
// //               content: (
// //                 <div className="h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-lg flex items-center justify-center text-xs text-gray-400">
// //                   📍 Jaipur Active
// //                 </div>
// //               )
// //             },
// //             {
// //               title: "Weekly Progress",
// //               content: (
// //                 <>
// //                   <div className="h-2 bg-gray-800 rounded">
// //                     <div className="h-2 bg-[#F97316] rounded w-3/4 shadow shadow-orange-500/40"></div>
// //                   </div>
// //                   <p className="text-xs mt-2 text-gray-500">75% completed</p>
// //                 </>
// //               ),
// //               colSpan: "col-span-2"
// //             },
// //             {
// //               title: "Streak",
// //               content: <p className="text-2xl font-bold text-[#F97316]">12 🔥</p>
// //             },
// //             {
// //               title: "Now Studying",
// //               content: (
// //                 <p className="text-sm text-gray-300 mt-2">
// //                   Polity - Parliament
// //                 </p>
// //               )
// //             }
// //           ].map((card, i) => (
// //             <motion.div
// //               key={i}
// //               whileHover={{ scale: 1.05, y: -5 }}
// //               transition={{ type: "spring", stiffness: 200 }}
// //               className={`bg-[#111111]/70 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-lg shadow-orange-500/10 hover:shadow-orange-500/30 transition duration-300 ${card.colSpan || ""}`}
// //             >
// //               <h3 className="text-sm text-gray-400 mb-2">{card.title}</h3>
// //               {card.content}
// //             </motion.div>
// //           ))}

// //         </div>
// //       </div>

// //     </div>

// //   )
// // }



// "use client"

// import { motion } from "framer-motion"
// import { useEffect, useState } from "react"
// import { signInWithGoogle } from "@/lib/auth"
// import { useRouter } from "next/navigation"

// const quotes = [
//   "Discipline beats motivation",
//   "Consistency is your real competition",
//   "Small steps daily = big results",
//   "Focus. Execute. Repeat."
// ]

// export default function LandingPage() {
//   const [quoteIndex, setQuoteIndex] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setQuoteIndex((prev) => (prev + 1) % quotes.length)
//     }, 3000)
//     return () => clearInterval(interval)
//   }, [])

//   const handleLogin = async () => {
//     try {
//       setLoading(true)
//       const user = await signInWithGoogle()
//       if (user) router.push("/dashboard")
//     } catch (err) {
//       console.error(err)
//       alert("Login failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

//       {/* Glow */}
//       <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-orange-500/20 blur-[120px] rounded-full"></div>
//       <div className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-orange-400/10 blur-[120px] rounded-full"></div>

//       {/* NAVBAR */}
//       <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6 relative z-10">
//         <h1 className="text-xl md:text-2xl font-bold">
//           <span className="text-[#F97316]">Study</span>Twin
//         </h1>

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm md:text-base hover:scale-105 transition disabled:opacity-50"
//         >
//           <img src="/google.png" className="w-4 h-4 md:w-5 md:h-5" />
//           {loading ? "Signing in..." : "Google"}
//         </button>
//       </div>

//       {/* HERO */}
//       <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-12 py-10 md:py-20 gap-12 relative z-10">

//         {/* LEFT */}
//         <div className="w-full lg:w-1/2 text-center lg:text-left">

//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
//             Your Personal{" "}
//             <span className="text-[#F97316] relative">
//               Study Twin
//             </span>
//           </h2>

//           <motion.p
//             key={quoteIndex}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mt-4 md:mt-6 text-base md:text-lg text-gray-400"
//           >
//             {quotes[quoteIndex]}
//           </motion.p>

//           <button
//             onClick={handleLogin}
//             className="mt-6 md:mt-8 bg-[#F97316] px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:scale-105 transition w-full sm:w-auto"
//           >
//             Start Your Journey
//           </button>
//         </div>

//         {/* RIGHT */}
//         <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">

//           {[
//             {
//               title: "Today's Tasks",
//               content: (
//                 <ul className="text-sm space-y-1">
//                   <li>✅ Polity</li>
//                   <li>✅ Algebra</li>
//                   <li className="text-gray-500">⬜ Thermodynamics</li>
//                 </ul>
//               )
//             },
//             {
//               title: "Study Connect",
//               content: (
//                 <div className="h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-lg flex items-center justify-center text-xs text-gray-400">
//                   📍 Active Users Nearby
//                 </div>
//               )
//             },
//             {
//               title: "Weekly Progress",
//               content: (
//                 <>
//                   <div className="h-2 bg-gray-800 rounded">
//                     <div className="h-2 bg-[#F97316] rounded w-3/4"></div>
//                   </div>
//                   <p className="text-xs mt-2 text-gray-500">75% completed</p>
//                 </>
//               ),
//               colSpan: "sm:col-span-2"
//             },
//             {
//               title: "Streak",
//               content: <p className="text-xl font-bold text-[#F97316]">12 🔥</p>
//             },
//             {
//               title: "Now Studying",
//               content: (
//                 <p className="text-sm text-gray-300">
//                   Polity - Parliament
//                 </p>
//               )
//             }
//           ].map((card, i) => (
//             <motion.div
//               key={i}
//               whileHover={{ scale: 1.04 }}
//               className={`bg-[#111]/70 border border-white/10 p-4 rounded-2xl ${card.colSpan || ""}`}
//             >
//               <h3 className="text-sm text-gray-400 mb-2">{card.title}</h3>
//               {card.content}
//             </motion.div>
//           ))}

//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { signInWithGoogle } from "@/lib/auth"
import { useRouter } from "next/navigation"

const quotes = [
  "Discipline beats motivation",
  "Consistency is your real competition",
  "Small steps daily = big results",
  "Focus. Execute. Repeat."
]

// ─── Particle network config ───────────────────────────────────────────────
const PARTICLE_COUNT = 70
const MAX_DIST = 130
const ORANGE = "249,115,22"

function initParticles(w: number, h: number) {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.5 + 1,
  }))
}

function useParticleCanvas(ref: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    let particles = initParticles(canvas.width, canvas.height)
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${ORANGE},0.75)`
        ctx.fill()

        // Draw edges
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.3
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${ORANGE},${alpha})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }

    draw()

    const observer = new ResizeObserver(() => {
      resize()
      particles = initParticles(canvas.width, canvas.height)
    })
    observer.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [ref])
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useParticleCanvas(canvasRef)

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async () => {
    try {
      setLoading(true)
      const user = await signInWithGoogle()
      if (user) router.push("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">

      {/* ── Particle network background ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* ── Soft glow blobs (sit above canvas, below content) ── */}
      <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-orange-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-orange-400/10 blur-[120px] rounded-full pointer-events-none" />

      {/* ── NAVBAR ── */}
      <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6 relative z-10">
        <h1 className="text-xl md:text-2xl font-bold">
          <span className="text-[#F97316]">Study</span>Twin
        </h1>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm md:text-base hover:scale-105 transition disabled:opacity-50"
        >
          <img src="/google.png" className="w-4 h-4 md:w-5 md:h-5" alt="Google" />
          {loading ? "Signing in..." : "Google"}
        </button>
      </div>

      {/* ── HERO ── */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-12 py-10 md:py-20 gap-12 relative z-10">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Your Personal{" "}
            <span className="text-[#F97316]">Study Twin</span>
          </h2>

          <motion.p
            key={quoteIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 md:mt-6 text-base md:text-lg text-gray-400"
          >
            {quotes[quoteIndex]}
          </motion.p>

          <button
            onClick={handleLogin}
            className="mt-6 md:mt-8 bg-[#F97316] px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/30 hover:scale-105 transition w-full sm:w-auto"
          >
            Start Your Journey
          </button>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "Today's Tasks",
              content: (
                <ul className="text-sm space-y-1">
                  <li>✅ Polity</li>
                  <li>✅ Algebra</li>
                  <li className="text-gray-500">⬜ Thermodynamics</li>
                </ul>
              ),
            },
            {
              title: "Study Connect",
              content: (
                <div className="h-16 bg-gradient-to-br from-orange-500/20 to-transparent rounded-lg flex items-center justify-center text-xs text-gray-400">
                  📍 Active Users Nearby
                </div>
              ),
            },
            {
              title: "Weekly Progress",
              content: (
                <>
                  <div className="h-2 bg-gray-800 rounded">
                    <div className="h-2 bg-[#F97316] rounded w-3/4" />
                  </div>
                  <p className="text-xs mt-2 text-gray-500">75% completed</p>
                </>
              ),
              colSpan: "sm:col-span-2",
            },
            {
              title: "Streak",
              content: <p className="text-xl font-bold text-[#F97316]">12 🔥</p>,
            },
            {
              title: "Now Studying",
              content: <p className="text-sm text-gray-300">Polity - Parliament</p>,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className={`bg-[#111]/70 border border-white/10 p-4 rounded-2xl backdrop-blur-sm ${card.colSpan || ""}`}
            >
              <h3 className="text-sm text-gray-400 mb-2">{card.title}</h3>
              {card.content}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
