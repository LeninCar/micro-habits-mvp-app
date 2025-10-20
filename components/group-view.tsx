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
} from "lucide-react"
import type { Group } from "@/app/page"
import { useState } from "react"

interface GroupViewProps {
  groups: Group[]
  onCreateGroup: () => void
  onToggleGroupMembership: (groupId: string) => void
  onToggleGroupHabit: (groupId: string, habitId: string) => void
}

export function GroupView({ groups, onCreateGroup, onToggleGroupMembership, onToggleGroupHabit }: GroupViewProps) {
  const [showShareNotification, setShowShareNotification] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const getGroupDetails = (group: Group) => ({
    ...group,
    createdDate: "15 de Enero, 2025",
    habits: group.habits || [],
    topMembers: [
      { name: "María", avatar: "👩", streak: 15, habits: 8 },
      { name: "Carlos", avatar: "👨", streak: 12, habits: 6 },
      { name: "Ana", avatar: "👧", streak: 10, habits: 7 },
      { name: "Luis", avatar: "👦", streak: 8, habits: 5 },
    ],
    recentActivity: [
      { user: "María", avatar: "👩", action: "completó", habit: "Meditar 5 minutos", time: "hace 10 min" },
      { user: "Carlos", avatar: "👨", action: "completó", habit: "Leer 10 páginas", time: "hace 25 min" },
      { user: "Ana", avatar: "👧", action: "completó", habit: "Ejercicio matutino", time: "hace 1 hora" },
      { user: "Luis", avatar: "👦", action: "se unió al grupo", habit: "", time: "hace 2 horas" },
    ],
    weeklyProgress: 78,
  })

  const joinedGroups = groups.filter((g) => g.isJoined)
  const availableGroups = groups.filter((g) => !g.isJoined)

  const handleShareInvite = (groupId: string, groupName: string) => {
    const inviteLink = `https://microhabits.app/invite/${groupId}`
    const shareText = `¡Únete a mi grupo "${groupName}" en MicroHabits! 🎯\n\nCrece tus hábitos junto a una comunidad motivada.\n\n${inviteLink}`

    if (navigator.share) {
      navigator
        .share({
          title: `Invitación a ${groupName}`,
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

  if (selectedGroup) {
    const details = getGroupDetails(selectedGroup)
    const today = new Date().toISOString().split("T")[0]

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

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
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
                <div className="text-2xl font-bold text-secondary">{details.weeklyProgress}%</div>
                <div className="text-xs text-muted-foreground">Progreso</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>Creado el {details.createdDate}</span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleShareInvite(details.id, details.name)}
                className="flex-1 bg-primary hover:bg-primary-hover text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Invitar amigo
              </Button>
              {details.isJoined && (
                <Button
                  onClick={() => {
                    onToggleGroupMembership(details.id)
                    setSelectedGroup(null)
                  }}
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Hábitos Compartidos
          </h2>
          {details.habits && details.habits.length > 0 ? (
            <div className="space-y-3">
              {details.habits.map((habit) => {
                const isCompleted = habit.completedDates.includes(today)
                const canComplete = details.isJoined

                return (
                  <Card
                    key={habit.id}
                    className={`p-4 transition-all ${
                      canComplete ? "cursor-pointer hover:shadow-md" : "cursor-not-allowed opacity-60"
                    } ${isCompleted ? "bg-success/5 border-success/30" : "bg-card"}`}
                    onClick={() => {
                      if (canComplete) {
                        onToggleGroupHabit(details.id, habit.id)
                      }
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{habit.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${isCompleted ? "text-success" : "text-foreground"}`}>
                            {habit.name}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {habit.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="capitalize">{habit.frequency}</span>
                          {!canComplete && <span className="text-xs text-destructive">• Únete para participar</span>}
                        </div>
                      </div>
                      {isCompleted ? (
                        <CheckCircle2 className="h-8 w-8 text-success" />
                      ) : (
                        <Circle className="h-8 w-8 text-muted-foreground" />
                      )}
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-secondary" />
            Miembros Destacados
          </h2>
          <div className="space-y-3">
            {details.topMembers.map((member, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{member.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{member.name}</span>
                      {index === 0 && <span className="text-lg">🏆</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>🔥 {member.streak} días</span>
                      <span>✅ {member.habits} hábitos</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-success" />
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            {details.recentActivity.map((activity, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{activity.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{activity.user}</span>
                      <span className="text-sm text-muted-foreground">{activity.action}</span>
                    </div>
                    {activity.habit && <p className="text-sm text-muted-foreground">{activity.habit}</p>}
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
            className="bg-primary hover:bg-primary-hover text-white rounded-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Crear
          </Button>
        </div>
      </div>

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
                    <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
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
                    className="flex-1 bg-primary hover:bg-primary-hover text-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Invitar amigo
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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Grupos Disponibles
        </h2>
        {availableGroups.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Crea tu primer grupo</h3>
            <p className="text-muted-foreground text-sm mb-4">Invita a otros a unirse a tu viaje de micro-hábitos</p>
            <Button onClick={onCreateGroup} className="bg-primary hover:bg-primary-hover text-white">
              <Plus className="h-4 w-4 mr-2" />
              Crear grupo
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {availableGroups.map((group) => (
              <Card
                key={group.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedGroup(group)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{group.name}</h3>
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
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Unirse al grupo
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-secondary" />
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
