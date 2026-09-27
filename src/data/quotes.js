export const QUOTES = [
  'Small progress every day becomes a beautiful future. 🌷',
  'Your future is built by what you do today. ✨',
  'Keep going. You are becoming the person you dreamed of. 💕',
  'Small steps create big changes. 🌱',
  'Your future self will thank you for today\'s effort. 💕',
  'Consistency matters more than perfection. ✨',
  'Keep learning. Keep growing. Keep going. 🌷',
  'One productive hour today can change your tomorrow. 🎯',
  'You showed up today, and that matters. 🌸',
  'Growth is quiet, but it never stops. 🌱',
  'Two hearts, one dream, endless possibilities. ❤️',
  'Every habit you build today is a gift to your future. 🎁',
  'Progress, not perfection. 🌷',
  'Believe in the slow work of becoming. ✨',
  'You don\'t have to be perfect, just consistent. 💫',
  'Together, every goal feels closer. 🫶',
  'Celebrate the small wins — they add up. 🏆',
  'The best investment you can make is in yourself. 📚',
  'Discipline today, freedom tomorrow. 🎯',
  'Your dreams are valid. Keep chasing them. 🌟',
  'Some days will be hard. Show up anyway. 💪',
  'Success is built one honest day at a time. 🌤️',
  'You and your goals — a beautiful work in progress. 🌸',
  'Love grows when ambition is shared. 💖',
  'Every line of code, every page read — it counts. 💻',
  'Rest is part of the journey too. 🌙',
  'Your effort today is your comfort tomorrow. 🍃',
  'Two journeys, one purpose — grow together. ❤️',
  'Focus on being one percent better today. 📈',
  'The best time to start was yesterday. The next best time is now. ✨',
  'Trust the process. You\'re exactly where you need to be. 🌷',
  'A calm mind builds a strong future. 🧘',
  'Support each other and watch how far you go. 🫶',
  'Dream big, plan carefully, work daily. 🎯',
  'You are capable of more than you know. 💫',
];

export function getRotatingQuote(seed) {
  const idx = seed % QUOTES.length;
  return QUOTES[idx];
}

export function getQuoteForToday() {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  return QUOTES[day % QUOTES.length];
}
