import { Card } from "@/components/ui/card"
import { Flame, Target, Award, TrendingUp, Calendar } from "lucide-react"
import type { Habit } from "@/app/page"

interface StreakViewProps {
  habits: Habit[]
}

export function StreakView({ habits }: StreakViewProps) {
  const calculateStreak = (habit: Habit) => {
    const sortedDates = [...habit.completedDates].sort().reverse()
    let streak = 0
    const today = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i])
      const expectedDate = new Date(today)
      expectedDate.setDate(today.getDate() - i)

      if (date.toISOString().split("T")[0] === expectedDate.toISOString().split("T")[0]) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0)
  const longestStreak = Math.max(...habits.map(calculateStreak), 0)
  const activeHabits = habits.filter((h) => calculateStreak(h) > 0).length

  const badges = [
    { name: "Principiante", icon: "🌱", unlocked: totalCompletions >= 1, requirement: "1 hábito completado" },
    { name: "Constante", icon: "⭐", unlocked: longestStreak >= 3, requirement: "3 días seguidos" },
    { name: "Dedicado", icon: "🔥", unlocked: longestStreak >= 7, requirement: "7 días seguidos" },
    { name: "Maestro", icon: "🏆", unlocked: totalCompletions >= 30, requirement: "30 hábitos completados" },
    { name: "Leyenda", icon: "👑", unlocked: longestStreak >= 30, requirement: "30 días seguidos" },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Tu Progreso</h1>
        <p className="text-muted-foreground text-sm">Celebra cada logro en tu camino</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-6 bg-gradient-to-br glow-pulse from-orange-500/20 to-orange-500/5 border-2 border-orange-500/40 shadow-lg relative overflow-hidden">
          {/* Efecto de brillo */}
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/10 to-transparent"></div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 animate-pulse">
              <Flame className="h-20 w-20 text-orange-500 drop-shadow-glow" />
            </div>
            <p className="text-3xl font-bold text-orange-500 mb-1">{longestStreak}</p>
            <p className="text-sm text-orange-500/80 font-medium">Días de racha</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-success/20 to-success/5 border-2 border-success/30 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <TrendingUp className="h-16 w-16 text-success" />
            </div>
            <p className="text-3xl font-bold text-success mb-1">{totalCompletions}</p>
            <p className="text-sm text-success/80 font-medium">Hábitos completados</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <Calendar className="h-16 w-16 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary mb-1">{activeHabits}</p>
            <p className="text-sm text-primary/80 font-medium">Días activos</p>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-900/20 to-amber-900/5 border-2 border-amber-900/30 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3">
              <Target className="h-16 w-16 text-amber-900" />
            </div>
            <p className="text-3xl font-bold text-amber-900 mb-1">{totalCompletions > 0 ? Math.round(totalCompletions / (habits.length + totalCompletions) * 100) : 0}%</p>
            <p className="text-sm text-amber-900/80 font-medium">Tasa de éxito</p>
          </div>
        </Card>    
      </div>
    
      {/* Individual Habit Streaks */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Rachas por Hábito</h2>
        <div className="space-y-3">
          {habits.map((habit) => {
            const streak = calculateStreak(habit)
            return (
              <Card key={habit.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{habit.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.completedDates.length} veces completado</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-primary">
                      <Flame className="h-5 w-5" />
                      <span className="text-2xl font-bold">{streak}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">días</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Award className="h-6 w-6 text-accent" />
          Logros Desbloqueados
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <Card
              key={badge.name}
              className={`p-4 text-center ${
                badge.unlocked
                  ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30"
                  : "bg-surface-secondary opacity-50"
              }`}
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="font-semibold text-sm mb-1">{badge.name}</div>
              <div className="text-xs text-muted-foreground">{badge.requirement}</div>
              {badge.unlocked && <div className="mt-2 text-xs font-semibold text-accent">✓ Desbloqueado</div>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
