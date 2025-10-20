"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, CheckCircle2, Calendar, Target, Users, Sparkles, Zap, Star } from "lucide-react"
import type { Habit, Group } from "@/app/page"
import { useState } from "react"

interface ProfileViewProps {
  habits: Habit[]
  groups: Group[]
}

export function ProfileView({ habits, groups }: ProfileViewProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Calculate user stats
  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.completedDates.includes(new Date().toISOString().split("T")[0])).length
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0)
  const joinedGroups = groups.filter((g) => g.isJoined).length

  // Calculate longest streak
  const longestStreak = Math.max(
    ...habits.map((habit) => {
      const sortedDates = [...habit.completedDates].sort()
      let maxStreak = 0
      let currentStreak = 0

      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          currentStreak = 1
        } else {
          const prevDate = new Date(sortedDates[i - 1])
          const currDate = new Date(sortedDates[i])
          const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            currentStreak++
          } else {
            currentStreak = 1
          }
        }
        maxStreak = Math.max(maxStreak, currentStreak)
      }
      return maxStreak
    }),
    0,
  )

  const premiumPlans = [
    {
      id: "mensual",
      name: "Plan Mensual",
      price: "$4.99",
      period: "/mes",
      features: [
        "Hábitos ilimitados",
        "Estadísticas avanzadas",
        "Recordatorios personalizados",
        "Temas personalizados",
        "Exportar progreso",
        "Sin anuncios",
      ],
      badge: "Popular",
      color: "primary",
    },
    {
      id: "trimestral",
      name: "Plan Trimestral",
      price: "$12.99",
      period: "/3 meses",
      features: [
        "Todo del plan mensual",
        "Ahorra 13%",
        "Grupos privados ilimitados",
        "Análisis de productividad",
        "Soporte prioritario",
        "Insignias exclusivas",
      ],
      badge: "Mejor valor",
      color: "secondary",
    },
    {
      id: "anual",
      name: "Plan Anual",
      price: "$39.99",
      period: "/año",
      features: [
        "Todo del plan trimestral",
        "Ahorra 33%",
        "Coaching personalizado",
        "Acceso anticipado a funciones",
        "Contenido exclusivo",
        "Certificados de logros",
      ],
      badge: "Máximo ahorro",
      color: "accent",
    },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm">Usuario MicroHabits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 text-center">
          <Target className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalHabits}</div>
          <div className="text-xs text-muted-foreground">Hábitos activos</div>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalCompletions}</div>
          <div className="text-xs text-muted-foreground">Completados</div>
        </Card>
        <Card className="p-4 text-center">
          <Sparkles className="h-6 w-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">Racha máxima</div>
        </Card>
        <Card className="p-4 text-center">
          <Users className="h-6 w-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{joinedGroups}</div>
          <div className="text-xs text-muted-foreground">Grupos unidos</div>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card className="p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Progreso de Hoy
          </h3>
          <span className="text-sm font-medium text-primary">
            {completedToday}/{totalHabits}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
            style={{ width: `${totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0}%` }}
          />
        </div>
      </Card>

      {/* Premium Section */}
      <div className="mb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full mb-3">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Únete a Premium</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Desbloquea todo el potencial de MicroHabits y alcanza tus metas más rápido
          </p>
        </div>

        <div className="space-y-4">
          {premiumPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-5 cursor-pointer transition-all ${
                selectedPlan === plan.id ? "border-2 border-primary shadow-lg" : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {plan.badge}
                </div>
              )}
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  selectedPlan === plan.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-primary hover:bg-primary-hover text-white"
                }`}
              >
                {selectedPlan === plan.id ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Seleccionado
                  </>
                ) : (
                  "Seleccionar plan"
                )}
              </Button>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <Button className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white text-lg py-6">
            <Star className="h-5 w-5 mr-2" />
            Continuar con {premiumPlans.find((p) => p.id === selectedPlan)?.name}
          </Button>
        )}
      </div>

      {/* Free Features */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold text-foreground mb-3 text-center">Versión Gratuita</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Hasta 5 hábitos activos
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Estadísticas básicas
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Unirse a 3 grupos
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Pausas activas básicas
          </li>
        </ul>
      </Card>
    </div>
  )
}
