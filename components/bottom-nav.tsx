"use client"

import { Home, Flame, Users, Heart, UserCircle } from "lucide-react"

interface BottomNavProps {
  currentView: "dashboard" | "streak" | "group" | "break" | "profile"
  onViewChange: (view: "dashboard" | "streak" | "group" | "break" | "profile") => void
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: "dashboard" as const, icon: Home, label: "Inicio" },
    { id: "streak" as const, icon: Flame, label: "Progreso" },
    { id: "group" as const, icon: Users, label: "Comunidad" },
    { id: "break" as const, icon: Heart, label: "Pausa" },
    { id: "profile" as const, icon: UserCircle, label: "Perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
