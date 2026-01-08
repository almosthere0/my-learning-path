import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Step, Resource } from '@/types/roadmap';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { 
  Check, 
  Circle, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Link, 
  FileText, 
  StickyNote,
  Plus,
  X,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { format, parseISO, isPast, isToday } from 'date-fns';

interface StepItemExpandedProps {
  step: Step;
  roadmapId: string;
  onToggle: () => void;
  onDelete: () => void;
}

export const StepItemExpanded = ({ step, roadmapId, onToggle, onDelete }: StepItemExpandedProps) => {
  const { updateStep, addResourceToStep, removeResourceFromStep } = useRoadmapStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({ type: 'link' as Resource['type'], title: '', content: '' });

  const isOverdue = step.dueDate && !step.completed && isPast(parseISO(step.dueDate)) && !isToday(parseISO(step.dueDate));
  const isDueToday = step.dueDate && !step.completed && isToday(parseISO(step.dueDate));

  const handleAddResource = () => {
    if (!newResource.title.trim() || !newResource.content.trim()) return;
    addResourceToStep(roadmapId, step.id, newResource);
    setNewResource({ type: 'link', title: '', content: '' });
    setShowAddResource(false);
  };

  const handleDueDateChange = (date: string) => {
    updateStep(roadmapId, step.id, { dueDate: date || undefined });
  };

  const resourceIcons = {
    link: Link,
    file: FileText,
    note: StickyNote,
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group rounded-lg border transition-all duration-200 ${
        step.completed
          ? 'bg-primary/5 border-primary/20'
          : isOverdue
          ? 'bg-destructive/5 border-destructive/30'
          : isDueToday
          ? 'bg-orange-500/5 border-orange-500/30'
          : 'bg-muted/30 border-border hover:border-primary/30'
      }`}
    >
      {/* Main Row */}
      <div className="flex items-center gap-3 p-3">
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            step.completed
              ? 'bg-primary border-primary'
              : 'border-muted-foreground hover:border-primary'
          }`}
        >
          {step.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-3 h-3 text-primary-foreground" />
            </motion.div>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm transition-all duration-200 ${
              step.completed
                ? 'text-muted-foreground line-through'
                : 'text-foreground'
            }`}
          >
            {step.title}
          </span>
          
          <div className="flex items-center gap-2 mt-1">
            {step.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${
                isOverdue ? 'text-destructive' : isDueToday ? 'text-orange-400' : 'text-muted-foreground'
              }`}>
                {isOverdue && <AlertCircle className="w-3 h-3" />}
                <Calendar className="w-3 h-3" />
                {format(parseISO(step.dueDate), 'MMM d')}
              </span>
            )}
            {step.resources.length > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {step.resources.length} resource{step.resources.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-muted/50 text-muted-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 text-destructive transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Due Date Picker */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={step.dueDate || ''}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  className="terminal-input text-sm w-full"
                />
              </div>

              {/* Resources */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Resources & Notes
                  </label>
                  <button
                    onClick={() => setShowAddResource(!showAddResource)}
                    className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>

                {/* Add Resource Form */}
                <AnimatePresence>
                  {showAddResource && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex gap-2">
                        {(['link', 'file', 'note'] as const).map(type => {
                          const Icon = resourceIcons[type];
                          return (
                            <button
                              key={type}
                              onClick={() => setNewResource(prev => ({ ...prev, type }))}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                newResource.type === type
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              <Icon className="w-3 h-3" />
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        value={newResource.title}
                        onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Title"
                        className="terminal-input text-sm w-full"
                      />
                      {newResource.type === 'note' ? (
                        <textarea
                          value={newResource.content}
                          onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Write your note in markdown..."
                          rows={3}
                          className="terminal-input text-sm w-full resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={newResource.content}
                          onChange={(e) => setNewResource(prev => ({ ...prev, content: e.target.value }))}
                          placeholder={newResource.type === 'link' ? 'https://...' : 'Filename or path'}
                          className="terminal-input text-sm w-full"
                        />
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddResource}
                          disabled={!newResource.title.trim() || !newResource.content.trim()}
                          className="terminal-button text-xs py-1 disabled:opacity-50"
                        >
                          Add Resource
                        </button>
                        <button
                          onClick={() => setShowAddResource(false)}
                          className="terminal-button-secondary text-xs py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resource List */}
                <div className="space-y-1">
                  {step.resources.map(resource => {
                    const Icon = resourceIcons[resource.type];
                    return (
                      <div
                        key={resource.id}
                        className="flex items-start gap-2 p-2 bg-muted/20 rounded group/resource"
                      >
                        <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{resource.title}</span>
                            {resource.type === 'link' && (
                              <a
                                href={resource.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {resource.type === 'note' ? (
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap mt-1">{resource.content}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground truncate">{resource.content}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeResourceFromStep(roadmapId, step.id, resource.id)}
                          className="opacity-0 group-hover/resource:opacity-100 p-1 hover:bg-destructive/20 rounded text-destructive transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  {step.resources.length === 0 && !showAddResource && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No resources added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
