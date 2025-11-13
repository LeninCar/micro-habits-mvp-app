"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, CheckCircle2, Circle, Filter, MoreVertical, Bell, Users } from 'lucide-react'
import type { Habit } from "@/app/page"

interface MainDashboardProps {
  habits: Habit[]
  onToggleHabit: (habitId: string) => void
  onAddHabit: () => void
  onEditHabit: (habit: Habit) => void
}

export function MainDashboard({ habits, onToggleHabit, onAddHabit, onEditHabit }: MainDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [completingHabitId, setCompletingHabitId] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const filteredHabits = selectedCategory === "todas" ? habits : habits.filter((h) => h.category === selectedCategory)

  const completedToday = filteredHabits.filter((h) => h.completedDates.includes(today)).length
  const totalHabits = filteredHabits.length
  const progressPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0

  const categories = [
    { value: "todas", label: "Todas", icon: "🌟" },
    { value: "salud", label: "Salud", icon: "💪" },
    { value: "estudio", label: "Estudio", icon: "📚" },
    { value: "descanso", label: "Descanso", icon: "😴" },
    { value: "finanzas", label: "Finanzas", icon: "💰" },
    { value: "bienestar", label: "Bienestar", icon: "🧘" },
  ]

  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId)
    const isCurrentlyCompleted = habit?.completedDates.includes(today)

    setCompletingHabitId(habitId)
    onToggleHabit(habitId)

    // Reproducir sonido de exito solo si el hábito NO estaba completado (se está marcando)
    if (!isCurrentlyCompleted) {
      const audio = new Audio("/sound/success.mp3")
      audio.play().catch(() => {})
    }

    setTimeout(() => setCompletingHabitId(null), 1000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">MicroHabits</h1>
        <p className="text-muted-foreground text-sm">Un paso pequeño hoy, un gran cambio mañana</p>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 mb-6 bg-linear-to-br from-primary/10 to-secondary/10 border-none">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Progreso de Hoy</h2>
          <span className="text-2xl font-bold text-primary">
            {completedToday}/{totalHabits}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground">
          {completedToday === totalHabits && totalHabits > 0
            ? "¡Increíble! Completaste todos tus hábitos 🎉"
            : `${totalHabits - completedToday} hábitos por completar`}
        </p>
      </Card>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filtrar por categoría</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? "bg-primary text-secondary"
                  : "bg-surface-secondary text-muted-foreground hover:bg-surface-secondary/80"
              }`}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Mis Micro-Hábitos</h2>
          <Button onClick={onAddHabit} size="sm" className="bg-primary hover:bg-primary-hover text-secondary rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>

        {filteredHabits.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === "todas" ? "Comienza tu viaje" : "No hay hábitos en esta categoría"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {selectedCategory === "todas"
                ? "Agrega tu primer micro-hábito y empieza a construir una mejor versión de ti"
                : "Agrega un nuevo hábito en esta categoría"}
            </p>
            <Button onClick={onAddHabit} className="bg-primary hover:bg-primary-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              Crear mi primer hábito
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHabits.map((habit) => {
              const isCompleted = habit.completedDates.includes(today)
              const isGroupHabit = !!habit.groupId
              const isAnimating = completingHabitId === habit.id

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`p-4 transition-all hover:shadow-md relative overflow-hidden ${
                      isCompleted ? "bg-success/5 border-success/30" : "bg-card"
                    }`}
                  >
                    {/* Animacion de cofeti al completar */}
                    <AnimatePresence>
                      {isAnimating && isCompleted && (
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(12)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-primary rounded-full"
                                initial={{ 
                                  x: 0,
                                  y: 0,
                                  opacity: 1,
                                  scale: 0 
                                }}
                                animate={{ 
                                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                                  opacity: 0,
                                  scale: 1,
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-3xl">{habit.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${isCompleted ? "text-success" : "text-foreground"}`}>
                                {habit.name}
                              </h3>
                              {isGroupHabit && (
                                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                                  <Users className="h-3 w-3" />
                                  {habit.groupName}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span className="capitalize">{habit.category}</span>
                                <span>•</span>
                                <span className="capitalize">{habit.frequency}</span>
                              </div>
                              {habit.reminderTime && (
                                <div className="flex items-center gap-1">
                                  <Bell className="h-3 w-3" />
                                  <span>{habit.reminderTime}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {!isGroupHabit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditHabit(habit)
                            }}
                            className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
                          >
                            <MoreVertical className="h-5 w-5 text-muted-foreground" />
                          </button>
                        )}
                        <motion.button
                          onClick={() => handleToggleHabit(habit.id)}
                          className="p-1 relative"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={isCompleted ? "Marcar como incompleto" : "Marcar como completado"}
                        >
                          {isCompleted ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle2 className="h-8 w-8 text-success cursor-pointer" />
                            </motion.div>
                          ) : (
                            <Circle className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer" />
                          )}
                        </motion.button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Motivational Quote */}
      <Card className="p-4 bg-surface-primary border-none">
        <p className="text-sm text-center text-muted-foreground italic">
          "Los pequeños cambios diarios crean resultados extraordinarios"
        </p>
      </Card>
    </div>
  )
}
