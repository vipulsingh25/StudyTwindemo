// "use client"

// import { useState } from "react"
// import { auth, db } from "@/lib/firebase"
// import { doc, updateDoc } from "firebase/firestore"

// export default function ProfileSetup({ user, onComplete }) {
//   const [nickname, setNickname] = useState("")
//   const [exam, setExam] = useState("")

//   const handleSubmit = async () => {
//     if (!nickname || !exam) return alert("Fill all fields")

//   await updateDoc(doc(db, "users", user.uid), {
//     nickname,
//     exam
//   })

//     onComplete()
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">

//       {/* Background */}
//       <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

//       {/* Card */}
//       <div className="relative bg-[#111] p-6 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-xl shadow-orange-500/20">

//         <h2 className="text-xl font-semibold mb-4">
//           Complete Your Profile
//         </h2>

//         {/* Name */}
//         <input
//           value={user.displayName}
//           disabled
//           className="w-full mb-3 p-2 rounded bg-white/5 text-gray-400"
//         />

//         {/* Email */}
//         <input
//           value={user.email}
//           disabled
//           className="w-full mb-3 p-2 rounded bg-white/5 text-gray-400"
//         />

//         {/* Nickname */}
//         <input
//           placeholder="Enter Nickname"
//           value={nickname}
//           onChange={(e) => setNickname(e.target.value)}
//           className="w-full mb-3 p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-orange-500"
//         />

//         {/* Exam */}
//         <input
//           placeholder="Exam (CDS, JEE...)"
//           value={exam}
//           onChange={(e) => setExam(e.target.value)}
//           className="w-full mb-4 p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-orange-500"
//         />

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-[#F97316] py-2 rounded-lg shadow-lg shadow-orange-500/30"
//         >
//           Save Profile
//         </button>

//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { User } from "firebase/auth"

interface ProfileSetupProps {
  user: User
  onComplete: () => void
}

const formatDate = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
const [nickname, setNickname] = useState("")
  const [exam, setExam] = useState("")
  const [loading, setLoading] = useState(false)
  const [examDate, setexamDate] = useState("")
  
  const planGenerated = formatDate(new Date())
  const generatePlan = async (examDate: string) => {
  const res = await fetch("/api/generate-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ examDate }) // ✅ exam removed (we fixed it to CDS)
  })

  const data = await res.json()

  if (!data.success) {
    console.error("Plan Error:", data.error)
  }
}

//   const handleSubmit = async () => {
//     if (!nickname || !exam || !examDate) {
//       alert("Fill all fields")
//       return
//     }

//     try {
//       setLoading(true)

//       await updateDoc(doc(db, "users", user.uid), {
//         nickname,
//         exam,
//         examDate,
//         planGenerated
//       })

//         // 🔥 Call AI in background
//   // generatePlan(examDate)


//   //     onComplete()

//   await generatePlan(examDate) // optional await (better UX)

// onComplete()

// router.refresh() // 🔥 THIS reloads dashboard data
//     } catch (error) {
//       console.error(error)
//       alert("Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

const handleSubmit = async () => {
  if (!nickname || !exam || !examDate) {
    alert("Fill all fields")
    return
  }

  try {
    setLoading(true)

    await updateDoc(doc(db, "users", user.uid), {
      nickname,
      exam,
      examDate,
      planGenerated
    })

    // ✅ store session
    localStorage.setItem(
      "userData",
      JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        nickname,
        exam,
        examDate
      })
    )

    // 🔥 trigger AI (DO NOT WAIT)
    generatePlan(examDate)

    // 🔥 close modal → dashboard handles rest
    onComplete()

  } catch (error) {
    console.error(error)
    alert("Something went wrong")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-[#111] p-6 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-xl shadow-orange-500/20">

        <h2 className="text-xl font-semibold mb-4">
          Complete Your Profile
        </h2>

        {/* Name */}
        <input
          value={user?.displayName || ""}
          disabled
          className="w-full mb-3 p-2 rounded bg-white/5 text-gray-400"
        />

        {/* Email */}
        <input
          value={user?.email || ""}
          disabled
          className="w-full mb-3 p-2 rounded bg-white/5 text-gray-400"
        />

        {/* Nickname */}
        <input
          placeholder="Enter Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full mb-3 p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Exam */}
        <input
          placeholder="Exam (CDS, JEE...)"
          value={exam}
          onChange={(e) => setExam(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-orange-500"
        />

        <input
  type="date"
  value={examDate}
  onChange={(e) => setexamDate(e.target.value)}
  className="w-full mb-4 p-2 rounded bg-white/10 outline-none focus:ring-2 focus:ring-orange-500"
/>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#F97316] py-2 rounded-lg shadow-lg shadow-orange-500/30 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

      </div>
    </div>
  )
}