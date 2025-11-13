"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  CheckCircle2,
  MessageCircle,
  TrendingUp,
  Plus,
  UserPlus,
  UserMinus,
  Share2,
  ArrowLeft,
  Calendar,
  Target,
  Award,
  Circle,
  Filter,
} from "lucide-react"
import type { Group } from "@/app/page"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GroupViewProps {
  groups: Group[]
  onCreateGroup: () => void
  onToggleGroupMembership: (groupId: string) => void
  onToggleGroupHabit: (groupId: string, habitId: string) => void
}

// Categorías de grupos para filtrado
const groupCategories = [
  { value: "todas", label: "Todas", icon: "🌟" },
  { value: "salud", label: "Salud", icon: "💪" },
  { value: "estudio", label: "Estudio", icon: "📚" },
  { value: "descanso", label: "Descanso", icon: "😴" },
  { value: "finanzas", label: "Finanzas", icon: "💰" },
  { value: "bienestar", label: "Bienestar", icon: "🧘" },
]

export function GroupView({ groups, onCreateGroup, onToggleGroupMembership, onToggleGroupHabit }: GroupViewProps) {
  const [showShareNotification, setShowShareNotification] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  // MEJORA #1: Estado para filtro de categoría
  const [selectedCategory, setSelectedCategory] = useState<string>("todas")
  const [completingHabitId, setCompletingHabitId] = useState<string | null>(null)

  const joinedGroups = groups.filter((g) => g.isJoined)
  const availableGroups = groups.filter((g) => !g.isJoined)

  // Filtrar grupos disponibles por categoría
  const filteredAvailableGroups = selectedCategory === "todas" 
    ? availableGroups 
    : availableGroups.filter(g => g.category === selectedCategory)

  const handleShareInvite = (groupId: string, groupName: string) => {
    const inviteLink = 'https://microhabits.app/invite/' + groupId
    const shareText = '¡Únete a mi grupo "' + groupName + '" en MicroHabits! 🎯\n\nCrece tus hábitos junto a una comunidad motivada.\n\n' + inviteLink

    if (navigator.share) {
      navigator
        .share({
          title: 'Invitación a ' + groupName,
          text: shareText,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText)
          setShowShareNotification(true)
          setTimeout(() => setShowShareNotification(false), 3000)
        })
    } else {
      navigator.clipboard.writeText(shareText)
      setShowShareNotification(true)
      setTimeout(() => setShowShareNotification(false), 3000)
    }
  }

  const getGroupDetails = (group: Group) => {
    return {
      ...group,
      createdDate: "15 de Enero, 2025",
      membersList: [
        { name: "María", avatar: "👩", joinedAt: "2025-01-05T10:00:00Z", streak: 15, habits: 8 },
        { name: "Carlos", avatar: "👨", joinedAt: "2025-01-08T14:00:00Z", streak: 12, habits: 6 },
        { name: "Ana", avatar: "👧", joinedAt: "2025-01-12T09:30:00Z", streak: 10, habits: 7 },
        { name: "Luis", avatar: "👦", joinedAt: "2025-01-15T12:00:00Z", streak: 8, habits: 5 },
      ],
      habits: group.habits ?? [],
      recentActivity: [
        { user: "María", avatar: "👩", action: "completó", habit: "Meditar 5 minutos", time: "hace 10 min" },
        { user: "Carlos", avatar: "👨", action: "completó", habit: "Leer 10 páginas", time: "hace 25 min" },
      ],
      weeklyProgress: 78,
    }
  }

  // Vista de detalle de grupo
  if (selectedGroup) {
    const currentSelected = groups.find((g) => g.id === selectedGroup.id) || selectedGroup
    const details = getGroupDetails(currentSelected)
    const today = new Date().toISOString().split("T")[0]
    const canComplete = details.isJoined

    const handleToggleSharedHabit = (habitId: string) => {
      if (!canComplete) return
      const habit = details.habits.find((h) => h.id === habitId)
      const isCurrentlyCompleted = habit?.completedDates.includes(today)
      setCompletingHabitId(habitId)
      onToggleGroupHabit(details.id, habitId)
      if (!isCurrentlyCompleted) {
        const audio = new Audio("/sound/success.mp3")
        audio.play().catch(() => {})
      }
      setTimeout(() => setCompletingHabitId(null), 1000)
    }

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        {showShareNotification && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Enlace copiado al portapapeles</span>
          </div>
        )}

        <div className="mb-6">
          <Button onClick={() => setSelectedGroup(null)} variant="ghost" className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a grupos
          </Button>

          <Card className="p-6 bg-linear-to-br from-primary/10 to-secondary/10 border-primary/30">
            <h1 className="text-2xl font-bold text-foreground mb-2">{details.name}</h1>
            <p className="text-muted-foreground mb-4">{details.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{details.members}</div>
                <div className="text-xs text-muted-foreground">Miembros</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{details.activeToday}</div>
                <div className="text-xs text-muted-foreground">Activos hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{details.weeklyProgress}%</div>
                <div className="text-xs text-muted-foreground">Progreso</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleShareInvite(details.id, details.name)}
                className="flex-1 bg-primary hover:bg-primary-hover text-secondary"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Invitar amigo
              </Button>
            </div>
          </Card>
        </div>

        {/* Hábitos Compartidos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Hábitos Compartidos
          </h2>

          {details.habits && details.habits.length > 0 ? (
            <div className="space-y-3">
              {details.habits.map((habit) => {
                const isCompleted = habit.completedDates.includes(today)
                const isAnimating = completingHabitId === habit.id

                return (
                  <Card
                    key={habit.id}
                    className={'p-4 transition-all relative overflow-hidden ' + (canComplete ? 'hover:shadow-md' : 'cursor-not-allowed opacity-60') + (isCompleted ? ' bg-success/5 border-success/30' : ' bg-card')}
                  >
                    {/* Animación de confeti al completar */}
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
                                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                                animate={{
                                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                                  opacity: 0,
                                  scale: 1,
                                }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{habit.icon}</div>
                      <div className="flex-1">
                        <h3 className={'font-semibold ' + (isCompleted ? 'text-success' : 'text-foreground')}>
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{habit.frequency}</span>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => canComplete && handleToggleSharedHabit(habit.id)}
                        className="p-1 relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isCompleted ? 'Marcar como incompleto' : 'Marcar como completado'}
                        disabled={!canComplete}
                      >
                        {isCompleted ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          >
                            <CheckCircle2 className="h-8 w-8 text-success" />
                          </motion.div>
                        ) : (
                          <Circle className="h-8 w-8 text-muted-foreground hover:text-primary" />
                        )}
                      </motion.button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm text-muted-foreground">Este grupo aún no tiene hábitos compartidos</p>
            </Card>
          )}
        </div>
      </div>
    )
  }

  // Vista principal con filtros
  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {showShareNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Enlace copiado al portapapeles</span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Comunidad</h1>
            <p className="text-muted-foreground text-sm">Crece junto a otros en tu camino</p>
          </div>
          <Button
            onClick={onCreateGroup}
            size="sm"
            className="bg-primary hover:bg-primary-hover text-secondary rounded-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Crear
          </Button>
        </div>
      </div>

      {/* Mis Grupos */}
      {joinedGroups.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-success" />
            Mis Grupos
          </h2>
          <div className="space-y-3">
            {joinedGroups.map((group) => (
              <Card
                key={group.id}
                className="p-4 border-success/30 bg-success/5 cursor-pointer hover:bg-success/10 transition-colors"
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{group.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {groupCategories.find(c => c.value === group.category)?.icon}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.members} miembros</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span>{group.activeToday} activos hoy</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShareInvite(group.id, group.name)
                    }}
                    className="flex-1 bg-primary hover:bg-primary-hover text-secondary"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-secondary" />
                    Invitar
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleGroupMembership(group.id)
                    }}
                    variant="outline"
                    className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filtros de categoría para grupos disponibles */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Grupos Disponibles
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{filteredAvailableGroups.length} grupos</span>
          </div>
        </div>

        {/* Botones de filtro por categoría */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {groupCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ' +
                (selectedCategory === cat.value
                  ? 'bg-primary text-secondary'
                  : 'bg-primary/10 text-muted-foreground hover:bg-surface-secondary/80'
                )}
            >
              <span>{cat.icon}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Lista de grupos filtrada */}
        {filteredAvailableGroups.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">
              {selectedCategory === 'todas' ? '🎯' : groupCategories.find(c => c.value === selectedCategory)?.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === 'todas' 
                ? 'Crea tu primer grupo' 
                : 'No hay grupos en esta categoría'}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {selectedCategory === 'todas'
                ? 'Invita a otros a unirse a tu viaje de micro-hábitos'
                : 'Intenta con otra categoría o crea un nuevo grupo'}
            </p>
            <Button onClick={onCreateGroup} className="bg-primary hover:bg-primary-hover text-secondary">
              <Plus className="h-4 w-4 mr-2" />
              Crear grupo
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAvailableGroups.map((group) => (
              <Card
                key={group.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{group.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30">
                        {groupCategories.find(c => c.value === group.category)?.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{group.members} miembros</span>
                  </div>
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span>{group.activeToday} activos hoy</span>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleGroupMembership(group.id)
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-secondary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Unirse al grupo
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actividad Reciente */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" />
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          {[
            { user: "María", habit: "Meditar 5 minutos", time: "hace 10 min", avatar: "👩" },
            { user: "Carlos", habit: "Leer 10 páginas", time: "hace 25 min", avatar: "👨" },
            { user: "Ana", habit: "Ejercicio matutino", time: "hace 1 hora", avatar: "👧" },
          ].map((activity, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{activity.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{activity.user}</span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.habit}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
