import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  Info,
  LogOut,
  Moon,
  Monitor,
  Palette,
  RotateCcw,
  Shield,
  SlidersHorizontal,
  Sun,
  UserCog,
  Zap,
} from 'lucide-react';
import { PageHead } from '../components/common/PageScaffold';
import { Card, CardHead } from '../components/ui/Card';
import { Segmented, Switch } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ACCENTS, useSettings, type AccentPref } from '../stores/settings';
import { useProfile } from '../stores/profile';
import { useAuth } from '../stores/auth';
import { useUi } from '../stores/ui';
import { cx } from '../lib/utils';

function Row({
  title,
  desc,
  children,
  right,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="set-row">
      <div className="px-grow">
        <strong className="set-row-title">{title}</strong>
        {desc && <p className="set-row-desc">{desc}</p>}
        {children}
      </div>
      {right}
    </div>
  );
}

export default function Settings() {
  const s = useSettings();
  const profile = useProfile((s2) => s2.profile);
  const { signOut, user } = useAuth();
  const resetProfile = useProfile((s2) => s2.reset);
  const nav = useNavigate();
  const showToast = useUi((x) => x.showToast);
  const [confirmReset, setConfirmReset] = useState(false);

  const logout = async () => {
    await signOut();
    resetProfile();
    nav('/');
  };

  const accentName: Record<AccentPref, string> = {
    violet: 'Violet',
    indigo: 'Indigo',
    sky: 'Sky',
    emerald: 'Emerald',
    rose: 'Rose',
  };

  return (
    <div className="settings-page">
      <PageHead
        icon={<SlidersHorizontal size={22} />}
        title="Settings"
        subtitle="Make PrepX yours — everything persists across sessions."
      />

      <div className="settings-grid">
        <div className="settings-stack">
          <Card>
            <CardHead
              title={<span className="set-head"><Palette size={16} /> Appearance</span>}
              sub="Interface theme and visual density"
            />
            <div className="set-body">
              <Row
                title="Theme"
                desc="Dark keeps the interface calm during long sessions."
                right={
                  <Segmented
                    value={s.theme}
                    onChange={(v) => s.set('theme', v)}
                    options={[
                      { value: 'dark', label: <span className="seg-ic"><Moon size={14} /> Dark</span> },
                      { value: 'light', label: <span className="seg-ic"><Sun size={14} /> Light</span> },
                      { value: 'system', label: <span className="seg-ic"><Monitor size={14} /> System</span> },
                    ]}
                  />
                }
              />
              <div className="set-divider" />
              <Row title="Accent colour" desc="Used for highlights, buttons and progress." />
              <div className="accent-row">
                {ACCENTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={cx('accent-dot', s.accent === a && 'is-on')}
                    onClick={() => {
                      s.set('accent', a);
                      showToast(`Accent set to ${accentName[a]}`);
                    }}
                    aria-label={`Accent ${accentName[a]}`}
                  >
                    <span className="accent-swatch" data-ac={a} />
                    {s.accent === a && <Check size={13} />}
                  </button>
                ))}
              </div>
              <div className="set-divider" />
              <Row title="Font size" desc="Scales text across the whole app.">
                <Segmented
                  value={s.fontScale}
                  onChange={(v) => s.set('fontScale', v)}
                  options={[
                    { value: 'sm', label: 'S' },
                    { value: 'md', label: 'M' },
                    { value: 'lg', label: 'L' },
                  ]}
                />
              </Row>
              <div className="set-divider" />
              <Row
                title="Comfortable mode"
                desc="More breathing room in cards and lists."
                right={
                  <Switch
                    checked={s.density === 'comfortable'}
                    onChange={(v) => s.set('density', v ? 'comfortable' : 'compact')}
                    label="Density"
                  />
                }
              />
              <Row
                title="Animations"
                desc="Micro-interactions across the interface."
                right={
                  <Segmented
                    value={s.motion}
                    onChange={(v) => s.set('motion', v)}
                    options={[
                      { value: 'full', label: 'Full' },
                      { value: 'reduced', label: 'Reduced' },
                      { value: 'off', label: 'Off' },
                    ]}
                  />
                }
              />
            </div>
          </Card>

          <Card>
            <CardHead
              title={<span className="set-head"><UserCog size={16} /> Personalisation</span>}
              sub="Your learning identity"
            />
            <div className="set-body">
              <Row
                title="Display name"
                desc="Shown on your dashboard and profile."
              >
                <em className="px-muted-2">{profile?.full_name ?? '—'}</em>{' '}
                <Button to="/profile" variant="ghost" size="xs">
                  Edit profile
                </Button>
              </Row>
              <div className="set-divider" />
              <Row
                title="Sidebar behaviour"
                desc="Sidebar preference on wide screens."
                right={
                  <Switch
                    checked={!s.sidebarCollapsed}
                    onChange={(v) => s.set('sidebarCollapsed', !v)}
                    label="Sidebar expanded"
                  />
                }
              />
            </div>
          </Card>

          <Card>
            <CardHead
              title={<span className="set-head"><Zap size={16} /> Study preferences</span>}
              sub="Goals and reminders"
            />
            <div className="set-body">
              <Row title="Daily focus goal" desc="Minutes of active study per day.">
                <div className="goal-stepper">
                  {[30, 60, 90, 120].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={cx('goal-opt', s.dailyGoalMinutes === m && 'is-on')}
                      onClick={() => s.set('dailyGoalMinutes', m)}
                    >
                      {m} min
                    </button>
                  ))}
                </div>
              </Row>
            </div>
          </Card>
        </div>

        <div className="settings-stack">
          <Card>
            <CardHead
              title={<span className="set-head"><Bell size={16} /> Notifications</span>}
              sub="Choose what PrepX pings you about"
            />
            <div className="set-body">
              <Row
                title="Daily study reminder"
                desc="A gentle nudge at your reminder time."
                right={
                  <Switch
                    checked={s.notifications.dailyReminder}
                    onChange={(v) => s.setNotifications('dailyReminder', v)}
                  />
                }
              />
              <div className="set-divider" />
              <Row
                title="Streak alerts"
                desc="Warn before your streak breaks."
                right={
                  <Switch
                    checked={s.notifications.streakAlerts}
                    onChange={(v) => s.setNotifications('streakAlerts', v)}
                  />
                }
              />
              <div className="set-divider" />
              <Row
                title="Weekly report"
                desc="A summary every Sunday evening."
                right={
                  <Switch
                    checked={s.notifications.weeklyReport}
                    onChange={(v) => s.setNotifications('weeklyReport', v)}
                  />
                }
              />
              <div className="set-divider" />
              <Row
                title="Product updates"
                desc="New chapters, features and content drops."
                right={
                  <Switch
                    checked={s.notifications.productUpdates}
                    onChange={(v) => s.setNotifications('productUpdates', v)}
                  />
                }
              />
            </div>
          </Card>

          <Card>
            <CardHead
              title={<span className="set-head"><Shield size={16} /> Account</span>}
              sub="Your private data stays yours"
            />
            <div className="set-body">
              <Row title="Signed in as" desc="Account tied to this device.">
                <div className="set-email">
                  {profile?.email || user?.email || '—'}
                  <Badge tone="neutral">private</Badge>
                </div>
              </Row>
              <div className="set-divider" />
              <Row
                title="Change password"
                desc="Reset via a secure email link."
                right={
                  <Button to="/reset-password" variant="secondary" size="sm">
                    Reset password
                  </Button>
                }
              />
              <div className="set-divider" />
              <Row
                title="Restore defaults"
                desc="Reset appearance and preferences."
                right={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirmReset) {
                        s.resetAll();
                        setConfirmReset(false);
                        showToast('Settings restored to defaults');
                      } else {
                        setConfirmReset(true);
                        showToast('Click again to confirm reset');
                      }
                    }}
                  >
                    <RotateCcw size={14} /> {confirmReset ? 'Confirm reset' : 'Reset'}
                  </Button>
                }
              />
              <div className="set-divider" />
              <div className="set-danger">
                <div>
                  <strong>Log out</strong>
                  <p>End this session on this device.</p>
                </div>
                <Button variant="danger" size="sm" onClick={logout}>
                  <LogOut size={14} /> Log out
                </Button>
              </div>
            </div>
          </Card>

          <div className="set-info">
            <Info size={15} />
            <p>
              Preferences persist on this device. When connected to Supabase they also sync to
              your profile across devices. Private fields are never shown to other students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
