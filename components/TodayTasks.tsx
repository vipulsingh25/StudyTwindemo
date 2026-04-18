"use client"

import { useEffect, useState } from "react"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, updateDoc,onSnapshot } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import SkeletonCard from "./SkeletonCard"


type Task = {
  id: number
  subject: string
  topic: string
  status: string
}

export default function TodayTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
const [userTasks, setUserTasks] = useState<Task[]>([])
  const [planGenerated, setplanGenerated] = useState<string>("")
  const [planData, setPlanData] = useState<any>(null)

  const formatDate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const today = formatDate(new Date())



useEffect(() => {
  let unsubscribePlan: any
  let retryInterval: any
let unsubscribeUserTask: any
  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (!user) return

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) return

    const { planGenerated } = userSnap.data()
    if (!planGenerated) return

    setplanGenerated(planGenerated)

    const planRef = doc(db, "studyPlans", `CDS_${planGenerated}`)

    // 🔥 REALTIME LISTENER
    unsubscribePlan = onSnapshot(planRef, (snap) => {
      if (snap.exists()) {
        processPlan(snap.data())
        setLoading(false)

        // ✅ stop retry once data found
        if (retryInterval) clearInterval(retryInterval)
      }
    })

    const userTaskRef = doc(db, "UserTask", `CDS_${user.uid}`)

unsubscribeUserTask = onSnapshot(userTaskRef, (snap) => {
  if (!snap.exists()) {
    setUserTasks([])
    return
  }

  const data = snap.data()
  const tasksByDate = data.tasksByDate || {}

  const todayTasks = tasksByDate[today] || []

  const mapped = todayTasks.map((t: any, i: number) => ({
    id: i + 1000, // 🔥 avoid clash with AI tasks
    subject: t.subject,
    topic: t.topic,
    status: t.status || "pending"
  }))

  setUserTasks(mapped)
})

    // 🔥 FALLBACK (IMPORTANT)
    retryInterval = setInterval(async () => {
      const snap = await getDoc(planRef)

      if (snap.exists()) {
        processPlan(snap.data())
        setLoading(false)

        clearInterval(retryInterval)
      }
    }, 2000) // retry every 2 sec
  })

  const processPlan = (data: any) => {
    setPlanData(data)

    const todayPlan = data.plan.find((d: any) => d.date === today)

    if (todayPlan) {
      const mapped = todayPlan.tasks.map((t: any, i: number) => ({
        id: i,
        subject: t.subject,
        topic: t.topic,
        status: t.status || "pending"
      }))

      setTasks(mapped)
    } else {
      setTasks([])
    }
  }

return () => {
  unsubscribeAuth()
  if (unsubscribePlan) unsubscribePlan()
  if (unsubscribeUserTask) unsubscribeUserTask()
  if (retryInterval) clearInterval(retryInterval)
}
}, [])

const toggleUserTask = async (id: number) => {
  const user = auth.currentUser
  if (!user) return

  const updated = userTasks.map((task) =>
    task.id === id
      ? {
          ...task,
          status: task.status === "completed" ? "pending" : "completed"
        }
      : task
  )

  setUserTasks(updated)

  // 🔥 Update DB
  const docRef = doc(db, "UserTask", `CDS_${user.uid}`)
  const snap = await getDoc(docRef)

  if (!snap.exists()) return

  const data = snap.data()
  const tasksByDate = data.tasksByDate || {}

  const updatedDayTasks = updated.map(({ subject, topic, status }) => ({
    subject,
    topic,
    status
  }))

  await updateDoc(docRef, {
    [`tasksByDate.${today}`]: updatedDayTasks
  })
}

  // 🔁 TOGGLE TASK STATUS
  const toggleTask = async (id: number) => {
    if (!planData) return

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            status: task.status === "completed" ? "pending" : "completed"
          }
        : task
    )

    setTasks(updatedTasks)

    // 🔥 UPDATE INSIDE FULL PLAN ARRAY
    const updatedPlan = planData.plan.map((day: any) => {
      if (day.date === today) {
        return {
          ...day,
          tasks: updatedTasks.map(({ subject, topic, status }) => ({
            subject,
            topic,
            status
          }))
        }
      }
      return day
    })

    const docRef = doc(db, "studyPlans", `CDS_${planGenerated}`)

    await updateDoc(docRef, {
      plan: updatedPlan
    })
  }


if (loading) {
  return <SkeletonCard />
}


  // const completed = tasks.filter((t) => t.status === "completed").length
  // const total = tasks.length
  const allTasks = [...tasks, ...userTasks]

const completed = allTasks.filter((t) => t.status === "completed").length
const total = allTasks.length
  const progress = total === 0 ? 0 : (completed / total) * 100

  return (
<div className="bg-[#111]/70 max-h-[71vh] rounded-2xl border border-white/10 shadow-lg shadow-orange-500/10 flex flex-col">

  {/* 🔒 STATIC HEADER */}
  <div className="p-5 border-b border-white/10 sticky top-0 bg-[#111]/90 backdrop-blur z-10">
    
    {/* Title */}
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-semibold">Today's Tasks</h2>
      <span className="text-sm text-gray-400">
        {completed}/{total} Done
      </span>
    </div>

    {/* Progress */}
    <div className="h-2 bg-white/10 rounded">
      <div
        className="h-2 bg-[#F97316] rounded transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>

  </div>

  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-3">

  {/* AI TASKS */}
  {tasks.length === 0 && userTasks.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No tasks planned for today
    </p>
  ) : (
    <>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 cursor-pointer bg-white/5 px-3 py-2 rounded-lg"
          onClick={() => toggleTask(task.id)}
        >
          <div
            className={`w-5 h-5 flex items-center justify-center rounded border
            ${
              task.status === "completed"
                ? "bg-green-500 border-green-500"
                : "border-gray-400"
            }`}
          >
            {task.status === "completed" && "✓"}
          </div>

          <span
            className={`text-sm ${
              task.status === "completed"
                ? "line-through text-gray-500"
                : ""
            }`}
          >
            {task.subject} - {task.topic}
          </span>
        </div>
      ))}

      {/* 🔥 Divider */}
      {userTasks.length > 0 && (
        <div className="border-t border-white/10 my-3 pt-2">
          <p className="text-xs text-gray-400 mb-2">
            ✍️ Added by you
          </p>

          {/* {userTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center mt-2 gap-3 bg-[#F97316]/10 px-3 py-2 rounded-lg"
            >
              <div className="w-5 h-5 rounded border border-[#F97316]" />

              <span className="text-sm text-[#F97316]">
                {task.subject} - {task.topic}
              </span>
            </div>
          ))} */}

                {userTasks.map((task) => (
  <div
    key={task.id}
    onClick={() => toggleUserTask(task.id)}
    className="flex items-center mt-2 gap-3 cursor-pointer bg-[#F97316]/10 px-3 py-2 rounded-lg"
  >
    <div
      className={`w-5 h-5 flex items-center justify-center rounded border
      ${
        task.status === "completed"
          ? "bg-green-500 border-green-500"
          : "border-[#F97316]"
      }`}
    >
      {task.status === "completed" && "✓"}
    </div>

    <span
      className={`text-sm ${
        task.status === "completed"
          ? "line-through text-gray-500"
          : "text-[#F97316]"
      }`}
    >
      {task.subject} - {task.topic}
    </span>
  </div>
))}
        </div>
      )}


    </>
  )}

</div>

    </div>
  )
}