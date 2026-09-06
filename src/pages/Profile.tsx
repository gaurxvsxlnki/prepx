import { useEffect, useState } from 'react';
import { BadgeCheck, Lock, Save, ShieldCheck, UserRound } from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card, CardHead } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Field, Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Chip } from '../components/ui/Badge';
import { useProfile } from '../stores/profile';
import { useUi } from '../stores/ui';
import { BOARDS, SUBJECTS, subjectOf } from '../data/content';
import { CLASS_OPTIONS, BOARD_OPTIONS, LANGUAGE_OPTIONS, examOptionsFor, SUBJECT_OPTIONS } from '../data/onboarding';
import { examGoalLabel } from '../data/demo';
import { formatDate } from '../lib/utils';
import type { BoardCode, ClassCode, ExamGoalCode, LanguageCode, SubjectCode } from '../types';

export default function Profile() {
  const { profile, update } = useProfile();
  const showToast = useUi((s) => s.showToast);
  const [draft, setDraft] = useState({
    full_name: '',
    class: null as ClassCode | null,
    board: null as BoardCode | null,
    exam_goal: null as ExamGoalCode | null,
    subjects: [] as SubjectCode[],
    language: null as LanguageCode | null,
  });
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setDraft({
        full_name: profile.full_name,
        class: profile.class,
        board: profile.board,
        exam_goal: profile.exam_goal,
        subjects: profile.subjects,
        language: profile.language,
      });
    }
  }, [profile?.user_id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!profile) return null;

  const dirty =
    draft.full_name !== profile.full_name ||
    draft.class !== profile.class ||
    draft.board !== profile.board ||
    draft.exam_goal !== profile.exam_goal ||
    JSON.stringify(draft.subjects) !== JSON.stringify(profile.subjects) ||
    draft.language !== profile.language;

  const subjectChoices =
    draft.class && draft.exam_goal ? SUBJECT_OPTIONS[draft.exam_goal] : SUBJECTS.map((s) => s.code);

  const save = async () => {
    if (draft.full_name.trim().length < 2) {
      showToast('Full name needs at least 2 characters');
      return;
    }
    setBusy(true);
    await update({
      full_name: draft.full_name.trim(),
      class: draft.class,
      board: draft.board,
      exam_goal: draft.exam_goal,
      subjects: draft.subjects,
      language: draft.language,
    });
    setBusy(false);
    setSaved(true);
    showToast('Profile updated');
  };

  const toggleSubject = (code: SubjectCode) => {
    setSaved(false);
    setDraft((d) => {
      const on = d.subjects.includes(code);
      return {
        ...d,
        subjects: on
          ? d.subjects.filter((x) => x !== code)
          : d.subjects.length >= 4
            ? d.subjects
            : [...d.subjects, code],
      };
    });
  };

  return (
    <div>
      <PageHead
        icon={<UserRound size={22} />}
        title="Profile"
        subtitle="Your identity and academic plan — private to you."
        action={
          <Button onClick={save} disabled={busy || !dirty} variant={dirty ? 'primary' : 'soft'}>
            <Save size={15} /> {saved && !dirty ? 'Saved' : 'Save changes'}
          </Button>
        }
      />

      <div className="profile-grid">
        <div className="profile-main">
          <Card className="profile-identity">
            <Avatar name={profile.full_name} src={profile.avatar_url} size={72} />
            <div className="px-grow">
              <h2 className="profile-name">{profile.full_name}</h2>
              <p className="px-muted-2">
                {profile.email}
                <BadgeCheck size={14} className="profile-verified" />
                <Badge tone="ok">verified</Badge>
              </p>
              <div className="profile-tags">
                <Badge tone="accent">Class {profile.class ?? '—'}</Badge>
                <Badge tone="neutral">
                  {BOARDS.find((b) => b.code === profile.board)?.name ?? 'Board —'}
                </Badge>
                <Badge tone="neutral">{examGoalLabel(profile.exam_goal)}</Badge>
                <Badge tone="neutral">
                  {(profile.language ?? '—').charAt(0).toUpperCase() + (profile.language ?? '').slice(1)}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="profile-form-card">
            <CardHead title="Personal details" sub="How PrepX greets and addresses you" />
            <div className="profile-form">
              <Field label="Full name">
                <Input
                  value={draft.full_name}
                  onChange={(e) => {
                    setDraft((d) => ({ ...d, full_name: e.target.value }));
                    setSaved(false);
                  }}
                />
              </Field>
              <Field label="Email" hint="Used for sign-in and security — cannot be edited here.">
                <Input value={profile.email} disabled />
              </Field>
            </div>
          </Card>

          <Card className="profile-form-card">
            <CardHead title="Academic plan" sub="Shapes your books, chapters and recommendations" />
            <div className="profile-form">
              <Field label="Class">
                <Select
                  value={draft.class ?? ''}
                  onChange={(e) => {
                    const v = e.target.value as ClassCode | '';
                    setDraft((d) => ({
                      ...d,
                      class: v === '' ? null : v,
                      exam_goal: null,
                      subjects: [],
                    }));
                    setSaved(false);
                  }}
                >
                  <option value="">Select class</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      Class {c.value} ({c.label})
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Board">
                <Select
                  value={draft.board ?? ''}
                  onChange={(e) => {
                    const v = e.target.value as BoardCode | '';
                    setDraft((d) => ({ ...d, board: v === '' ? null : v }));
                    setSaved(false);
                  }}
                >
                  <option value="">Select board</option>
                  {BOARD_OPTIONS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Preparing for">
                <Select
                  value={draft.exam_goal ?? ''}
                  onChange={(e) => {
                    const v = e.target.value as ExamGoalCode | '';
                    setDraft((d) => ({
                      ...d,
                      exam_goal: v === '' ? null : v,
                      subjects: [],
                    }));
                    setSaved(false);
                  }}
                >
                  <option value="">Select goal</option>
                  {examOptionsFor(draft.class).map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field
                label="Subjects (up to 4)"
                hint={draft.exam_goal ? 'Candidates shown for your goal' : 'Select a class and goal to focus the list'}
              >
                <div className="subject-picker">
                  {subjectChoices.map((code) => {
                    const subj = subjectOf(code);
                    const on = draft.subjects.includes(code);
                    return (
                      <Chip key={code} selected={on} onClick={() => toggleSubject(code)}>
                        <span className="subject-dot" style={{ background: subj.color }} />
                        {subj.name}
                      </Chip>
                    );
                  })}
                </div>
              </Field>
              <Field label="Preferred language">
                <Select
                  value={draft.language ?? ''}
                  onChange={(e) => {
                    const v = e.target.value as LanguageCode | '';
                    setDraft((d) => ({ ...d, language: v === '' ? null : v }));
                    setSaved(false);
                  }}
                >
                  <option value="">Select language</option>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label} — {l.hint}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>
        </div>

        <aside className="profile-side">
          <Card>
            <CardHead title="Account status" />
            <ul className="profile-status">
              <li>
                <span>Member since</span>
                <strong>{formatDate(profile.created_at)}</strong>
              </li>
              <li>
                <span>Onboarding</span>
                <Badge tone={profile.onboarded ? 'ok' : 'warn'}>
                  {profile.onboarded ? 'Complete' : 'Pending'}
                </Badge>
              </li>
              <li>
                <span>Subjects</span>
                <strong>{profile.subjects.length}</strong>
              </li>
            </ul>
          </Card>

          <Card className="privacy-card">
            <div className="privacy-head">
              <ShieldCheck size={20} className="privacy-ic" />
              <strong>Private by design</strong>
            </div>
            <p>
              Your profile, bookmarks and progress are tied to your authenticated user ID and
              protected with row-level security. No other student can read them — and PrepX never
              displays your email or phone to anyone.
            </p>
            <div className="privacy-note">
              <Lock size={13} /> Not visible to other students
            </div>
          </Card>

          <Button variant="ghost" size="sm" block onClick={() => showToast('Avatar upload arrives with Supabase Storage in Phase 2.')}>
            Change profile picture
          </Button>
        </aside>
      </div>
    </div>
  );
}
