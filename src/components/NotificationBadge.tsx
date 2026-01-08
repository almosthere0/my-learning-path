import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { AlertCircle, Calendar, Bell } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';

interface NotificationBadgeProps {
  onClick?: () => void;
}

export const NotificationBadge = ({ onClick }: NotificationBadgeProps) => {
  const { getUpcomingDueDates, getOverdueSteps } = useRoadmapStore();
  
  const overdue = getOverdueSteps();
  const upcoming = getUpcomingDueDates().slice(0, 5);
  
  const totalNotifications = overdue.length + upcoming.filter(u => 
    isToday(parseISO(u.step.dueDate!)) || isTomorrow(parseISO(u.step.dueDate!))
  ).length;

  if (totalNotifications === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative"
    >
      <button
        onClick={onClick}
        className="relative p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center"
        >
          {totalNotifications}
        </motion.span>
      </button>
    </motion.div>
  );
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const { getUpcomingDueDates, getOverdueSteps } = useRoadmapStore();
  
  const overdue = getOverdueSteps();
  const upcoming = getUpcomingDueDates().slice(0, 10);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-80 terminal-card p-0 z-50 max-h-96 overflow-hidden"
    >
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h3>
      </div>
      
      <div className="max-h-72 overflow-y-auto">
        {overdue.length > 0 && (
          <div className="p-2">
            <p className="text-xs text-destructive font-semibold px-2 py-1">
              Overdue ({overdue.length})
            </p>
            {overdue.map(({ step, roadmap }) => (
              <div
                key={step.id}
                className="p-2 hover:bg-destructive/10 rounded-md transition-colors"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{step.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {roadmap.title} • Due {format(parseISO(step.dueDate!), 'MMM d')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {upcoming.length > 0 && (
          <div className="p-2">
            <p className="text-xs text-muted-foreground font-semibold px-2 py-1">
              Upcoming
            </p>
            {upcoming.map(({ step, roadmap }) => {
              const dueDate = parseISO(step.dueDate!);
              const isTodays = isToday(dueDate);
              const isTomorrows = isTomorrow(dueDate);
              
              return (
                <div
                  key={step.id}
                  className="p-2 hover:bg-muted/50 rounded-md transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <Calendar className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isTodays ? 'text-orange-500' : isTomorrows ? 'text-yellow-500' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{step.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {roadmap.title} • {
                          isTodays ? 'Due today' :
                          isTomorrows ? 'Due tomorrow' :
                          `Due ${format(dueDate, 'MMM d')}`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {overdue.length === 0 && upcoming.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No notifications
          </div>
        )}
      </div>
    </motion.div>
  );
};
