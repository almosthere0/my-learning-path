import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { RoadmapCard } from './RoadmapCard';
import { SortOption, SortDirection } from '@/types/roadmap';
import { 
  Search, 
  Plus, 
  SortAsc, 
  SortDesc,
  Filter
} from 'lucide-react';

interface RoadmapListProps {
  onSelectRoadmap: (id: string) => void;
  onCreateNew: () => void;
}

export const RoadmapList = ({ onSelectRoadmap, onCreateNew }: RoadmapListProps) => {
  const { roadmaps, categories, getProgress } = useRoadmapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filteredAndSortedRoadmaps = useMemo(() => {
    let filtered = [...roadmaps];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r => r.title.toLowerCase().includes(query) ||
             r.description?.toLowerCase().includes(query) ||
             r.steps.some(s => s.title.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.categoryId === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.categoryId.localeCompare(b.categoryId);
          break;
        case 'progress':
          comparison = getProgress(a) - getProgress(b);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updated':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [roadmaps, searchQuery, selectedCategory, sortBy, sortDirection, getProgress]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
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
            <h1 className="text-2xl font-bold text-foreground">Roadmaps</h1>
            <span className="typing-cursor text-primary">_</span>
          </div>
          <p className="text-muted-foreground">
            Manage and track your learning journeys
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="terminal-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Roadmap
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="terminal-card p-4 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roadmaps and steps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="terminal-input w-full pl-10"
          />
        </div>

        {/* Category & Sort */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="terminal-input text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="terminal-input text-sm"
            >
              <option value="updated">Last Updated</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
              <option value="progress">Progress</option>
              <option value="category">Category</option>
            </select>
            <button
              onClick={toggleSortDirection}
              className="terminal-button-ghost p-2"
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              category={categories.find(c => c.id === roadmap.categoryId)}
              progress={getProgress(roadmap)}
              onClick={() => onSelectRoadmap(roadmap.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedRoadmaps.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'No roadmaps match your filters.'
              : 'No roadmaps yet. Create your first one!'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
