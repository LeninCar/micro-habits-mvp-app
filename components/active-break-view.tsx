"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Wind, Sparkles, Play, Pause, Volume2, VolumeX, Dumbbell, Eye, Brain } from "lucide-react"

const exercises = [
  {
    id: "breathing",
    name: "Respiración Profunda",
    icon: <Wind className="h-8 w-8" />,
    duration: 120,
    description: "Inhala por 4 segundos, mantén por 4, exhala por 4",
    instructions: [
      "Siéntate cómodamente con la espalda recta",
      "Inhala profundamente por la nariz contando hasta 4",
      "Mantén el aire 4 segundos",
      "Exhala lentamente por la boca contando hasta 4",
      "Repite el ciclo durante 2 minutos"
    ],
    color: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
    category: "respiracion",
  },
  {
    id: "meditation",
    name: "Meditación Rápida",
    icon: <Sparkles className="h-8 w-8" />,
    duration: 300,
    description: "Cierra los ojos y enfócate en tu respiración",
    instructions: [
      "Encuentra un lugar tranquilo y siéntate cómodamente",
      "Cierra los ojos suavemente",
      "Enfócate en tu respiración natural",
      "Si tu mente divaga, vuelve suavemente a la respiración",
      "Continúa durante 5 minutos"
    ],
    color: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
    category: "mental",
  },
  {
    id: "stretch",
    name: "Estiramiento",
    icon: <Heart className="h-8 w-8" />,
    duration: 180,
    description: "Estira cuello, hombros y espalda suavemente",
    instructions: [
      "De pie, inclina la cabeza hacia cada lado (10 seg cada lado)",
      "Gira los hombros hacia adelante y atrás (5 veces cada dirección)",
      "Entrelaza las manos y estira los brazos hacia arriba",
      "Inclínate suavemente hacia cada lado",
      "Haz rotaciones suaves del tronco"
    ],
    color: "from-pink-500/10 to-pink-500/5",
    iconColor: "text-pink-500",
    category: "estiramiento",
  },
  {
    id: "neck-stretch",
    name: "Estiramiento de Cuello",
    icon: <Heart className="h-8 w-8" />,
    duration: 120,
    description: "Libera tensión del cuello y hombros",
    instructions: [
      "Siéntate con la espalda recta",
      "Inclina la cabeza hacia la derecha, mantén 15 segundos",
      "Repite hacia la izquierda",
      "Gira la cabeza lentamente a cada lado",
      "Termina con rotaciones suaves del cuello"
    ],
    color: "from-green-500/10 to-green-500/5",
    iconColor: "text-green-500",
    category: "estiramiento",
  },
  {
    id: "shoulder-rolls",
    name: "Rotaciones de Hombros",
    icon: <Dumbbell className="h-8 w-8" />,
    duration: 90,
    description: "Reduce tensión en hombros y espalda alta",
    instructions: [
      "De pie o sentado, relaja los brazos a los lados",
      "Levanta los hombros hacia las orejas",
      "Gira los hombros hacia atrás haciendo círculos grandes",
      "Haz 10 rotaciones hacia atrás",
      "Luego 10 rotaciones hacia adelante"
    ],
    color: "from-orange-500/10 to-orange-500/5",
    iconColor: "text-orange-500",
    category: "estiramiento",
  },
  {
    id: "eye-rest",
    name: "Descanso Visual",
    icon: <Eye className="h-8 w-8" />,
    duration: 180,
    description: "Reduce fatiga ocular por pantallas",
    instructions: [
      "Cierra los ojos durante 10 segundos",
      "Mira un objeto a 6 metros de distancia por 10 segundos",
      "Parpadea 10 veces lentamente",
      "Mira arriba, abajo, izquierda, derecha sin mover la cabeza",
      "Haz círculos con los ojos en ambas direcciones"
    ],
    color: "from-cyan-500/10 to-cyan-500/5",
    iconColor: "text-cyan-500",
    category: "visual",
  },
  {
    id: "desk-yoga",
    name: "Yoga en tu Escritorio",
    icon: <Sparkles className="h-8 w-8" />,
    duration: 240,
    description: "Secuencia corta de yoga sentado",
    instructions: [
      "Siéntate en el borde de la silla",
      "Gira el torso hacia la derecha, sostén 15 seg",
      "Repite hacia la izquierda",
      "Estira los brazos hacia arriba y entrelaza los dedos",
      "Inclínate suavemente hacia cada lado"
    ],
    color: "from-indigo-500/10 to-indigo-500/5",
    iconColor: "text-indigo-500",
    category: "estiramiento",
  },
  {
    id: "walking-break",
    name: "Caminata Activa",
    icon: <Dumbbell className="h-8 w-8" />,
    duration: 300,
    description: "Camina y activa tu circulación",
    instructions: [
      "Levántate y camina alrededor de tu espacio",
      "Camina con pasos deliberados y conscientes",
      "Balancea los brazos naturalmente",
      "Respira profundamente mientras caminas",
      "Continúa durante 5 minutos"
    ],
    color: "from-lime-500/10 to-lime-500/5",
    iconColor: "text-lime-500",
    category: "movimiento",
  },
  {
    id: "wrist-stretches",
    name: "Estiramiento de Muñecas",
    icon: <Heart className="h-8 w-8" />,
    duration: 90,
    description: "Previene fatiga por uso de teclado",
    instructions: [
      "Extiende el brazo derecho con la palma hacia arriba",
      "Con la otra mano, tira suavemente de los dedos hacia ti",
      "Mantén 15 segundos, repite con la otra mano",
      "Haz rotaciones de muñecas en ambas direcciones",
      "Cierra y abre los puños 10 veces"
    ],
    color: "from-teal-500/10 to-teal-500/5",
    iconColor: "text-teal-500",
    category: "estiramiento",
  },
  {
    id: "standing-stretch",
    name: "Estiramiento de Pie",
    icon: <Dumbbell className="h-8 w-8" />,
    duration: 180,
    description: "Estiramiento completo de cuerpo",
    instructions: [
      "De pie, estira los brazos hacia arriba",
      "Inclínate hacia la derecha, mantén 10 seg",
      "Repite hacia la izquierda",
      "Dobla el torso hacia adelante suavemente",
      "Vuelve arriba lentamente, estira de nuevo"
    ],
    color: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
    category: "estiramiento",
  },
  {
    id: "box-breathing",
    name: "Respiración Cuadrada",
    icon: <Wind className="h-8 w-8" />,
    duration: 180,
    description: "Técnica de respiración para reducir ansiedad",
    instructions: [
      "Inhala contando hasta 4",
      "Mantén el aire contando hasta 4",
      "Exhala contando hasta 4",
      "Mantén los pulmones vacíos contando hasta 4",
      "Repite el ciclo 5-7 veces"
    ],
    color: "from-sky-500/10 to-sky-500/5",
    iconColor: "text-sky-500",
    category: "respiracion",
  },
  {
    id: "gratitude-moment",
    name: "Momento de Gratitud",
    icon: <Brain className="h-8 w-8" />,
    duration: 120,
    description: "Pausa mental para bienestar emocional",
    instructions: [
      "Cierra los ojos y respira profundamente 3 veces",
      "Piensa en 3 cosas por las que estás agradecido hoy",
      "Visualiza cada una durante unos segundos",
      "Sonríe suavemente mientras piensas en ellas",
      "Abre los ojos y continúa tu día con energía positiva"
    ],
    color: "from-rose-500/10 to-rose-500/5",
    iconColor: "text-rose-500",
    category: "mental",
  },
  {
    id: "posture-check",
    name: "Corrección de Postura",
    icon: <Dumbbell className="h-8 w-8" />,
    duration: 120,
    description: "Revisa y mejora tu postura",
    instructions: [
      "Siéntate al fondo de la silla con la espalda recta",
      "Pies planos en el suelo, rodillas a 90 grados",
      "Hombros relajados, hacia atrás y abajo",
      "Pantalla a la altura de los ojos",
      "Respira profundo manteniendo esta postura"
    ],
    color: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
    category: "estiramiento",
  },
  {
    id: "mindful-breathing",
    name: "Respiración Consciente",
    icon: <Brain className="h-8 w-8" />,
    duration: 240,
    description: "Atención plena en la respiración",
    instructions: [
      "Siéntate cómodamente y cierra los ojos",
      "Observa tu respiración sin intentar cambiarla",
      "Nota cómo el aire entra y sale de tu cuerpo",
      "Cuenta mentalmente cada exhalación hasta 10",
      "Si te distraes, vuelve suavemente a contar desde 1"
    ],
    color: "from-fuchsia-500/10 to-fuchsia-500/5",
    iconColor: "text-fuchsia-500",
    category: "mental",
  },
  {
    id: "shoulder-blade-squeeze",
    name: "Apretón de Omóplatos",
    icon: <Heart className="h-8 w-8" />,
    duration: 90,
    description: "Fortalece y relaja la espalda",
    instructions: [
      "Siéntate con la espalda recta",
      "Lleva los codos hacia atrás como si quisieras unir los omóplatos",
      "Mantén la tensión 5 segundos",
      "Relaja y repite 10 veces",
      "Respira normalmente durante el ejercicio"
    ],
    color: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
    category: "estiramiento",
  },
]

const playground = (soundType: 'start' | 'tick' | 'complete') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  // Configuración por tipo de sonido
  if (soundType === 'start') {
    oscillator.frequency.value = 523.25
    gainNode.gain.value = 0.3
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.2)
  } else if (soundType === 'tick') {
    oscillator.frequency.value = 440
    gainNode.gain.value = 0.1
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.1)
  } else if (soundType === 'complete') {
    oscillator.frequency.value = 523.25
    gainNode.gain.value = 0.3
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.15)

    setTimeout(() => {
      const osc2 = audioContext.createOscillator()
      const gain2 = audioContext.createGain()
      osc2.connect(gain2)
      gain2.connect(audioContext.destination)
      osc2.frequency.value = 659.25
      gain2.gain.value = 0.3
      osc2.start()
      osc2.stop(audioContext.currentTime + 0.15)
    }, 150)

    setTimeout(() => {
      const osc3 = audioContext.createOscillator()
      const gain3 = audioContext.createGain()
      osc3.connect(gain3)
      gain3.connect(audioContext.destination)
      osc3.frequency.value = 783.99 // G5
      gain3.gain.value = 0.3
      osc3.start()
      osc3.stop(audioContext.currentTime + 0.3)
    }, 300)
  }
}

export function ActiveBreakView() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true) // Control de sonido
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startExercise = (exerciseId: string) => {
    const exercise = exercises.find((e) => e.id === exerciseId)
    if (exercise) {
      setActiveExercise(exerciseId)
      setTimer(exercise.duration)
      setCurrentStep(0)
      setIsRunning(true)
      if (soundEnabled) {
        playground('start')
      }
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetExercise = () => {
    setActiveExercise(null)
    setTimer(0)
    setIsRunning(false)
    setCurrentStep(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Timer con sonidos
  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            if (soundEnabled) playground('complete') // Sonido al completar el ejercicio
            return 0
          }
            
          // Sonido cada 10 segundos
          if (prev % 10 === 0 && soundEnabled) {
            playground('tick')
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timer, soundEnabled])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const activeExerciseData = exercises.find((e) => e.id === activeExercise)

  // Avanzar automaticamente las instrucciones
  useEffect(() => {
    if (activeExerciseData && isRunning) {
      const stepDuration = activeExerciseData.duration / activeExerciseData.instructions.length
      const currentSepCalc = Math.floor((activeExerciseData.duration - timer) / stepDuration)
      setCurrentStep(Math.min(currentSepCalc, activeExerciseData.instructions.length - 1))
    }
  }, [timer, activeExerciseData, isRunning])

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header con control de sonido */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pausa Activa</h1>
          <p className="text-muted-foreground text-sm">Tómate un momento para recargar energías</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="shrink-0"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      {!activeExercise ? (
        <>
          {/* Beneficios de tomar pausas */}
          <Card className="p-6 mb-6 bg-linear-to-br from-primary/10 to-secondary/10 border-none">
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

          {/* Filtros por categoría */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground mb-3">Elige un ejercicio</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {['todos', 'respiracion', 'estiramiento', 'mental', 'movimiento', 'visual'].map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-secondary'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'todos' ? 'Todos' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Opciones de ejercicio */}
          <div className="space-y-3">
            {exercises
              .filter(exercise => selectedCategory === 'todos' || exercise.category === selectedCategory)
              .map((exercise) => (
              <Card
                key={exercise.id}
                className={`p-5 cursor-pointer transition-all hover:shadow-md bg-linear-to-br ${exercise.color}`}
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
        </>
      ) : (
        <div className="space-y-6">
          {/* Ejercicio actual con instrucciones paso a paso */}
          <Card className={`p-8 text-center bg-linear-to-br ${activeExerciseData?.color}`}>
            <div className={`flex justify-center mb-4 ${activeExerciseData?.iconColor}`}>
              {activeExerciseData?.icon}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{activeExerciseData?.name}</h2>

            {/* Instrucción actual destacada */}
            <Card className="p-4 mb-4 bg-white/50 dark:bg-black/20">
              <p className="text-sm font-medium text-foreground">
                Paso {currentStep + 1} de {activeExerciseData?.instructions.length}
              </p>
              <p className="text-muted-foreground mt-2">
                {activeExerciseData?.instructions[currentStep]}
              </p>
            </Card>

            {/* Timer */}
            <div className="text-6xl font-bold text-primary mb-6">{formatTime(timer)}</div>

            {/* Botones de control */}
            <div className="flex gap-3 justify-center">
              <Button onClick={toggleTimer} size="lg" className="bg-primary hover:bg-primary-hover text-secondary">
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

          {/* Mensaje de completado */}
          {timer === 0 && (
            <Card className="p-6 bg-success/10 border-success/30 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">¡Excelente trabajo!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Has completado tu pausa activa. ¿Listo para continuar?
              </p>
              <Button onClick={resetExercise} className="bg-primary hover:bg-primary-hover text-white">
                Elegir otro ejercicio
              </Button>
            </Card>
          )}

          {/* Lista completa de instrucciones */}
          <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Todas las instrucciones:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {activeExerciseData?.instructions.map((instruction, idx) => (
                <li 
                  key={idx}
                  className={`flex gap-2 ${idx === currentStep ? 'text-primary font-semibold' : ''}`}
                >
                  <span>{idx + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}
    </div>
  )
}


