import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Map, 
  FolderOpen, 
  Download, 
  Upload,
  Terminal,
  Timer,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roadmaps', label: 'Roadmaps', icon: Map },
  { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'categories', label: 'Categories', icon: FolderOpen },
];

const utilityItems = [
  { id: 'export', label: 'Export Data', icon: Download },
  { id: 'import', label: 'Import Data', icon: Upload },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center terminal-glow">
            <Terminal className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">LearnPath</h1>
            <p className="text-xs text-muted-foreground">Learning Roadmap</p>
          </div>
        </motion.div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          {menuItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onViewChange(item.id)}
              className={`sidebar-item w-full ${activeView === item.id ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Utilities
          </p>
          {utilityItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (menuItems.length + index) * 0.1 }}
              onClick={() => onViewChange(item.id)}
              className={`sidebar-item w-full ${activeView === item.id ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="terminal-card p-3 bg-primary/5 border-primary/20">
          <p className="text-xs text-muted-foreground">
            <span className="text-primary">$</span> v1.1.0
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Keep learning, keep growing
          </p>
        </div>
      </div>
    </aside>
  );
};
