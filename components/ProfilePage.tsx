// "use client"

// import { useEffect, useState } from "react"
// import { auth, db } from "@/lib/firebase"
// import { doc, getDoc } from "firebase/firestore"
// import SkeletonCard from "./SkeletonCard"

// export default function ProfilePage() {
//   const [userData, setUserData] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUser = async () => {
//       const user = auth.currentUser
//       if (!user) return

//       const ref = doc(db, "users", user.uid)
//       const snap = await getDoc(ref)

//       if (snap.exists()) {
//         setUserData(snap.data())
//       }

//       setLoading(false)
//     }

//     fetchUser()
//   }, [])

//   // if (loading) {
//   //   return <div className="text-white p-6">Loading.</div>
//   // }

//   if (!userData) {
//   return (
//     <div className="space-y-4">
//       <SkeletonCard />
//     </div>
//   )
// }

//   return (
//     <div className="p-4 md:p-6">

//       {/* Header */}
//       <h1 className="text-2xl font-semibold mb-6">
//         👤 Your Profile
//       </h1>

//       {/* Card */}
//       <div className="bg-[#111]/70 border border-white/10 rounded-2xl p-6 shadow-lg shadow-orange-500/10 max-w-2xl">

//         {/* Top */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-14 h-14 rounded-full bg-[#F97316]/20 flex items-center justify-center text-xl">
//             {userData?.nickname?.[0] || "U"}
//           </div>

//           <div>
//             <h2 className="text-lg font-semibold">
//               {userData?.nickname || "User"}
//             </h2>
//             <p className="text-sm text-gray-400">
//               {userData?.email}
//             </p>
//           </div>
//         </div>

//         {/* Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           <div className="bg-white/5 p-4 rounded-xl">
//             <p className="text-sm text-gray-400">Exam</p>
//             <p className="text-base font-medium mt-1">
//               {userData?.exam}
//             </p>
//           </div>

//           <div className="bg-white/5 p-4 rounded-xl">
//             <p className="text-sm text-gray-400">Exam Date</p>
//             <p className="text-base font-medium mt-1">
//               {userData?.examDate}
//             </p>
//           </div>

//           <div className="bg-white/5 p-4 rounded-xl">
//             <p className="text-sm text-gray-400">Plan Generated</p>
//             <p className="text-base font-medium mt-1">
//               {userData?.planGenerated}
//             </p>
//           </div>

//           <div className="bg-white/5 p-4 rounded-xl">
//             <p className="text-sm text-gray-400">Streak</p>
//             <p className="text-base font-medium mt-1 text-orange-400">
//               🔥 12 Days
//             </p>
//           </div>

//         </div>

//         {/* Action Buttons */}
//         <div className="mt-6 flex gap-3">

//           <button className="flex-1 bg-[#F97316] py-2 rounded-lg hover:opacity-90 transition">
//             Edit Profile
//           </button>

//           <button className="flex-1 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition">
//             Share Progress
//           </button>

//         </div>

//       </div>
//     </div>
//   )
// }




"use client"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"



export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)


  const [progress, setProgress] = useState(0)

  const calculateProgress = (plan: any[], today: string) => {
  let total = 0
  let completed = 0

  plan.forEach((day) => {
    if (day.date <= today) {
      day.tasks.forEach((task: any) => {
        total++
        if (task.status === "completed") completed++
      })
    }
  })

  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

// useEffect(() => {
//   const fetchProgress = async () => {
//     const user = auth.currentUser
//     if (!user) return

//     const userRef = doc(db, "users", user.uid)
//     const userSnap = await getDoc(userRef)

//     if (!userSnap.exists()) return

//     const { planGenerated } = userSnap.data()

//     const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)
//     const planSnap = await getDoc(planRef)

//     if (!planSnap.exists()) return

//     const planData = planSnap.data().plan

//     const today = new Date().toISOString().split("T")[0]

//     const progressValue = calculateProgress(planData, today)

//     setProgress(progressValue)
//   }

//   fetchProgress()
// }, [])

const [completed, setCompleted] = useState(0)
const [pending, setPending] = useState(0)
const [missed, setMissed] = useState(0)

useEffect(() => {
  const fetchProgress = async () => {
    const user = auth.currentUser
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return

    const { planGenerated } = userSnap.data()

    const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)
    const planSnap = await getDoc(planRef)

    if (!planSnap.exists()) return

    const data = planSnap.data()

    let c = 0
    let p = 0
    let m = 0
    let total = 0

    data.plan.forEach((day: any) => {
      day.tasks.forEach((task: any) => {
        total++

        if (task.status === "completed") c++
        else if (task.status === "missed") m++
        else p++
      })
    })

    setCompleted(c)
    setPending(p)
    setMissed(m)

    const prog = total === 0 ? 0 : Math.round((c / total) * 100)
    setProgress(prog)
  }

  fetchProgress()
}, [])

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser
      if (!user) return

      const ref = doc(db, "users", user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        setUserData(snap.data())
      }
    }

    fetchUser()
  }, [])

  if (!userData) {
    return <div className="text-gray-400">Loading profile...</div>
  }

  // 🔥 Countdown logic
  const today = new Date()
  const examDate = new Date(userData.examDate)
  const daysLeft = Math.max(
    Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    0
  )

  return (
    <div className="w-full space-y-6">

      {/* 🔥 TOP PROFILE CARD */}
      <div className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-6 rounded-2xl border border-white/10 shadow-xl shadow-orange-500/10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-500/30">
            {userData.nickname?.[0] || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {userData.nickname}
            </h2>
            <p className="text-gray-400 text-sm">
              {auth.currentUser?.email}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="text-right">
          <p className="text-gray-400 text-sm">Exam Countdown</p>
          <p className="text-2xl font-bold text-orange-400">
            {daysLeft} Days
          </p>
        </div>

      </div>

      {/* 🔥 STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-[1.02] transition">
          <p className="text-gray-400 text-xs">Exam</p>
          <p className="font-semibold">{userData.exam}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-[1.02] transition">
          <p className="text-gray-400 text-xs">Exam Date</p>
          <p className="font-semibold">{userData.examDate}</p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-[1.02] transition">
          <p className="text-gray-400 text-xs">Plan Created</p>
          <p className="font-semibold">{userData.planGenerated}</p>
        </div>

        

        {/* <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-[1.02] transition">
          <p className="text-gray-400 text-xs">🔥 Streak</p>
          <p className="font-semibold text-orange-400">12 Days</p>
        </div> */}

        <div className="bg-[#111]/70 p-4 rounded-xl border border-white/10">
  <p className="text-sm text-gray-400">Mates Connected</p>
  <p className="text-lg font-semibold text-[#F97316]">3</p>
</div>

      </div>

      {/* 🔥 PROGRESS CARD (dummy for now but looks powerful) */}
      {/* <div className="bg-[#111]/70 p-6 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10">

        <div className="flex justify-between mb-3">
          <h3 className="font-semibold">Overall Progress</h3>
          <span className="text-sm text-gray-400">65%</span>
        </div>

        <div className="h-2 bg-white/10 rounded">
          <div
            className="h-2 bg-[#F97316] rounded"
            style={{ width: "65%" }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Based on completed study plan tasks
        </p>

      </div> */}

<div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10">

  {/* Header */}
  <div className="flex justify-between items-center mb-3">
    <h2 className="text-lg font-semibold">Your Progress</h2>
    <span className="text-sm text-gray-400">
      {progress}% Done
    </span>
  </div>

  {/* Progress Bar */}
  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
    <div
      className="h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    />
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4 mt-5 text-center">

    <div className="bg-black/30 p-3 rounded-xl border border-white/10">
      <p className="text-xs text-gray-400">Completed</p>
      <p className="text-lg font-semibold text-green-400">
        {completed}
      </p>
    </div>

    <div className="bg-black/30 p-3 rounded-xl border border-white/10">
      <p className="text-xs text-gray-400">Pending</p>
      <p className="text-lg font-semibold text-yellow-400">
        {pending}
      </p>
    </div>

    <div className="bg-black/30 p-3 rounded-xl border border-white/10">
      <p className="text-xs text-gray-400">Missed</p>
      <p className="text-lg font-semibold text-red-400">
        {missed}
      </p>
    </div>

  </div>

  {/* Footer */}
  <p className="text-xs text-gray-500 mt-4 text-center">
    Overall progress from start → exam date
  </p>

</div>

      

      {/* 🔥 ACTIONS */}
      <div className="flex gap-4">

        <button className="flex-1 bg-[#F97316] py-2 rounded-lg shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition">
          Edit Profile
        </button>

        <button className="flex-1 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition">
          Reset Plan
        </button>

      </div>

    </div>
  )
}