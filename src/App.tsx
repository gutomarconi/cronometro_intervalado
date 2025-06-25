import { useEffect, useRef, useState } from 'react'

function App() {
  const [totalSeconds, setTotalSeconds] = useState(900) // 15 minutos
  const [intervalSeconds, setIntervalSeconds] = useState(30)
  const [preAlarmSeconds, setPreAlarmSeconds] = useState(5)
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [nextInterval, setNextInterval] = useState(intervalSeconds)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch((e) => {
        console.log('Falha ao tocar som:', e)
      })
    }
  }

  const reset = () => {
    setRunning(false)
    setTimeLeft(totalSeconds)
    setNextInterval(intervalSeconds)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const start = () => {
    setTimeLeft(totalSeconds)
    setNextInterval(intervalSeconds)
    setRunning(true)
    // desbloqueia autoplay
    audioRef.current?.play().catch(() => {})
  }

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            return 0
          }
          return prev - 1
        })
        setNextInterval((prev) => {
          if (prev === 1) {
            playBeep()
            return intervalSeconds
          } else if (prev === preAlarmSeconds + 1) {
            playBeep()
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current!)
  }, [running])

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '2rem' }}>
      <h1>Cronômetro com Intervalos</h1>

      <div>
        <label>
  Tempo total (minutos):{' '}
  <input
    type="number"
    value={Math.floor(totalSeconds / 60)}
    onChange={(e) => {
      const minutes = Number(e.target.value)
      setTotalSeconds(minutes * 60)
    }}
    disabled={running}
  />
</label>
      </div>
      <div>
        <label>
          Intervalo de alarme (segundos):{' '}
          <input
            type="number"
            value={intervalSeconds}
            onChange={(e) => setIntervalSeconds(Number(e.target.value))}
            disabled={running}
          />
        </label>
      </div>
      <div>
        <label>
          Alarme antecipado (segundos):{' '}
          <input
            type="number"
            value={preAlarmSeconds}
            onChange={(e) => setPreAlarmSeconds(Number(e.target.value))}
            disabled={running}
          />
        </label>
      </div>

      <div style={{ margin: '1rem' }}>
        <button onClick={start} disabled={running}>
          Iniciar
        </button>
        <button onClick={reset}>Resetar</button>
      </div>

      <p>Tempo total: {formatTime(totalSeconds)}</p>
      <h2>Tempo restante: {formatTime(timeLeft)}</h2>
      <h3>Próximo alarme em: {formatTime(nextInterval)}</h3>

      <audio ref={audioRef} src="/beep.mp3" preload="auto" />
    </div>
  )
}

export default App
