// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
// import { auth } from "./firebase"

// const provider = new GoogleAuthProvider()

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider)
//     return result.user
//   } catch (error) {
//     console.error(error)
//   }
// }


import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const provider = new GoogleAuthProvider()
const formatDate = (d: Date) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    // 🔥 If first time → create user
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        // createdAt: new Date(),
        nickname: "",
        exam: ""
      })
    }

    return user
  } catch (error) {
    console.error(error)
  }
}