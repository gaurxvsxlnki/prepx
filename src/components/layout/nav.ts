import {
  Bookmark,
  BookOpen,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Home,
  Image as ImageIcon,
  Layers,
  Library,
  ListChecks,
  Settings,
  Target,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/study', label: 'My Study', icon: BookOpen },
  { to: '/books', label: 'Books', icon: Library },
  { to: '/pyqs', label: 'PYQs', icon: ListChecks },
  { to: '/quizzes', label: 'Quizzes', icon: Zap },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/diagrams', label: 'Important Diagrams', icon: ImageIcon },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

export const EXAM_NAV: NavItem[] = [
  { to: '/jee', label: 'JEE', icon: Target },
  { to: '/neet', label: 'NEET', icon: HeartPulse },
  { to: '/boards', label: 'Boards', icon: GraduationCap },
];

export const FOOTER_NAV: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: User },
];

export const EXAM_FALLBACK_ICON: LucideIcon = FlaskConical;
