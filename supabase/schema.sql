-- ============================================================
-- PrepX — Database foundation (Phase 1)
-- Run in the Supabase SQL editor.
--
-- Content graph (public):   boards → classes → subjects → books
--                                  → chapters → book_pages → page_assets
-- User data (private RLS):  profiles, student_preferences, bookmarks,
--                           user_progress, study_sessions
-- ============================================================

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ============================================================
-- PUBLIC ACADEMIC CONTENT (readable by every signed-in user)
-- ============================================================

create table public.classes (
  id          text primary key,          -- '9' | '10' | '11' | '12'
  label       text not null,             -- 'Class 11'
  position    int  not null default 0
);

create table public.boards (
  id          text primary key,          -- 'cbse' | 'icse' | 'state' | 'other'
  name        text not null,
  short       text not null
);

create table public.exams (
  id          text primary key,          -- 'boards' | 'jee' | 'neet'
  name        text not null,
  full_name   text not null
);

create table public.subjects (
  id          text primary key,          -- 'physics' | 'chemistry' | ...
  name        text not null,
  color       text,                      -- accent hex used by the UI
  position    int not null default 0
);

create table public.books (
  id           uuid primary key default gen_random_uuid(),
  board_id     text not null references public.boards(id),
  class_id     text not null references public.classes(id),
  subject_id   text not null references public.subjects(id),
  title        text not null,
  subtitle     text,
  publisher    text not null default 'NCERT',
  ncert_code   text,                     -- official NCERT book code, e.g. 'kebo1'
  cover_url    text,
  description  text,
  page_count   int  not null default 0,  -- total real pages in the book
  created_at   timestamptz not null default now()
);

create table public.chapters (
  id          uuid primary key default gen_random_uuid(),
  book_id     uuid not null references public.books(id) on delete cascade,
  position    int  not null default 0,
  title       text not null,
  description text,
  page_count  int  not null default 0,   -- real page count from source PDF
  ncert_pdf   text,                      -- official source PDF reference
  available   boolean not null default false,  -- page assets imported?
  created_at  timestamptz not null default now()
);

create table public.book_pages (
  id             uuid primary key default gen_random_uuid(),
  chapter_id     uuid not null references public.chapters(id) on delete cascade,
  position       int  not null,          -- 1-based order inside the chapter
  printed_number int  not null,          -- number printed on the real page
  content_text   text,                   -- optional OCR/preview text
  unique (chapter_id, position)
);

-- page_assets carries the REAL textbook page image (jpg/png) plus any
-- future derived assets (highlight overlays, diagrams) for that page.
create table public.page_assets (
  id           uuid primary key default gen_random_uuid(),
  page_id      uuid not null references public.book_pages(id) on delete cascade,
  asset_type   text not null check (asset_type in ('image', 'pdf', 'diagram', 'overlay')),
  url          text not null,            -- public bucket / CDN url of the REAL page image
  storage_path text,                     -- storage object path
  source       text not null default 'ncert' check (source in ('ncert', 'upload')),
  width        int,
  height       int,
  mime         text not null default 'image/jpeg',
  created_at   timestamptz not null default now()
);

-- ============================================================
-- PRIVATE USER DATA
-- ============================================================

create table public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  email      text,                       -- mirror kept private (never public)
  phone      text,
  avatar_url text,
  class_id   text references public.classes(id),
  board_id   text references public.boards(id),
  exam_goal  text check (exam_goal in ('boards','jee','neet','jee-boards','neet-boards')),
  subjects   text[] not null default '{}',
  language   text check (language in ('english','hindi','hinglish')),
  onboarded  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.student_preferences (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  theme               text not null default 'dark' check (theme in ('dark','light','system')),
  accent_color        text not null default 'violet',
  font_scale          text not null default 'md' check (font_scale in ('sm','md','lg')),
  density             text not null default 'comfortable' check (density in ('comfortable','compact')),
  animation_intensity text not null default 'full' check (animation_intensity in ('full','reduced','off')),
  sidebar_collapsed   boolean not null default false,
  daily_goal_minutes  int  not null default 60,
  reminder_time       time,
  notif_daily         boolean not null default true,
  notif_streak        boolean not null default true,
  notif_weekly        boolean not null default false,
  notif_updates       boolean not null default false,
  updated_at          timestamptz not null default now()
);

-- content_type/content_id polymorphic: the content row's id (page/question/diagram)
create table public.bookmarks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  content_type text not null check (content_type in ('page','question','diagram')),
  content_id   text not null,
  created_at   timestamptz not null default now(),
  unique (user_id, content_type, content_id)
);

create table public.user_progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  book_id    uuid not null references public.books(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  page_id    uuid references public.book_pages(id) on delete cascade,
  status     text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  progress_pct numeric(5,2) not null default 0,   -- 0–100 within the chapter
  last_position int,                              -- last page number read
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create table public.study_sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  started_at          timestamptz not null default now(),
  ended_at            timestamptz,
  duration_seconds    int,
  chapter_id          uuid references public.chapters(id) on delete set null,
  page_id             uuid references public.book_pages(id) on delete set null,
  questions_attempted int not null default 0,
  questions_correct   int not null default 0,
  kind                text not null default 'reading' check (kind in ('reading','quiz','pyq','flashcard'))
);

-- ---------- updated_at triggers ----------
create trigger trg_profiles_updated  before update on public.profiles  for each row execute function public.set_updated_at();
create trigger trg_prefs_updated     before update on public.student_preferences for each row execute function public.set_updated_at();
create trigger trg_progress_updated  before update on public.user_progress for each row execute function public.set_updated_at();

-- ---------- profile auto-creation on signup ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  )
  on conflict (user_id) do nothing;
  insert into public.student_preferences (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public content: any authenticated user can read; nobody writes via API.
alter table public.classes   enable row level security;
alter table public.boards    enable row level security;
alter table public.exams     enable row level security;
alter table public.subjects  enable row level security;
alter table public.books     enable row level security;
alter table public.chapters  enable row level security;
alter table public.book_pages enable row level security;
alter table public.page_assets enable row level security;

create policy "read content" on public.classes   for select to authenticated using (true);
create policy "read content" on public.boards    for select to authenticated using (true);
create policy "read content" on public.exams     for select to authenticated using (true);
create policy "read content" on public.subjects  for select to authenticated using (true);
create policy "read content" on public.books     for select to authenticated using (true);
create policy "read content" on public.chapters  for select to authenticated using (true);
create policy "read content" on public.book_pages for select to authenticated using (true);
create policy "read content" on public.page_assets for select to authenticated using (true);

-- User-owned data: read/write only your own rows.
alter table public.profiles enable row level security;
alter table public.student_preferences enable row level security;
alter table public.bookmarks enable row level security;
alter table public.user_progress enable row level security;
alter table public.study_sessions enable row level security;

create policy "own profile" on public.profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own preferences" on public.student_preferences
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own bookmarks" on public.bookmarks
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own progress" on public.user_progress
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own sessions" on public.study_sessions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for page assets (public read, admin-only write later)
insert into storage.buckets (id, name, public) values ('pages', 'pages', true)
on conflict (id) do nothing;

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_chapters_book   on public.chapters(book_id, position);
create index if not exists idx_pages_chapter   on public.book_pages(chapter_id, position);
create index if not exists idx_assets_page     on public.page_assets(page_id);
create index if not exists idx_progress_user   on public.user_progress(user_id, updated_at desc);
create index if not exists idx_sessions_user   on public.study_sessions(user_id, started_at desc);
create index if not exists idx_bookmarks_user  on public.bookmarks(user_id, created_at desc);

-- ============================================================
-- PHASE 2 — STUDY & PRACTICE ENGINE
-- ============================================================
-- Content stays public/read-only; every row a student creates is
-- scoped to auth.uid() and protected by RLS below. Column names
-- mirror src/types/study.ts 1:1 so demo datasets swap cleanly.

-- ---------- Content: questions (MCQ / assertion / numerical / free) ----------
create table if not exists public.questions (
  id            text primary key,
  chapter_id    text not null default '',      -- '' = subject-level (general PYQ)
  subject       text,                          -- set for unmapped rows
  section       text not null check (section in ('important','mcq','pyq')),
  kind          text not null check (kind in ('mcq','assertion','short','numerical','long','conceptual')),
  difficulty    text not null check (difficulty in ('easy','medium','hard')),
  topic         text not null,
  text          text not null,
  options       jsonb,                         -- string[] for option questions
  answer        text,
  explanation   text,
  source        text not null check (source in ('ncert','exemplar','pyq','board','prepx','demo')),
  source_label  text,
  exam          text check (exam in ('jee','neet','cbse','icse','state')),
  year          integer check (year between 2000 and 2026),
  marks         integer default 1,
  is_demo       boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Page mapping: which textbook page(s) each question belongs to.
-- Only content mapped to the page the student is reading is served.
create table if not exists public.question_pages (
  question_id   text not null references public.questions(id) on delete cascade,
  chapter_id    text not null,
  page_number   integer not null,             -- 1-based position inside the chapter
  primary key (question_id, chapter_id, page_number)
);

-- ---------- Content: flashcards + important diagrams ----------
create table if not exists public.flashcards (
  id          text primary key,
  deck_id     text not null,
  chapter_id  text not null,
  subject     text not null,
  pages       integer[] not null default '{}',
  front       text not null,
  back        text not null,
  tag         text not null,
  is_demo     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.diagrams (
  id             text primary key,
  book_id        text not null,
  chapter_id     text not null,
  subject        text not null,
  page_number    integer not null,
  image_url      text not null,               -- real NCERT page render (storage)
  caption        text,
  labels         jsonb not null default '[]', -- [{id,text,x,y}] hotspot QA data
  exam_relevance text,
  is_demo        boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Content is read-only via the API for every authenticated user.
alter table public.questions      enable row level security;
alter table public.question_pages enable row level security;
alter table public.flashcards     enable row level security;
alter table public.diagrams       enable row level security;

create policy "read content" on public.questions      for select to authenticated using (true);
create policy "read content" on public.question_pages for select to authenticated using (true);
create policy "read content" on public.flashcards     for select to authenticated using (true);
create policy "read content" on public.diagrams       for select to authenticated using (true);

-- ---------- Private: attempts, reviews, activity ----------
create table if not exists public.quiz_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  source_type     text not null check (source_type in ('chapter','subject','pyq','custom')),
  source_label    text,
  subject         text not null,
  chapter_id      text,
  timed           boolean not null default false,
  time_limit_sec  integer,
  total           integer not null default 0,
  correct         integer not null default 0,
  incorrect       integer not null default 0,
  skipped         integer not null default 0,
  accuracy        integer not null default 0,
  time_sec        integer not null default 0,
  topic_breakdown jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id          uuid primary key default gen_random_uuid(),
  attempt_id  uuid not null references public.quiz_attempts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  picked      text,
  correct     boolean,
  created_at  timestamptz not null default now()
);

create table if not exists public.flashcard_reviews (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  card_id    text not null,
  rating     text not null check (rating in ('again','hard','good','easy')),
  created_at timestamptz not null default now()
);

-- Activity feed: the analytics engine replays these rows to compute
-- streaks, weak topics and accuracy (same shape as TrackEvent).
create table if not exists public.activity_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null check (kind in ('page_view','question','pyq','quiz','flashcard','diagram')),
  subject     text not null,
  book_id     text,
  chapter_id  text,
  page_number integer,
  correct     boolean,
  ref_id      text,          -- question/card id of the attempt
  minutes     integer not null default 1,
  label       text,
  created_at  timestamptz not null default now()
);

-- Presence: clients heartbeat last_seen; the realtime channel carries the
-- live set (aggregate count only — identity never leaves the client).
alter table public.profiles add column if not exists last_seen timestamptz;

-- RLS — students touch only their own private rows.
alter table public.quiz_attempts     enable row level security;
alter table public.quiz_answers      enable row level security;
alter table public.flashcard_reviews enable row level security;
alter table public.activity_events   enable row level security;

create policy "own attempts" on public.quiz_attempts
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own answers" on public.quiz_answers
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reviews" on public.flashcard_reviews
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own events" on public.activity_events
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Phase 2 indexes ----------
create index if not exists idx_questions_chapter  on public.questions(chapter_id);
create index if not exists idx_questions_filter   on public.questions(exam, subject, year, difficulty);
create index if not exists idx_qpages_page        on public.question_pages(chapter_id, page_number);
create index if not exists idx_flashcards_deck    on public.flashcards(deck_id);
create index if not exists idx_flashcards_chapter on public.flashcards(chapter_id);
create index if not exists idx_diagrams_chapter   on public.diagrams(chapter_id, page_number);
create index if not exists idx_attempts_user      on public.quiz_attempts(user_id, created_at desc);
create index if not exists idx_reviews_user       on public.flashcard_reviews(user_id, created_at desc);
create index if not exists idx_events_user_time   on public.activity_events(user_id, created_at desc);
create index if not exists idx_events_kind        on public.activity_events(user_id, kind);
