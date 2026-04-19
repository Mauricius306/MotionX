const { useState, useEffect, useMemo } = React;
const { Home, Calendar, BarChart3, Settings, Plus, Play, Check, X, Clock, Dumbbell, Activity, Zap, Waves, Timer, ChevronLeft, ChevronRight, Trash2, Edit3, Download, Upload, Flame, Mountain, Pencil, Save, PlayCircle, PlusCircle, MinusCircle, Circle, CheckCircle2, TrendingUp, RotateCcw, FileText, Trophy, Copy, StickyNote, Scale, Calculator, LineChart: LineChartIcon, History, Volume2, VolumeX } = window.LucideReact;

const STORAGE_KEY = 'basecamp-data-v1';

// =====================
// EXERCISE LIBRARY
// =====================
// kind: 'reps-weight' | 'reps-only' | 'hold' | 'cardio' | 'mobility'
const DEFAULT_EXERCISES = [
  // KRAFT
  { id: 'ex-squat', name: 'Kniebeuge', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-frontsq', name: 'Frontkniebeuge', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-dl', name: 'Kreuzheben', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-rdl', name: 'Rumänisches Kreuzheben', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-bench', name: 'Bankdrücken', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-ohp', name: 'Überkopfdrücken', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-row', name: 'Langhantelrudern', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-dbrow', name: 'Kurzhantelrudern', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-bsplit', name: 'Bulgarian Split Squat', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-curl', name: 'Bizepscurl', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-tri', name: 'Trizepsdrücken', type: 'strength', kind: 'reps-weight' },
  { id: 'ex-latp', name: 'Latzug', type: 'strength', kind: 'reps-weight' },

  // CALISTHENICS / SKILLS
  { id: 'ex-pu', name: 'Klimmzug', type: 'skill', kind: 'reps-weight' },
  { id: 'ex-cu', name: 'Chin-Up', type: 'skill', kind: 'reps-weight' },
  { id: 'ex-mu', name: 'Muscle-Up', type: 'skill', kind: 'reps-only' },
  { id: 'ex-dip', name: 'Dip', type: 'skill', kind: 'reps-weight' },
  { id: 'ex-push', name: 'Liegestütz', type: 'skill', kind: 'reps-only' },
  { id: 'ex-pikep', name: 'Pike Push-Up', type: 'skill', kind: 'reps-only' },
  { id: 'ex-hspu', name: 'Handstand Push-Up', type: 'skill', kind: 'reps-only' },
  { id: 'ex-pistol', name: 'Pistol Squat', type: 'skill', kind: 'reps-only' },
  { id: 'ex-archer', name: 'Archer Push-Up', type: 'skill', kind: 'reps-only' },
  { id: 'ex-hlraise', name: 'Hanging Leg Raise', type: 'skill', kind: 'reps-only' },
  { id: 'ex-t2b', name: 'Toes-to-Bar', type: 'skill', kind: 'reps-only' },
  // Holds
  { id: 'ex-beuge', name: 'Beugehang', type: 'skill', kind: 'hold' },
  { id: 'ex-handhold', name: 'Handstand Hold', type: 'skill', kind: 'hold' },
  { id: 'ex-lsit', name: 'L-Sit', type: 'skill', kind: 'hold' },
  { id: 'ex-frontlever', name: 'Front Lever', type: 'skill', kind: 'hold' },
  { id: 'ex-backlever', name: 'Back Lever', type: 'skill', kind: 'hold' },
  { id: 'ex-planche', name: 'Planche', type: 'skill', kind: 'hold' },
  { id: 'ex-deadhang', name: 'Dead Hang', type: 'skill', kind: 'hold' },

  // AUSDAUER
  { id: 'ex-runeasy', name: 'Lauf locker', type: 'cardio', kind: 'cardio' },
  { id: 'ex-runtempo', name: 'Lauf Tempo', type: 'cardio', kind: 'cardio' },
  { id: 'ex-runint', name: 'Lauf Intervalle', type: 'cardio', kind: 'cardio' },
  { id: 'ex-runlong', name: 'Langer Lauf', type: 'cardio', kind: 'cardio' },
  { id: 'ex-bikeeasy', name: 'Rad locker', type: 'cardio', kind: 'cardio' },
  { id: 'ex-biketempo', name: 'Rad Tempo', type: 'cardio', kind: 'cardio' },
  { id: 'ex-bikeint', name: 'Rad Intervalle', type: 'cardio', kind: 'cardio' },
  { id: 'ex-swim', name: 'Schwimmen', type: 'cardio', kind: 'cardio' },
  { id: 'ex-swimtech', name: 'Schwimmen Technik', type: 'cardio', kind: 'cardio' },

  // MOBILITY
  { id: 'ex-warmup', name: 'Warm-up', type: 'mobility', kind: 'mobility' },
  { id: 'ex-hipmob', name: 'Hüft-Mobility', type: 'mobility', kind: 'mobility' },
  { id: 'ex-shoulder', name: 'Schulter-Mobility', type: 'mobility', kind: 'mobility' },
  { id: 'ex-wrist', name: 'Handgelenk-Mobility', type: 'mobility', kind: 'mobility' },
  { id: 'ex-cool', name: 'Cool-Down Stretch', type: 'mobility', kind: 'mobility' }
];

const TYPE_META = {
  strength: { label: 'Kraft', icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-500' },
  skill: { label: 'Skill', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400' },
  cardio: { label: 'Ausdauer', icon: Activity, color: 'text-sky-400', bg: 'bg-sky-400' },
  mobility: { label: 'Mobility', icon: Waves, color: 'text-emerald-400', bg: 'bg-emerald-400' }
};

// Create example workouts - one per training type
const createSeedWorkouts = () => [
  // ========== KRAFT ==========
  {
    id: 'seed-kraft-' + Math.random().toString(36).slice(2, 8),
    name: 'Ganzkörper A',
    type: 'strength',
    exercises: [
      { exerciseId: 'ex-warmup', section: 'warmup', sets: [{ duration: 5 }]},
      { exerciseId: 'ex-squat', section: 'main', sets: [
        { reps: 5, weight: 80 }, { reps: 5, weight: 80 },
        { reps: 5, weight: 80 }, { reps: 5, weight: 80 }
      ]},
      { exerciseId: 'ex-bench', section: 'main', sets: [
        { reps: 5, weight: 70 }, { reps: 5, weight: 70 },
        { reps: 5, weight: 70 }, { reps: 5, weight: 70 }
      ]},
      { exerciseId: 'ex-row', section: 'main', sets: [
        { reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 8, weight: 60 }
      ]},
      { exerciseId: 'ex-ohp', section: 'main', sets: [
        { reps: 8, weight: 40 }, { reps: 8, weight: 40 }, { reps: 8, weight: 40 }
      ]},
      { exerciseId: 'ex-cool', section: 'cooldown', sets: [{ duration: 5 }]}
    ]
  },
  // ========== CALISTHENICS / SKILL ==========
  {
    id: 'seed-skill-' + Math.random().toString(36).slice(2, 8),
    name: 'Skill Day',
    type: 'skill',
    exercises: [
      { exerciseId: 'ex-shoulder', section: 'warmup', sets: [{ duration: 5 }]},
      { exerciseId: 'ex-wrist', section: 'warmup', sets: [{ duration: 3 }]},
      { exerciseId: 'ex-handhold', section: 'main', sets: [
        { duration: 20 }, { duration: 20 }, { duration: 20 },
        { duration: 20 }, { duration: 20 }
      ]},
      { exerciseId: 'ex-lsit', section: 'main', sets: [
        { duration: 15 }, { duration: 15 }, { duration: 15 }, { duration: 15 }
      ]},
      { exerciseId: 'ex-pu', section: 'main', sets: [
        { reps: 8, weight: 0 }, { reps: 8, weight: 0 },
        { reps: 8, weight: 0 }, { reps: 6, weight: 0 }
      ]},
      { exerciseId: 'ex-mu', section: 'main', sets: [
        { reps: 3 }, { reps: 3 }, { reps: 3 }, { reps: 2 }
      ]},
      { exerciseId: 'ex-pistol', section: 'main', sets: [
        { reps: 5 }, { reps: 5 }, { reps: 5 }
      ]}
    ]
  },
  // ========== AUSDAUER ==========
  {
    id: 'seed-cardio-' + Math.random().toString(36).slice(2, 8),
    name: 'Intervall-Lauf',
    type: 'cardio',
    exercises: [
      { exerciseId: 'ex-runeasy', section: 'warmup', sets: [
        { duration: 10, distance: 1.5 }
      ]},
      { exerciseId: 'ex-runint', section: 'main', sets: [
        { duration: 2, distance: 0.5 }, { duration: 2, distance: 0.5 },
        { duration: 2, distance: 0.5 }, { duration: 2, distance: 0.5 },
        { duration: 2, distance: 0.5 }, { duration: 2, distance: 0.5 }
      ]},
      { exerciseId: 'ex-runeasy', section: 'cooldown', sets: [
        { duration: 5, distance: 0.7 }
      ]}
    ]
  },
  // ========== MOBILITY ==========
  {
    id: 'seed-mob-' + Math.random().toString(36).slice(2, 8),
    name: 'Ganzkörper Mobility',
    type: 'mobility',
    exercises: [
      { exerciseId: 'ex-warmup', section: 'main', sets: [{ duration: 5 }] },
      { exerciseId: 'ex-hipmob', section: 'main', sets: [{ duration: 10 }] },
      { exerciseId: 'ex-shoulder', section: 'main', sets: [{ duration: 8 }] },
      { exerciseId: 'ex-wrist', section: 'main', sets: [{ duration: 5 }] },
      { exerciseId: 'ex-cool', section: 'main', sets: [{ duration: 5 }] }
    ]
  }
];

const SECTIONS = [
  { key: 'warmup', label: 'Aufwärmen', short: 'Warm-up', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  { key: 'main', label: 'Training', short: 'Main', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { key: 'cooldown', label: 'Auslaufen', short: 'Cool-down', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
];

const getSection = (wex) => wex.section || 'main';
const groupBySections = (exercises) => {
  const groups = { warmup: [], main: [], cooldown: [] };
  for (const wex of exercises) groups[getSection(wex)].push(wex);
  return groups;
};

const EMPTY_STATE = {
  exercises: DEFAULT_EXERCISES,
  workouts: [],
  sessions: [],
  plan: { mon: null, tue: null, wed: null, thu: null, fri: null, sat: null, sun: null },
  userName: '',
  hasOnboarded: false,
  bodyWeights: [] // [{ date: ISO, weight: number }]
};

const DAYS = [
  { key: 'mon', short: 'MO', full: 'Montag' },
  { key: 'tue', short: 'DI', full: 'Dienstag' },
  { key: 'wed', short: 'MI', full: 'Mittwoch' },
  { key: 'thu', short: 'DO', full: 'Donnerstag' },
  { key: 'fri', short: 'FR', full: 'Freitag' },
  { key: 'sat', short: 'SA', full: 'Samstag' },
  { key: 'sun', short: 'SO', full: 'Sonntag' }
];

const todayKey = () => {
  const d = new Date().getDay(); // 0=Sun
  return ['sun','mon','tue','wed','thu','fri','sat'][d];
};

const uid = () => Math.random().toString(36).slice(2, 10);

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
};

const fmtDuration = (s) => {
  if (!s) return '–';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}s`;
  if (sec === 0) return `${m}min`;
  return `${m}:${String(sec).padStart(2,'0')}`;
};

const fmtDayKey = (d) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
};

// =====================
// PR / HISTORY / STATS HELPERS
// =====================

// Get all past sets for an exercise, newest first
function getExerciseHistory(data, exerciseId, limit = 10) {
  const entries = [];
  for (const session of data.sessions) {
    if (session.live) continue;
    for (const ex of (session.exercises || [])) {
      if (ex.exerciseId !== exerciseId) continue;
      const topSet = [...(ex.sets || [])]
        .filter(s => s.done !== false)
        .map(s => s.actual || s)
        .sort((a, b) => {
          // sort by weight desc, then reps desc
          const wa = a.weight || 0, wb = b.weight || 0;
          if (wb !== wa) return wb - wa;
          return (b.reps || 0) - (a.reps || 0);
        })[0];
      if (topSet) {
        entries.push({
          date: session.date,
          sets: ex.sets.filter(s => s.done !== false).map(s => s.actual || s),
          topSet
        });
      }
    }
  }
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return entries.slice(0, limit);
}

// Check if a set is a PR for this exercise (excluding current session)
function checkIsPR(data, exerciseId, exerciseKind, actual, currentSessionId) {
  if (!actual) return false;
  let best = { weight: 0, reps: 0, duration: 0, distance: 0 };
  for (const session of data.sessions) {
    if (session.id === currentSessionId) continue;
    if (session.live) continue;
    for (const ex of (session.exercises || [])) {
      if (ex.exerciseId !== exerciseId) continue;
      for (const s of (ex.sets || [])) {
        if (s.done === false) continue;
        const vals = s.actual || s;
        if ((vals.weight || 0) > best.weight) best.weight = vals.weight || 0;
        if ((vals.reps || 0) > best.reps) best.reps = vals.reps || 0;
        if ((vals.duration || 0) > best.duration) best.duration = vals.duration || 0;
        if ((vals.distance || 0) > best.distance) best.distance = vals.distance || 0;
      }
    }
  }
  if (exerciseKind === 'reps-weight') {
    return (actual.weight || 0) > best.weight ||
      ((actual.weight || 0) === best.weight && (actual.reps || 0) > best.reps && best.weight > 0);
  }
  if (exerciseKind === 'reps-only') {
    return (actual.reps || 0) > best.reps && best.reps > 0;
  }
  if (exerciseKind === 'hold') {
    return (actual.duration || 0) > best.duration && best.duration > 0;
  }
  if (exerciseKind === 'cardio') {
    return (actual.distance || 0) > best.distance && best.distance > 0;
  }
  return false;
}

// Streak: consecutive days with at least one session, ending today or yesterday
function calculateStreak(sessions) {
  const dayKeys = new Set(
    sessions.filter(s => !s.live).map(s => fmtDayKey(s.date))
  );
  if (dayKeys.size === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0,0,0,0);
  // allow streak to start from yesterday (if not trained today yet)
  let cursor = new Date(today);
  if (!dayKeys.has(fmtDayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dayKeys.has(fmtDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Epley formula for estimated 1RM
function estimate1RM(weight, reps) {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

// Plate calculator: given target total weight and bar weight, return plates per side
function calculatePlates(total, barWeight = 20) {
  const perSide = (total - barWeight) / 2;
  if (perSide <= 0) return { valid: false, plates: [], perSide: 0 };
  const available = [25, 20, 15, 10, 5, 2.5, 1.25];
  const plates = [];
  let remaining = perSide;
  for (const p of available) {
    while (remaining >= p - 0.001) {
      plates.push(p);
      remaining = Math.round((remaining - p) * 100) / 100;
    }
  }
  return {
    valid: Math.abs(remaining) < 0.01,
    plates,
    perSide,
    remaining
  };
}

// Audio beep using Web Audio API (no file needed)
function playBeep(duration = 200, freq = 880) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
    if (navigator.vibrate) navigator.vibrate([200, 50, 200]);
  } catch (e) {}
}

// =====================
// MAIN APP
// =====================
function App() {
  const [data, setData] = useState(EMPTY_STATE);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState('home');
  const [modal, setModal] = useState(null); // { type, payload }
  const [activeSession, setActiveSession] = useState(null);
  const [pendingWorkout, setPendingWorkout] = useState(null); // workout waiting for mode selection

  // Load
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          // merge default exercises for any missing ones
          const existingIds = new Set((parsed.exercises || []).map(e => e.id));
          const merged = [
            ...(parsed.exercises || []),
            ...DEFAULT_EXERCISES.filter(e => !existingIds.has(e.id))
          ];
          // Legacy users (pre-onboarding) with existing data skip onboarding
          const hasLegacyData = (parsed.workouts?.length > 0 || parsed.sessions?.length > 0);
          const hasOnboarded = parsed.hasOnboarded ?? hasLegacyData;
          setData({ ...EMPTY_STATE, ...parsed, exercises: merged, hasOnboarded });
        }
      } catch (e) {
        // first run or missing key
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      (async () => {
        try { await window.storage.set(STORAGE_KEY, JSON.stringify(next)); }
        catch (e) { console.error('Save failed', e); }
      })();
      return next;
    });
  };

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-neutral-950 flex items-center justify-center">
        <div className="text-neutral-500 font-display tracking-widest uppercase text-sm">Basecamp</div>
      </div>
    );
  }

  // Show onboarding on first run
  if (!data.hasOnboarded) {
    return (
      <Onboarding
        onComplete={(name, seedExamples) => {
          save(d => ({
            ...d,
            userName: name,
            hasOnboarded: true,
            workouts: seedExamples ? [...d.workouts, ...createSeedWorkouts()] : d.workouts
          }));
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 text-neutral-50 overflow-hidden flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Barlow Condensed', system-ui, sans-serif; letter-spacing: 0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollhide::-webkit-scrollbar { display: none; }
        .scrollhide { scrollbar-width: none; }
      `}</style>

      <main className="flex-1 overflow-y-auto scrollhide pb-20">
        {tab === 'home' && <HomeScreen data={data} save={save} setModal={setModal} setActiveSession={setActiveSession} setPendingWorkout={setPendingWorkout} />}
        {tab === 'plans' && <PlansScreen data={data} save={save} setModal={setModal} />}
        {tab === 'history' && <HistoryScreen data={data} save={save} />}
        {tab === 'more' && <MoreScreen data={data} save={save} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />

      {/* Modals */}
      {modal?.type === 'workout-builder' && (
        <WorkoutBuilder
          data={data}
          save={save}
          workoutId={modal.payload?.workoutId}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'exercise-picker' && (
        <ExercisePicker
          data={data}
          save={save}
          onPick={modal.payload.onPick}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'assign-day' && (
        <AssignDayModal
          data={data}
          save={save}
          day={modal.payload.day}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === 'quick-log' && (
        <QuickLogger
          data={data}
          save={save}
          workoutId={modal.payload?.workoutId}
          onClose={() => setModal(null)}
        />
      )}
      {pendingWorkout && (
        <SessionStartModal
          workout={pendingWorkout}
          data={data}
          onStart={(session) => { setPendingWorkout(null); setActiveSession(session); }}
          onClose={() => setPendingWorkout(null)}
        />
      )}
      {activeSession && (
        <SessionPlayer
          session={activeSession}
          data={data}
          save={save}
          onClose={() => setActiveSession(null)}
          onUpdate={setActiveSession}
        />
      )}
    </div>
  );
}

// =====================
// BOTTOM NAV
// =====================
function BottomNav({ tab, setTab }) {
  const tabs = [
    { key: 'home', label: 'Heute', icon: Home },
    { key: 'plans', label: 'Pläne', icon: Calendar },
    { key: 'history', label: 'Verlauf', icon: BarChart3 },
    { key: 'more', label: 'Mehr', icon: Settings }
  ];
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-800 flex">
      {tabs.map(t => {
        const Icon = t.icon;
        const active = tab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition ${active ? 'text-orange-500' : 'text-neutral-500'}`}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="font-display uppercase text-[10px] tracking-wider font-semibold">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// =====================
// HOME SCREEN
// =====================
function HomeScreen({ data, save, setModal, setActiveSession, setPendingWorkout }) {
  const today = todayKey();
  const plannedWorkoutId = data.plan[today];
  const plannedWorkout = data.workouts.find(w => w.id === plannedWorkoutId);

  // Stats this week
  const weekStart = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const m = new Date(d.setDate(diff));
    m.setHours(0,0,0,0);
    return m;
  }, []);

  const weekSessions = data.sessions.filter(s => new Date(s.date) >= weekStart);
  const weekDone = new Set(weekSessions.map(s => {
    const d = new Date(s.date).getDay();
    return ['sun','mon','tue','wed','thu','fri','sat'][d];
  }));
  const totalMin = weekSessions.reduce((a, s) => a + (s.durationSec || 0), 0) / 60;
  const streak = useMemo(() => calculateStreak(data.sessions), [data.sessions]);

  const startSession = (workout) => {
    if (workout) {
      // Show mode selection modal for template-based workouts
      setPendingWorkout(workout);
    } else {
      // Freestyle starts immediately
      const session = {
        id: uid(),
        date: new Date().toISOString(),
        workoutId: null,
        name: 'Freestyle',
        type: 'strength',
        exercises: [],
        startedAt: Date.now(),
        durationSec: 0,
        live: true
      };
      setActiveSession(session);
    }
  };

  const now = new Date();
  const hour = now.getHours();
  const greetBase = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend';
  const greeting = data.userName ? `${greetBase}, ${data.userName}.` : `${greetBase}.`;

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">
          {now.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })}
        </div>
        <h1 className="font-display text-4xl font-bold uppercase mt-1 tracking-tight">{greeting}</h1>
      </div>

      {/* Today card */}
      <div className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500">Heute</h2>
          <button
            onClick={() => setModal({ type: 'quick-log', payload: { workoutId: plannedWorkoutId } })}
            className="text-[10px] font-display uppercase tracking-widest text-neutral-500 hover:text-neutral-300"
          >
            Schnell loggen →
          </button>
        </div>

        {plannedWorkout ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
            <TypeBadge type={plannedWorkout.type} />
            <h3 className="font-display text-3xl font-bold uppercase mt-2 leading-tight">{plannedWorkout.name}</h3>
            <div className="text-neutral-500 font-mono text-xs mt-1">
              {plannedWorkout.exercises.length} Übungen · geschätzt {estimateDuration(plannedWorkout)} min
            </div>
            <button
              onClick={() => startSession(plannedWorkout)}
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-neutral-950 font-display uppercase tracking-widest font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Play size={18} fill="currentColor" />
              Session starten
            </button>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-2xl p-5 text-center">
            <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest mb-3">Kein Plan für heute</div>
            <button
              onClick={() => startSession(null)}
              className="w-full bg-neutral-50 text-neutral-950 font-display uppercase tracking-widest font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Play size={18} fill="currentColor" />
              Freestyle starten
            </button>
          </div>
        )}
      </div>

      {/* Week strip */}
      <div className="mb-8">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Diese Woche</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map(d => {
            const isToday = d.key === today;
            const done = weekDone.has(d.key);
            const planned = !!data.plan[d.key];
            return (
              <div key={d.key} className={`rounded-xl p-2.5 flex flex-col items-center ${isToday ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-900'}`}>
                <div className={`font-display text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-neutral-950' : 'text-neutral-500'}`}>{d.short}</div>
                <div className="h-6 flex items-center justify-center mt-1">
                  {done ? <CheckCircle2 size={18} className="text-green-500" fill="currentColor" color="#0a0a0a" /> :
                    planned ? <Circle size={14} className={isToday ? 'text-orange-500' : 'text-neutral-600'} fill="currentColor" /> :
                    <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-neutral-400' : 'bg-neutral-700'}`} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick stats */}
      <div>
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Stats</h2>
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Streak" value={streak} hint={streak >= 2 ? '🔥 Tage' : 'Tage'} accent={streak >= 3} />
          <StatCard label="Woche" value={weekSessions.length} hint="Sessions" />
          <StatCard label="Min" value={Math.round(totalMin)} hint="Woche" />
          <StatCard label="Total" value={data.sessions.length} hint="all-time" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, accent }) {
  return (
    <div className={`bg-neutral-900 border rounded-xl p-3 ${accent ? 'border-orange-500/60' : 'border-neutral-800'}`}>
      <div className={`font-mono text-2xl font-bold ${accent ? 'text-orange-500' : 'text-neutral-50'}`}>{value}</div>
      <div className="font-display text-[10px] uppercase tracking-widest text-neutral-500 mt-1">{label}</div>
      {hint && <div className="font-mono text-[9px] text-neutral-600 mt-0.5">{hint}</div>}
    </div>
  );
}

function TypeBadge({ type }) {
  const meta = TYPE_META[type] || TYPE_META.strength;
  const Icon = meta.icon;
  return (
    <div className="inline-flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-full px-2 py-1">
      <Icon size={11} className={meta.color} />
      <span className="font-display text-[9px] uppercase tracking-widest text-neutral-400 font-bold">{meta.label}</span>
    </div>
  );
}

function estimateDuration(workout) {
  // Rough estimation: strength 3min/set, cardio uses duration, holds use sets*1min, mobility 10min flat
  let total = 0;
  for (const ex of workout.exercises) {
    const def = DEFAULT_EXERCISES.find(e => e.id === ex.exerciseId);
    if (!def) continue;
    if (def.kind === 'reps-weight' || def.kind === 'reps-only') total += ex.sets.length * 3;
    else if (def.kind === 'hold') total += ex.sets.length * 1.5;
    else if (def.kind === 'cardio') total += ex.sets.reduce((a,s)=>a+(s.duration||0),0);
    else total += 10;
  }
  return Math.max(10, Math.round(total));
}

// =====================
// PLANS SCREEN
// =====================
function PlansScreen({ data, save, setModal }) {
  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Pläne</h1>
      <p className="text-neutral-500 font-mono text-xs mt-1">Workouts erstellen und Wochenplan belegen</p>

      {/* Weekly plan */}
      <div className="mt-8">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Wochenplan</h2>
        <div className="space-y-1.5">
          {DAYS.map(d => {
            const workoutId = data.plan[d.key];
            const workout = data.workouts.find(w => w.id === workoutId);
            return (
              <button
                key={d.key}
                onClick={() => setModal({ type: 'assign-day', payload: { day: d.key } })}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-3 hover:bg-neutral-800 transition text-left"
              >
                <div className="font-display text-sm font-bold uppercase text-neutral-500 tracking-widest w-10">{d.short}</div>
                {workout ? (
                  <div className="flex-1 flex items-center gap-2">
                    <TypeBadge type={workout.type} />
                    <span className="font-display uppercase text-sm font-semibold tracking-wide">{workout.name}</span>
                  </div>
                ) : (
                  <div className="flex-1 text-neutral-600 font-mono text-xs uppercase tracking-widest">— leer —</div>
                )}
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Workout templates */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-neutral-500">Workout-Vorlagen</h2>
          <button
            onClick={() => setModal({ type: 'workout-builder' })}
            className="flex items-center gap-1 text-orange-500 font-display uppercase text-xs tracking-widest font-bold"
          >
            <Plus size={14} strokeWidth={3} /> Neu
          </button>
        </div>

        {data.workouts.length === 0 ? (
          <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-xl p-8 text-center">
            <Mountain size={32} className="text-neutral-700 mx-auto mb-2" strokeWidth={1.5} />
            <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Noch keine Vorlagen</div>
            <button
              onClick={() => setModal({ type: 'workout-builder' })}
              className="mt-4 bg-neutral-50 text-neutral-950 font-display uppercase tracking-widest font-bold py-2.5 px-5 rounded-lg text-sm"
            >
              Erstes Workout bauen
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {data.workouts.map(w => (
              <div key={w.id} className="bg-neutral-900 border border-neutral-800 rounded-xl flex items-center hover:bg-neutral-800 transition overflow-hidden">
                <button
                  onClick={() => setModal({ type: 'workout-builder', payload: { workoutId: w.id } })}
                  className="flex-1 p-3 flex items-center gap-3 text-left"
                >
                  <TypeBadge type={w.type} />
                  <div className="flex-1">
                    <div className="font-display uppercase text-base font-bold tracking-wide">{w.name}</div>
                    <div className="text-neutral-500 font-mono text-[10px] mt-0.5">
                      {w.exercises.length} Übungen · {estimateDuration(w)} min
                    </div>
                  </div>
                  <Pencil size={14} className="text-neutral-600" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const copy = {
                      ...w,
                      id: uid(),
                      name: w.name + ' (Kopie)',
                      exercises: w.exercises.map(ex => ({ ...ex, sets: ex.sets.map(s => ({ ...s })) }))
                    };
                    save(d => ({ ...d, workouts: [...d.workouts, copy] }));
                  }}
                  className="p-3 border-l border-neutral-800 text-neutral-500 hover:text-orange-500"
                  title="Duplizieren"
                >
                  <Copy size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================
// HISTORY SCREEN
// =====================
function HistoryScreen({ data, save }) {
  const [expanded, setExpanded] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'calendar' | 'progress'
  const [chartExerciseId, setChartExerciseId] = useState(null);
  const sessions = [...data.sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Basic stats
  const allTime = sessions.length;
  const byType = sessions.reduce((a, s) => { a[s.type] = (a[s.type]||0)+1; return a; }, {});

  const deleteSession = (id) => {
    if (!confirm('Session wirklich löschen?')) return;
    save(d => ({ ...d, sessions: d.sessions.filter(s => s.id !== id) }));
  };

  // List of exercises that have been logged (for progress tab)
  const loggedExerciseIds = useMemo(() => {
    const ids = new Set();
    for (const s of sessions) {
      for (const ex of (s.exercises || [])) {
        if (ex.sets?.some(set => set.done !== false)) ids.add(ex.exerciseId);
      }
    }
    return Array.from(ids);
  }, [sessions]);

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Verlauf</h1>
      <p className="text-neutral-500 font-mono text-xs mt-1">Alle getrackten Sessions</p>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        <StatCard label="Total" value={allTime} />
        <StatCard label="Kraft" value={byType.strength || 0} />
        <StatCard label="Skill" value={byType.skill || 0} />
        <StatCard label="Cardio" value={byType.cardio || 0} />
      </div>

      {/* View tabs */}
      <div className="mt-6 flex gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
        {[
          { k: 'list', l: 'Liste', i: BarChart3 },
          { k: 'calendar', l: 'Kalender', i: Calendar },
          { k: 'progress', l: 'Fortschritt', i: LineChartIcon }
        ].map(t => {
          const Icon = t.i;
          return (
            <button
              key={t.k}
              onClick={() => setView(t.k)}
              className={`flex-1 rounded-lg py-2 font-display uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-1 ${
                view === t.k ? 'bg-neutral-50 text-neutral-950' : 'text-neutral-400'
              }`}
            >
              <Icon size={12} /> {t.l}
            </button>
          );
        })}
      </div>

      {/* Content per view */}
      {view === 'list' && (
        <div className="mt-6 space-y-2">
          {sessions.length === 0 ? (
            <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-xl p-8 text-center">
              <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Noch keine Sessions</div>
            </div>
          ) : sessions.map(s => {
            const isOpen = expanded === s.id;
            const prCount = (s.exercises || []).reduce((a, ex) => a + ex.sets.filter(set => set.isPR).length, 0);
            return (
              <div key={s.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : s.id)}
                  className="w-full p-3 flex items-center gap-3 text-left"
                >
                  <TypeBadge type={s.type} />
                  <div className="flex-1">
                    <div className="font-display uppercase text-sm font-bold tracking-wide flex items-center gap-2">
                      {s.name}
                      {prCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 bg-yellow-500/20 text-yellow-400 rounded px-1.5 py-0.5 font-mono text-[9px]">
                          <Trophy size={9} fill="currentColor" /> {prCount}
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500 font-mono text-[10px] mt-0.5">
                      {fmtDate(s.date)} · {fmtDuration(s.durationSec)} · {s.exercises.length} Üb.
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-neutral-600 transition ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-neutral-800 p-3 space-y-2">
                    {/* Section grouping */}
                    {SECTIONS.map(sec => {
                      const items = (s.exercises || []).filter(ex => getSection(ex) === sec.key);
                      if (items.length === 0) return null;
                      return (
                        <div key={sec.key} className="space-y-1.5">
                          {sec.key !== 'main' && (
                            <div className={`font-display uppercase text-[9px] font-bold tracking-[0.2em] ${sec.color}`}>
                              {sec.label}
                            </div>
                          )}
                          {items.map((ex, i) => {
                            const def = data.exercises.find(e => e.id === ex.exerciseId);
                            return (
                              <div key={i}>
                                <div className="font-display uppercase text-xs font-bold tracking-wide text-neutral-300">{def?.name || '?'}</div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {ex.sets.map((set, si) => (
                                    <span key={si} className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                                      set.isPR ? 'bg-yellow-500/20 text-yellow-400' :
                                      set.isWarmup ? 'bg-amber-950/40 text-amber-400' :
                                      set.done === false ? 'bg-neutral-800 text-neutral-600 line-through' :
                                      'bg-neutral-800 text-neutral-300'
                                    }`}>
                                      {set.isPR && '🏆 '}{formatSet(def, set)}
                                    </span>
                                  ))}
                                </div>
                                {ex.sets.some(set => set.note) && (
                                  <div className="mt-1 space-y-0.5">
                                    {ex.sets.filter(set => set.note).map((set, si) => (
                                      <div key={si} className="font-mono text-[9px] text-amber-400/80 italic">
                                        "{set.note}"
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {s.notes && <div className="text-neutral-400 font-mono text-xs italic mt-2">"{s.notes}"</div>}
                    <button
                      onClick={() => deleteSession(s.id)}
                      className="mt-2 text-red-500 font-display uppercase text-[10px] tracking-widest flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Löschen
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {view === 'calendar' && <CalendarView data={data} sessions={sessions} onSelectSession={(id) => { setView('list'); setExpanded(id); }} />}

      {view === 'progress' && (
        <div className="mt-6">
          {loggedExerciseIds.length === 0 ? (
            <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-xl p-8 text-center">
              <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Noch keine Daten</div>
              <div className="text-neutral-600 font-mono text-[10px] mt-1">Log ein paar Sessions, dann wird's spannend</div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Übung wählen</div>
              {loggedExerciseIds.map(exId => {
                const def = data.exercises.find(e => e.id === exId);
                if (!def) return null;
                const history = getExerciseHistory(data, exId, 50);
                return (
                  <button
                    key={exId}
                    onClick={() => setChartExerciseId(exId)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center gap-3 hover:bg-neutral-800 text-left"
                  >
                    <TypeBadge type={def.type} />
                    <div className="flex-1">
                      <div className="font-display uppercase text-sm font-bold tracking-wide">{def.name}</div>
                      <div className="text-neutral-500 font-mono text-[10px]">{history.length} Sessions</div>
                    </div>
                    <LineChartIcon size={14} className="text-neutral-600" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal for exercise chart */}
      {chartExerciseId && (
        <ExerciseHistoryModal
          exerciseId={chartExerciseId}
          data={data}
          onClose={() => setChartExerciseId(null)}
        />
      )}
    </div>
  );
}

// =====================
// CALENDAR VIEW
// =====================
function CalendarView({ data, sessions, onSelectSession }) {
  const [monthOffset, setMonthOffset] = useState(0);

  const now = new Date();
  const viewMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  // Build calendar grid
  const firstDay = new Date(year, month, 1);
  const firstDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Sessions by day key
  const sessionsByDay = useMemo(() => {
    const map = {};
    for (const s of sessions) {
      const k = fmtDayKey(s.date);
      (map[k] = map[k] || []).push(s);
    }
    return map;
  }, [sessions]);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ d, key: fmtDayKey(date), isToday: fmtDayKey(date) === fmtDayKey(now) });
  }

  const monthName = viewMonth.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  return (
    <div className="mt-6">
      {/* Nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setMonthOffset(m => m - 1)} className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-400">
          <ChevronLeft size={16} />
        </button>
        <div className="font-display uppercase text-sm font-bold tracking-wide">{monthName}</div>
        <button onClick={() => setMonthOffset(m => m + 1)} disabled={monthOffset >= 0} className="bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-neutral-400 disabled:opacity-40">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['MO','DI','MI','DO','FR','SA','SO'].map(d => (
          <div key={d} className="font-display uppercase text-[9px] font-bold tracking-widest text-neutral-600 text-center">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const sessionsOnDay = sessionsByDay[c.key] || [];
          const hasSession = sessionsOnDay.length > 0;
          return (
            <button
              key={i}
              onClick={() => hasSession && onSelectSession(sessionsOnDay[0].id)}
              disabled={!hasSession}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-0.5 ${
                c.isToday ? 'bg-orange-500/20 border border-orange-500/60' :
                hasSession ? 'bg-neutral-800 border border-neutral-700 hover:border-orange-500' :
                'bg-neutral-900 border border-neutral-900'
              }`}
            >
              <div className={`font-mono text-xs ${c.isToday ? 'text-orange-400 font-bold' : hasSession ? 'text-neutral-200' : 'text-neutral-600'}`}>
                {c.d}
              </div>
              {hasSession && (
                <div className="flex gap-0.5 mt-0.5">
                  {sessionsOnDay.slice(0, 3).map((s, si) => {
                    const meta = TYPE_META[s.type] || TYPE_META.strength;
                    return <div key={si} className={`w-1 h-1 rounded-full ${meta.bg}`} />;
                  })}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {Object.entries(TYPE_META).map(([k, m]) => (
          <div key={k} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${m.bg}`} />
            <span className="font-display uppercase text-[9px] tracking-widest text-neutral-500">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatSet(def, set) {
  if (!def) return '—';
  if (def.kind === 'reps-weight') return `${set.actual?.reps ?? set.reps}×${set.actual?.weight ?? set.weight}kg`;
  if (def.kind === 'reps-only') return `${set.actual?.reps ?? set.reps}×`;
  if (def.kind === 'hold') return `${set.actual?.duration ?? set.duration}s`;
  if (def.kind === 'cardio') {
    const d = set.actual?.duration ?? set.duration;
    const dist = set.actual?.distance ?? set.distance;
    if (dist) return `${dist}km/${d}min`;
    return `${d}min`;
  }
  return `${set.actual?.duration ?? set.duration}min`;
}

// =====================
// MORE / SETTINGS
// =====================
function MoreScreen({ data, save }) {
  const [msg, setMsg] = useState('');
  const [nameDraft, setNameDraft] = useState(data.userName || '');
  const [tool, setTool] = useState(null); // 'bodyweight' | '1rm' | 'plates'

  const saveName = () => {
    save(d => ({ ...d, userName: nameDraft.trim() }));
    setMsg('Name gespeichert.');
    setTimeout(() => setMsg(''), 2000);
  };

  const loadExamples = () => {
    const seeds = createSeedWorkouts();
    save(d => ({ ...d, workouts: [...d.workouts, ...seeds] }));
    setMsg('Beispiel-Workouts geladen.');
    setTimeout(() => setMsg(''), 2000);
  };

  const exportData = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `basecamp-export-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg('Export gespeichert.');
    setTimeout(() => setMsg(''), 2000);
  };

  const resetAll = () => {
    if (!confirm('Alle Daten wirklich löschen? Das lässt sich nicht rückgängig machen.')) return;
    save(EMPTY_STATE);
    setMsg('Alle Daten gelöscht.');
    setTimeout(() => setMsg(''), 2000);
  };

  const latestBW = data.bodyWeights && data.bodyWeights.length > 0
    ? [...data.bodyWeights].sort((a,b) => new Date(b.date) - new Date(a.date))[0]
    : null;

  return (
    <div className="px-5 pt-12 pb-6">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Mehr</h1>
      <p className="text-neutral-500 font-mono text-xs mt-1">Daten, Tools & Einstellungen</p>

      {/* Name */}
      <div className="mt-8">
        <div className="font-display uppercase text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-2">Dein Name</div>
        <div className="flex gap-2">
          <input
            value={nameDraft}
            onChange={e => setNameDraft(e.target.value)}
            placeholder="Wie heißt du?"
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-50 placeholder-neutral-600 focus:border-orange-500 outline-none"
          />
          <button
            onClick={saveName}
            disabled={nameDraft.trim() === (data.userName || '')}
            className="bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-display uppercase text-xs font-bold tracking-widest px-4 rounded-xl"
          >
            Speichern
          </button>
        </div>
      </div>

      {/* Tools */}
      <div className="mt-8">
        <div className="font-display uppercase text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-2">Tools</div>
        <div className="space-y-2">
          <button onClick={() => setTool('bodyweight')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Scale size={18} className="text-sky-400" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Körpergewicht</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">
                {latestBW ? `Zuletzt ${latestBW.weight} kg · ${fmtDate(latestBW.date)}` : 'Noch kein Eintrag'}
              </div>
            </div>
            <ChevronRight size={14} className="text-neutral-600" />
          </button>

          <button onClick={() => setTool('1rm')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Calculator size={18} className="text-orange-500" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide">1RM-Rechner</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Maximum schätzen (Epley-Formel)</div>
            </div>
            <ChevronRight size={14} className="text-neutral-600" />
          </button>

          <button onClick={() => setTool('plates')} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Dumbbell size={18} className="text-yellow-400" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Plate-Calculator</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Was muss an die Stange?</div>
            </div>
            <ChevronRight size={14} className="text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Data */}
      <div className="mt-8">
        <div className="font-display uppercase text-[10px] font-bold tracking-[0.2em] text-neutral-500 mb-2">Daten</div>
        <div className="space-y-2">
          <button onClick={loadExamples} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Mountain size={18} className="text-orange-500" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Beispiel-Workouts laden</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">4 Vorlagen (Kraft, Skill, Cardio, Mobility)</div>
            </div>
          </button>

          <button onClick={exportData} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Download size={18} className="text-neutral-300" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Daten exportieren</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Als JSON sichern</div>
            </div>
          </button>

          <button onClick={resetAll} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-3 hover:bg-neutral-800">
            <Trash2 size={18} className="text-red-500" />
            <div className="flex-1 text-left">
              <div className="font-display uppercase text-sm font-bold tracking-wide text-red-500">Alles zurücksetzen</div>
              <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Löscht Pläne, Vorlagen & Verlauf</div>
            </div>
          </button>
        </div>
      </div>

      <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="font-display uppercase text-xs font-bold tracking-widest text-neutral-500 mb-2">Stats</div>
        <div className="font-mono text-xs text-neutral-400 space-y-1">
          <div>{data.workouts.length} Workout-Vorlagen</div>
          <div>{data.sessions.length} absolvierte Sessions</div>
          <div>{data.exercises.length} Übungen in der Bibliothek</div>
          <div>{(data.bodyWeights || []).length} Gewichts-Einträge</div>
        </div>
      </div>

      {msg && (
        <div className="fixed bottom-24 left-5 right-5 bg-neutral-50 text-neutral-950 font-display uppercase text-xs tracking-widest font-bold py-3 text-center rounded-xl">
          {msg}
        </div>
      )}

      <div className="mt-12 text-center">
        <div className="font-display uppercase text-xs tracking-widest text-neutral-700">Basecamp v1.0</div>
      </div>

      {tool === 'bodyweight' && <BodyWeightModal data={data} save={save} onClose={() => setTool(null)} />}
      {tool === '1rm' && <OneRMModal onClose={() => setTool(null)} />}
      {tool === 'plates' && <PlateCalcModal onClose={() => setTool(null)} />}
    </div>
  );
}

// =====================
// WORKOUT BUILDER
// =====================
function WorkoutBuilder({ data, save, workoutId, onClose }) {
  const existing = data.workouts.find(w => w.id === workoutId);
  const [name, setName] = useState(existing?.name || '');
  const [type, setType] = useState(existing?.type || 'strength');
  const [exercises, setExercises] = useState(
    (existing?.exercises || []).map(e => ({ ...e, section: e.section || 'main' }))
  );
  const [picking, setPicking] = useState(null); // section key when picking

  const addExercise = (ex) => {
    const newEx = {
      exerciseId: ex.id,
      section: picking,
      sets: defaultSets(ex.kind)
    };
    setExercises([...exercises, newEx]);
    setPicking(null);
  };

  const removeExercise = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const changeSection = (idx, newSection) => {
    const next = [...exercises];
    next[idx] = { ...next[idx], section: newSection };
    setExercises(next);
  };

  const updateSet = (exIdx, setIdx, patch) => {
    const next = [...exercises];
    next[exIdx].sets[setIdx] = { ...next[exIdx].sets[setIdx], ...patch };
    setExercises(next);
  };

  const addSet = (exIdx) => {
    const next = [...exercises];
    const last = next[exIdx].sets[next[exIdx].sets.length - 1];
    next[exIdx].sets.push({ ...last });
    setExercises(next);
  };

  const removeSet = (exIdx, setIdx) => {
    const next = [...exercises];
    next[exIdx].sets = next[exIdx].sets.filter((_, i) => i !== setIdx);
    if (next[exIdx].sets.length === 0) next.splice(exIdx, 1);
    setExercises(next);
  };

  const saveWorkout = () => {
    if (!name.trim()) return alert('Name fehlt');
    if (exercises.length === 0) return alert('Mindestens eine Übung');
    const w = { id: workoutId || uid(), name: name.trim(), type, exercises };
    save(d => ({
      ...d,
      workouts: workoutId ? d.workouts.map(x => x.id === workoutId ? w : x) : [...d.workouts, w]
    }));
    onClose();
  };

  const duplicateWorkout = () => {
    const copy = {
      id: uid(),
      name: name.trim() + ' (Kopie)',
      type,
      exercises: exercises.map(e => ({ ...e, sets: e.sets.map(s => ({ ...s })) }))
    };
    save(d => ({ ...d, workouts: [...d.workouts, copy] }));
    onClose();
  };

  const deleteWorkout = () => {
    if (!confirm('Vorlage löschen?')) return;
    save(d => ({
      ...d,
      workouts: d.workouts.filter(x => x.id !== workoutId),
      plan: Object.fromEntries(Object.entries(d.plan).map(([k,v]) => [k, v === workoutId ? null : v]))
    }));
    onClose();
  };

  // Find real index of exercise across all sections (for update helpers)
  const realIdx = (wex) => exercises.indexOf(wex);

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <button onClick={onClose} className="text-neutral-400"><X size={22} /></button>
        <div className="font-display uppercase text-xs tracking-widest font-bold">
          {workoutId ? 'Vorlage bearbeiten' : 'Neues Workout'}
        </div>
        <button onClick={saveWorkout} className="text-orange-500 font-display uppercase text-xs tracking-widest font-bold">Speichern</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollhide p-4 pb-32">
        {/* Name */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name (z.B. Push A)"
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 font-display uppercase text-xl font-bold tracking-wide text-neutral-50 placeholder-neutral-700 focus:border-orange-500 outline-none"
        />

        {/* Type */}
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {Object.entries(TYPE_META).map(([k, m]) => {
            const Icon = m.icon;
            const active = type === k;
            return (
              <button
                key={k}
                onClick={() => setType(k)}
                className={`rounded-lg p-2 flex flex-col items-center gap-1 transition ${active ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-900 border border-neutral-800 text-neutral-400'}`}
              >
                <Icon size={16} />
                <span className="font-display uppercase text-[9px] font-bold tracking-widest">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sections */}
        {SECTIONS.map(sec => {
          const sectionExercises = exercises.filter(e => getSection(e) === sec.key);
          return (
            <div key={sec.key} className="mt-6">
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${sec.border}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sec.bg.replace('/10', '')}`} />
                <span className={`font-display uppercase text-[11px] font-bold tracking-[0.2em] ${sec.color}`}>
                  {sec.label}
                </span>
                <span className="font-mono text-[10px] text-neutral-600">
                  {sectionExercises.length > 0 ? `${sectionExercises.length} Üb.` : 'optional'}
                </span>
              </div>

              <div className="space-y-2">
                {sectionExercises.map(ex => {
                  const i = realIdx(ex);
                  const def = data.exercises.find(e => e.id === ex.exerciseId);
                  if (!def) return null;
                  return (
                    <div key={i} className={`bg-neutral-900 border ${sec.border} rounded-xl p-3`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 font-display uppercase text-sm font-bold tracking-wide">{def.name}</div>
                        {/* Section move */}
                        <div className="flex gap-0.5">
                          {SECTIONS.filter(s => s.key !== sec.key).map(s => (
                            <button
                              key={s.key}
                              onClick={() => changeSection(i, s.key)}
                              title={`Nach ${s.label}`}
                              className={`text-[8px] font-display uppercase tracking-wider px-1.5 py-0.5 rounded ${s.color} bg-neutral-800 hover:bg-neutral-700`}
                            >
                              → {s.short}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => removeExercise(i)} className="text-neutral-600"><Trash2 size={14} /></button>
                      </div>
                      <div className="space-y-1.5">
                        {ex.sets.map((set, si) => (
                          <SetEditor
                            key={si}
                            def={def}
                            set={set}
                            idx={si}
                            onChange={patch => updateSet(i, si, patch)}
                            onRemove={() => removeSet(i, si)}
                          />
                        ))}
                        <button
                          onClick={() => addSet(i)}
                          className="w-full mt-1 py-2 border border-dashed border-neutral-800 rounded-lg font-display uppercase text-[10px] tracking-widest text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 flex items-center justify-center gap-1"
                        >
                          <Plus size={12} /> Satz
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={() => setPicking(sec.key)}
                  className={`w-full p-3 bg-neutral-900 border border-dashed ${sec.border} rounded-xl font-display uppercase text-[11px] font-bold tracking-widest ${sec.color} hover:bg-neutral-800 flex items-center justify-center gap-2`}
                >
                  <Plus size={14} /> Übung in {sec.label}
                </button>
              </div>
            </div>
          );
        })}

        {workoutId && (
          <div className="mt-6 space-y-2">
            <button
              onClick={duplicateWorkout}
              className="w-full py-3 bg-neutral-900 border border-neutral-800 rounded-xl font-display uppercase text-xs tracking-widest text-neutral-300 flex items-center justify-center gap-2"
            >
              <Copy size={14} /> Als Kopie speichern
            </button>
            <button
              onClick={deleteWorkout}
              className="w-full py-3 font-display uppercase text-xs tracking-widest text-red-500 flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Vorlage löschen
            </button>
          </div>
        )}
      </div>

      {picking && (
        <ExercisePicker
          data={data}
          save={save}
          onPick={addExercise}
          onClose={() => setPicking(null)}
        />
      )}
    </Modal>
  );
}

function defaultSets(kind) {
  if (kind === 'reps-weight') return [{ reps: 8, weight: 60 }, { reps: 8, weight: 60 }, { reps: 8, weight: 60 }];
  if (kind === 'reps-only') return [{ reps: 10 }, { reps: 10 }, { reps: 10 }];
  if (kind === 'hold') return [{ duration: 20 }, { duration: 20 }, { duration: 20 }];
  if (kind === 'cardio') return [{ duration: 30, distance: 5 }];
  return [{ duration: 10 }];
}

function SetEditor({ def, set, idx, onChange, onRemove }) {
  const inputCls = "bg-neutral-800 border border-neutral-700 rounded text-center font-mono text-sm py-1.5 w-16 focus:border-orange-500 outline-none";
  return (
    <div className="flex items-center gap-2">
      <div className="font-mono text-xs text-neutral-500 w-6">{idx + 1}.</div>
      {def.kind === 'reps-weight' && (
        <>
          <input type="number" value={set.reps} onChange={e => onChange({ reps: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">WDH</span>
          <input type="number" value={set.weight} onChange={e => onChange({ weight: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">KG</span>
        </>
      )}
      {def.kind === 'reps-only' && (
        <>
          <input type="number" value={set.reps} onChange={e => onChange({ reps: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">WDH</span>
        </>
      )}
      {def.kind === 'hold' && (
        <>
          <input type="number" value={set.duration} onChange={e => onChange({ duration: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">SEK</span>
        </>
      )}
      {def.kind === 'cardio' && (
        <>
          <input type="number" value={set.duration} onChange={e => onChange({ duration: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">MIN</span>
          <input type="number" value={set.distance || 0} onChange={e => onChange({ distance: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">KM</span>
        </>
      )}
      {def.kind === 'mobility' && (
        <>
          <input type="number" value={set.duration} onChange={e => onChange({ duration: +e.target.value })} className={inputCls} />
          <span className="text-neutral-600 font-mono text-xs">MIN</span>
        </>
      )}
      <div className="flex-1" />
      <button onClick={onRemove} className="text-neutral-600 p-1"><X size={14} /></button>
    </div>
  );
}

// =====================
// EXERCISE PICKER
// =====================
function ExercisePicker({ data, save, onPick, onClose }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = data.exercises.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <button onClick={onClose} className="text-neutral-400"><X size={22} /></button>
        <div className="font-display uppercase text-xs tracking-widest font-bold">Übung wählen</div>
        <button onClick={() => setShowAdd(true)} className="text-orange-500 font-display uppercase text-xs tracking-widest font-bold flex items-center gap-1">
          <Plus size={14} strokeWidth={3} /> Neu
        </button>
      </div>

      <div className="p-4 border-b border-neutral-800 space-y-2">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Suchen..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-50 placeholder-neutral-600 focus:border-orange-500 outline-none"
        />
        <div className="flex gap-1.5 overflow-x-auto scrollhide">
          {['all', ...Object.keys(TYPE_META)].map(k => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1 rounded-full font-display uppercase text-[10px] font-bold tracking-widest whitespace-nowrap ${filter === k ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-900 border border-neutral-800 text-neutral-400'}`}
            >
              {k === 'all' ? 'Alle' : TYPE_META[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollhide">
        {filtered.map(ex => (
          <button
            key={ex.id}
            onClick={() => onPick(ex)}
            className="w-full p-3 border-b border-neutral-900 flex items-center gap-3 hover:bg-neutral-900 text-left"
          >
            <TypeBadge type={ex.type} />
            <div className="flex-1 font-display uppercase text-sm font-semibold tracking-wide">{ex.name}</div>
            <div className="font-mono text-[9px] text-neutral-600 uppercase">{ex.kind.replace('-', ' ')}</div>
          </button>
        ))}
      </div>

      {showAdd && <CustomExerciseDialog save={save} onClose={() => setShowAdd(false)} onCreated={(ex) => { setShowAdd(false); onPick(ex); }} />}
    </Modal>
  );
}

function CustomExerciseDialog({ save, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('strength');
  const [kind, setKind] = useState('reps-weight');

  const create = () => {
    if (!name.trim()) return;
    const ex = { id: 'ex-' + uid(), name: name.trim(), type, kind };
    save(d => ({ ...d, exercises: [...d.exercises, ex] }));
    onCreated(ex);
  };

  return (
    <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
        <div className="font-display uppercase text-base font-bold tracking-widest mb-4">Neue Übung</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 mb-3 text-neutral-50 focus:border-orange-500 outline-none" />
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {Object.entries(TYPE_META).map(([k, m]) => (
            <button key={k} onClick={() => setType(k)} className={`rounded-lg py-2 font-display uppercase text-[9px] font-bold tracking-widest ${type === k ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>{m.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {[
            ['reps-weight', 'Wdh + Gew'],
            ['reps-only', 'Nur Wdh'],
            ['hold', 'Hold (Sek)'],
            ['cardio', 'Cardio'],
            ['mobility', 'Mobility']
          ].map(([k, l]) => (
            <button key={k} onClick={() => setKind(k)} className={`rounded-lg py-2 font-display uppercase text-[9px] font-bold tracking-widest ${kind === k ? 'bg-neutral-50 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>{l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 font-display uppercase text-xs font-bold tracking-widest text-neutral-400 bg-neutral-800 rounded-lg">Abbrechen</button>
          <button onClick={create} className="flex-1 py-2.5 font-display uppercase text-xs font-bold tracking-widest text-neutral-950 bg-orange-500 rounded-lg">Erstellen</button>
        </div>
      </div>
    </div>
  );
}

// =====================
// ASSIGN DAY
// =====================
function AssignDayModal({ data, save, day, onClose }) {
  const assign = (workoutId) => {
    save(d => ({ ...d, plan: { ...d.plan, [day]: workoutId } }));
    onClose();
  };
  const dayLabel = DAYS.find(d => d.key === day)?.full || day;
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <button onClick={onClose} className="text-neutral-400"><X size={22} /></button>
        <div className="font-display uppercase text-xs tracking-widest font-bold">{dayLabel}</div>
        <div className="w-6" />
      </div>
      <div className="flex-1 overflow-y-auto scrollhide">
        <button onClick={() => assign(null)} className="w-full p-4 border-b border-neutral-900 text-left font-display uppercase text-sm tracking-wide text-neutral-500">— Leer / Rest-Day —</button>
        {data.workouts.map(w => (
          <button key={w.id} onClick={() => assign(w.id)} className="w-full p-4 border-b border-neutral-900 flex items-center gap-3 hover:bg-neutral-900 text-left">
            <TypeBadge type={w.type} />
            <div className="flex-1">
              <div className="font-display uppercase text-sm font-bold tracking-wide">{w.name}</div>
              <div className="text-neutral-500 font-mono text-[10px]">{w.exercises.length} Übungen</div>
            </div>
          </button>
        ))}
        {data.workouts.length === 0 && (
          <div className="p-8 text-center text-neutral-500 font-mono text-xs">Erstelle erst ein Workout unter „Pläne".</div>
        )}
      </div>
    </Modal>
  );
}

// =====================
// SESSION PLAYER (LIVE)
// =====================
function SessionPlayer({ session, data, save, onClose, onUpdate }) {
  const [restTimer, setRestTimer] = useState(null); // seconds remaining
  const [restDuration, setRestDuration] = useState(90);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [historyFor, setHistoryFor] = useState(null); // exerciseId to show history for
  const [pickingMid, setPickingMid] = useState(null); // section key when adding

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startedAt]);

  // Rest timer - with beep at end
  useEffect(() => {
    if (restTimer === null) return;
    if (restTimer <= 0) {
      if (soundOn) playBeep(300, 880);
      setRestTimer(null);
      return;
    }
    // Countdown beep at 3,2,1
    if (soundOn && restTimer <= 3 && restTimer > 0) {
      playBeep(100, 660);
    }
    const t = setTimeout(() => setRestTimer(restTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [restTimer, soundOn]);

  const markSetDone = (exIdx, setIdx, actual) => {
    const ex = session.exercises[exIdx];
    const def = data.exercises.find(e => e.id === ex.exerciseId);
    // PR check excludes current session
    const isPR = def && !ex.sets[setIdx].isWarmup
      ? checkIsPR(data, ex.exerciseId, def.kind, actual, session.id)
      : false;
    const next = {
      ...session,
      exercises: session.exercises.map((ex, i) =>
        i !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, done: true, actual, isPR })
        }
      )
    };
    onUpdate(next);
    // Don't auto-start rest timer for cooldown or mobility
    const sectionIsActive = getSection(ex) === 'main' || getSection(ex) === 'warmup';
    if (sectionIsActive && def?.kind !== 'cardio' && def?.kind !== 'mobility') {
      setRestTimer(restDuration);
    }
  };

  const updateSetNote = (exIdx, setIdx, note) => {
    const next = {
      ...session,
      exercises: session.exercises.map((ex, i) =>
        i !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, note })
        }
      )
    };
    onUpdate(next);
  };

  const toggleWarmup = (exIdx, setIdx) => {
    const next = {
      ...session,
      exercises: session.exercises.map((ex, i) =>
        i !== exIdx ? ex : {
          ...ex,
          sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, isWarmup: !s.isWarmup })
        }
      )
    };
    onUpdate(next);
  };

  const addExerciseMid = (ex, section) => {
    const newEx = {
      exerciseId: ex.id,
      section: section || 'main',
      sets: defaultSets(ex.kind).map(s => ({ ...s, done: false, actual: null }))
    };
    onUpdate({ ...session, exercises: [...session.exercises, newEx] });
  };

  const finishSession = () => {
    const toSave = {
      ...session,
      durationSec: elapsed,
      notes: notes.trim() || undefined,
      live: false,
      finishedAt: Date.now()
    };
    save(d => ({ ...d, sessions: [...d.sessions, toSave] }));
    onClose();
  };

  const cancelSession = () => {
    if (!confirm('Session verwerfen? Fortschritt geht verloren.')) return;
    onClose();
  };

  const totalSets = session.exercises.reduce((a, ex) => a + ex.sets.length, 0);
  const doneSets = session.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0);
  const prCount = session.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.isPR).length, 0);

  // Group exercises by section
  const groups = groupBySections(session.exercises);

  const renderExercise = (ex) => {
    const i = session.exercises.indexOf(ex);
    const def = data.exercises.find(e => e.id === ex.exerciseId);
    if (!def) return null;
    return (
      <div key={i} className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TypeBadge type={def.type} />
          <button
            onClick={() => setHistoryFor(def.id)}
            className="flex-1 text-left font-display uppercase text-base font-bold tracking-wide flex items-center gap-1.5 hover:text-orange-400"
          >
            {def.name}
            <History size={12} className="text-neutral-500" />
          </button>
        </div>
        <div className="space-y-1.5">
          {ex.sets.map((set, si) => (
            <LiveSetRow
              key={si}
              def={def}
              set={set}
              idx={si}
              onDone={(actual) => markSetDone(i, si, actual)}
              onNote={(note) => updateSetNote(i, si, note)}
              onToggleWarmup={() => toggleWarmup(i, si)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 z-40 flex flex-col">
      {/* Header */}
      <div className="border-b border-neutral-800 p-4 flex items-center gap-3">
        <button onClick={cancelSession} className="text-neutral-500"><X size={22} /></button>
        <div className="flex-1">
          <div className="font-display uppercase text-sm font-bold tracking-wide truncate">{session.name}</div>
          <div className="font-mono text-[10px] text-neutral-500 flex items-center gap-2">
            <span>{fmtDuration(elapsed)} · {doneSets}/{totalSets}</span>
            {prCount > 0 && (
              <span className="flex items-center gap-0.5 text-yellow-400">
                <Trophy size={10} fill="currentColor" /> {prCount}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setSoundOn(!soundOn)}
          className="text-neutral-500 p-1"
          title={soundOn ? 'Ton aus' : 'Ton an'}
        >
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button onClick={finishSession} className="bg-green-600 hover:bg-green-700 text-neutral-50 font-display uppercase text-xs font-bold tracking-widest px-3 py-2 rounded-lg">
          Fertig
        </button>
      </div>

      {/* Rest timer overlay */}
      {restTimer !== null && (
        <div className="border-b border-neutral-800 bg-orange-500 text-neutral-950 p-3 flex items-center gap-3">
          <Timer size={20} />
          <div className="flex-1">
            <div className="font-display uppercase text-[10px] font-bold tracking-widest">Pause</div>
            <div className="font-mono text-2xl font-bold leading-none">{fmtDuration(restTimer)}</div>
          </div>
          <button onClick={() => setRestTimer(r => Math.max(0, r - 15))} className="bg-neutral-950/20 rounded-lg px-2 py-1 font-mono text-xs font-bold">-15s</button>
          <button onClick={() => setRestTimer(r => r + 15)} className="bg-neutral-950/20 rounded-lg px-2 py-1 font-mono text-xs font-bold">+15s</button>
          <button onClick={() => setRestTimer(null)} className="font-display uppercase text-[10px] font-bold tracking-widest">Skip</button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollhide p-4 pb-32">
        {session.exercises.length === 0 && (
          <div className="bg-neutral-900 border border-dashed border-neutral-800 rounded-xl p-6 text-center">
            <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Freestyle-Session</div>
            <div className="text-neutral-600 font-mono text-[10px] mt-1">Füg unten Übungen hinzu</div>
          </div>
        )}

        {/* Section-grouped rendering */}
        {SECTIONS.map(sec => {
          const items = groups[sec.key];
          if (items.length === 0 && sec.key === 'main' && session.exercises.length > 0) return null;
          if (items.length === 0) return null;
          return (
            <div key={sec.key} className="mb-2">
              <div className={`flex items-center gap-2 mb-3 pb-1.5 border-b ${sec.border}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${sec.bg.replace('/10','')}`} />
                <span className={`font-display uppercase text-[10px] font-bold tracking-[0.2em] ${sec.color}`}>
                  {sec.label}
                </span>
                <span className="font-mono text-[9px] text-neutral-600">
                  {items.reduce((a, ex) => a + ex.sets.filter(s => s.done).length, 0)}/
                  {items.reduce((a, ex) => a + ex.sets.length, 0)}
                </span>
              </div>
              {items.map(renderExercise)}
              {/* Add button per section */}
              <button
                onClick={() => setPickingMid(sec.key)}
                className={`w-full p-2 mb-2 border border-dashed ${sec.border} rounded-lg font-display uppercase text-[10px] tracking-widest ${sec.color} flex items-center justify-center gap-1`}
              >
                <Plus size={12} /> Übung in {sec.label}
              </button>
            </div>
          );
        })}

        {/* If no exercises at all, allow adding to main */}
        {session.exercises.length === 0 && (
          <button
            onClick={() => setPickingMid('main')}
            className="w-full p-3 bg-neutral-900 border border-dashed border-neutral-800 rounded-xl font-display uppercase text-xs font-bold tracking-widest text-neutral-400 flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Übung hinzufügen
          </button>
        )}

        {/* Notes */}
        <div className="mt-6">
          <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Session-Notiz</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Wie lief's? RPE, Auffälligkeiten..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-50 placeholder-neutral-600 focus:border-orange-500 outline-none resize-none"
            rows={3}
          />
        </div>

        {/* Rest duration */}
        <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
          <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Standard-Pause</div>
          <div className="flex gap-1.5">
            {[60, 90, 120, 180, 300].map(s => (
              <button key={s} onClick={() => setRestDuration(s)} className={`flex-1 rounded py-1.5 font-mono text-xs font-bold ${restDuration === s ? 'bg-orange-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}>
                {s < 60 ? s+'s' : Math.floor(s/60)+'m'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {pickingMid && (
        <ExercisePicker
          data={data}
          save={save}
          onPick={(ex) => { addExerciseMid(ex, pickingMid); setPickingMid(null); }}
          onClose={() => setPickingMid(null)}
        />
      )}

      {historyFor && (
        <ExerciseHistoryModal
          exerciseId={historyFor}
          data={data}
          onClose={() => setHistoryFor(null)}
        />
      )}
    </div>
  );
}

function LiveSetRow({ def, set, idx, onDone, onNote, onToggleWarmup }) {
  const [reps, setReps] = useState(set.reps ?? '');
  const [weight, setWeight] = useState(set.weight ?? '');
  const [duration, setDuration] = useState(set.duration ?? '');
  const [distance, setDistance] = useState(set.distance ?? '');
  const [showNote, setShowNote] = useState(!!set.note);
  const [noteDraft, setNoteDraft] = useState(set.note || '');

  const done = set.done;
  const isPR = set.isPR;
  const isWarmup = set.isWarmup;
  const inputCls = `bg-neutral-800 border border-neutral-700 rounded text-center font-mono text-sm py-2 w-16 focus:border-orange-500 outline-none ${done ? 'opacity-50' : ''}`;

  const handleDone = () => {
    if (done) return;
    let actual = {};
    if (def.kind === 'reps-weight') actual = { reps: +reps, weight: +weight };
    else if (def.kind === 'reps-only') actual = { reps: +reps };
    else if (def.kind === 'hold') actual = { duration: +duration };
    else if (def.kind === 'cardio') actual = { duration: +duration, distance: +distance };
    else actual = { duration: +duration };
    onDone(actual);
  };

  const saveNote = () => {
    onNote && onNote(noteDraft.trim());
  };

  const borderCls = isPR
    ? 'bg-yellow-950/40 border border-yellow-600/60'
    : done
      ? 'bg-green-950/30 border border-green-900'
      : isWarmup
        ? 'bg-amber-950/20 border border-amber-900/40'
        : 'bg-neutral-900 border border-neutral-800';

  return (
    <div className={`rounded-lg ${borderCls}`}>
      <div className="flex items-center gap-2 p-2">
        {/* Warmup toggle on number */}
        <button
          onClick={() => !done && onToggleWarmup && onToggleWarmup()}
          disabled={done}
          className={`font-mono text-xs w-6 text-center rounded ${isWarmup ? 'text-amber-400' : done ? 'text-green-500' : 'text-neutral-500'}`}
          title={isWarmup ? 'Warm-up Satz' : 'Arbeitssatz — tippen für Warm-up'}
        >
          {isWarmup ? 'W' : idx + 1 + '.'}
        </button>
        {def.kind === 'reps-weight' && (
          <>
            <input type="number" value={reps} onChange={e => setReps(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">W</span>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">KG</span>
          </>
        )}
        {def.kind === 'reps-only' && (
          <>
            <input type="number" value={reps} onChange={e => setReps(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">WDH</span>
          </>
        )}
        {def.kind === 'hold' && (
          <>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">SEK</span>
          </>
        )}
        {def.kind === 'cardio' && (
          <>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">MIN</span>
            <input type="number" value={distance} onChange={e => setDistance(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">KM</span>
          </>
        )}
        {def.kind === 'mobility' && (
          <>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} disabled={done} className={inputCls} />
            <span className="text-neutral-600 font-mono text-[10px]">MIN</span>
          </>
        )}
        <div className="flex-1" />

        {/* PR badge */}
        {isPR && (
          <div className="flex items-center gap-0.5 bg-yellow-500 text-neutral-950 rounded px-1.5 py-1 font-display uppercase text-[9px] font-bold tracking-wider">
            <Trophy size={10} fill="currentColor" /> PR
          </div>
        )}

        {/* Note button */}
        <button
          onClick={() => setShowNote(!showNote)}
          className={`rounded-lg p-2 ${set.note ? 'text-amber-400 bg-neutral-800' : 'text-neutral-500 hover:bg-neutral-800'}`}
        >
          <StickyNote size={14} />
        </button>

        {/* Done button */}
        <button
          onClick={handleDone}
          disabled={done}
          className={`rounded-lg p-2 ${done ? 'bg-green-600 text-neutral-950' : 'bg-orange-500 text-neutral-950 hover:bg-orange-600'}`}
        >
          <Check size={16} strokeWidth={3} />
        </button>
      </div>

      {/* Note editor */}
      {showNote && (
        <div className="px-2 pb-2 pt-0 flex gap-1.5">
          <input
            value={noteDraft}
            onChange={e => setNoteDraft(e.target.value)}
            onBlur={saveNote}
            placeholder="Notiz zum Satz (z.B. 'Schulter leicht')"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 placeholder-neutral-600 focus:border-amber-500 outline-none"
          />
        </div>
      )}
    </div>
  );
}

// =====================
// EXERCISE HISTORY MODAL
// =====================
function ExerciseHistoryModal({ exerciseId, data, onClose }) {
  const def = data.exercises.find(e => e.id === exerciseId);
  const history = getExerciseHistory(data, exerciseId, 20);

  // Find best set (for PR display)
  let best = null;
  if (def && history.length > 0) {
    for (const entry of history) {
      for (const s of entry.sets) {
        if (!best) { best = s; continue; }
        if (def.kind === 'reps-weight' && (s.weight || 0) > (best.weight || 0)) best = s;
        else if (def.kind === 'reps-only' && (s.reps || 0) > (best.reps || 0)) best = s;
        else if (def.kind === 'hold' && (s.duration || 0) > (best.duration || 0)) best = s;
        else if (def.kind === 'cardio' && (s.distance || 0) > (best.distance || 0)) best = s;
      }
    }
  }

  // Simple chart data for reps-weight exercises
  const chartData = def && def.kind === 'reps-weight'
    ? history.slice().reverse().map((e, i) => ({
        x: i,
        y: Math.max(...e.sets.map(s => s.weight || 0))
      }))
    : null;

  // Render simple SVG chart
  const chartWidth = 280;
  const chartHeight = 80;
  const renderChart = () => {
    if (!chartData || chartData.length < 2) return null;
    const maxY = Math.max(...chartData.map(p => p.y));
    const minY = Math.min(...chartData.map(p => p.y));
    const padY = (maxY - minY) * 0.1 || 1;
    const rangeY = (maxY - minY) + 2 * padY;
    const scaleX = (i) => (i / (chartData.length - 1)) * (chartWidth - 20) + 10;
    const scaleY = (v) => chartHeight - 10 - ((v - minY + padY) / rangeY) * (chartHeight - 20);
    const path = chartData.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.y)}`
    ).join(' ');
    return (
      <svg width={chartWidth} height={chartHeight} className="w-full">
        <path d={path} stroke="#f97316" strokeWidth="2" fill="none" />
        {chartData.map((p, i) => (
          <circle key={i} cx={scaleX(i)} cy={scaleY(p.y)} r="3" fill="#f97316" />
        ))}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 pb-3 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            {def && <TypeBadge type={def.type} />}
            <button onClick={onClose} className="text-neutral-500 p-1"><X size={20} /></button>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight leading-tight">{def?.name || 'Übung'}</h2>
          <div className="text-neutral-500 font-mono text-xs mt-1">
            {history.length} {history.length === 1 ? 'Session' : 'Sessions'} im Verlauf
          </div>
        </div>

        {/* Best + chart */}
        {best && (
          <div className="px-5 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-yellow-500" fill="currentColor" />
              <span className="font-display uppercase text-[10px] font-bold tracking-widest text-yellow-400">Bestwert</span>
            </div>
            <div className="font-mono text-xl font-bold">{formatSet(def, best)}</div>
            {chartData && chartData.length >= 2 && (
              <div className="mt-3">
                <div className="font-display uppercase text-[9px] font-bold tracking-widest text-neutral-500 mb-1">Max-Gewicht pro Session</div>
                {renderChart()}
              </div>
            )}
          </div>
        )}

        {/* History list */}
        <div className="flex-1 overflow-y-auto scrollhide">
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Noch keine Historie</div>
              <div className="text-neutral-600 font-mono text-[10px] mt-1">Diese Übung wurde noch nie geloggt</div>
            </div>
          ) : (
            history.map((entry, i) => (
              <div key={i} className="p-4 border-b border-neutral-800">
                <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">{fmtDate(entry.date)}</div>
                <div className="flex flex-wrap gap-1">
                  {entry.sets.map((s, si) => (
                    <span key={si} className="bg-neutral-800 text-neutral-300 rounded px-2 py-0.5 font-mono text-xs">
                      {formatSet(def, s)}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// =====================
// QUICK LOGGER (form-based)
// =====================
function QuickLogger({ data, save, workoutId, onClose }) {
  const [selectedId, setSelectedId] = useState(workoutId || null);
  const workout = data.workouts.find(w => w.id === selectedId);
  const [exercises, setExercises] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (workout) {
      setExercises(workout.exercises.map(wex => ({
        ...wex,
        sets: wex.sets.map(s => ({ ...s, done: true, actual: { ...s } }))
      })));
    } else {
      setExercises([]);
    }
  }, [selectedId]);

  const saveLog = () => {
    if (exercises.length === 0) return alert('Keine Übungen');
    const session = {
      id: uid(),
      date: new Date(date).toISOString(),
      workoutId: selectedId,
      name: workout?.name || 'Freestyle',
      type: workout?.type || 'strength',
      exercises,
      durationSec: duration * 60,
      notes: notes.trim() || undefined,
      live: false,
      finishedAt: Date.now()
    };
    save(d => ({ ...d, sessions: [...d.sessions, session] }));
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <button onClick={onClose} className="text-neutral-400"><X size={22} /></button>
        <div className="font-display uppercase text-xs tracking-widest font-bold">Schnell loggen</div>
        <button onClick={saveLog} className="text-orange-500 font-display uppercase text-xs tracking-widest font-bold">Speichern</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollhide p-4 pb-32">
        <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Vorlage</div>
        <select
          value={selectedId || ''}
          onChange={e => setSelectedId(e.target.value || null)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-3 text-neutral-50 focus:border-orange-500 outline-none"
        >
          <option value="">— Freestyle —</option>
          {data.workouts.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <div>
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Wann</div>
            <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-neutral-50 text-sm focus:border-orange-500 outline-none" />
          </div>
          <div>
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Dauer (min)</div>
            <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-neutral-50 focus:border-orange-500 outline-none" />
          </div>
        </div>

        {workout && exercises.length > 0 && (
          <div className="mt-6">
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Sätze anpassen (falls nötig)</div>
            <div className="space-y-3">
              {exercises.map((ex, i) => {
                const def = data.exercises.find(e => e.id === ex.exerciseId);
                if (!def) return null;
                return (
                  <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-3">
                    <div className="font-display uppercase text-sm font-bold tracking-wide mb-2">{def.name}</div>
                    <div className="space-y-1.5">
                      {ex.sets.map((set, si) => (
                        <QuickSetEditor
                          key={si}
                          def={def}
                          set={set}
                          idx={si}
                          onChange={(patch) => {
                            const next = [...exercises];
                            next[i].sets[si] = { ...next[i].sets[si], actual: { ...next[i].sets[si].actual, ...patch } };
                            setExercises(next);
                          }}
                          onSkip={() => {
                            const next = [...exercises];
                            next[i].sets[si] = { ...next[i].sets[si], done: !next[i].sets[si].done };
                            setExercises(next);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Notiz</div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-sm text-neutral-50 placeholder-neutral-600 focus:border-orange-500 outline-none resize-none" placeholder="Optional..." />
        </div>
      </div>
    </Modal>
  );
}

function QuickSetEditor({ def, set, idx, onChange, onSkip }) {
  const done = set.done;
  const actual = set.actual || {};
  const cls = `bg-neutral-800 border border-neutral-700 rounded text-center font-mono text-sm py-1.5 w-14 focus:border-orange-500 outline-none ${!done ? 'opacity-40' : ''}`;
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={onSkip} className={`rounded p-1 ${done ? 'text-green-500' : 'text-neutral-600'}`}>
        {done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>
      <div className="font-mono text-xs text-neutral-500 w-5">{idx + 1}</div>
      {def.kind === 'reps-weight' && (
        <>
          <input type="number" value={actual.reps ?? set.reps} onChange={e => onChange({ reps: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">×</span>
          <input type="number" value={actual.weight ?? set.weight} onChange={e => onChange({ weight: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">KG</span>
        </>
      )}
      {def.kind === 'reps-only' && (
        <>
          <input type="number" value={actual.reps ?? set.reps} onChange={e => onChange({ reps: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">WDH</span>
        </>
      )}
      {def.kind === 'hold' && (
        <>
          <input type="number" value={actual.duration ?? set.duration} onChange={e => onChange({ duration: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">SEK</span>
        </>
      )}
      {def.kind === 'cardio' && (
        <>
          <input type="number" value={actual.duration ?? set.duration} onChange={e => onChange({ duration: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">MIN</span>
          <input type="number" value={actual.distance ?? set.distance ?? 0} onChange={e => onChange({ distance: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">KM</span>
        </>
      )}
      {def.kind === 'mobility' && (
        <>
          <input type="number" value={actual.duration ?? set.duration} onChange={e => onChange({ duration: +e.target.value })} disabled={!done} className={cls} />
          <span className="text-neutral-600 font-mono text-[10px]">MIN</span>
        </>
      )}
    </div>
  );
}

// =====================
// SESSION START MODAL (Letzter Stand / Leer / Overload)
// =====================
function findLastSession(data, workoutId) {
  // Find most recent completed session for this workout
  return [...data.sessions]
    .filter(s => s.workoutId === workoutId && !s.live)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
}

function applyOverload(set, kind) {
  const s = { ...set };
  if (kind === 'reps-weight' || kind === 'reps_weight') {
    // +2.5kg, gleiche Wdh
    s.weight = (s.weight || 0) + 2.5;
  } else if (kind === 'reps-only' || kind === 'reps_only') {
    // +1 Wdh
    s.reps = (s.reps || 0) + 1;
  } else if (kind === 'hold') {
    // +5 Sekunden
    s.duration = (s.duration || 0) + 5;
  } else if (kind === 'cardio') {
    // +0.5 km oder -1 min (wir nehmen +0.5 km)
    s.distance = (s.distance || 0) + 0.5;
  } else if (kind === 'mobility') {
    // +1 min
    s.duration = (s.duration || 0) + 1;
  }
  return s;
}

function buildSessionFromMode(workout, data, mode) {
  const lastSession = findLastSession(data, workout.id);

  let exercises;

  if (mode === 'last' && lastSession) {
    // Use actual values from last session
    exercises = workout.exercises.map(wex => {
      // Find matching exercise in last session
      const lastEx = lastSession.exercises.find(e => e.exerciseId === wex.exerciseId);
      if (lastEx && lastEx.sets) {
        return {
          ...wex,
          sets: lastEx.sets.map(s => {
            const vals = s.actual || s;
            return { ...vals, done: false, actual: null };
          })
        };
      }
      // Fallback to template
      return { ...wex, sets: wex.sets.map(s => ({ ...s, done: false, actual: null })) };
    });
  } else if (mode === 'overload' && lastSession) {
    // Use actual from last session + overload
    exercises = workout.exercises.map(wex => {
      const def = data.exercises.find(e => e.id === wex.exerciseId);
      const lastEx = lastSession.exercises.find(e => e.exerciseId === wex.exerciseId);
      if (lastEx && lastEx.sets) {
        return {
          ...wex,
          sets: lastEx.sets.map(s => {
            const vals = s.actual || s;
            const overloaded = applyOverload(vals, def?.kind || 'reps-weight');
            return { ...overloaded, done: false, actual: null };
          })
        };
      }
      return { ...wex, sets: wex.sets.map(s => ({ ...s, done: false, actual: null })) };
    });
  } else {
    // Empty / template defaults
    exercises = workout.exercises.map(wex => ({
      ...wex,
      sets: wex.sets.map(s => ({ ...s, done: false, actual: null }))
    }));
  }

  return {
    id: uid(),
    date: new Date().toISOString(),
    workoutId: workout.id,
    name: workout.name,
    type: workout.type,
    exercises,
    startedAt: Date.now(),
    durationSec: 0,
    live: true
  };
}

function SessionStartModal({ workout, data, onStart, onClose }) {
  const lastSession = findLastSession(data, workout.id);
  const hasHistory = !!lastSession;

  const handleSelect = (mode) => {
    const session = buildSessionFromMode(workout, data, mode);
    onStart(session);
  };

  // Preview: show what the last session looked like
  const lastDate = lastSession ? fmtDate(lastSession.date) : null;

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            <TypeBadge type={workout.type} />
            <button onClick={onClose} className="text-neutral-500 p-1"><X size={20} /></button>
          </div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight leading-tight">{workout.name}</h2>
          <div className="text-neutral-500 font-mono text-xs mt-1">
            {workout.exercises.length} Übungen · {estimateDuration(workout)} min
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 mx-5" />

        {/* Mode label */}
        <div className="px-5 pt-4 pb-2">
          <div className="font-display text-[10px] uppercase tracking-[0.2em] text-neutral-500">Wie willst du starten?</div>
        </div>

        {/* Options */}
        <div className="px-5 pb-3 space-y-2">
          {/* Letzter Stand */}
          <button
            onClick={() => handleSelect('last')}
            disabled={!hasHistory}
            className={`w-full rounded-xl p-4 flex items-start gap-3 text-left transition ${
              hasHistory
                ? 'bg-neutral-800 border border-neutral-700 hover:border-orange-500 active:bg-neutral-700'
                : 'bg-neutral-900 border border-neutral-800 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="mt-0.5 bg-blue-500/20 rounded-lg p-2"><RotateCcw size={18} className="text-blue-400" /></div>
            <div className="flex-1">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Letzter Stand</div>
              <div className="text-neutral-400 font-mono text-[10px] mt-0.5">
                {hasHistory
                  ? `Werte von ${lastDate} übernehmen`
                  : 'Noch keine Session mit diesem Workout'
                }
              </div>
              {hasHistory && lastSession.exercises.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {lastSession.exercises.slice(0, 3).map((ex, i) => {
                    const def = data.exercises.find(e => e.id === ex.exerciseId);
                    const topSet = ex.sets.find(s => s.done !== false);
                    return (
                      <span key={i} className="bg-neutral-900 rounded px-1.5 py-0.5 font-mono text-[9px] text-neutral-400">
                        {def?.name?.slice(0, 12)}: {topSet ? formatSet(def, topSet) : '–'}
                      </span>
                    );
                  })}
                  {lastSession.exercises.length > 3 && (
                    <span className="bg-neutral-900 rounded px-1.5 py-0.5 font-mono text-[9px] text-neutral-500">
                      +{lastSession.exercises.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </button>

          {/* Overload */}
          <button
            onClick={() => handleSelect('overload')}
            disabled={!hasHistory}
            className={`w-full rounded-xl p-4 flex items-start gap-3 text-left transition ${
              hasHistory
                ? 'bg-neutral-800 border border-neutral-700 hover:border-orange-500 active:bg-neutral-700'
                : 'bg-neutral-900 border border-neutral-800 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="mt-0.5 bg-green-500/20 rounded-lg p-2"><TrendingUp size={18} className="text-green-400" /></div>
            <div className="flex-1">
              <div className="font-display uppercase text-sm font-bold tracking-wide flex items-center gap-2">
                Overload
                <span className="bg-green-500/20 text-green-400 font-mono text-[9px] px-1.5 py-0.5 rounded">+PROGRESS</span>
              </div>
              <div className="text-neutral-400 font-mono text-[10px] mt-0.5">
                {hasHistory
                  ? 'Letzte Werte + automatische Steigerung'
                  : 'Erst nach der ersten Session verfügbar'
                }
              </div>
              {hasHistory && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="bg-green-900/40 text-green-400 rounded px-1.5 py-0.5 font-mono text-[9px]">Kraft +2.5kg</span>
                  <span className="bg-green-900/40 text-green-400 rounded px-1.5 py-0.5 font-mono text-[9px]">Reps +1</span>
                  <span className="bg-green-900/40 text-green-400 rounded px-1.5 py-0.5 font-mono text-[9px]">Hold +5s</span>
                  <span className="bg-green-900/40 text-green-400 rounded px-1.5 py-0.5 font-mono text-[9px]">Cardio +0.5km</span>
                </div>
              )}
            </div>
          </button>

          {/* Leer / Template */}
          <button
            onClick={() => handleSelect('empty')}
            className="w-full rounded-xl p-4 flex items-start gap-3 text-left bg-neutral-800 border border-neutral-700 hover:border-orange-500 active:bg-neutral-700 transition"
          >
            <div className="mt-0.5 bg-neutral-600/20 rounded-lg p-2"><FileText size={18} className="text-neutral-400" /></div>
            <div className="flex-1">
              <div className="font-display uppercase text-sm font-bold tracking-wide">Leer starten</div>
              <div className="text-neutral-400 font-mono text-[10px] mt-0.5">
                Template-Vorgaben, alles manuell eintragen
              </div>
            </div>
          </button>
        </div>

        {/* Bottom safe area padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}

// =====================
// BODY WEIGHT MODAL
// =====================
function BodyWeightModal({ data, save, onClose }) {
  const [weight, setWeight] = useState('');
  const entries = useMemo(
    () => [...(data.bodyWeights || [])].sort((a,b) => new Date(b.date) - new Date(a.date)),
    [data.bodyWeights]
  );

  const addEntry = () => {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 300) return alert('Plausibles Gewicht eingeben (30–300 kg)');
    const entry = { date: new Date().toISOString(), weight: w };
    save(d => ({ ...d, bodyWeights: [...(d.bodyWeights || []), entry] }));
    setWeight('');
  };

  const deleteEntry = (date) => {
    save(d => ({ ...d, bodyWeights: d.bodyWeights.filter(e => e.date !== date) }));
  };

  // Mini chart
  const chartData = entries.slice(0, 30).reverse();
  const renderChart = () => {
    if (chartData.length < 2) return null;
    const w = 300, h = 100;
    const maxY = Math.max(...chartData.map(p => p.weight));
    const minY = Math.min(...chartData.map(p => p.weight));
    const padY = (maxY - minY) * 0.15 || 1;
    const rangeY = (maxY - minY) + 2 * padY;
    const scaleX = (i) => (i / (chartData.length - 1)) * (w - 20) + 10;
    const scaleY = (v) => h - 10 - ((v - minY + padY) / rangeY) * (h - 20);
    const path = chartData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(p.weight)}`).join(' ');
    return (
      <svg width={w} height={h} className="w-full">
        <path d={path} stroke="#38bdf8" strokeWidth="2" fill="none" />
        {chartData.map((p, i) => (
          <circle key={i} cx={scaleX(i)} cy={scaleY(p.weight)} r="2" fill="#38bdf8" />
        ))}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-sky-400" />
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">Körpergewicht</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 p-1"><X size={20} /></button>
        </div>

        <div className="p-5 border-b border-neutral-800">
          <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Heute</div>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="kg"
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-lg font-mono text-neutral-50 placeholder-neutral-600 focus:border-sky-400 outline-none"
            />
            <button
              onClick={addEntry}
              className="bg-sky-500 text-neutral-950 font-display uppercase text-xs font-bold tracking-widest px-5 rounded-xl"
            >
              Eintragen
            </button>
          </div>
        </div>

        {entries.length >= 2 && (
          <div className="p-5 border-b border-neutral-800">
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">
              Verlauf (letzte {Math.min(entries.length, 30)})
            </div>
            {renderChart()}
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollhide">
          {entries.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-mono text-xs">Noch keine Einträge</div>
          ) : entries.map(e => (
            <div key={e.date} className="p-3 border-b border-neutral-800 flex items-center gap-3">
              <div className="font-mono text-lg font-bold text-neutral-50">{e.weight} kg</div>
              <div className="flex-1 font-mono text-[10px] text-neutral-500">{fmtDate(e.date)}</div>
              <button onClick={() => deleteEntry(e.date)} className="text-neutral-600 hover:text-red-500 p-1">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================
// 1RM CALCULATOR
// =====================
function OneRMModal({ onClose }) {
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const rm = estimate1RM(+weight, +reps);

  // Table of rep maxes from estimated 1RM
  const percentages = [
    { pct: 100, label: '1RM', reps: 1 },
    { pct: 95, label: '2RM', reps: 2 },
    { pct: 90, label: '3RM', reps: 3 },
    { pct: 85, label: '5RM', reps: 5 },
    { pct: 80, label: '8RM', reps: 8 },
    { pct: 75, label: '10RM', reps: 10 },
    { pct: 70, label: '12RM', reps: 12 }
  ];

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-orange-500" />
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">1RM-Rechner</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 p-1"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Arbeitssatz</div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                step="2.5"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-lg font-mono text-neutral-50 focus:border-orange-500 outline-none"
              />
              <span className="font-mono text-neutral-500 text-sm">kg</span>
              <span className="text-neutral-700">×</span>
              <input
                type="number"
                value={reps}
                onChange={e => setReps(e.target.value)}
                className="w-20 bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3 text-lg font-mono text-neutral-50 focus:border-orange-500 outline-none"
              />
              <span className="font-mono text-neutral-500 text-sm">Wdh</span>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/40 rounded-xl p-4 text-center">
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-orange-400 mb-1">Geschätztes 1RM</div>
            <div className="font-mono text-4xl font-bold text-orange-500">{rm} kg</div>
            <div className="font-mono text-[10px] text-neutral-500 mt-1">Epley-Formel</div>
          </div>

          <div>
            <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Rep-Maxe</div>
            <div className="grid grid-cols-2 gap-1.5">
              {percentages.map(p => (
                <div key={p.pct} className="bg-neutral-800 rounded-lg p-2 flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-neutral-500 w-8">{p.pct}%</span>
                  <span className="font-mono text-base font-bold text-neutral-50 flex-1">{Math.round(rm * p.pct / 100 * 2) / 2}</span>
                  <span className="font-display uppercase text-[9px] text-neutral-600 tracking-widest">{p.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-neutral-500 font-mono text-[10px] leading-relaxed">
            Die Formel wird bei höheren Reps ungenauer. Ab {'>'}12 Wdh nur noch grobe Richtung.
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================
// PLATE CALCULATOR
// =====================
function PlateCalcModal({ onClose }) {
  const [target, setTarget] = useState(100);
  const [barWeight, setBarWeight] = useState(20);
  const result = calculatePlates(+target, +barWeight);

  // Group plates by type for display
  const grouped = {};
  result.plates.forEach(p => { grouped[p] = (grouped[p] || 0) + 1; });

  const plateColors = {
    25: 'bg-red-600',
    20: 'bg-blue-600',
    15: 'bg-yellow-500',
    10: 'bg-green-600',
    5: 'bg-neutral-400',
    2.5: 'bg-neutral-500',
    1.25: 'bg-neutral-600'
  };

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur z-50 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell size={18} className="text-yellow-400" />
            <h2 className="font-display text-xl font-bold uppercase tracking-tight">Plate-Calculator</h2>
          </div>
          <button onClick={onClose} className="text-neutral-500 p-1"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Ziel-Gewicht</div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="2.5"
                  value={target}
                  onChange={e => setTarget(e.target.value)}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-3 text-lg font-mono text-neutral-50 focus:border-orange-500 outline-none"
                />
                <span className="font-mono text-neutral-500 text-sm">kg</span>
              </div>
            </div>
            <div>
              <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Stange</div>
              <div className="flex gap-1">
                {[15, 20].map(w => (
                  <button
                    key={w}
                    onClick={() => setBarWeight(w)}
                    className={`flex-1 rounded-xl py-3 font-mono text-sm font-bold ${+barWeight === w ? 'bg-orange-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'}`}
                  >
                    {w}kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {+target < +barWeight && (
            <div className="bg-red-950/30 border border-red-900 rounded-xl p-3 text-center">
              <div className="font-mono text-xs text-red-400">Ziel-Gewicht kleiner als Stange.</div>
            </div>
          )}

          {+target >= +barWeight && (
            <>
              {/* Per-side display */}
              <div className="bg-neutral-800 rounded-xl p-4">
                <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Pro Seite</div>
                <div className="font-mono text-3xl font-bold text-neutral-50">{result.perSide} kg</div>
                {!result.valid && (
                  <div className="font-mono text-[10px] text-amber-400 mt-1">
                    ≈ nicht exakt, Rest {result.remaining}kg
                  </div>
                )}
              </div>

              {/* Plates visual */}
              <div>
                <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Scheiben pro Seite</div>
                {result.plates.length === 0 ? (
                  <div className="bg-neutral-800 rounded-xl p-4 text-center font-mono text-xs text-neutral-500">Nur die Stange</div>
                ) : (
                  <div className="space-y-1.5">
                    {Object.keys(grouped).sort((a,b) => +b - +a).map(pw => (
                      <div key={pw} className="bg-neutral-800 rounded-lg p-2 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${plateColors[pw] || 'bg-neutral-600'} flex items-center justify-center font-mono text-[10px] font-bold text-neutral-50`}>
                          {pw}
                        </div>
                        <div className="flex-1 font-mono text-sm text-neutral-200">{pw} kg</div>
                        <div className="font-mono text-lg font-bold text-orange-500">× {grouped[pw]}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Loading sequence */}
              {result.plates.length > 0 && (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                  <div className="font-display uppercase text-[10px] font-bold tracking-widest text-neutral-500 mb-2">Reihenfolge (innen → außen)</div>
                  <div className="flex gap-1 items-center justify-center flex-wrap">
                    <div className="font-mono text-[10px] text-neutral-600 mr-1">Stange</div>
                    {result.plates.map((p, i) => (
                      <div key={i} className={`${plateColors[p] || 'bg-neutral-600'} rounded font-mono text-[9px] font-bold text-neutral-50 px-1.5 py-1`}>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="font-mono text-[10px] text-neutral-600 leading-relaxed">
            Verfügbare Scheiben: 25, 20, 15, 10, 5, 2.5, 1.25 kg
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================
// ONBOARDING (First Run)
// =====================
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [seedExamples, setSeedExamples] = useState(true);

  const canContinue = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-neutral-950 text-neutral-50 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Barlow Condensed', system-ui, sans-serif; letter-spacing: 0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Logo / Brand */}
      <div className="pt-16 px-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">Basecamp</div>
        <div className="mt-1 h-[2px] w-12 bg-orange-500" />
      </div>

      {step === 0 && (
        <div className="flex-1 flex flex-col justify-center px-8 pb-16">
          <div className="font-display uppercase text-[10px] tracking-[0.3em] text-neutral-500 mb-3">Willkommen</div>
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight leading-none mb-6">
            Wie heißt<br />du?
          </h1>
          <p className="text-neutral-400 font-mono text-xs mb-8 leading-relaxed">
            Damit deine Session sich nicht wie ein Behördenformular anfühlt.
          </p>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && canContinue) setStep(1); }}
            placeholder="Vorname"
            className="w-full bg-transparent border-b-2 border-neutral-800 focus:border-orange-500 outline-none font-display text-3xl font-bold uppercase py-3 text-neutral-50 placeholder-neutral-700"
          />
          <button
            onClick={() => canContinue && setStep(1)}
            disabled={!canContinue}
            className="mt-10 w-full bg-orange-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-neutral-950 font-display uppercase tracking-widest font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            Weiter <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center px-8 pb-16">
          <div className="font-display uppercase text-[10px] tracking-[0.3em] text-neutral-500 mb-3">Setup</div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight leading-none mb-6">
            Beispiel-<br/>Workouts?
          </h1>
          <p className="text-neutral-400 font-mono text-xs mb-8 leading-relaxed">
            Vier Beispiel-Vorlagen (Kraft, Skill, Ausdauer, Mobility) vorinstallieren? Kannst du jederzeit anpassen oder löschen.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => setSeedExamples(true)}
              className={`w-full rounded-xl p-4 border-2 flex items-center gap-3 transition ${seedExamples ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 bg-neutral-900'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${seedExamples ? 'border-orange-500 bg-orange-500' : 'border-neutral-700'}`}>
                {seedExamples && <Check size={12} className="text-neutral-950" strokeWidth={4} />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-display uppercase text-sm font-bold tracking-wide">Ja, bitte laden</div>
                <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Empfohlen — zum Ausprobieren</div>
              </div>
            </button>

            <button
              onClick={() => setSeedExamples(false)}
              className={`w-full rounded-xl p-4 border-2 flex items-center gap-3 transition ${!seedExamples ? 'border-orange-500 bg-orange-500/5' : 'border-neutral-800 bg-neutral-900'}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${!seedExamples ? 'border-orange-500 bg-orange-500' : 'border-neutral-700'}`}>
                {!seedExamples && <Check size={12} className="text-neutral-950" strokeWidth={4} />}
              </div>
              <div className="flex-1 text-left">
                <div className="font-display uppercase text-sm font-bold tracking-wide">Nein, leer starten</div>
                <div className="text-neutral-500 font-mono text-[10px] mt-0.5">Ich baue meine eigenen</div>
              </div>
            </button>
          </div>

          <button
            onClick={() => onComplete(name.trim(), seedExamples)}
            className="mt-10 w-full bg-orange-500 text-neutral-950 font-display uppercase tracking-widest font-bold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            Los geht's <Play size={16} fill="currentColor" />
          </button>

          <button
            onClick={() => setStep(0)}
            className="mt-3 w-full py-2 font-display uppercase text-[10px] tracking-widest text-neutral-500"
          >
            ← zurück
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div className="pb-10 flex justify-center gap-2">
        <div className={`h-1 rounded-full transition-all ${step === 0 ? 'w-8 bg-orange-500' : 'w-1.5 bg-neutral-700'}`} />
        <div className={`h-1 rounded-full transition-all ${step === 1 ? 'w-8 bg-orange-500' : 'w-1.5 bg-neutral-700'}`} />
      </div>
    </div>
  );
}

// =====================
// MODAL SHELL
// =====================
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-neutral-950 z-40 flex flex-col">
      {children}
    </div>
  );
}


window.__BasecampApp = App;
