"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, CheckCircle2, Target, Users, Sparkles, Zap } from "lucide-react"
import type { Habit, Group } from "@/app/page"
import { useState } from "react"

interface ProfileViewProps {
  habits: Habit[]
  groups: Group[]
}

type Plan = {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  badge?: string
}

// Modal de confirmación de compra (sin cambios)
function ConfirmationModal({
  plan,
  onConfirm,
  onCancel,
}: {
  plan: Plan
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <Card role="dialog" aria-modal="true" aria-label="Confirmar compra" className="w-11/12 max-w-sm p-6 bg-background">
        <h2 className="text-lg font-bold text-foreground mb-4 text-center">Confirmar Compra</h2>
        <p className="text-muted-foreground text-center mb-6">
          ¿Estás seguro de adquirir el <span className="font-semibold text-primary">{plan.name}</span> por{" "}
          <span className="font-semibold text-primary">{plan.price}</span>?
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary text-white" onClick={onConfirm}>
            Confirmar y Pagar
          </Button>
        </div>
      </Card>
    </div>
  )
}

// NUEVO: Modal de cancelación de plan seleccionado
function CancelPlanModal({
  plan,
  onConfirmCancel,
  onClose,
}: {
  plan: Plan
  onConfirmCancel: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <Card role="dialog" aria-modal="true" aria-label="Cancelar plan" className="w-11/12 max-w-sm p-6 bg-background">
        <h2 className="text-lg font-bold text-foreground mb-3 text-center">¿Cancelar tu plan?</h2>
        <p className="text-muted-foreground text-center mb-6">
          Estás suscrito al <span className="font-semibold text-primary">{plan.name}</span>. Si cancelas, perderás los
          beneficios de <span className="font-semibold">MicroHabits Premium</span> al finalizar tu periodo actual.
        </p>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onClose}>
            Mantener plan
          </Button>
          <Button onClick={onConfirmCancel} className="bg-destructive text-destructive-foreground">
            Cancelar plan
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function ProfileView({ habits, groups }: ProfileViewProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false) // NUEVO
  const [planToConfirm, setPlanToConfirm] = useState<Plan | null>(null)
  const [planConfirmed, setPlanConfirmed] = useState<Plan | null>(null)

  // Stats
  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.completedDates.includes(new Date().toISOString().split("T")[0])).length
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0)
  const joinedGroups = groups.filter((g) => g.isJoined).length
  const longestStreak = 0 // demo

  const premiumPlans: Plan[] = [
    { id: "mensual", name: "Plan Mensual", price: "$4.99", period: "/mes", features: ["Hábitos ilimitados", "Estadísticas avanzadas"], badge: "Popular" },
    { id: "trimestral", name: "Plan Trimestral", price: "$12.99", period: "/3 meses", features: ["Todo del plan mensual", "Ahorra 13%"], badge: "Mejor valor" },
    { id: "anual", name: "Plan Anual", price: "$39.99", period: "/año", features: ["Todo del plan trimestral", "Ahorra 33%"], badge: "Máximo ahorro" },
  ]

  const handleSelectPlanClick = (plan: Plan) => {
    if (planConfirmed) return // evitar seleccionar otro si ya hay uno
    setPlanToConfirm(plan)
    setShowConfirmation(true)
  }

  const handleConfirmPurchase = () => {
    if (planToConfirm) {
      setPlanConfirmed(planToConfirm)
      setShowConfirmation(false)
      // Aquí iría la redirección a la pasarela de pagos.
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    setPlanToConfirm(null)
  }

  // NUEVO: abrir modal de cancelación desde "Plan seleccionado"
  const handleOpenCancelPlan = () => {
    if (planConfirmed) setShowCancelModal(true)
  }

  const handleConfirmCancelPlan = () => {
    setPlanConfirmed(null)
    setShowCancelModal(false)
  }

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {showConfirmation && planToConfirm && (
        <ConfirmationModal plan={planToConfirm} onConfirm={handleConfirmPurchase} onCancel={handleCancelConfirmation} />
      )}

      {showCancelModal && planConfirmed && (
        <CancelPlanModal plan={planConfirmed} onConfirmCancel={handleConfirmCancelPlan} onClose={handleCloseCancelModal} />
      )}

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm">Usuario MicroHabits</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 text-center">
          <Target className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{totalHabits}</div>
          <div className="text-xs text-muted-foreground">Hábitos activos</div>
        </Card>
        <Card className="p-4 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
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

      {/* Premium */}
      <div className="mb-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full mb-3">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Únete a Premium</span>
          </div>
          <p className="text-muted-foreground text-sm">Desbloquea todo el potencial de MicroHabits.</p>
        </div>

        <div className="space-y-4">
          {premiumPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-5 transition-all ${planConfirmed && planConfirmed.id !== plan.id ? "opacity-50" : ""}`}
            >
              {plan.badge && (
                <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground mb-3">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                {planConfirmed && planConfirmed.id === plan.id ? (
                  // BOTÓN CLICABLE QUE ABRE EL POPUP
                  <Button
                    onClick={handleOpenCancelPlan}
                    className="w-full bg-green-500 text-white"
                    title="Tu plan actual. Haz clic para gestionar la cancelación."
                  >
                    Plan seleccionado
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlanClick(plan)}
                    disabled={planConfirmed !== null}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Seleccionar plan
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Free Features */}
        <Card className="p-4 bg-muted/50 mt-6">
          <h3 className="font-semibold text-foreground mb-3 text-center">Versión Gratuita</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Hasta 5 hábitos activos
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Estadísticas básicas
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Unirse a 3 grupos
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Pausas activas básicas
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
