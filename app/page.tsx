"use client"

import { useState, useEffect } from "react"
import { MainDashboard } from "@/components/main-dashboard"
import { AddHabitModal } from "@/components/add-habit-modal"
import { StreakView } from "@/components/streak-view"
import { GroupView } from "@/components/group-view"
import { ActiveBreakView } from "@/components/active-break-view"
import { ProfileView } from "@/components/profile-view"
import { BottomNav } from "@/components/bottom-nav"
import { EditHabitModal } from "@/components/edit-habit-modal"
import { CreateGroupModal } from "@/components/create-group-modal"

export type Habit = {
  id: string
  name: string
  category: "salud" | "estudio" | "descanso" | "finanzas" | "bienestar"
  frequency: "diario" | "semanal"
  icon: string
  completedDates: string[]
  createdAt: string
  reminderTime?: string
  groupId?: string
  groupName?: string
}

export type Group = {
  id: string
  name: string
  description: string
  category: string
  members: number
  activeToday: number
  createdAt: string
  isJoined: boolean
  habits?: Habit[]
}

export default function Home() {
  const [currentView, setCurrentView] = useState<"dashboard" | "streak" | "group" | "break" | "profile">("dashboard")
  const [habits, setHabits] = useState<Habit[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)

  useEffect(() => {
    const savedHabits = localStorage.getItem("microhabits-habits")
    const savedGroups = localStorage.getItem("microhabits-groups")

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    } else {
      // Default habits for first time users
      const defaultHabits: Habit[] = [
        {
          id: "1",
          name: "Meditar 5 minutos",
          category: "bienestar",
          frequency: "diario",
          icon: "🧘",
          completedDates: [
            new Date().toISOString().split("T")[0],
            new Date(Date.now() - 86400000).toISOString().split("T")[0],
            new Date(Date.now() - 172800000).toISOString().split("T")[0],
          ],
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          reminderTime: "08:00",
        },
        {
          id: "2",
          name: "Leer 10 páginas",
          category: "estudio",
          frequency: "diario",
          icon: "📚",
          completedDates: [new Date().toISOString().split("T")[0]],
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          reminderTime: "20:00",
        },
      ]
      setHabits(defaultHabits)
    }

    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    } else {
      const defaultGroups: Group[] = [
        {
          id: "1",
          name: "Estudiantes Productivos",
          description: "Grupo para estudiantes que quieren mejorar sus hábitos de estudio",
          category: "estudio",
          members: 24,
          activeToday: 18,
          createdAt: new Date().toISOString(),
          isJoined: false,
          habits: [
            {
              id: "group-1-habit-1",
              name: "Revisar apuntes 15 min",
              category: "estudio",
              frequency: "diario",
              icon: "📝",
              completedDates: [],
              createdAt: new Date().toISOString(),
              groupId: "1",
              groupName: "Estudiantes Productivos",
            },
            {
              id: "group-1-habit-2",
              name: "Hacer ejercicios de práctica",
              category: "estudio",
              frequency: "diario",
              icon: "✍️",
              completedDates: [],
              createdAt: new Date().toISOString(),
              groupId: "1",
              groupName: "Estudiantes Productivos",
            },
          ],
        },
        {
          id: "2",
          name: "Vida Saludable",
          description: "Comparte tu progreso en hábitos de salud y bienestar",
          category: "salud",
          members: 42,
          activeToday: 31,
          createdAt: new Date().toISOString(),
          isJoined: false,
          habits: [
            {
              id: "group-2-habit-1",
              name: "Caminar 10 minutos",
              category: "salud",
              frequency: "diario",
              icon: "🚶",
              completedDates: [],
              createdAt: new Date().toISOString(),
              groupId: "2",
              groupName: "Vida Saludable",
            },
            {
              id: "group-2-habit-2",
              name: "Beber 2 vasos de agua",
              category: "salud",
              frequency: "diario",
              icon: "💧",
              completedDates: [],
              createdAt: new Date().toISOString(),
              groupId: "2",
              groupName: "Vida Saludable",
            },
          ],
        },
      ]
      setGroups(defaultGroups)
    }
  }, [])

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("microhabits-habits", JSON.stringify(habits))
    }
  }, [habits])

  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("microhabits-groups", JSON.stringify(groups))
    }
  }, [groups])

  const addHabit = (habit: Omit<Habit, "id" | "completedDates" | "createdAt">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    setHabits([...habits, newHabit])
  }

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)))
    setEditingHabit(null)
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setEditingHabit(null)
  }

  const toggleHabitCompletion = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const isCompleted = habit.completedDates.includes(today)
          return {
            ...habit,
            completedDates: isCompleted
              ? habit.completedDates.filter((date) => date !== today)
              : [...habit.completedDates, today],
          }
        }
        return habit
      }),
    )
  }

  const toggleGroupHabitCompletion = (groupId: string, habitId: string) => {
    const today = new Date().toISOString().split("T")[0]
    setGroups(
      groups.map((group) => {
        if (group.id === groupId && group.habits) {
          return {
            ...group,
            habits: group.habits.map((habit) => {
              if (habit.id === habitId) {
                const isCompleted = habit.completedDates.includes(today)
                return {
                  ...habit,
                  completedDates: isCompleted
                    ? habit.completedDates.filter((date) => date !== today)
                    : [...habit.completedDates, today],
                }
              }
              return habit
            }),
          }
        }
        return group
      }),
    )
  }

  const createGroup = (group: Omit<Group, "id" | "members" | "activeToday" | "createdAt" | "isJoined">) => {
    const newGroup: Group = {
      ...group,
      id: Date.now().toString(),
      members: 1,
      activeToday: 1,
      createdAt: new Date().toISOString(),
      isJoined: true,
      habits: [],
    }
    setGroups([...groups, newGroup])
  }

  const toggleGroupMembership = (groupId: string) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          const newIsJoined = !group.isJoined
          return {
            ...group,
            isJoined: newIsJoined,
            members: newIsJoined ? group.members + 1 : group.members - 1,
          }
        }
        return group
      }),
    )
  }

  const allHabits = [
    ...habits,
    ...groups
      .filter((g) => g.isJoined)
      .flatMap((g) => g.habits || []),
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      {currentView === "dashboard" && (
        <MainDashboard
          habits={allHabits}
          onToggleHabit={toggleHabitCompletion}
          onAddHabit={() => setIsAddModalOpen(true)}
          onEditHabit={setEditingHabit}
        />
      )}
      {currentView === "streak" && <StreakView habits={allHabits} />}
      {currentView === "group" && (
        <GroupView
          groups={groups}
          onCreateGroup={() => setIsCreateGroupModalOpen(true)}
          onToggleGroupMembership={toggleGroupMembership}
          onToggleGroupHabit={toggleGroupHabitCompletion}
        />
      )}
      {currentView === "break" && <ActiveBreakView />}
      {currentView === "profile" && <ProfileView habits={allHabits} groups={groups} />}

      <AddHabitModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addHabit} />

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
          onUpdate={updateHabit}
          onDelete={deleteHabit}
        />
      )}

      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreate={createGroup}
      />

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  )
}
