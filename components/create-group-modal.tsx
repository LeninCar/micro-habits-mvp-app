"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Group } from "@/app/page"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (group: Omit<Group, "id" | "members" | "activeToday" | "createdAt" | "isJoined">) => void
}

const categories = [
  { value: "salud", label: "Salud", icon: "💪" },
  { value: "estudio", label: "Estudio", icon: "📚" },
  { value: "descanso", label: "Descanso", icon: "😴" },
  { value: "finanzas", label: "Finanzas", icon: "💰" },
  { value: "bienestar", label: "Bienestar", icon: "🧘" },
  { value: "general", label: "General", icon: "🌟" },
]

export function CreateGroupModal({ isOpen, onClose, onCreate }: CreateGroupModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && description.trim()) {
      onCreate({
        name: name.trim(),
        description: description.trim(),
        category,
      })
      setName("")
      setDescription("")
      setCategory("general")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Crear Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <Label htmlFor="groupName" className="text-sm font-semibold">
              Nombre del grupo
            </Label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Estudiantes Productivos"
              className="mt-2"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el propósito de tu grupo..."
              className="mt-2 min-h-[100px]"
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

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-secondary" size="lg">
            Crear Grupo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
