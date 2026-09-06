import { Atom, Calculator, Dna, FlaskConical, BookOpen, Languages } from 'lucide-react';
import type { SubjectCode } from '../../types';
import { subjectOf } from '../../data/content';
import { cx } from '../../lib/utils';

const ICONS: Partial<Record<SubjectCode, typeof Atom>> = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  mathematics: Calculator,
  english: BookOpen,
  hindi: Languages,
  accounts: BookOpen,
  economics: BookOpen,
  business: BookOpen,
  geography: BookOpen,
  history: BookOpen,
  political: BookOpen,
  sociology: BookOpen,
  psychology: BookOpen,
  'physical-education': BookOpen,
  computer: Calculator,
  informatics: Calculator,
  honeydew: BookOpen,
  beehive: BookOpen,
  'first-flight': BookOpen,
  footprints: BookOpen,
  kshitiz: Languages,
  kritika: Languages,
  sanskrit: Languages,
  it: Calculator,
  'computer-science': Calculator,
  'informatics-practices': Calculator,
  aipmt: Calculator,
  jeemain: Calculator,
  jeeadvanced: Calculator,
  cbse: BookOpen,
  icse: BookOpen,
  state: BookOpen,
  kshitij: Languages,
  seba: BookOpen,
  'mathematics-instruction': Calculator,
};

export function SubjectIcon({ code, size = 16 }: { code: SubjectCode; size?: number }) {
  const I = ICONS[code] ?? BookOpen;
  return <I size={size} strokeWidth={1.9} />;
}

export function SubjectBadge({
  code,
  className,
  showName = true,
}: {
  code: SubjectCode;
  className?: string;
  showName?: boolean;
}) {
  const s = subjectOf(code);
  return (
    <span className={cx('subject-badge', className)}>
      <span className="subject-dot" style={{ background: s.color }} />
      {showName && <span>{s.name}</span>}
    </span>
  );
}

export { subjectOf, ICONS };
