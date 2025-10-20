"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle2, MessageCircle, TrendingUp, Plus, UserPlus, UserMinus } from "lucide-react"
import type { Group } from "@/app/page"

interface GroupViewProps {
  groups: Group[]
  onCreateGroup: () => void
  onToggleGroupMembership: (groupId: string) => void
}

export function GroupView({ groups, onCreateGroup, onToggleGroupMembership }: GroupViewProps) {
  const mockActivity = [
    { user: "María", habit: "Meditar 5 minutos", time: "hace 10 min", avatar: "👩" },
    { user: "Carlos", habit: "Leer 10 páginas", time: "hace 25 min", avatar: "👨" },
    { user: "Ana", habit: "Ejercicio matutino", time: "hace 1 hora", avatar: "👧" },
  ]

  const joinedGroups = groups.filter((g) => g.isJoined)
  const availableGroups = groups.filter((g) => !g.isJoined)

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
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
              <Card key={group.id} className="p-4 border-success/30 bg-success/5">
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
                  onClick={() => onToggleGroupMembership(group.id)}
                  variant="outline"
                  className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Salir del grupo
                </Button>
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
              <Card key={group.id} className="p-4">
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
                  onClick={() => onToggleGroupMembership(group.id)}
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

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-secondary" />
          Actividad Reciente
        </h2>
        <div className="space-y-3">
          {mockActivity.map((activity, index) => (
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
