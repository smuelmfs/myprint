"use client"

import type React from "react"
import { useState } from "react"
import { AdminSidebar } from "@/components/dashboard/admin/admin-sidebar"
import { AdminNavbar } from "@/components/dashboard/admin/admin-navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
