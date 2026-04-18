import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const formatDate = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export async function POST(req: Request) {
  try {
    const { examDate } = await req.json()
    const exam = "CDS"

    const today = formatDate(new Date())
    const docId = `${exam}_${today}`

    // 🔥 1. CHECK EXISTING PLAN
    const docRef = doc(db, "studyPlans", docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return Response.json({
        success: true,
        source: "db",
        data: docSnap.data()
      })
    }

    // 🧠 CALCULATE DAYS LEFT
    const todayDate = new Date(today)
    const examDateObj = new Date(examDate)

    const daysLeft = Math.ceil(
      (examDateObj.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    // 🔥 2. STRONG CDS PROMPT
    const prompt = `
Create a highly effective and realistic daily study plan for CDS (Combined Defence Services) written exam.

Start date: ${today}
Exam date: ${examDate}
Total days available: ${daysLeft}

Subjects to cover:
- Polity
- History
- Geography
- General Science
- Mathematics
- Current Affairs
- Economics
- English

Instructions:
- Adapt the study intensity based on days remaining.
- If more time is available → focus on concepts and gradual learning.
- If less time → increase revision, practice, and mock tests.
- Avoid burnout: do NOT overload any single day.
- Keep the plan sustainable and consistent.
- Include revision cycles (spaced repetition).
- Include mock tests closer to exam date.
- Distribute subjects evenly across timeline.
- Focus on maximizing score in written exam.

Output STRICT JSON ONLY:
[
  {
    "date": "YYYY-MM-DD",
    "tasks": [
      {
        "subject": "Subject Name",
        "topic": "Specific Topic",
        "status": "pending"
      }
    ]
  }
]

Rules:
- Each day should have balanced workload.
- Avoid vague tasks like "Study Polity"
- Keep topics specific (e.g., "Parliament Structure", "Fundamental Rights")
- No text outside JSON
`

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash-lite"
})

    const result = await model.generateContent(prompt)
    let text = result.response.text()

    // 🔥 CLEAN RESPONSE
    text = text.replace(/```json|```/g, "").trim()

    let parsed

    try {
      parsed = JSON.parse(text)
    } catch (err) {
      return Response.json({
        success: false,
        error: "AI returned invalid JSON"
      })
    }

    // 🔥 3. SAVE PLAN
    const planData = {
      exam,
      examDate,
      startDate: today,
      totalDays: daysLeft,
      plan: parsed,
      createdAt: new Date().toISOString()
    }

    await setDoc(docRef, planData)

    return Response.json({
      success: true,
      source: "ai",
      data: planData
    })

  } 
//   catch (error) {
//     return Response.json({
//       success: false,
//       error: "Something went wrong"
//     })
//   }

catch (error: any) {
  console.error("🔥 ERROR:", error)

  return Response.json({
    success: false,
    error: error.message || "Something went wrong"
  })
}
}