import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-3 items-center py-4">
      <button
        className={`p-2 rounded-full ${theme === 'light' ? 'bg-primary text-white' : 'bg-muted'}`}
        onClick={() => setTheme('light')}
        aria-label="Tema claro"
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        className={`p-2 rounded-full ${theme === 'dark' ? 'bg-primary text-black' : 'bg-muted'}`}
        onClick={() => setTheme('dark')}
        aria-label="Tema oscuro"
      >
        <Moon className="h-5 w-5" />
      </button>
      <button
        className={`p-2 rounded-full ${theme === 'system' ? 'bg-primary text-secondary' : 'bg-muted'}`}
        onClick={() => setTheme('system')}
        aria-label="Tema del sistema"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  )
}