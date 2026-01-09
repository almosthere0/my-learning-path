import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { ROADMAP_TEMPLATES } from '@/types/roadmap';
import { 
  BookTemplate, 
  Download, 
  Star, 
  Search,
  Filter,
  CheckCircle,
  Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const Templates = () => {
  const { addRoadmap, categories } = useRoadmapStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [importedTemplates, setImportedTemplates] = useState<Set<string>>(new Set());

  const filteredTemplates = ROADMAP_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImport = (template: typeof ROADMAP_TEMPLATES[0]) => {
    addRoadmap({
      title: template.title,
      description: template.description,
      categoryId: template.categoryId,
      steps: template.steps.map(step => ({
        ...step,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date().toISOString(),
        resources: [],
      })),
      totalStudyTime: 0,
    });
    
    setImportedTemplates(prev => new Set(prev).add(template.id));
    toast.success(`"${template.title}" has been added to your roadmaps!`);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || { name: 'General', icon: '📚', color: 'green' };
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookTemplate className="w-8 h-8 text-terminal-purple" />
          Templates
        </h1>
        <p className="text-muted-foreground">
          Browse and use community-created roadmap templates
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="pl-9 terminal-input"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-4"
      >
        <div className="terminal-card px-4 py-2">
          <span className="text-sm text-muted-foreground">Total Templates:</span>
          <span className="text-lg font-bold text-foreground ml-2">{ROADMAP_TEMPLATES.length}</span>
        </div>
        <div className="terminal-card px-4 py-2">
          <span className="text-sm text-muted-foreground">Imported:</span>
          <span className="text-lg font-bold text-primary ml-2">{importedTemplates.size}</span>
        </div>
      </motion.div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTemplates.map((template, i) => {
          const category = getCategoryInfo(template.categoryId);
          const isImported = importedTemplates.has(template.id);
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`terminal-card p-5 hover:border-primary/30 transition-all ${
                isImported ? 'border-primary/30 bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{category.icon}</span>
                    <h3 className="font-semibold text-foreground truncate">{template.title}</h3>
                    {template.isOfficial && (
                      <span className="px-2 py-0.5 text-xs bg-terminal-yellow/20 text-terminal-yellow rounded-full">
                        Official
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-terminal-yellow fill-terminal-yellow" />
                      {template.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {template.downloads.toLocaleString()}
                    </span>
                    <span>{template.steps.length} steps</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => handleImport(template)}
                  disabled={isImported}
                  variant={isImported ? "outline" : "default"}
                  className={isImported ? "" : "terminal-button"}
                >
                  {isImported ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-1" />
                      Use
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-card p-12 text-center"
        >
          <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </motion.div>
      )}
    </div>
  );
};
