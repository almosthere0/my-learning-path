import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { RoadmapList } from '@/components/RoadmapList';
import { RoadmapEditor } from '@/components/RoadmapEditor';
import { CategoryManager } from '@/components/CategoryManager';
import { ImportExport } from '@/components/ImportExport';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { Statistics } from '@/components/Statistics';

type View = 'dashboard' | 'roadmaps' | 'categories' | 'export' | 'import' | 'editor' | 'pomodoro' | 'statistics';

const Index = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | undefined>();
  const [isNewRoadmap, setIsNewRoadmap] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('learnpath-welcomed');
  });

  const handleViewChange = (view: string) => {
    setActiveView(view as View);
    setSelectedRoadmapId(undefined);
    setIsNewRoadmap(false);
  };

  const handleSelectRoadmap = (id: string) => {
    setSelectedRoadmapId(id);
    setIsNewRoadmap(false);
    setActiveView('editor');
  };

  const handleCreateNew = () => {
    setSelectedRoadmapId(undefined);
    setIsNewRoadmap(true);
    setActiveView('editor');
  };

  const handleEditorBack = () => {
    setActiveView('roadmaps');
    setSelectedRoadmapId(undefined);
    setIsNewRoadmap(false);
  };

  const handleEditorSave = () => {
    if (isNewRoadmap) {
      setActiveView('roadmaps');
      setIsNewRoadmap(false);
    }
  };

  const handleWelcomeComplete = () => {
    localStorage.setItem('learnpath-welcomed', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        activeView={activeView === 'editor' ? 'roadmaps' : activeView} 
        onViewChange={handleViewChange} 
      />
      
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <Dashboard 
              key="dashboard"
              onSelectRoadmap={handleSelectRoadmap} 
            />
          )}
          
          {activeView === 'roadmaps' && (
            <RoadmapList 
              key="roadmaps"
              onSelectRoadmap={handleSelectRoadmap}
              onCreateNew={handleCreateNew}
            />
          )}
          
          {activeView === 'editor' && (
            <RoadmapEditor
              key="editor"
              roadmapId={selectedRoadmapId}
              onBack={handleEditorBack}
              onSave={handleEditorSave}
            />
          )}
          
          {activeView === 'categories' && (
            <CategoryManager key="categories" />
          )}
          
          {activeView === 'pomodoro' && (
            <div key="pomodoro" className="p-8 max-w-2xl mx-auto">
              <PomodoroTimer />
            </div>
          )}
          
          {activeView === 'statistics' && (
            <Statistics key="statistics" />
          )}
          
          {activeView === 'export' && (
            <ImportExport key="export" mode="export" />
          )}
          
          {activeView === 'import' && (
            <ImportExport key="import" mode="import" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
