// Task Types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'study' | 'personal' | 'general';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string; // UI-friendly ID
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: "pending" | "completed";
  createdAt: string;
}



// Diary Types
export type Mood = 'happy' | 'neutral' | 'stressed' | 'tired';

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  createdAt: string;
}

// Career Types
export interface ExtractedSkill {
  id: string;
  name: string;
  category?: string;
}

export interface JobPreferences {
  role: string;
  location: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  path: string;
  icon: string;
  description: string;
}
