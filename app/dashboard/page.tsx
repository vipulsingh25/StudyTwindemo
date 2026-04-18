// import Sidebar from "@/components/Sidebar"
// import TodayTasks from "@/components/TodayTasks"
// import CalendarCard from "@/components/CalendarCard"
// import MatesCard from "@/components/MatesCard"

// export default function Dashboard() {
//   return (
//     <div className="flex bg-[#0B0B0B] text-white min-h-screen">

//       <Sidebar />

//       <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

//         <TodayTasks />
//         <CalendarCard />
//         <MatesCard />

//       </div>

//     </div>
//   )
// }



"use client"

import { useState,useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import TodayTasks from "@/components/TodayTasks"
import CalendarCard from "@/components/CalendarCard"
import MatesCard from "@/components/MatesCard"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, onSnapshot} from "firebase/firestore"
import ProfileSetup from "@/components/ProfileSetup"
import ProfilePage from "@/components/ProfilePage"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import CSSSMemoryTest from "@/components/CSSSMemoryTest"
import OLQDashboard from "@/components/OLQDashboard"

const FindMate = dynamic(() => import("@/components/findmate"), {
  ssr: false
})


export default function Dashboard() {
  const [open, setOpen] = useState(false)
const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileExists, setProfileExists] = useState(false)
  const [planReady, setPlanReady] = useState(false)
  const [planGenerated, setPlanGenerated] = useState<string | null>(null)
const [activeSection, setActiveSection] = useState<string>(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("activeSection") || "home"
  }
  return "home"
})  

const router = useRouter()

const [streak, setStreak] = useState(0)

const calculateStreak = (plan: any[]) => {
  if (!plan || plan.length === 0) return 0

  const sorted = [...plan].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let streak = 0

  for (let day of sorted) {
    const hasCompleted = day.tasks.some(
      (t: any) => t.status === "completed"
    )

    if (hasCompleted) {
      streak++
    } else {
      break
    }
  }

  return streak
}

useEffect(() => {
  const fetchPlan = async () => {
    if (!planGenerated) return

    const ref = doc(db, "studyPlans", `CDS_${planGenerated}`)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      const data = snap.data()
      const s = calculateStreak(data.plan)
      setStreak(s)
    }
  }

  fetchPlan()
}, [planGenerated])

useEffect(() => {
  localStorage.setItem("activeSection", activeSection)
}, [activeSection])

useEffect(() => {
  if (!planGenerated) return

  const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)

  const unsubscribe = onSnapshot(planRef, (docSnap) => {
    if (docSnap.exists()) {
      console.log("✅ Plan found")
      setPlanReady(true)
    }
  })

  return () => unsubscribe()
}, [planGenerated])


// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (u) => {
//     if (!u) {
//       router.push("/")
//       return
//     }

//     setUser(u)

//     const docRef = doc(db, "users", u.uid)
//     const docSnap = await getDoc(docRef)

//     if (docSnap.exists()) {
//       const data = docSnap.data()

//       // ✅ Check if profile is COMPLETE
//       if (data.nickname && data.exam) {
//         setProfileExists(true)
//       } else {
//         setProfileExists(false)
//       }
//     }

//     setLoading(false)
//   })

//   return () => unsubscribe()
// }, [])

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (u) => {
    if (!u) {
      router.push("/")
      return
    }

    setUser(u)

    const docRef = doc(db, "users", u.uid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()

      if (data.nickname && data.exam) {
        setProfileExists(true)
      } else {
        setProfileExists(false)
      }

      // 🔥 IMPORTANT
      if (data.planGenerated) {
        setPlanGenerated(data.planGenerated)
      }
    }

    setLoading(false)
  })

  return () => unsubscribe()
}, [])

  if (loading) return <div className="text-white p-6">Loading...</div>

// if (!planReady && profileExists) {
//   return (
//     <div className="flex items-center justify-center h-screen text-white">
//       <div className="animate-pulse text-lg">
//         🚀 Generating your AI study plan...
//       </div>
//     </div>
//   )
// }
  return (
    <div className="flex bg-[#0B0B0B] text-white min-h-screen">

      {/* Sidebar */}
      <div className={`fixed md:static z-50 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition`}>
       {/* <Sidebar 
  closeSidebar={() => setOpen(false)} 
  active={activeSection}
  setActive={setActiveSection}
/> */}

<Sidebar
  closeSidebar={() => setOpen(false)}
  active={activeSection}
  setActive={setActiveSection}
  streak={streak}
/>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">

        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-white/10">
          <button onClick={() => setOpen(true)}>☰</button>
          <h1 className="font-semibold">Dashboard</h1>
        </div>



        {/* Content */}
        {/* <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TodayTasks />
          <CalendarCard />
          <MatesCard />
        </div> */}
        {/* <div className="p-4 md:p-6">
  {activeSection === "home" && (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TodayTasks />
      <CalendarCard />
      <MatesCard />
    </div>
  )}

  {activeSection === "profile" && <ProfilePage />}

  {activeSection === "mates" && <MatesPage />}
</div> */}

<div className="p-4 md:p-6 relative overflow-hidden">

  <AnimatePresence mode="wait">

    {activeSection === "home" && (
      <motion.div
        key="home"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <TodayTasks />
        <CalendarCard />
        <MatesCard />
      </motion.div>
    )}

    {activeSection === "profile" && (
      <motion.div
        key="profile"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
      >
        <ProfilePage />
      </motion.div>
    )}

    {activeSection === "mates" && (
      <motion.div
        key="mates"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
      >
        <FindMate />
      </motion.div>
    )}
        {activeSection === "CSSSM" && (
      <motion.div
        key="CSSSM"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
      >
        <CSSSMemoryTest />
      </motion.div>
    )}
            {/* {activeSection === "OLQ" && (
      <motion.div
        key="OLQ"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
      >
        <OLQDashboard olqScores={undefined} consistency={0} insights={[]} />
      </motion.div>
    )} */}

  </AnimatePresence>

</div>

      </div>


            {/* 🔥 Show Profile Setup if not exists */}
      {!profileExists && user && (
        <ProfileSetup
          user={user}
          onComplete={() => setProfileExists(true)}
        />
      )}
    </div>
  )
}


