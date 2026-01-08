import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { ProgressBar } from './ProgressBar';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Flame, 
  Target, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { format, subDays, parseISO, startOfWeek, eachDayOfInterval, isWithinInterval } from 'date-fns';

export const Statistics = () => {
  const { 
    roadmaps, 
    categories, 
    dailyActivities, 
    currentStreak, 
    longestStreak,
    getProgress,
    getOverallProgress,
    getTotalStudyTime
  } = useRoadmapStore();

  const totalStudyTime = getTotalStudyTime();
  const overallProgress = getOverallProgress();

  // Calculate stats
  const stats = useMemo(() => {
    const totalSteps = roadmaps.reduce((acc, r) => acc + r.steps.length, 0);
    const completedSteps = roadmaps.reduce((acc, r) => acc + r.steps.filter(s => s.completed).length, 0);
    const completedRoadmaps = roadmaps.filter(r => getProgress(r) === 100).length;
    
    return {
      totalRoadmaps: roadmaps.length,
      completedRoadmaps,
      totalSteps,
      completedSteps,
      completionRate: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    };
  }, [roadmaps, getProgress]);

  // Weekly activity data
  const weeklyData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: today });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const activity = dailyActivities.find(a => a.date === dateStr);
      return {
        day: format(day, 'EEE'),
        steps: activity?.stepsCompleted || 0,
        minutes: activity?.pomodoroMinutes || 0,
      };
    });
  }, [dailyActivities]);

  // Last 30 days trend
  const monthlyTrend = useMemo(() => {
    const today = new Date();
    const data: { date: string; steps: number; minutes: number }[] = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const activity = dailyActivities.find(a => a.date === dateStr);
      data.push({
        date: format(date, 'MMM d'),
        steps: activity?.stepsCompleted || 0,
        minutes: activity?.pomodoroMinutes || 0,
      });
    }
    
    return data;
  }, [dailyActivities]);

  // Category distribution
  const categoryData = useMemo(() => {
    const data = categories.map(cat => {
      const categoryRoadmaps = roadmaps.filter(r => r.categoryId === cat.id);
      const totalSteps = categoryRoadmaps.reduce((acc, r) => acc + r.steps.length, 0);
      return {
        name: cat.name,
        value: totalSteps,
        color: cat.color,
      };
    }).filter(d => d.value > 0);
    
    return data;
  }, [categories, roadmaps]);

  const COLORS = {
    green: 'hsl(142, 71%, 45%)',
    cyan: 'hsl(186, 76%, 52%)',
    yellow: 'hsl(48, 96%, 53%)',
    orange: 'hsl(25, 95%, 53%)',
    purple: 'hsl(265, 89%, 78%)',
    pink: 'hsl(330, 81%, 60%)',
  };

  // Roadmap progress chart
  const roadmapProgressData = useMemo(() => {
    return roadmaps
      .map(r => ({
        name: r.title.length > 20 ? r.title.slice(0, 20) + '...' : r.title,
        progress: getProgress(r),
        studyTime: r.totalStudyTime,
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 8);
  }, [roadmaps, getProgress]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Learning Statistics
        </h1>
        <p className="text-muted-foreground">
          Track your learning progress and study patterns
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">
            Best: {longestStreak} days
          </div>
        </div>

        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">Study Time</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {Math.floor(totalStudyTime / 60)}h
          </div>
          <div className="text-xs text-muted-foreground">
            {totalStudyTime % 60}m total
          </div>
        </div>

        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Completed Steps</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.completedSteps}</div>
          <div className="text-xs text-muted-foreground">
            of {stats.totalSteps} total
          </div>
        </div>

        <div className="terminal-card p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-sm">Completion Rate</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.completionRate}%</div>
          <ProgressBar progress={stats.completionRate} size="sm" />
        </div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            This Week's Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar 
                  dataKey="steps" 
                  name="Steps Completed"
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="terminal-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            Steps by Category
          </h3>
          {categoryData.length > 0 ? (
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[entry.color as keyof typeof COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[cat.color as keyof typeof COLORS] }}
                    />
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="text-foreground font-medium">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 30-Day Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="terminal-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            30-Day Learning Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                  interval={6}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="steps" 
                  name="Steps"
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorSteps)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Roadmap Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="terminal-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Roadmap Progress
          </h3>
          <div className="space-y-3">
            {roadmapProgressData.length > 0 ? (
              roadmapProgressData.map((roadmap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground truncate">{roadmap.name}</span>
                    <span className="text-primary font-mono">{roadmap.progress}%</span>
                  </div>
                  <ProgressBar progress={roadmap.progress} size="sm" />
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No roadmaps yet
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Completed Roadmaps Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="terminal-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Overall Progress Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Roadmaps</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalRoadmaps}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Completed Roadmaps</p>
            <p className="text-2xl font-bold text-green-500">{stats.completedRoadmaps}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-primary">{stats.totalRoadmaps - stats.completedRoadmaps}</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Learning Progress</span>
            <span className="text-sm font-mono text-primary">{overallProgress}%</span>
          </div>
          <ProgressBar progress={overallProgress} size="lg" />
        </div>
      </motion.div>
    </div>
  );
};
