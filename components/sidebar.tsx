"use client"


import Link from "next/link"
import { LayoutDashboard, Users, FileQuestion, UserSquare2 } from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Mülakatlar", href: "/interviews" },
  { icon: FileQuestion, label: "Sorular", href: "/questions" },
  { icon: UserSquare2, label: "Adaylar", href: "/candidates" },
]

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-gray-800">
      <div className="flex h-20 items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700">
                <item.icon className="mr-3 h-6 w-6" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

