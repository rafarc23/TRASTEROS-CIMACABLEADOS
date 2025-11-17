"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "propietario":
        return "Propietario"
      case "inmobiliaria":
        return "Inmobiliaria"
      case "administrador":
        return "Administrador"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex-1" />

            <div className="flex flex-col items-center gap-4">
              <img src="/logo-cima.png" alt="Cima Cableados" className="h-24 w-auto" />
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">TRASTEROS</h1>
                <p className="text-sm text-slate-300 mt-1">Sistema de gestión profesional</p>
              </div>
            </div>

            <div className="flex-1 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-red-500 hover:bg-red-500 bg-red-600 hover:border-red-400"
                  >
                    <User className="h-5 w-5 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.nombre}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs font-medium text-red-600">Rol: {user && getRoleLabel(user.role)}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
