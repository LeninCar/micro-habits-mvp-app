"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2 } from "lucide-react"
import type { Habit } from "@/app/page"

interface EditHabitModalProps {
  habit: Habit
  onClose: () => void
  onUpdate: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

const categories = [
  { value: "salud", label: "Salud", icon: "💪" },
  { value: "estudio", label: "Estudio", icon: "📚" },
  { value: "descanso", label: "Descanso", icon: "😴" },
  { value: "finanzas", label: "Finanzas", icon: "💰" },
  { value: "bienestar", label: "Bienestar", icon: "🧘" },
] as const

const icons = ["🧘", "📚", "💪", "🏃", "💧", "🥗", "😴", "✍️", "🎯", "💰", "🎨", "🎵"]

export function EditHabitModal({ habit, onClose, onUpdate, onDelete }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name)
  const [category, setCategory] = useState(habit.category)
  const [frequency, setFrequency] = useState(habit.frequency)
  const [selectedIcon, setSelectedIcon] = useState(habit.icon)
  const [reminderTime, setReminderTime] = useState(habit.reminderTime || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onUpdate({
        ...habit,
        name: name.trim(),
        category,
        frequency,
        icon: selectedIcon,
        reminderTime: reminderTime || undefined,
      })
    }
  }

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que quieres eliminar este hábito?")) {
      onDelete(habit.id)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Micro-Hábito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Nombre del hábito
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Meditar 5 minutos"
              className="mt-2"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Categoría</Label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    category === cat.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Frecuencia</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFrequency("diario")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  frequency === "diario" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">Diario</div>
                <div className="text-xs text-muted-foreground">Todos los días</div>
              </button>
              <button
                type="button"
                onClick={() => setFrequency("semanal")}
                className={`p-3 rounded-lg border-2 transition-all ${
                  frequency === "semanal" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-semibold">Semanal</div>
                <div className="text-xs text-muted-foreground">Cada semana</div>
              </button>
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Ícono</Label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 rounded-lg border-2 transition-all text-2xl ${
                    selectedIcon === icon ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <Label htmlFor="reminderTime" className="text-sm font-semibold">
              Recordatorio (opcional)
            </Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Configura una hora para recibir un recordatorio</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleDelete}
              variant="outline"
              className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white">
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
