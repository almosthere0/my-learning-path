import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { 
  Download, 
  Upload, 
  FileJson, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ImportExportProps {
  mode: 'export' | 'import';
}

export const ImportExport = ({ mode }: ImportExportProps) => {
  const { exportData, importData, roadmaps, categories } = useRoadmapStore();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = (format: 'json' | 'markdown') => {
    exportData(format);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importData(content);
      
      if (success) {
        setImportStatus('success');
        setStatusMessage('Data imported successfully!');
      } else {
        setImportStatus('error');
        setStatusMessage('Invalid file format. Please use a valid JSON export.');
      }

      setTimeout(() => {
        setImportStatus('idle');
        setStatusMessage('');
      }, 3000);
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (mode === 'export') {
    return (
      <div className="p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary">$</span>
            <h1 className="text-2xl font-bold text-foreground">Export Data</h1>
            <span className="typing-cursor text-primary">_</span>
          </div>
          <p className="text-muted-foreground">
            Download your learning roadmaps in various formats
          </p>
        </motion.div>

        <div className="terminal-card p-6 space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{roadmaps.length} roadmaps</span>
            <span>•</span>
            <span>{categories.length} categories</span>
            <span>•</span>
            <span>{roadmaps.reduce((sum, r) => sum + r.steps.length, 0)} steps</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('json')}
              className="terminal-card p-6 text-left hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-terminal-cyan/10 flex items-center justify-center">
                  <FileJson className="w-6 h-6 text-terminal-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">JSON Format</h3>
                  <p className="text-xs text-muted-foreground">Best for backups & re-importing</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Download className="w-4 h-4" />
                Download JSON
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('markdown')}
              className="terminal-card p-6 text-left hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-terminal-purple/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-terminal-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Markdown Format</h3>
                  <p className="text-xs text-muted-foreground">Great for sharing & documentation</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Download className="w-4 h-4" />
                Download Markdown
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2">
          <span className="text-primary">$</span>
          <h1 className="text-2xl font-bold text-foreground">Import Data</h1>
          <span className="typing-cursor text-primary">_</span>
        </div>
        <p className="text-muted-foreground">
          Restore your roadmaps from a previously exported file
        </p>
      </motion.div>

      <div className="terminal-card p-6 space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="file-import"
          />
          <label htmlFor="file-import" className="cursor-pointer block">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              JSON files only (exported from LearnPath)
            </p>
          </label>
        </div>

        {importStatus !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 p-3 rounded-lg ${
              importStatus === 'success' 
                ? 'bg-primary/10 text-primary' 
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {importStatus === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{statusMessage}</span>
          </motion.div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Importing will replace all existing data</li>
            <li>Make sure to export your current data first as backup</li>
            <li>Only JSON files from LearnPath exports are supported</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
