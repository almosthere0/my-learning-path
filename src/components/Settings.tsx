import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRoadmapStore } from '@/hooks/useRoadmapStore';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield,
  Save,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AVATARS = ['👤', '🧑‍💻', '👨‍🎓', '👩‍🔬', '🧑‍🎨', '👨‍💼', '🦊', '🐱', '🐶', '🦁', '🐯', '🐻'];
const ACCENT_COLORS = [
  { id: 'green', name: 'Terminal Green', color: 'hsl(142, 71%, 45%)' },
  { id: 'cyan', name: 'Cyber Cyan', color: 'hsl(185, 60%, 55%)' },
  { id: 'purple', name: 'Neon Purple', color: 'hsl(280, 65%, 60%)' },
  { id: 'orange', name: 'Warm Orange', color: 'hsl(25, 95%, 53%)' },
];

export const Settings = () => {
  const { settings, updateSettings } = useRoadmapStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = <T extends keyof typeof localSettings>(
    section: T,
    key: keyof typeof localSettings[T],
    value: typeof localSettings[T][keyof typeof localSettings[T]]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your learning experience
          </p>
        </div>
        
        {hasChanges && (
          <Button onClick={handleSave} className="gap-2 terminal-button">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        )}
      </motion.div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 w-full justify-start">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card p-6 space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Settings
            </h2>
            
            {/* Avatar Selection */}
            <div className="space-y-3">
              <Label>Avatar</Label>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => handleChange('profile', 'avatar', avatar)}
                    className={`w-12 h-12 text-2xl rounded-lg transition-all ${
                      localSettings.profile.avatar === avatar
                        ? 'bg-primary/20 border-2 border-primary terminal-glow'
                        : 'bg-muted hover:bg-muted/80 border border-border'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={localSettings.profile.displayName}
                onChange={(e) => handleChange('profile', 'displayName', e.target.value)}
                placeholder="Your display name"
                className="terminal-input"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={localSettings.profile.email}
                onChange={(e) => handleChange('profile', 'email', e.target.value)}
                placeholder="your@email.com"
                className="terminal-input"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={localSettings.profile.bio}
                onChange={(e) => handleChange('profile', 'bio', e.target.value)}
                placeholder="Tell us about your learning goals..."
                className="terminal-input min-h-[100px]"
              />
            </div>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card p-6 space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              {[
                { key: 'emailReminders', label: 'Email Reminders', desc: 'Get reminded about your learning goals via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser notifications' },
                { key: 'dailyDigest', label: 'Daily Digest', desc: 'Summary of your daily progress' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly learning statistics and insights' },
                { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Get notified when you unlock achievements' },
                { key: 'dueDateReminders', label: 'Due Date Reminders', desc: 'Reminders for upcoming step deadlines' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={localSettings.notifications[key as keyof typeof localSettings.notifications]}
                    onCheckedChange={(checked) => handleChange('notifications', key as keyof typeof localSettings.notifications, checked)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card p-6 space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance Settings
            </h2>
            
            {/* Theme */}
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="flex gap-3">
                {['dark', 'light', 'system'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleChange('appearance', 'theme', theme as 'dark' | 'light' | 'system')}
                    className={`px-4 py-2 rounded-lg capitalize transition-all ${
                      localSettings.appearance.theme === theme
                        ? 'bg-primary text-primary-foreground terminal-glow'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <Label>Accent Color</Label>
              <div className="flex gap-3">
                {ACCENT_COLORS.map(({ id, name, color }) => (
                  <button
                    key={id}
                    onClick={() => handleChange('appearance', 'accentColor', id as 'green' | 'cyan' | 'purple' | 'orange')}
                    className={`relative w-12 h-12 rounded-lg transition-all ${
                      localSettings.appearance.accentColor === id
                        ? 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                    title={name}
                  >
                    {localSettings.appearance.accentColor === id && (
                      <Check className="w-5 h-5 text-white absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Options */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">Use a more condensed layout</p>
                </div>
                <Switch
                  checked={localSettings.appearance.compactMode}
                  onCheckedChange={(checked) => handleChange('appearance', 'compactMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable motion and transitions</p>
                </div>
                <Switch
                  checked={localSettings.appearance.animationsEnabled}
                  onCheckedChange={(checked) => handleChange('appearance', 'animationsEnabled', checked)}
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="terminal-card p-6 space-y-6"
          >
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              {[
                { key: 'profilePublic', label: 'Public Profile', desc: 'Allow others to view your profile' },
                { key: 'showProgress', label: 'Show Progress', desc: 'Display your learning progress publicly' },
                { key: 'showActivity', label: 'Show Activity', desc: 'Share your recent learning activity' },
                { key: 'allowMessages', label: 'Allow Messages', desc: 'Let other learners message you' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">{label}</Label>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={localSettings.privacy[key as keyof typeof localSettings.privacy]}
                    onCheckedChange={(checked) => handleChange('privacy', key as keyof typeof localSettings.privacy, checked)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
