import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Roadmap } from '@/types/roadmap';
import { Play, Pause, RotateCcw, Coffee, Target, Clock } from 'lucide-react';

interface PomodoroTimerProps {
  roadmap?: Roadmap;
  onSessionComplete?: (duration: number) => void;
}

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const PomodoroTimer = ({ roadmap, onSessionComplete }: PomodoroTimerProps) => {
  const { addPomodoroSession, roadmaps } = useRoadmapStore();
  
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(roadmap?.id || '');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const selectedRoadmap = roadmaps.find(r => r.id === selectedRoadmapId);

  const resetTimer = useCallback((newMode?: TimerMode) => {
    const targetMode = newMode || mode;
    setTimeLeft(TIMER_SETTINGS[targetMode]);
    setIsRunning(false);
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [mode]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    resetTimer(newMode);
  };

  const toggleTimer = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    
    if (mode === 'work' && selectedRoadmapId) {
      const duration = Math.round(TIMER_SETTINGS.work / 60);
      addPomodoroSession(selectedRoadmapId, duration, true);
      setSessionsCompleted(prev => prev + 1);
      onSessionComplete?.(duration);
      
      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleBAGuZZ/j35xb3mPp6yWe1E9WXWPn5V9X0ZFXH2Rm5F8ZlxTYnqMk4p2YFhYaHyIin1wZl1he4aIf3RqYmR5gYV/dWxlZnF5fXt1bmhlbHR4eHNwamhqcHR0cm9raWtvdHVyb2tpbHB0dHFubGprcXRzcG9samtxdHNwb2xqa3F0c3BvbGprc3V0cW9ta2txdHRxb21ra3F0dHFvbWtr');
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
      
      // Auto-switch to break
      if (sessionsCompleted > 0 && (sessionsCompleted + 1) % 4 === 0) {
        handleModeChange('longBreak');
      } else {
        handleModeChange('shortBreak');
      }
    } else {
      handleModeChange('work');
    }
  }, [mode, selectedRoadmapId, sessionsCompleted, addPomodoroSession, onSessionComplete]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleComplete]);

  useEffect(() => {
    if (roadmap?.id) {
      setSelectedRoadmapId(roadmap.id);
    }
  }, [roadmap?.id]);

  const progress = ((TIMER_SETTINGS[mode] - timeLeft) / TIMER_SETTINGS[mode]) * 100;

  const modeConfig = {
    work: { label: 'Focus', icon: Target, color: 'primary' },
    shortBreak: { label: 'Short Break', icon: Coffee, color: 'cyan' },
    longBreak: { label: 'Long Break', icon: Coffee, color: 'purple' },
  };

  const currentConfig = modeConfig[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="terminal-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Pomodoro Timer
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="text-primary font-mono">{sessionsCompleted}</span>
          <span>sessions today</span>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        {(Object.keys(modeConfig) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              mode === m
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Roadmap Selector */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Tracking for:</label>
        <select
          value={selectedRoadmapId}
          onChange={(e) => setSelectedRoadmapId(e.target.value)}
          className="terminal-input w-full"
          disabled={isRunning}
        >
          <option value="">Select a roadmap...</option>
          {roadmaps.map(r => (
            <option key={r.id} value={r.id}>{r.title}</option>
          ))}
        </select>
      </div>

      {/* Timer Display */}
      <div className="relative flex flex-col items-center py-8">
        {/* Progress Ring */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={553}
              initial={{ strokeDashoffset: 553 }}
              animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
              transition={{ duration: 0.5 }}
              className="drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <currentConfig.icon className="w-6 h-6 text-primary mb-2" />
            <span className="text-4xl font-mono font-bold text-foreground">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-muted-foreground mt-1">{currentConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          disabled={mode === 'work' && !selectedRoadmapId}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            isRunning
              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
              : 'terminal-button'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <AnimatePresence mode="wait">
            {isRunning ? (
              <motion.div
                key="pause"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Pause className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Play className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={() => resetTimer()}
          className="terminal-button-secondary flex items-center gap-2 px-4 py-3"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Current Roadmap Stats */}
      {selectedRoadmap && (
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total study time for this roadmap:</span>
            <span className="text-primary font-mono">
              {Math.floor(selectedRoadmap.totalStudyTime / 60)}h {selectedRoadmap.totalStudyTime % 60}m
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
