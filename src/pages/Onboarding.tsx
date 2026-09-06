import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';
import {
  BOARD_OPTIONS,
  CLASS_OPTIONS,
  examOptionsFor,
  LANGUAGE_OPTIONS,
  SUBJECT_OPTIONS,
} from '../data/onboarding';
import { subjectOf } from '../data/content';
import { useProfile } from '../stores/profile';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { cx } from '../lib/utils';
import type { BoardCode, ClassCode, ExamGoalCode, LanguageCode, SubjectCode } from '../types';

type StepState = {
  klass: ClassCode | null;
  goal: ExamGoalCode | null;
  board: BoardCode | null;
  subjects: SubjectCode[];
  language: LanguageCode | null;
};

export default function Onboarding() {
  const profile = useProfile((s) => s.profile);
  const update = useProfile((s) => s.update);
  const markOnboarded = useProfile((s) => s.markOnboarded);
  const nav = useNavigate();

  const [step, setStep] = useState(0);
  const [state, setState] = useState<StepState>({
    klass: (profile?.class as ClassCode) ?? null,
    goal: profile?.exam_goal ?? null,
    board: profile?.board ?? null,
    subjects: profile?.subjects ?? [],
    language: profile?.language ?? null,
  });
  const [saving, setSaving] = useState(false);

  if (profile?.onboarded) return <Navigate to="/dashboard" replace />;

  const examOptions = examOptionsFor(state.klass);
  const subjectOptions = useMemo(() => {
    const base = state.goal ? SUBJECT_OPTIONS[state.goal] : [];
    if (state.goal === 'boards') return base; // all five
    return base;
  }, [state.goal]);

  const finish = async (markDone = true) => {
    setSaving(true);
    await update({
      class: state.klass,
      board: state.board,
      exam_goal: state.goal,
      subjects: state.subjects,
      language: state.language,
    });
    if (markDone) await markOnboarded();
    setSaving(false);
    nav('/dashboard');
  };

  const canContinue =
    (step === 0 && !!state.klass) ||
    (step === 1 && !!state.goal) ||
    (step === 2 && !!state.board) ||
    (step === 3 && state.subjects.length >= 1) ||
    (step === 4 && !!state.language);

  const pickClass = (k: ClassCode) => {
    setState((s) => ({ ...s, klass: k, goal: null, subjects: [] }));
  };
  const pickGoal = (g: ExamGoalCode) => {
    setState((s) => ({ ...s, goal: g, subjects: [] }));
  };
  const pickBoard = (b: BoardCode) => {
    setState((s) => ({ ...s, board: b }));
  };

  const toggleSubject = (code: SubjectCode) => {
    setState((s) => {
      const has = s.subjects.includes(code);
      if (has) return { ...s, subjects: s.subjects.filter((x) => x !== code) };
      if (s.subjects.length >= 4) return s;
      return { ...s, subjects: [...s.subjects, code] };
    });
  };

  const pickLanguage = (l: LanguageCode) => {
    setState((s) => ({ ...s, language: l }));
  };

  const STEP_TITLES = ['Class', 'Goal', 'Board', 'Subjects', 'Language'];

  return (
    <div className="ob-page">
      <div className="ob-top">
        <div className="ob-top-inner">
          <Logo />
          <div className="ob-progress" aria-label={`Step ${step + 1} of 5`}>
            {STEP_TITLES.map((t, i) => (
              <span
                key={t}
                className={cx('ob-progress-item', i <= step && 'is-done')}
                title={t}
              >
                {i < step ? <Check size={11} /> : i + 1}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="ob-skip"
            onClick={() => finish(true)}
            disabled={saving}
          >
            Skip for now
          </button>
        </div>
      </div>

      <main className="ob-main">
        <div className="ob-inner" key={step}>
          <div className="ob-kicker">Step {step + 1} of 5</div>
          {step === 0 && (
            <>
              <h1>What class are you in?</h1>
              <p className="ob-sub">This shapes your syllabus, books and study plan.</p>
              <div className="ob-grid ob-grid-class">
                {CLASS_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    className={cx('ob-option', 'ob-option-lg', state.klass === c.value && 'is-selected')}
                    onClick={() => pickClass(c.value)}
                  >
                    <span className="ob-option-main">{c.label}</span>
                    <span className="ob-option-hint">{c.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1>What are you preparing for?</h1>
              <p className="ob-sub">You can combine Boards with a competitive exam.</p>
              <div className="ob-grid">
                {examOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={cx('ob-option', state.goal === o.value && 'is-selected')}
                    onClick={() => pickGoal(o.value)}
                  >
                    <span className="ob-option-main">{o.label}</span>
                    <span className="ob-option-hint">{o.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1>Which board are you in?</h1>
              <p className="ob-sub">NCERT books power most boards — we adapt the rest.</p>
              <div className="ob-grid">
                {BOARD_OPTIONS.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    className={cx('ob-option', state.board === b.value && 'is-selected')}
                    onClick={() => pickBoard(b.value)}
                  >
                    <span className="ob-option-main">{b.label}</span>
                    <span className="ob-option-hint">{b.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1>Which subjects do you study?</h1>
              <p className="ob-sub">Pick all that apply — up to 4 keeps your dashboard focused.</p>
              <div className="ob-grid ob-grid-subjects">
                {subjectOptions.map((code) => {
                  const s = subjectOf(code);
                  const on = state.subjects.includes(code);
                  return (
                    <button
                      key={code}
                      type="button"
                      className={cx('ob-subject', on && 'is-on')}
                      style={{ '--subj': s.color } as React.CSSProperties}
                      onClick={() => toggleSubject(code)}
                    >
                      <span className="ob-subject-check">{on && <Check size={13} />}</span>
                      <span className="ob-subject-name">{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h1>Preferred language</h1>
              <p className="ob-sub">
                How would you like explanations, flashcards and question text?
              </p>
              <div className="ob-grid ob-grid-lang">
                {LANGUAGE_OPTIONS.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    className={cx('ob-option', state.language === l.value && 'is-selected')}
                    onClick={() => pickLanguage(l.value)}
                  >
                    <span className="ob-option-main">{l.label}</span>
                    <span className="ob-option-hint">{l.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <div className="ob-foot">
        <div className="ob-foot-inner">
          <Button
            variant="ghost"
            size="md"
            disabled={step === 0 || saving}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="ob-foot-side">
            {step === 4 ? (
              <Button size="lg" disabled={!canContinue || saving} onClick={() => finish(true)} trailing={<GraduationCap size={17} />}>
                Start studying
              </Button>
            ) : (
              <Button
                size="lg"
                disabled={!canContinue || saving}
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                trailing={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
