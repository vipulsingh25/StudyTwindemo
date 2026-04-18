// "use client"

// export default function Sidebar() {
//   return (
//     <div className="h-screen w-[240px] bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between p-4">

//       {/* Top */}
//       <div>
//         <h1 className="text-xl font-bold mb-8">
//           <span className="text-[#F97316]">Study</span>Twin
//         </h1>

//         <div className="space-y-3">

//           <button className="w-full text-left px-4 py-2 rounded-lg bg-[#F97316]/20 text-[#F97316]">
//             🏠 Home
//           </button>

//           <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             🤝 Find Mate
//           </button>

//           <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             👤 Profile
//             <div className="text-xs text-gray-400 mt-1">🔥 Streak: 12 days</div>
//           </button>

//         </div>
//       </div>

//       {/* Bottom */}
//       <button className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400">
//         Logout
//       </button>
//     </div>
//   )
// }


// "use client"

// export default function Sidebar({ closeSidebar }) {
//   return (
//     <div className="h-screen w-[240px] bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between p-4">

//       <div>
//         <h1 className="text-xl font-bold mb-8">
//           <span className="text-[#F97316]">Study</span>Twin
//         </h1>

//         <div className="space-y-3">

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg bg-[#F97316]/20 text-[#F97316]">
//             🏠 Home
//           </button>

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             🤝 Find Mate
//           </button>

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             👤 Profile
//             <div className="text-xs text-gray-400 mt-1">🔥 Streak: 12 days</div>
//           </button>

//         </div>
//       </div>

//       <button className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400">
//         Logout
//       </button>
//     </div>
//   )
// }


// "use client"
// import { signOut } from "firebase/auth"
// import { auth } from "@/lib/firebase"
// import { useRouter } from "next/navigation"

// type SidebarProps = {
//   closeSidebar: () => void
// }

// export default function Sidebar({ closeSidebar }: SidebarProps) {

//   const router = useRouter()

//   const handleLogout = async () => {
//     await signOut(auth)
//     router.push("/")
//   }

//   return (
//     <div className="h-screen w-[240px] bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between p-4">

//       <div>
//         <h1 className="text-xl font-bold mb-8">
//           <span className="text-[#F97316]">Study</span>Twin
//         </h1>

//         <div className="space-y-3">

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg bg-[#F97316]/20 text-[#F97316]">
//             🏠 Home
//           </button>

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             🤝 Find Mate
//           </button>

//           <button onClick={closeSidebar} className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5">
//             👤 Profile
//             <div className="text-xs text-gray-400 mt-1">🔥 Streak: 12 days</div>
//           </button>

//         </div>
//       </div>

//       {/* <button className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400">
//         Logout
//       </button> */}

//       <button
//   onClick={handleLogout}
//   className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400"
// >
//   Logout
// </button>
//     </div>
//   )
// }


"use client"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

// type SidebarProps = {
//   closeSidebar: () => void
//   active: string
//   setActive: (val: string) => void
// }

type SidebarProps = {
  closeSidebar: () => void
  active: string
  setActive: (val: string) => void
  streak: number
}

export default function Sidebar({ closeSidebar, active, setActive,streak }: SidebarProps) {
  const router = useRouter()

  

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  const navItem = (key: string, label: string, icon: string) => (
    <button
      onClick={() => {
        setActive(key)
        closeSidebar()
      }}
      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer
        ${
          active === key
            ? "bg-[#F97316]/20 text-[#F97316]"
            : "hover:bg-white/5 text-gray-300"
        }`}
    >
      {icon} {label}
    </button>
  )

  return (
    // <div className="h-screen w-[240px] bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between p-4">

    //   <div>
    //     <h1 className="text-xl font-bold mb-8">
    //       <span className="text-[#F97316]">Study</span>Twin
    //     </h1>

    //     <div className="space-y-3">
    //       {navItem("home", "Home", "🏠")}
    //       {navItem("mates", "Find Mate", "🤝")}

    //       <div>
    //         {navItem("profile", "Profile", "👤")}
    //         <div className="text-xs text-gray-400 mt-1 ml-4">
    //           🔥 Streak: 12 days
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <button
    //     onClick={handleLogout}
    //     className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
    //   >
    //     Logout
    //   </button>
    // </div>

    <div className="h-screen w-[240px] bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between p-4">

  {/* Top */}
  <div>
    <h1 className="text-xl font-bold mb-8 text-center">
      <span className="text-[#F97316]">Study</span>Twin
    </h1>

    {/* Navigation */}
    <div className="space-y-3">
      {navItem("home", "Home", "🏠")}
      {/* {navItem("CSSSM", "CSSSM", "👤")}
            {navItem("OLQ", "OLQ", "🤝")} */}

      {navItem("mates", "Find Mate", "🤝")}
      {navItem("profile", "Profile", "👤")}
    </div>
      <div className="flex justify-center my-6">
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/20">

    <span className="text-sm">🔥</span>

    <span className="text-xs text-gray-300">
      {streak} day streak
    </span>

  </div>
</div>
  </div>

  {/* 🔥 CENTER STREAK CARD */}
  {/* <div className="flex justify-center my-6">
    <div className="w-full bg-[#111]/80 border border-white/10 rounded-2xl p-4 text-center shadow-lg shadow-orange-500/10">

      <div className="text-3xl mb-1">🔥</div>

      <p className="text-sm text-gray-400">
        Current Streak
      </p>

      <p className="text-2xl font-bold text-[#F97316]">
        12 Days
      </p>

      <p className="text-xs text-gray-500 mt-1">
        Keep it going!
      </p>

    </div>
  </div> */}



  {/* Bottom */}
  <button
    onClick={handleLogout}
    className="text-left px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
  >
    Logout
  </button>

</div>
  )
}
