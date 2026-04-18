// "use client"

// import { useState } from "react"

// export default function CalendarCard() {
//   const [selectedDate, setSelectedDate] = useState<number | null>(null)

//   const days = Array.from({ length: 30 }, (_, i) => i + 1)

//   return (
//     <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10">

//       <h2 className="text-lg font-semibold mb-4">Study Calendar</h2>

//       <div className="grid grid-cols-7 gap-2">
//         {days.map((day) => (
//           <div
//             key={day}
//             onClick={() => setSelectedDate(day)}
//             className="p-2 text-center rounded-lg bg-white/5 hover:bg-orange-500/20 cursor-pointer"
//           >
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* Popup */}
//       {selectedDate && (
//         <div className="mt-4 p-3 bg-[#0B0B0B] rounded-lg border border-white/10">
//           <p className="text-sm text-gray-400">
//             Tasks for Day {selectedDate}
//           </p>

//           <ul className="text-sm mt-2 space-y-1">
//             <li>✅ Polity</li>
//             <li>❌ Thermodynamics</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }



// "use client"

// import { useState } from "react"

// export default function CalendarCard() {
//  const [selectedDate, setSelectedDate] = useState<number | null>(null)

//   const days = Array.from({ length: 30 }, (_, i) => i + 1)

//   return (
//     <div className="bg-[#111]/70 p-5 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10">

//       <h2 className="text-lg font-semibold mb-4">Study Calendar</h2>

//       <div className="grid grid-cols-7 gap-2">
//         {days.map((day) => (
//           <div
//             key={day}
//             onClick={() => setSelectedDate(day)}
//             className="p-2 text-center rounded-lg bg-white/5 hover:bg-orange-500/20 cursor-pointer"
//           >
//             {day}
//           </div>
//         ))}
//       </div>

//       {/* 🔥 MODAL POPUP */}
//       {selectedDate && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">

//           {/* Background blur */}
//           <div
//             className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             onClick={() => setSelectedDate(null)}
//           />

//           {/* Modal */}
//           <div className="relative bg-[#111] p-6 rounded-2xl border border-white/10 w-[90%] max-w-sm shadow-xl shadow-orange-500/20">

//             <h3 className="text-lg font-semibold mb-3">
//               Day {selectedDate} Tasks
//             </h3>

//             <ul className="text-sm space-y-2">
//               <li>✅ Polity - Parliament</li>
//               <li>❌ Thermodynamics (Missed)</li>
//             </ul>

//             <button
//               onClick={() => setSelectedDate(null)}
//               className="mt-4 w-full bg-[#F97316] py-2 rounded-lg"
//             >
//               Close
//             </button>

//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { auth, db } from "@/lib/firebase"
import { doc, setDoc, getDoc,collection, getDocs } from "firebase/firestore"
import { onSnapshot } from "firebase/firestore"

export default function CalendarCard() {
  const [date, setDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [viewModal, setViewModal] = useState(false)
const [dayTasks, setDayTasks] = useState<any[]>([])
const [loadingTasks, setLoadingTasks] = useState(false)
const [taskDates, setTaskDates] = useState<string[]>([])
const [TaskData, setTaskData] = useState<string[]>([])
const [planData, setPlanData] = useState<any>(null)
const [planGenerated, setPlanGenerated] = useState("")

const formatDate = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
  // 🔥 SAVE TASK
//   const handleSave = async () => {
//         const user = auth.currentUser

//     if (!selectedDate || !subject || !topic) {
//       alert("Fill all fields")
//       return
//     }

//     const docId = `CDS_${user?.uid}`
//     const docRef = doc(db, "UserTask", docId)

//     const docSnap = await getDoc(docRef)

//     let existingTasks = []

//     if (docSnap.exists()) {
//       existingTasks = docSnap.data().tasks || []
//     }

//     // const updatedTasks = [
//     //   ...existingTasks,
//     //   { subject, topic }
//     // ]

//     const updatedTasks = [
//   ...existingTasks,
//   {
//     subject,
//     topic,
//     status: "pending" // 🔥 default
//   }
// ]

//     await setDoc(docRef, {
//       exam: "CDS",
//       date: selectedDate,
//       tasks: updatedTasks
//     })

//     // Reset
//     setShowModal(false)
//     setSubject("")
//     setTopic("")
//     setSelectedDate("")
//   }


const handleSave = async () => {
  const user = auth.currentUser
  if (!user) return

  if (!selectedDate || !subject || !topic) {
    alert("Fill all fields")
    return
  }

  const docId = `CDS_${user.uid}`
  const docRef = doc(db, "UserTask", docId)

  const docSnap = await getDoc(docRef)

  let tasksByDate: any = {}

  if (docSnap.exists()) {
    tasksByDate = docSnap.data().tasksByDate || {}
  }

  // 🔥 Existing tasks for selected date
  const existingTasks = tasksByDate[selectedDate] || []

  const updatedTasks = [
    ...existingTasks,
    {
      subject,
      topic,
      status: "pending",
      createdAt: new Date().toISOString()
    }
  ]

  // 🔥 Update only that date
  tasksByDate[selectedDate] = updatedTasks

  await setDoc(docRef, {
    exam: "CDS",
    tasksByDate
  })

  // Reset
  setShowModal(false)
  setSubject("")
  setTopic("")
  setSelectedDate("")
}



// useEffect(() => {
//   const fetchAllDates = async () => {
//     const snapshot = await getDocs(collection(db, "studyPlans"))

//     const dates: string[] = []

//     snapshot.forEach((doc) => {
//       const data = doc.data()
//       if (data.date) {
//         dates.push(data.date)
//       }
//     })

//     setTaskDates(dates)
//   }

//   fetchAllDates()
// }, [])


useEffect(() => {
  const fetchPlan = async () => {
    const user = auth.currentUser
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return

    const { planGenerated } = userSnap.data()
    setPlanGenerated(planGenerated)

    const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)
    const planSnap = await getDoc(planRef)

    if (planSnap.exists()) {
      setPlanData(planSnap.data().plan)
    }
  }

  fetchPlan()
}, [])



  return (
<div className="bg-[#111]/70 max-h-[71vh] overflow-y-auto custom-scrollbar p-5 rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10">

      <h2 className="text-lg font-semibold mb-4">Study Calendar</h2>

      {/* 📅 REAL CALENDAR */}
      <Calendar
        value={date}
        onChange={(val: any) => setDate(val)}
        
// onClickDay={(val) => {
//   const formatted = formatDate(val)
//   setSelectedDate(formatted)
//   setViewModal(true)

//   setLoadingTasks(true)

//   if (!planData) {
//     setDayTasks([])
//     setLoadingTasks(false)
//     return
//   }

//   const dayPlan = planData.find((d: any) => d.date === formatted)

//   if (dayPlan) {
//     setDayTasks(dayPlan.tasks)
//   } else {
//     setDayTasks([])
//   }

//   setLoadingTasks(false)
// }}
onClickDay={async (val) => {
  const formatted = formatDate(val)
  setSelectedDate(formatted)
  setViewModal(true)

  setLoadingTasks(true)

  const user = auth.currentUser
  if (!user) return

  try {
    // 🔹 1. STUDY PLAN
    const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)
    const planSnap = await getDoc(planRef)

    let planTasks: any[] = []

    if (planSnap.exists()) {
      const data = planSnap.data()
      const day = data.plan.find((d: any) => d.date === formatted)

      if (day) {
        planTasks = day.tasks || []
      }
    }

    // 🔹 2. USER TASK
    const userTaskRef = doc(db, "UserTask", `CDS_${user.uid}`)
    const userTaskSnap = await getDoc(userTaskRef)

    let userTasks: any[] = []

    if (userTaskSnap.exists()) {
      const data = userTaskSnap.data()

      if (data.tasksByDate && data.tasksByDate[formatted]) {
        userTasks = data.tasksByDate[formatted]
      }
    }

    // 🔥 Merge (but keep separate)
    setDayTasks([
      { type: "plan", tasks: planTasks },
      { type: "user", tasks: userTasks }
    ])

  } catch (err) {
    console.log(err)
    setDayTasks([])
  }

  setLoadingTasks(false)
}}

tileContent={({ date: tileDate, view }) => {
  if (view !== "month" || !planData) return null

  const formatted = formatDate(tileDate)
  const todayDate = formatDate(new Date())

  const dayPlan = planData.find((d: any) => d.date === formatted)

  if (!dayPlan) return null

  const total = dayPlan.tasks.length
  const completed = dayPlan.tasks.filter((t: any) => t.status === "completed").length

  const percent = total === 0 ? 0 : (completed / total) * 100

  // 🎯 CURRENT DAY
  if (formatted === todayDate) {
    return <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full mx-auto" />
  }

  // 🎯 PAST DAYS
  if (formatted < todayDate) {
    if (percent === 100) {
      return <div className="mt-1 w-2 h-2 bg-green-500 rounded-full mx-auto" />
    } else if (percent >= 80) {
      return (
        <div className="text-[10px] text-green-400 text-center">
          {Math.round(percent)}%
        </div>
      )
    } else {
      return <div className="mt-1 w-2 h-2 bg-red-500 rounded-full mx-auto" />
    }
  }

  // 🎯 FUTURE DAYS
  return <div className="mt-1 w-2 h-2 bg-orange-500 rounded-full mx-auto" />
}}
      />

      {/* ➕ Add Task Button */}
      <button
        onClick={() => setShowModal(true)}
        className="mt-4 w-full bg-[#F97316] py-2 rounded-lg cursor-pointer"
      >
        Add Task
      </button>

      {/* 🔥 ADD TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          {/* Background */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-[#111] p-6 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-xl shadow-orange-500/20">

            <h3 className="text-lg font-semibold mb-4">
              Add Study Task
            </h3>

            {/* Date */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-white/10"
            />

            {/* Subject */}
            <input
              placeholder="Subject (e.g. Polity)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-white/10"
            />

            {/* Topic */}
            <input
              placeholder="Topic (e.g. Parliament)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-white/10"
            />

            {/* Buttons */}
            <div className="flex gap-3 ">
              <button
              
                onClick={handleSave}
                className="flex-1 bg-[#F97316] py-2 rounded-lg cursor-pointer"
              >
                Save
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 py-2 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 VIEW TASK MODAL */}
{viewModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">

    {/* Background */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setViewModal(false)}
    />

    {/* Modal */}
    <div className="relative bg-[#111] p-6 rounded-2xl border border-white/10 w-[90%] max-w-md shadow-xl shadow-orange-500/20">

      <h3 className="text-lg font-semibold mb-4">
        Tasks for {selectedDate}
      </h3>

      {/* Loading */}
{loadingTasks ? (
  <p className="text-gray-400">Loading...</p>
) : dayTasks.length === 0 ? (
  <p className="text-gray-400">No tasks for this day</p>
) : (
  <div className="space-y-4">

    {/* 🔹 Study Plan Tasks */}
    {dayTasks[0]?.tasks?.length > 0 && (
      <div>
        <p className="text-xs text-gray-400 mb-2">📘 Study Plan</p>

        <ul className="space-y-2">
          {dayTasks[0].tasks.map((task: any, i: number) => (
            <li
              key={i}
              className="bg-white/5 p-2 rounded-lg text-sm flex justify-between"
            >
              <span>{task.subject} - {task.topic}</span>

              <span
                className={`text-xs ${
                  task.status === "completed"
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {task.status || "pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* 🔥 Divider */}
    {dayTasks[1]?.tasks?.length > 0 && (
      <div className="border-t border-white/10 pt-3">
        <p className="text-xs text-orange-400 mb-2">
          ✍️ Added by you
        </p>

        <ul className="space-y-2">
          {dayTasks[1].tasks.map((task: any, i: number) => (
            <li
              key={i}
              className="bg-orange-500/10 p-2 rounded-lg text-sm flex justify-between"
            >
              <span>{task.subject} - {task.topic}</span>

              <span
                className={`text-xs ${
                  task.status === "completed"
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {task.status || "pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

  </div>
)}

      <button
        onClick={() => setViewModal(false)}
        className="mt-4 w-full bg-[#F97316] py-2 rounded-lg cursor-pointer"
      >
        Close
      </button>

    </div>
  </div>
)}

    </div>
  )
}