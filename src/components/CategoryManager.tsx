import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { Category } from '@/types/roadmap';
import { CategoryBadge } from './CategoryBadge';
import { ProgressBar } from './ProgressBar';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save,
  X
} from 'lucide-react';

const EMOJI_OPTIONS = ['💻', '📐', '🌍', '🔬', '🎨', '📊', '📚', '🎯', '🚀', '💡', '🎵', '⚽'];
const COLOR_OPTIONS: Category['color'][] = ['green', 'cyan', 'yellow', 'orange', 'purple', 'pink'];

export const CategoryManager = () => {
  const { categories, roadmaps, addCategory, updateCategory, deleteCategory, getCategoryProgress } = useRoadmapStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📚');
  const [newColor, setNewColor] = useState<Category['color']>('green');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory({ name: newName, icon: newIcon, color: newColor });
    setNewName('');
    setNewIcon('📚');
    setNewColor('green');
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    if (!newName.trim()) return;
    updateCategory(id, { name: newName, icon: newIcon, color: newColor });
    setEditingId(null);
    setNewName('');
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setNewName(category.name);
    setNewIcon(category.icon);
    setNewColor(category.color);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <span className="typing-cursor text-primary">_</span>
          </div>
          <p className="text-muted-foreground">
            Organize your roadmaps by category
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="terminal-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </motion.div>

      {/* Add Category Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="terminal-card p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground">New Category</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Category name..."
                  className="terminal-input w-full"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewIcon(emoji)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                        newIcon === emoji 
                          ? 'bg-primary/20 border-2 border-primary' 
                          : 'bg-muted hover:bg-muted/80 border border-border'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all bg-terminal-${color} ${
                        newColor === color 
                          ? 'ring-2 ring-offset-2 ring-offset-card ring-primary' 
                          : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="terminal-button flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewName('');
                  }}
                  className="terminal-button-secondary flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="terminal-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">Delete Category?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Roadmaps in this category will become uncategorized. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="terminal-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {categories.map((category) => {
            const roadmapCount = roadmaps.filter(r => r.categoryId === category.id).length;
            const progress = getCategoryProgress(category.id);
            const isEditing = editingId === category.id;

            return (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="terminal-card p-5"
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="terminal-input w-full"
                      autoFocus
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      {EMOJI_OPTIONS.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setNewIcon(emoji)}
                          className={`w-8 h-8 rounded flex items-center justify-center text-lg ${
                            newIcon === emoji 
                              ? 'bg-primary/20 border border-primary' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewColor(color)}
                          className={`w-8 h-8 rounded bg-terminal-${color} ${newColor === color ? 'ring-2 ring-offset-1 ring-offset-card ring-primary' : ''}`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
                        className="terminal-button text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="terminal-button-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category={category} />
                        <span className="text-sm text-muted-foreground">
                          {roadmapCount} roadmap{roadmapCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {roadmapCount > 0 && (
                        <ProgressBar progress={progress} size="sm" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(category.id)}
                        className="p-2 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No categories yet. Create your first one!
          </p>
        </motion.div>
      )}
    </div>
  );
};
