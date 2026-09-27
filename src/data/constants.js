export const CATEGORIES = [
  { id: 'study', label: 'Study', icon: '📚', color: '#EC4899' },
  { id: 'coding', label: 'Coding', icon: '💻', color: '#BE185D' },
  { id: 'ai_ml', label: 'AI/ML', icon: '🤖', color: '#9D174D' },
  { id: 'college', label: 'College', icon: '🎓', color: '#F472B6' },
  { id: 'career', label: 'Career', icon: '💼', color: '#DB2777' },
  { id: 'health', label: 'Health', icon: '🏃', color: '#22C55E' },
  { id: 'wellness', label: 'Wellness', icon: '🧘', color: '#34D399' },
  { id: 'relationship', label: 'Relationship', icon: '❤️', color: '#F43F5E' },
  { id: 'personal', label: 'Personal', icon: '🏠', color: '#FB7185' },
  { id: 'goals', label: 'Goals', icon: '🎯', color: '#EC4899' },
  { id: 'other', label: 'Other', icon: '✨', color: '#C084FC' },
];

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export const ROUTINE_MODES = [
  { id: 'normal', label: 'Normal Day', icon: '📚', desc: 'Regular college/work schedule.' },
  { id: 'holiday', label: 'Holiday', icon: '🌴', desc: 'Relaxed but productive schedule.' },
  { id: 'exam', label: 'Exam Mode', icon: '📝', desc: 'Study-focused schedule.' },
];

export const PRIORITIES = [
  { id: 'low', label: 'Low', color: '#8B6475' },
  { id: 'medium', label: 'Medium', color: '#F59E0B' },
  { id: 'high', label: 'High', color: '#EF4444' },
];

export const MOODS = [
  { id: 'amazing', label: 'Amazing', emoji: '😍' },
  { id: 'good', label: 'Good', emoji: '😊' },
  { id: 'okay', label: 'Okay', emoji: '🙂' },
  { id: 'tired', label: 'Tired', emoji: '😴' },
  { id: 'difficult', label: 'Difficult', emoji: '😔' },
];

export const AVATARS = ['🌸', '💙', '🌷', '🌻', '🦋', '🌙', '⭐', '🍃', '🌺', '💫'];

export const ACHIEVEMENT_DEFS = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first task.',
    icon: '🌱',
    check: (s) => s.totalTasksCompleted >= 1,
  },
  {
    id: 'streak_7',
    title: '7 Day Streak',
    description: 'Stay consistent for 7 days.',
    icon: '🔥',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'coding_week',
    title: 'Coding Week',
    description: 'Complete coding tasks for 7 days.',
    icon: '💻',
    check: (s) => s.codingDays >= 7,
  },
  {
    id: 'study_champion',
    title: 'Study Champion',
    description: 'Complete 20 study hours.',
    icon: '📚',
    check: (s) => s.studyHoursTotal >= 20,
  },
  {
    id: 'goal_getter',
    title: 'Goal Getter',
    description: 'Complete your first goal.',
    icon: '🎯',
    check: (s) => s.goalsCompleted >= 1,
  },
  {
    id: 'grow_together',
    title: 'Grow Together',
    description: 'Complete shared goals together.',
    icon: '❤️',
    check: (s) => s.coupleGoalsCompleted >= 1,
  },
  {
    id: 'hundred_tasks',
    title: '100 Tasks',
    description: 'Complete 100 tasks.',
    icon: '🏆',
    check: (s) => s.totalTasksCompleted >= 100,
  },
];

export const LITTLE_THINGS_TEMPLATES = [
  { id: 'goals_together', label: 'Completed today\'s goals together', emoji: '💕' },
  { id: 'encouraged', label: 'Encouraged each other', emoji: '🌷' },
  { id: 'learned', label: 'Learned something new', emoji: '✨' },
  { id: 'careers', label: 'Worked toward our careers', emoji: '🎯' },
];
