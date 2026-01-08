import { motion } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export const WelcomeScreen = ({ onComplete }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex items-center justify-center p-8 scanline"
    >
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="inline-block"
        >
          <div className="w-24 h-24 rounded-2xl bg-primary flex items-center justify-center terminal-glow pulse-glow">
            <Terminal className="w-12 h-12 text-primary-foreground" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            <span className="text-primary">$</span> LearnPath
          </h1>
          <p className="text-xl text-muted-foreground">
            Your command center for structured learning
          </p>
        </motion.div>

        {/* Terminal-style text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="terminal-card p-6 text-left font-mono text-sm space-y-2"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-muted-foreground"
          >
            <span className="text-primary">$</span> initializing learning_engine...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-terminal-cyan"
          >
            ✓ Roadmap manager loaded
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-terminal-cyan"
          >
            ✓ Progress tracker online
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            className="text-terminal-cyan"
          >
            ✓ Motivation module activated
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-primary"
          >
            Ready to learn!<span className="typing-cursor">_</span>
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="terminal-button text-lg px-8 py-4 inline-flex items-center gap-3"
        >
          Start Learning
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        {/* Features hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="text-xs text-muted-foreground"
        >
          Create roadmaps • Track progress • Stay motivated • Export & share
        </motion.p>
      </div>
    </motion.div>
  );
};
