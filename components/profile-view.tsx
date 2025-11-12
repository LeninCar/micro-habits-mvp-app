"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, CheckCircle2, Target, Users, Sparkles, Zap, Edit2, Camera, User } from "lucide-react"
import type { Habit, Group } from "@/app/page"
import { useState, useEffect } from "react"

interface ProfileViewProps {
  habits: Habit[]
  groups: Group[]
}

// Tipo para datos del perfil de usuario
type UserProfile = {
  name: string
  avatar: string
}

// Modal para editar perfil
function EditProfileModal({
  currentProfile,
  onSave,
  onCancel,
}: {
  currentProfile: UserProfile
  onSave: (profile: UserProfile) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(currentProfile.name)
  const [avatar, setAvatar] = useState(currentProfile.avatar)

  // Avatares predefinidos
  const avatarOptions = [
    "👤", "😊", "🙂", "😎", "🤓", "👨", "👩", "👦", "👧",
    "🧑", "👴", "👵", "🧔", "👱", "👨‍💼", "👩‍💼", "👨‍🎓", "👩‍🎓",
    "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎨", "👨‍🎨", "👩‍🎨"
  ]

  const handleSave = () => {
    if (name.trim()) {
      onSave({ name: name.trim(), avatar })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <Card 
        role="dialog" 
        aria-modal="true" 
        aria-label="Editar perfil" 
        className="w-full max-w-md p-6 bg-background max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
          <Edit2 className="h-6 w-6 text-primary" />
          Editar Perfil
        </h2>

        {/* Avatar actual */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-5xl">
            {avatar}
          </div>
          <p className="text-sm text-muted-foreground">Selecciona tu avatar</p>
        </div>

        {/* Selector de avatares */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Avatares disponibles
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-muted/30 rounded-lg">
            {avatarOptions.map((ava, idx) => (
              <button
                key={idx}
                onClick={() => setAvatar(ava)}
                className={'text-3xl p-2 rounded-lg transition-all ' +
                  (avatar === ava 
                    ? 'bg-primary/20 ring-2 ring-primary scale-110' 
                    : 'hover:bg-muted/50 hover:scale-105'
                  )}
              >
                {ava}
              </button>
            ))}
          </div>
        </div>

        {/* Input de nombre */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
            <User className="h-4 w-4" />
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nombre"
            maxLength={30}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {name.length}/30 caracteres
          </p>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full bg-primary hover:bg-primary-hover text-white"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Guardar cambios
          </Button>
          <Button 
            onClick={onCancel} 
            variant="outline"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </Card>
    </div>
  )
}

type Plan = {
  id: string
  name: string
  price: string
  period: string
  features: string[]
  badge?: string
}

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

export function ProfileView({ habits, groups }: ProfileViewProps) {
  // Estado del perfil de usuario
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "Usuario MicroHabits", avatar: "👤" })
  const [showEditProfile, setShowEditProfile] = useState(false)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [planToConfirm, setPlanToConfirm] = useState<Plan | null>(null)
  const [planConfirmed, setPlanConfirmed] = useState<Plan | null>(null)

  // Cargar perfil desde localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("microhabits-user-profile")
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile)
        setUserProfile(parsed)
      } catch (e) {
        console.error("Error parsing user profile:", e)
      }
    }
  }, [])

  // Guardar perfil en localStorage
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile)
    localStorage.setItem("microhabits-user-profile", JSON.stringify(newProfile))
    setShowEditProfile(false)
  }

  // Stats
  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.completedDates.includes(new Date().toISOString().split("T")[0])).length
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0)
  const joinedGroups = groups.filter((g) => g.isJoined).length
  const longestStreak = 0

  const premiumPlans: Plan[] = [
    { id: "mensual", name: "Plan Mensual", price: "$4.99", period: "/mes", features: ["Hábitos ilimitados", "Estadísticas avanzadas"], badge: "Popular" },
    { id: "trimestral", name: "Plan Trimestral", price: "$12.99", period: "/3 meses", features: ["Todo del plan mensual", "Ahorra 13%"], badge: "Mejor valor" },
    { id: "anual", name: "Plan Anual", price: "$39.99", period: "/año", features: ["Todo del plan trimestral", "Ahorra 33%"], badge: "Máximo ahorro" },
  ]

  const handleSelectPlanClick = (plan: Plan) => {
    if (planConfirmed) return
    setPlanToConfirm(plan)
    setShowConfirmation(true)
  }

  const handleConfirmPurchase = () => {
    if (planToConfirm) {
      setPlanConfirmed(planToConfirm)
      setShowConfirmation(false)
    }
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    setPlanToConfirm(null)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Modal de edición de perfil */}
      {showEditProfile && (
        <EditProfileModal
          currentProfile={userProfile}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditProfile(false)}
        />
      )}

      {showConfirmation && planToConfirm && (
        <ConfirmationModal plan={planToConfirm} onConfirm={handleConfirmPurchase} onCancel={handleCancelConfirmation} />
      )}

      {/* Header mejorado con perfil editable */}
      <div className="mb-8 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto flex items-center justify-center text-5xl">
            {userProfile.avatar}
          </div>
          {/* Botón de editar sobre el avatar */}
          <button
            onClick={() => setShowEditProfile(true)}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors shadow-lg"
            aria-label="Editar perfil"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
          <button
            onClick={() => setShowEditProfile(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Editar nombre"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-muted-foreground text-sm">Miembro desde Enero 2025</p>
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
              className={'p-5 transition-all ' + (planConfirmed && planConfirmed.id !== plan.id ? 'opacity-50' : '')}
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
                  <Button
                    disabled
                    className="w-full bg-green-500 text-white"
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