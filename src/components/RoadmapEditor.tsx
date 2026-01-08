import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Roadmap } from '@/types/roadmap';
import { StepItemExpanded } from './StepItemExpanded';
import { ProgressBar } from './ProgressBar';
import { CategoryBadge } from './CategoryBadge';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save,
  Edit2,
  X,
  Clock
} from 'lucide-react';

interface RoadmapEditorProps {
  roadmapId?: string;
  onBack: () => void;
  onSave: () => void;
}

export const RoadmapEditor = ({ roadmapId, onBack, onSave }: RoadmapEditorProps) => {
  const { 
    roadmaps, 
    categories, 
    addRoadmap, 
    updateRoadmap, 
    deleteRoadmap,
    addStep, 
    toggleStep, 
    deleteStep,
    getProgress 
  } = useRoadmapStore();

  const existingRoadmap = roadmapId ? roadmaps.find(r => r.id === roadmapId) : null;
  
  const [title, setTitle] = useState(existingRoadmap?.title || '');
  const [description, setDescription] = useState(existingRoadmap?.description || '');
  const [categoryId, setCategoryId] = useState(existingRoadmap?.categoryId || categories[0]?.id || '');
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isEditing, setIsEditing] = useState(!existingRoadmap);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentRoadmap = existingRoadmap || {
    id: '',
    title,
    description,
    categoryId,
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Roadmap;

  const progress = existingRoadmap ? getProgress(existingRoadmap) : 0;
  const category = categories.find(c => c.id === (existingRoadmap?.categoryId || categoryId));

  const handleSave = () => {
    if (!title.trim()) return;

    if (existingRoadmap) {
      updateRoadmap(existingRoadmap.id, { title, description, categoryId });
    } else {
      addRoadmap({ title, description, categoryId, steps: [], totalStudyTime: 0 });
    }
    setIsEditing(false);
    onSave();
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim() || !existingRoadmap) return;
    addStep(existingRoadmap.id, { title: newStepTitle });
    setNewStepTitle('');
  };

  const handleDelete = () => {
    if (existingRoadmap) {
      deleteRoadmap(existingRoadmap.id);
      onBack();
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="terminal-button-ghost flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="flex items-center gap-2">
          {existingRoadmap && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="terminal-button-secondary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}
          {existingRoadmap && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="terminal-button-ghost text-destructive flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="terminal-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Delete Roadmap?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This will permanently delete "{existingRoadmap?.title}" and all its steps. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="terminal-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="terminal-card p-6 space-y-6"
      >
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter roadmap title..."
                className="terminal-input w-full text-lg font-semibold"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your learning goal..."
                rows={3}
                className="terminal-input w-full resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="terminal-input w-full"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!title.trim()}
                className="terminal-button flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              {existingRoadmap && (
                <button
                  onClick={() => {
                    setTitle(existingRoadmap.title);
                    setDescription(existingRoadmap.description || '');
                    setCategoryId(existingRoadmap.categoryId);
                    setIsEditing(false);
                  }}
                  className="terminal-button-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          /* View Mode */
          <>
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-foreground">{currentRoadmap.title}</h2>
                <CategoryBadge category={category} />
              </div>
              {currentRoadmap.description && (
                <p className="text-muted-foreground">{currentRoadmap.description}</p>
              )}
            </div>

            <ProgressBar progress={progress} size="lg" />
            
            {existingRoadmap && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Clock className="w-4 h-4" />
                <span>Study time: {Math.floor(existingRoadmap.totalStudyTime / 60)}h {existingRoadmap.totalStudyTime % 60}m</span>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Steps Section */}
      {existingRoadmap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="terminal-card p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">
            Steps ({existingRoadmap.steps.length})
          </h3>

          {/* Add Step Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
              placeholder="Add a new step..."
              className="terminal-input flex-1"
            />
            <button
              onClick={handleAddStep}
              disabled={!newStepTitle.trim()}
              className="terminal-button flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Steps List */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {existingRoadmap.steps.map((step) => (
                <StepItemExpanded
                  key={step.id}
                  step={step}
                  roadmapId={existingRoadmap.id}
                  onToggle={() => toggleStep(existingRoadmap.id, step.id)}
                  onDelete={() => deleteStep(existingRoadmap.id, step.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {existingRoadmap.steps.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No steps yet. Add your first step above!
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};
