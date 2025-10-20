"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Wind, Sparkles, Play, Pause } from "lucide-react"

export function ActiveBreakView() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const exercises = [
    {
      id: "breathing",
      name: "Respiración Profunda",
      icon: <Wind className="h-8 w-8" />,
      duration: 120,
      description: "Inhala por 4 segundos, mantén por 4, exhala por 4",
      color: "from-secondary/10 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      id: "meditation",
      name: "Meditación Rápida",
      icon: <Sparkles className="h-8 w-8" />,
      duration: 300,
      description: "Cierra los ojos y enfócate en tu respiración",
      color: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
    },
    {
      id: "stretch",
      name: "Estiramiento",
      icon: <Heart className="h-8 w-8" />,
      duration: 180,
      description: "Estira cuello, hombros y espalda suavemente",
      color: "from-accent/10 to-accent/5",
      iconColor: "text-accent",
    },
  ]

  const startExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)
    if (exercise) {
      setActiveExercise(exerciseId)
      setTimer(exercise.duration)
      setIsRunning(true)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetExercise = () => {
    setActiveExercise(null)
    setTimer(0)
    setIsRunning(false)
  }

  // Timer logic
  if (isRunning && timer > 0) {
    setTimeout(() => setTimer(timer - 1), 1000)
  } else if (timer === 0 && activeExercise) {
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const activeExerciseData = exercises.find((e) => e.id === activeExercise)

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pausa Activa</h1>
        <p className="text-muted-foreground text-sm">Tómate un momento para recargar energías</p>
      </div>

      {!activeExercise ? (
        <>
          {/* Benefits Card */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-none">
            <h2 className="text-lg font-semibold text-foreground mb-3">¿Por qué tomar pausas?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Reduce el estrés y la ansiedad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Mejora la concentración y productividad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Previene el agotamiento mental</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Aumenta tu bienestar general</span>
              </li>
            </ul>
          </Card>

          {/* Exercise Options */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Elige un ejercicio</h2>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`p-5 cursor-pointer transition-all hover:shadow-md bg-gradient-to-br ${exercise.color}`}
                  onClick={() => startExercise(exercise.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={exercise.iconColor}>{exercise.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{exercise.description}</p>
                      <div className="text-xs font-medium text-muted-foreground">
                        {Math.floor(exercise.duration / 60)} minutos
                      </div>
                    </div>
                    <Play className="h-6 w-6 text-muted-foreground" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Active Exercise */}
          <Card className={`p-8 text-center bg-gradient-to-br ${activeExerciseData?.color}`}>
            <div className={`flex justify-center mb-4 ${activeExerciseData?.iconColor}`}>
              {activeExerciseData?.icon}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{activeExerciseData?.name}</h2>
            <p className="text-muted-foreground mb-6">{activeExerciseData?.description}</p>

            {/* Timer */}
            <div className="text-6xl font-bold text-primary mb-6">{formatTime(timer)}</div>

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              <Button onClick={toggleTimer} size="lg" className="bg-primary hover:bg-primary-hover text-white">
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    {timer === 0 ? "Completado" : "Continuar"}
                  </>
                )}
              </Button>
              <Button onClick={resetExercise} size="lg" variant="outline">
                Finalizar
              </Button>
            </div>
          </Card>

          {/* Completion Message */}
          {timer === 0 && (
            <Card className="p-6 bg-success/10 border-success/30 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">¡Excelente trabajo!</h3>
              <p className="text-sm text-muted-foreground">Has completado tu pausa activa. ¿Listo para continuar?</p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
