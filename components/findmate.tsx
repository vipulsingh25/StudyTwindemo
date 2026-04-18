// "use client"

// import { useEffect, useState } from "react"
// import { MapContainer, TileLayer, Marker, Popup, } from "react-leaflet"
// import { updateDoc, doc, collection, getDocs } from "firebase/firestore"
// import { db, auth } from "@/lib/firebase"
// import L from "leaflet"
// import "leaflet/dist/leaflet.css"

// export default function FindMate() {
//   const [users, setUsers] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
// const [center, setCenter] = useState<[number, number] | null>(null)
//   // 📍 Get Location
//   const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
//     return new Promise((resolve, reject) => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const lat = pos.coords.latitude
//           const lng = pos.coords.longitude

//           resolve({
//             lat: Math.round(lat * 100) / 100,
//             lng: Math.round(lng * 100) / 100
//           })
//         },
//         (err) => reject(err)
//       )
//     })
//   }



//   // 💾 Save Location
//   const saveLocation = async () => {
//     const user = auth.currentUser
//     if (!user) return

//     try {
//       const loc = await getUserLocation()

//       await updateDoc(doc(db, "users", user.uid), {
//         location: loc
//       })
//     } catch (err) {
//       console.log("Location denied")
//     }
//   }

//   // 👥 Fetch Users
//   const fetchUsers = async () => {
//     const snapshot = await getDocs(collection(db, "users"))

//     const users: any[] = []

//     snapshot.forEach((doc) => {
//       const data = doc.data()

//       if (data.location) {
//         users.push({
//           id: doc.id,
//           ...data
//         })
//       }
//     })

//     return users
//   }

//   // 🚀 Init
// useEffect(() => {
//   const init = async () => {
//     try {
//       const loc = await getUserLocation()

//       setCenter([loc.lat, loc.lng])

//       await updateDoc(doc(db, "users", auth.currentUser!.uid), {
//         location: loc
//       })
//     } catch (err) {
//       // fallback → India center
//       setCenter([28.61, 77.23])
//     }

//     const data = await fetchUsers()
//     setUsers(data)
//     setLoading(false)
//   }

//   init()
// }, [])

//   if (loading) {
//     return <div className="text-white p-4">Loading map...</div>
//   }

//   return (
//     <div className="h-[500px] rounded-2xl overflow-hidden">

//  <MapContainer
//   center={center}
//   zoom={6}
//   style={{ height: "100%", width: "100%" }}
// >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

// {users.map((user) => {
//   const initial = (user.nickname || "U")[0].toUpperCase()

//   const customIcon = L.divIcon({
//     className: "",
//     html: `
//       <div style="
//         display:flex;
//         flex-direction:column;
//         align-items:center;
//       ">
        
//         <div style="
//           width:40px;
//           height:40px;
//           border-radius:50%;
//           background:#F97316;
//           color:white;
//           display:flex;
//           align-items:center;
//           justify-content:center;
//           font-weight:bold;
//           font-size:16px;
//           border:2px solid white;
//           box-shadow:0 0 10px rgba(0,0,0,0.4);
//         ">
//           ${initial}
//         </div>

//         <div style="
//           margin-top:4px;
//           font-size:10px;
//           background:#111;
//           color:#F97316;
//           padding:2px 6px;
//           border-radius:6px;
//           border:1px solid rgba(255,255,255,0.1);
//         ">
//           ${user.exam || ""}
//         </div>

//       </div>
//     `,
//     iconSize: [40, 50],
//     iconAnchor: [20, 40]
//   })

//   return (
//     <Marker
//       key={user.id}
//       position={[user.location.lat, user.location.lng]}
//       icon={customIcon}
//     >
//       <Popup>
//         <div>
//           <p className="font-semibold">
//             {user.nickname || "User"}
//           </p>
//           <p className="text-sm text-gray-500">
//             {user.exam}
//           </p>
//         </div>
//       </Popup>
//     </Marker>
//   )
// })}

//       </MapContainer>
//     </div>
//   )
// }


"use client"

import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

import { useEffect, useState, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet"
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  arrayUnion
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import "leaflet/dist/leaflet.css"

export default function FindMate() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [center, setCenter] = useState<[number, number] | null>(null)
  const [selectedMate, setSelectedMate] = useState<any>(null)
const [filter, setFilter] = useState<"explore" | "connected">(() => {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("mateFilter") as any) || "explore"
  }
  return "explore"
})
  // 📍 Get Location
  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: Math.round(pos.coords.latitude * 100) / 100,
            lng: Math.round(pos.coords.longitude * 100) / 100
          })
        },
        (err) => reject(err)
      )
    })
  }


  useEffect(() => {
  localStorage.setItem("mateFilter", filter)
}, [filter])

  // 💾 Save Location
  const saveLocation = async (loc: any) => {
    const user = auth.currentUser
    if (!user) return

    await updateDoc(doc(db, "users", user.uid), {
      location: loc
    })
  }

  // 👥 Fetch Users
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"))

    const users: any[] = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      if (data.location) {
        users.push({
          id: docSnap.id,
          ...data
        })
      }
    })

    setUsers(users)
  }

  const currentUser = auth.currentUser

const filteredUsers = users.filter((user) => {
  if (!currentUser) return false

  if (filter === "connected") {
    return user.connections?.includes(currentUser.uid)
  }

  // explore → exclude self + already connected
  return (
    user.id !== currentUser.uid &&
    !user.connections?.includes(currentUser.uid)
  )
})

  // 🤝 Send Connect Request
  const sendRequest = async (targetId: string) => {
    const user = auth.currentUser
    if (!user) return

    await updateDoc(doc(db, "users", targetId), {
      requests: arrayUnion(user.uid)
    })

    alert("Request sent 🚀")
  }

  // 🚀 Init
  useEffect(() => {
    const init = async () => {
      try {
        const loc = await getUserLocation()
        setCenter([loc.lat, loc.lng])
        await saveLocation(loc)
      } catch {
        setCenter([28.61, 77.23]) // fallback
      }

      await fetchUsers()
      setLoading(false)
    }

    init()
  }, [])

  // ⚡ Marker generator (optimized)
  const getIcon = (user: any) => {
    const initial = (user.nickname || "U")[0].toUpperCase()

    return L.divIcon({
      className: "",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="
            width:42px;height:42px;border-radius:50%;
            background:#F97316;color:white;
            display:flex;align-items:center;justify-content:center;
            font-weight:bold;font-size:16px;
            border:2px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.4);
          ">
            ${initial}
          </div>

          <div style="
            margin-top:4px;font-size:10px;
            background:#111;color:#F97316;
            padding:2px 6px;border-radius:6px;
            border:1px solid rgba(255,255,255,0.1);
          ">
            ${user.exam || ""}
          </div>
        </div>
      `,
      iconSize: [42, 52],
      iconAnchor: [21, 42]
    })
  }



  if (!center) {
  return <div className="text-white p-4">Loading map...</div>
}

return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

    {/* 🗺️ MAP */}
    <div className="lg:col-span-2 relative h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden border border-white/10">

      {/* FILTER */}
      <div className=" top-3 left-3 flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
        <button
          onClick={() => setFilter("explore")}
          className={`px-3 py-1.5 text-xs rounded-md transition cursor-pointer
            ${
              filter === "explore"
                ? "bg-[#F97316] text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
        >
          🌍 Explore
        </button>

        <button
          onClick={() => setFilter("connected")}
          className={`px-3 py-1.5 text-xs rounded-md transition cursor-pointer
            ${
              filter === "connected"
                ? "bg-[#22c55e] text-white"
                : "text-gray-400 hover:bg-white/10"
            }`}
        >
          🤝 Connected
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {filteredUsers.map((user) => (
          <Marker
            key={user.id}
            position={[user.location.lat, user.location.lng]}
            icon={getIcon(user)}
          >
            <Popup>
              <div className="space-y-2">
                <p className="font-semibold">{user.nickname}</p>
                <p className="text-xs text-gray-400">{user.exam}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>

    {/* 🤝 RIGHT PANEL */}
    <div className="bg-[#111]/70 rounded-2xl border border-white/10 p-4 h-[60vh] md:h-[70vh] flex flex-col">

      {/* HEADER */}
      <h2 className="text-sm font-semibold mb-3 text-gray-300">
        Connected Mates
      </h2>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-3">

        {/* 🔥 DEMO DATA */}
        {[
          { name: "Aman", exam: "CDS", status: "Online" },
          { name: "Riya", exam: "CDS", status: "Studying" },
          { name: "Karan", exam: "CDS", status: "Offline" }
        ].map((mate, i) => (
          <div
            key={i}
            className="bg-white/5 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-white/10"
                        onClick={() => setSelectedMate(mate)}

          >
            <div>
              <p className="text-sm font-medium">{mate.name}</p>
              <p className="text-xs text-gray-400">{mate.exam}</p>
            </div>

            <span
              className={`text-xs ${
                mate.status === "Online"
                  ? "text-green-400"
                  : mate.status === "Studying"
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              {mate.status}
            </span>
          </div>
        ))}
      </div>

      {/* 🧪 STUDY ROOM (DEMO) */}
      <div className="mt-4 bg-[#0B0B0B] border border-white/10 rounded-xl p-3">

        <p className="text-xs text-gray-400 mb-2">
          🔥 Live Study Room
        </p>

        <p className="text-sm mb-2">
          3 users studying now
        </p>

        <button className="w-full bg-[#F97316] py-1.5 rounded-md text-xs cursor-pointer">
          Join Room
        </button>

      </div>

    </div>


{selectedMate && (
  <div className="fixed inset-0 flex items-center justify-center z-[9999]">

    {/* overlay */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setSelectedMate(null)}
    />

    {/* modal */}
    <div className="relative bg-[#111] p-5 rounded-xl border border-white/10 w-[90%] max-w-sm shadow-xl shadow-orange-500/20">

      <h3 className="text-lg font-semibold mb-2">
        {selectedMate.name}
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        Preparing for {selectedMate.exam}
      </p>

      <button className="w-full bg-[#F97316] py-2 rounded-lg mb-2 hover:scale-[1.02] transition cursor-pointer">
        💬 Send Message
      </button>

      <button
        onClick={() => setSelectedMate(null)}
        className="w-full bg-white/10 py-2 rounded-lg hover:bg-white/20 transition cursor-pointer"
      >
        Close
      </button>

    </div>
  </div>
)}

  </div>
)
  
}