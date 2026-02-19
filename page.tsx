'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Home, Utensils, Dumbbell, Sun, Moon, Menu, X, User, LogOut, 
  Plus, Trash2, Clock, Users, Flame, ChevronLeft, ChevronRight,
  Calendar, ChefHat, Heart, Activity, Target, Zap
} from 'lucide-react';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface NutritionLog {
  id: string;
  date: string;
  meal: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  fiber?: number;
}

interface Recipe {
  title: string;
  description: string;
  cuisine: string;
  method: string;
  minutes: number;
  servings: number;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  };
  tips: string[];
  benefits: string[];
}

interface YogaExercise {
  id: number;
  name: string;
  sanskrit: string;
  emoji: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  focus: string[];
  description: string;
  benefits: string[];
  steps: string[];
  precautions?: string[];
}

// Yoga Database
const yogaDatabase: YogaExercise[] = [
  {
    id: 1,
    name: 'Surya Namaskar',
    sanskrit: 'सूर्य नमस्कार',
    emoji: '🌅',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['flexibility', 'strength', 'balance'],
    description: 'A complete sequence of 12 powerful yoga poses that provide a great cardiovascular workout.',
    benefits: ['Improves blood circulation', 'Strengthens muscles and joints', 'Aids in weight loss', 'Improves digestive system', 'Enhances mental clarity'],
    steps: [
      'Stand straight with feet together (Pranamasana)',
      'Raise arms overhead, arch back (Hasta Uttanasana)',
      'Bend forward, touch feet (Padahastasana)',
      'Right leg back, look up (Ashwa Sanchalanasana)',
      'Plank position (Dandasana)',
      'Lower body, 8 points touching ground (Ashtanga Namaskara)',
      'Lift chest, cobra pose (Bhujangasana)',
      'Hips up, downward dog (Adho Mukha Svanasana)',
      'Right foot forward (Ashwa Sanchalanasana)',
      'Forward fold (Padahastasana)',
      'Rise up, arms overhead (Hasta Uttanasana)',
      'Return to standing (Pranamasana)'
    ],
    precautions: ['Avoid if you have high blood pressure', 'Not recommended during pregnancy', 'Take it slow if you have back problems']
  },
  {
    id: 2,
    name: 'Tadasana',
    sanskrit: 'ताडासन (Mountain Pose)',
    emoji: '🧘',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['balance', 'strength'],
    description: 'The foundation of all standing poses, promoting proper alignment and posture.',
    benefits: ['Improves posture', 'Strengthens thighs and ankles', 'Increases awareness', 'Reduces flat feet'],
    steps: ['Stand with feet together, arms at sides', 'Distribute weight evenly on both feet', 'Engage thigh muscles, lift kneecaps', 'Draw belly in, lift chest', 'Relax shoulders, arms hanging', 'Gaze forward, breathe steadily', 'Hold for 30-60 seconds'],
    precautions: ['Be careful if you have headaches or low blood pressure']
  },
  {
    id: 3,
    name: 'Vrikshasana',
    sanskrit: 'वृक्षासन (Tree Pose)',
    emoji: '🌳',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['balance', 'strength'],
    description: 'A balancing pose that builds focus and strengthens the legs.',
    benefits: ['Improves balance', 'Strengthens legs', 'Opens hips', 'Improves concentration'],
    steps: ['Stand in Tadasana', 'Shift weight to left foot', 'Bend right knee, place foot on inner left thigh', 'Press foot and thigh together', 'Hands in prayer position at chest', 'Hold balance for 30 seconds', 'Repeat on other side'],
    precautions: ['Hold wall if needed for balance', 'Avoid if you have recent knee or hip injury']
  },
  {
    id: 4,
    name: 'Trikonasana',
    sanskrit: 'त्रिकोणासन (Triangle Pose)',
    emoji: '📐',
    level: 'intermediate',
    duration: '10-15 mins',
    focus: ['flexibility', 'strength'],
    description: 'A powerful standing pose that stretches and strengthens the entire body.',
    benefits: ['Stretches legs and hips', 'Improves digestion', 'Reduces anxiety', 'Strengthens core'],
    steps: ['Stand with feet 3-4 feet apart', 'Turn right foot out 90 degrees', 'Extend arms parallel to floor', 'Reach right hand toward right foot', 'Place hand on shin, ankle, or floor', 'Extend left arm up', 'Gaze at left thumb', 'Hold 30 seconds, repeat other side'],
    precautions: ['Avoid if you have low blood pressure', 'Modify if you have neck problems']
  },
  {
    id: 5,
    name: 'Padmasana',
    sanskrit: 'पद्मासन (Lotus Pose)',
    emoji: '🪷',
    level: 'advanced',
    duration: '10-20 mins',
    focus: ['flexibility', 'relaxation'],
    description: 'The classic meditation pose that calms the mind and opens the hips.',
    benefits: ['Improves posture', 'Opens hips', 'Calms mind', 'Improves digestion', 'Good for meditation'],
    steps: ['Sit on floor with legs extended', 'Bend right knee, place foot on left thigh', 'Bend left knee, place foot on right thigh', 'Keep spine straight', 'Rest hands on knees in mudra', 'Close eyes, breathe deeply', 'Hold as long as comfortable'],
    precautions: ['Not for knee or ankle injuries', 'Start with half lotus if needed']
  },
  {
    id: 6,
    name: 'Bhujangasana',
    sanskrit: 'भुजंगासन (Cobra Pose)',
    emoji: '🐍',
    level: 'beginner',
    duration: '5-10 mins',
    focus: ['flexibility', 'strength'],
    description: 'A gentle backbend that strengthens the spine and opens the chest.',
    benefits: ['Strengthens spine', 'Opens chest and lungs', 'Stimulates abdominal organs', 'Relieves stress'],
    steps: ['Lie face down, legs extended', 'Place hands under shoulders', 'Press tops of feet into floor', 'Inhale, lift chest off floor', 'Keep elbows slightly bent', 'Draw shoulders back', 'Hold 15-30 seconds', 'Exhale to lower down'],
    precautions: ['Avoid if pregnant', 'Be careful with back injuries']
  },
  {
    id: 7,
    name: 'Anulom Vilom',
    sanskrit: 'अनुलोम विलोम',
    emoji: '🌬️',
    level: 'beginner',
    duration: '10-20 mins',
    focus: ['breathing', 'relaxation'],
    description: 'A calming breathing technique that balances the nervous system.',
    benefits: ['Reduces stress', 'Improves lung capacity', 'Balances energy', 'Enhances focus'],
    steps: ['Sit comfortably with spine straight', 'Close right nostril with right thumb', 'Inhale through left nostril', 'Close left nostril with ring finger', 'Release right nostril, exhale', 'Inhale through right nostril', 'Close right, exhale through left', 'Continue for 10-20 minutes'],
    precautions: ['Practice on empty stomach', 'Breathe naturally, don\'t force']
  },
  {
    id: 8,
    name: 'Kapalbhati',
    sanskrit: 'कपालभाति',
    emoji: '💨',
    level: 'intermediate',
    duration: '5-10 mins',
    focus: ['breathing', 'strength'],
    description: 'An energizing breathing technique that cleanses the respiratory system.',
    benefits: ['Cleanses lungs', 'Energizes body', 'Improves digestion', 'Reduces belly fat'],
    steps: ['Sit in comfortable position', 'Take deep breath in', 'Exhale forcefully through nose', 'Let inhalation happen passively', 'Continue rapid exhalations', 'Do 20-30 breaths per round', 'Practice 3-5 rounds'],
    precautions: ['Not for high blood pressure', 'Avoid during pregnancy', 'Stop if you feel dizzy']
  },
  {
    id: 9,
    name: 'Shavasana',
    sanskrit: 'शवासन (Corpse Pose)',
    emoji: '😌',
    level: 'beginner',
    duration: '10-20 mins',
    focus: ['relaxation'],
    description: 'The ultimate relaxation pose that integrates the practice.',
    benefits: ['Deep relaxation', 'Reduces stress', 'Lowers blood pressure', 'Improves sleep'],
    steps: ['Lie on back, legs extended', 'Let feet fall open naturally', 'Arms at sides, palms up', 'Close eyes gently', 'Relax entire body', 'Breathe naturally', 'Stay for 10-20 minutes', 'Come out slowly'],
    precautions: ['Use blanket if cold', 'Support head if needed']
  },
  {
    id: 10,
    name: 'Virabhadrasana I',
    sanskrit: 'वीरभद्रासन I (Warrior I)',
    emoji: '⚔️',
    level: 'beginner',
    duration: '10-15 mins',
    focus: ['strength', 'balance'],
    description: 'A powerful standing pose that builds strength and stamina.',
    benefits: ['Strengthens legs', 'Opens hips and chest', 'Improves focus', 'Builds stamina'],
    steps: ['Stand with feet 3-4 feet apart', 'Turn right foot out 90 degrees', 'Turn left foot in slightly', 'Rotate hips to face right', 'Bend right knee over right ankle', 'Raise arms overhead', 'Gaze up at hands', 'Hold 30-60 seconds each side'],
    precautions: ['Be careful with knee problems', 'Modify if you have neck issues']
  }
];

// Main Component
export default function PantryPilotApp() {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Nutrition State
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLog[]>([]);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [foodForm, setFoodForm] = useState({
    foodName: '',
    quantity: 100,
    unit: 'g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  // Recipe State
  const [recipeForm, setRecipeForm] = useState({
    ingredients: '',
    diet: 'none',
    cuisine: 'auto',
    minutes: 25,
    servings: 2,
    targetCalories: 450,
    spiceLevel: 'medium'
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Yoga State
  const [selectedExercise, setSelectedExercise] = useState<YogaExercise | null>(null);
  const [yogaFilters, setYogaFilters] = useState({ level: 'all', focus: 'all' });

  // Toast helper
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 3000);
  }, []);

  // Check auth on mount
  useEffect(() => {
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => {});
  }, []);

  // Load nutrition logs when date changes
  useEffect(() => {
    if (user) {
      fetch(`/api/nutrition?date=${currentDate}`)
        .then(res => res.json())
        .then(data => setNutritionLogs(data.logs || []))
        .catch(() => {});
    }
  }, [currentDate, user]);

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'nutrition', 'yoga'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginForm })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setShowLoginModal(false);
        setLoginForm({ email: '', password: '' });
        showToast(data.message);
      } else {
        showToast(data.error);
      }
    } catch {
      showToast('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', ...signupForm })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setShowSignupModal(false);
        setSignupForm({ name: '', email: '', password: '' });
        showToast(data.message);
      } else {
        showToast(data.error);
      }
    } catch {
      showToast('Signup failed');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setUser(null);
    showToast('Logged out successfully');
  };

  // Nutrition handlers
  const getMealTotals = (meal: string) => {
    const mealLogs = nutritionLogs.filter(log => log.meal === meal);
    return mealLogs.reduce((acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const getDailyTotals = () => {
    return nutritionLogs.reduce((acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein,
      carbs: acc.carbs + log.carbs,
      fats: acc.fats + log.fats
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to track nutrition');
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: currentDate, meal: selectedMeal, ...foodForm })
      });
      const data = await res.json();
      if (res.ok) {
        setNutritionLogs([...nutritionLogs, data.log]);
        setShowAddFoodModal(false);
        setFoodForm({ foodName: '', quantity: 100, unit: 'g', calories: 0, protein: 0, carbs: 0, fats: 0 });
        showToast(data.message);
      } else {
        showToast(data.error);
      }
    } catch {
      showToast('Failed to add food');
    }
  };

  const handleDeleteFood = async (logId: string) => {
    try {
      const res = await fetch(`/api/nutrition?id=${logId}`, { method: 'DELETE' });
      if (res.ok) {
        setNutritionLogs(nutritionLogs.filter(log => log.id !== logId));
        showToast('Food item deleted');
      }
    } catch {
      showToast('Failed to delete');
    }
  };

  // Recipe handler
  const handleGenerateRecipe = async () => {
    if (!recipeForm.ingredients.trim()) {
      showToast('Please enter ingredients');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeForm)
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedRecipe(data.recipe);
        showToast('Recipe generated!');
      } else {
        showToast(data.error);
      }
    } catch {
      showToast('Failed to generate recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  // Yoga filter
  const filteredExercises = yogaDatabase.filter(ex => {
    if (yogaFilters.level !== 'all' && ex.level !== yogaFilters.level) return false;
    if (yogaFilters.focus !== 'all' && !ex.focus.includes(yogaFilters.focus)) return false;
    return true;
  });

  // Daily targets
  const dailyTargets = { calories: 2000, protein: 150, carbs: 250, fats: 65 };
  const dailyTotals = getDailyTotals();

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 dark:bg-green-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold gradient-text">PantryPilot AI</h1>
                <p className="text-xs text-muted-foreground">Nutrition & Wellness</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'nutrition', icon: Utensils, label: 'Nutrition' },
                { id: 'yoga', icon: Dumbbell, label: 'Yoga & Exercises' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium'
                      : 'hover:bg-purple-500/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDark(!isDark)}
                className="rounded-full hover:bg-purple-500/20"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-red-500/20 hover:text-red-500">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full shadow-lg shadow-purple-500/30"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-purple-500/20 p-4">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'nutrition', icon: Utensils, label: 'Nutrition Tracker' },
              { id: 'yoga', icon: Dumbbell, label: 'Yoga & Exercises' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 font-medium'
                    : 'hover:bg-purple-500/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 animate-float">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">AI-Powered Nutrition Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Transform Your{' '}
                  <span className="gradient-text">Pantry</span>{' '}
                  Into Healthy Meals
                </h1>

                <p className="text-lg text-muted-foreground max-w-xl">
                  Smart recipe generation with personalized nutrition tracking, calorie management, 
                  and traditional Indian yoga exercises - all in one comprehensive wellness platform.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full shadow-lg shadow-purple-500/30 text-lg px-8"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="rounded-full border-purple-500/30 hover:bg-purple-500/10 text-lg px-8"
                  >
                    Explore Features
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4">
                  {[
                    { value: '10K+', label: 'Active Users' },
                    { value: '50K+', label: 'Recipes Generated' },
                    { value: '100+', label: 'Yoga Routines' }
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Content - Recipe Generator Card */}
              <div id="recipes" className="glass rounded-3xl p-6 border border-purple-500/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Recipe Generator</h2>
                    <p className="text-sm text-muted-foreground">Create delicious meals from your ingredients</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Available Ingredients</Label>
                    <textarea
                      value={recipeForm.ingredients}
                      onChange={e => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                      placeholder="rice, tomato, onion, paneer, spinach..."
                      className="mt-1 w-full h-24 px-4 py-3 rounded-xl bg-background/50 border border-purple-500/20 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Diet</Label>
                      <select
                        value={recipeForm.diet}
                        onChange={e => setRecipeForm({ ...recipeForm, diet: e.target.value })}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl bg-background/50 border border-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option value="none">No restriction</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="glutenfree">Gluten-free</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Cuisine</Label>
                      <select
                        value={recipeForm.cuisine}
                        onChange={e => setRecipeForm({ ...recipeForm, cuisine: e.target.value })}
                        className="mt-1 w-full px-4 py-2.5 rounded-xl bg-background/50 border border-purple-500/20 focus:border-purple-500 transition-all"
                      >
                        <option value="auto">Auto-detect</option>
                        <option value="indian">Indian</option>
                        <option value="italian">Italian</option>
                        <option value="chinese">Chinese</option>
                        <option value="mediterranean">Mediterranean</option>
                        <option value="mexican">Mexican</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Time (min)</Label>
                      <Input
                        type="number"
                        value={recipeForm.minutes}
                        onChange={e => setRecipeForm({ ...recipeForm, minutes: parseInt(e.target.value) || 25 })}
                        className="mt-1 rounded-xl border-purple-500/20"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Servings</Label>
                      <Input
                        type="number"
                        value={recipeForm.servings}
                        onChange={e => setRecipeForm({ ...recipeForm, servings: parseInt(e.target.value) || 2 })}
                        className="mt-1 rounded-xl border-purple-500/20"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Calories</Label>
                      <Input
                        type="number"
                        value={recipeForm.targetCalories}
                        onChange={e => setRecipeForm({ ...recipeForm, targetCalories: parseInt(e.target.value) || 450 })}
                        className="mt-1 rounded-xl border-purple-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Spice Level</Label>
                    <div className="flex gap-2 mt-2">
                      {['mild', 'medium', 'hot'].map(level => (
                        <button
                          key={level}
                          onClick={() => setRecipeForm({ ...recipeForm, spiceLevel: level })}
                          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                            recipeForm.spiceLevel === level
                              ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                              : 'bg-purple-500/10 text-muted-foreground hover:bg-purple-500/20'
                          }`}
                        >
                          {level === 'mild' ? '🌿 Mild' : level === 'medium' ? '🌶️ Medium' : '🔥 Hot'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-xl shadow-lg shadow-purple-500/30 h-12"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Generate Recipe
                      </>
                    )}
                  </Button>
                </div>

                {/* Generated Recipe */}
                {generatedRecipe && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{generatedRecipe.title}</h3>
                        <p className="text-sm text-muted-foreground">{generatedRecipe.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold gradient-text">
                          {Math.round(generatedRecipe.nutrition.calories)}
                        </div>
                        <div className="text-xs text-muted-foreground">kcal/serving</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="rounded-full">{generatedRecipe.cuisine}</Badge>
                      <Badge variant="secondary" className="rounded-full">{generatedRecipe.minutes} min</Badge>
                      <Badge variant="secondary" className="rounded-full">{generatedRecipe.servings} servings</Badge>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {[
                        { label: 'Protein', value: `${generatedRecipe.nutrition.protein}g`, color: 'text-purple-500' },
                        { label: 'Carbs', value: `${generatedRecipe.nutrition.carbs}g`, color: 'text-green-500' },
                        { label: 'Fats', value: `${generatedRecipe.nutrition.fats}g`, color: 'text-cyan-500' },
                        { label: 'Fiber', value: `${generatedRecipe.nutrition.fiber || 5}g`, color: 'text-orange-500' }
                      ].map((nutrient, i) => (
                        <div key={i} className="text-center p-2 rounded-lg bg-background/50">
                          <div className={`text-sm font-bold ${nutrient.color}`}>{nutrient.value}</div>
                          <div className="text-xs text-muted-foreground">{nutrient.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {generatedRecipe.ingredients.slice(0, 6).map((ing, i) => (
                          <Badge key={i} variant="outline" className="rounded-full text-xs">{ing.name}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      <h4 className="font-medium text-sm">Steps:</h4>
                      <ol className="text-sm text-muted-foreground space-y-1 pl-4 list-decimal">
                        {generatedRecipe.steps.slice(0, 3).map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Comprehensive <span className="gradient-text">Wellness</span> Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need for a healthier lifestyle in one place
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: ChefHat, title: 'Smart Recipe AI', desc: 'Generate personalized recipes based on your available ingredients with AI-powered suggestions', color: 'from-purple-500 to-pink-500' },
                { icon: Target, title: 'Nutrition Tracking', desc: 'Track daily calories, macronutrients, and micronutrients with detailed analytics and insights', color: 'from-cyan-500 to-blue-500' },
                { icon: Dumbbell, title: 'Yoga & Exercise', desc: 'Traditional Indian yoga asanas and exercises with detailed instructions and benefits', color: 'from-green-500 to-emerald-500' },
                { icon: Heart, title: 'Diet Planning', desc: 'Customize meal plans for vegetarian, vegan, gluten-free, and other dietary preferences', color: 'from-red-500 to-orange-500' },
                { icon: Activity, title: 'Health Analytics', desc: 'Visualize your nutrition journey with charts, trends, and personalized recommendations', color: 'from-yellow-500 to-amber-500' },
                { icon: Users, title: 'Multi-User Support', desc: 'Separate profiles for family members with individual tracking and preferences', color: 'from-indigo-500 to-purple-500' }
              ].map((feature, i) => (
                <Card key={i} className="glass border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Nutrition Tracker Section */}
        <section id="nutrition" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Daily <span className="gradient-text">Nutrition</span> Tracker
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Monitor your calories, macros, and micronutrients every day
              </p>
            </div>

            {/* Date Selector */}
            <div className="glass rounded-2xl p-4 mb-8 flex items-center justify-center gap-4 border border-purple-500/20">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setDate(d.getDate() - 1);
                  setCurrentDate(d.toISOString().split('T')[0]);
                }}
                className="rounded-full hover:bg-purple-500/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Calendar className="w-5 h-5 text-purple-500" />
                <input
                  type="date"
                  value={currentDate}
                  onChange={e => setCurrentDate(e.target.value)}
                  className="bg-transparent font-medium focus:outline-none"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const d = new Date(currentDate);
                  d.setDate(d.getDate() + 1);
                  setCurrentDate(d.toISOString().split('T')[0]);
                }}
                className="rounded-full hover:bg-purple-500/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])}
                className="rounded-full border-purple-500/30 hover:bg-purple-500/10"
              >
                Today
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Calories', current: dailyTotals.calories, target: dailyTargets.calories, unit: 'kcal', color: 'from-orange-500 to-red-500', icon: Flame },
                { label: 'Protein', current: dailyTotals.protein, target: dailyTargets.protein, unit: 'g', color: 'from-purple-500 to-pink-500', icon: Activity },
                { label: 'Carbs', current: dailyTotals.carbs, target: dailyTargets.carbs, unit: 'g', color: 'from-green-500 to-emerald-500', icon: Target },
                { label: 'Fats', current: dailyTotals.fats, target: dailyTargets.fats, unit: 'g', color: 'from-cyan-500 to-blue-500', icon: Heart }
              ].map((macro, i) => (
                <Card key={i} className="glass border-purple-500/20 hover:border-purple-500/40 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${macro.color} flex items-center justify-center`}>
                        <macro.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground uppercase tracking-wide">{macro.label}</div>
                        <div className="font-bold">
                          {Math.round(macro.current)} / {macro.target} <span className="text-xs font-normal text-muted-foreground">{macro.unit}</span>
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min((macro.current / macro.target) * 100, 100)} 
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meal Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map(meal => {
                const mealTotals = getMealTotals(meal);
                const mealLogs = nutritionLogs.filter(log => log.meal === meal);
                
                return (
                  <Card key={meal} className="glass border-purple-500/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-purple-500" />
                          {meal}
                          <span className="text-sm font-normal text-muted-foreground ml-2">
                            {Math.round(mealTotals.calories)} kcal
                          </span>
                        </CardTitle>
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!user) {
                              showToast('Please login to track nutrition');
                              setShowLoginModal(true);
                              return;
                            }
                            setSelectedMeal(meal);
                            setShowAddFoodModal(true);
                          }}
                          className="rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {mealLogs.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6 italic text-sm">
                          No items added yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {mealLogs.map(log => (
                            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-purple-500/10 hover:border-purple-500/30 transition-all">
                              <div>
                                <div className="font-medium capitalize">{log.foodName}</div>
                                <div className="text-sm text-muted-foreground">{log.quantity} {log.unit}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-right">
                                  <div className="font-medium">{Math.round(log.calories)} kcal</div>
                                  <div className="text-xs text-muted-foreground">
                                    P: {log.protein}g | C: {log.carbs}g | F: {log.fats}g
                                  </div>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteFood(log.id)}
                                  className="rounded-full hover:bg-red-500/20 hover:text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Yoga & Exercises Section */}
        <section id="yoga" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Traditional Indian <span className="gradient-text">Yoga</span> & Exercises
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ancient wisdom meets modern wellness with comprehensive yoga asanas and exercises
              </p>
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-4 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Level:</Label>
                <select
                  value={yogaFilters.level}
                  onChange={e => setYogaFilters({ ...yogaFilters, level: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-background/50 border border-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Focus:</Label>
                <select
                  value={yogaFilters.focus}
                  onChange={e => setYogaFilters({ ...yogaFilters, focus: e.target.value })}
                  className="px-4 py-2 rounded-xl bg-background/50 border border-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="all">All Areas</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="strength">Strength</option>
                  <option value="balance">Balance</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="breathing">Breathing</option>
                </select>
              </div>
              <Button
                variant="outline"
                onClick={() => setYogaFilters({ level: 'all', focus: 'all' })}
                className="rounded-full border-purple-500/30 hover:bg-purple-500/10 ml-auto"
              >
                Reset Filters
              </Button>
            </div>

            {/* Exercise Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredExercises.map(exercise => (
                <Card
                  key={exercise.id}
                  className="glass border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer hover:scale-[1.02] group"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{exercise.emoji}</div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={`rounded-full ${
                            exercise.level === 'beginner' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' :
                            exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' :
                            'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
                          }`}
                        >
                          {exercise.level}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exercise.duration}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold mb-1">{exercise.name}</h3>
                    <p className="text-sm text-purple-500 dark:text-purple-400 italic mb-2">{exercise.sanskrit}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{exercise.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {exercise.focus.map(f => (
                        <Badge key={f} variant="outline" className="rounded-full text-xs capitalize">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold gradient-text">PantryPilot AI</h3>
                  <p className="text-sm text-muted-foreground">Your personal nutrition & wellness companion</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2024 PantryPilot AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="glass border-purple-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Welcome Back</DialogTitle>
            <DialogDescription>Login to access your personalized nutrition tracking</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter your password"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-xl">
              Sign In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowSignupModal(true);
                }}
                className="text-purple-500 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="glass border-purple-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Create Account</DialogTitle>
            <DialogDescription>Start your wellness journey today</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={signupForm.name}
                onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="John Doe"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={signupForm.email}
                onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={signupForm.password}
                onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                placeholder="Create a password"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-xl">
              Create Account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowSignupModal(false);
                  setShowLoginModal(true);
                }}
                className="text-purple-500 hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Food Modal */}
      <Dialog open={showAddFoodModal} onOpenChange={setShowAddFoodModal}>
        <DialogContent className="glass border-purple-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl gradient-text">Add Food Item</DialogTitle>
            <DialogDescription className="capitalize">{selectedMeal}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddFood} className="space-y-4 mt-4">
            <div>
              <Label>Food Name</Label>
              <Input
                value={foodForm.foodName}
                onChange={e => setFoodForm({ ...foodForm, foodName: e.target.value })}
                placeholder="e.g., Oatmeal, Banana"
                required
                className="mt-1 rounded-xl border-purple-500/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={foodForm.quantity}
                  onChange={e => setFoodForm({ ...foodForm, quantity: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1 rounded-xl border-purple-500/20"
                />
              </div>
              <div>
                <Label>Unit</Label>
                <select
                  value={foodForm.unit}
                  onChange={e => setFoodForm({ ...foodForm, unit: e.target.value })}
                  className="mt-1 w-full px-4 py-2 rounded-xl bg-background/50 border border-purple-500/20"
                >
                  <option value="g">grams</option>
                  <option value="ml">ml</option>
                  <option value="piece">piece</option>
                  <option value="cup">cup</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Calories (kcal)</Label>
                <Input
                  type="number"
                  value={foodForm.calories}
                  onChange={e => setFoodForm({ ...foodForm, calories: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1 rounded-xl border-purple-500/20"
                />
              </div>
              <div>
                <Label>Protein (g)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={foodForm.protein}
                  onChange={e => setFoodForm({ ...foodForm, protein: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1 rounded-xl border-purple-500/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Carbs (g)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={foodForm.carbs}
                  onChange={e => setFoodForm({ ...foodForm, carbs: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1 rounded-xl border-purple-500/20"
                />
              </div>
              <div>
                <Label>Fats (g)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={foodForm.fats}
                  onChange={e => setFoodForm({ ...foodForm, fats: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1 rounded-xl border-purple-500/20"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-xl">
              Add to Meal
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Exercise Detail Modal */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="glass border-purple-500/30 max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedExercise && (
            <>
              <DialogHeader>
                <div className="text-center">
                  <div className="text-6xl mb-4">{selectedExercise.emoji}</div>
                  <DialogTitle className="text-3xl gradient-text">{selectedExercise.name}</DialogTitle>
                  <DialogDescription className="text-lg text-purple-500 italic">{selectedExercise.sanskrit}</DialogDescription>
                </div>
              </DialogHeader>
              
              <div className="flex flex-wrap items-center justify-center gap-2 my-4">
                <Badge
                  className={`rounded-full ${
                    selectedExercise.level === 'beginner' ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30' :
                    selectedExercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30' :
                    'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
                  }`}
                >
                  {selectedExercise.level}
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedExercise.duration}
                </Badge>
                {selectedExercise.focus.map(f => (
                  <Badge key={f} variant="secondary" className="rounded-full capitalize">{f}</Badge>
                ))}
              </div>

              <div className="space-y-6 mt-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedExercise.description}</p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Benefits</h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {selectedExercise.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Heart className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Step-by-Step Instructions</h3>
                  <ol className="space-y-2">
                    {selectedExercise.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {selectedExercise.precautions && selectedExercise.precautions.length > 0 && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <h3 className="font-bold text-lg mb-2 text-red-500">⚠️ Precautions</h3>
                    <ul className="space-y-1">
                      {selectedExercise.precautions.map((p, i) => (
                        <li key={i} className="text-muted-foreground text-sm">• {p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full glass border border-purple-500/30 shadow-2xl animate-in slide-in-from-bottom-4">
          <p className="font-medium">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
