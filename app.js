// ==================== SOLO LEVELING GYM — APP LOGIC V2 ====================

// ===== RANK SYSTEM =====
const RANKS = [
    { name: 'E-RANK', minLevel: 1, cls: 'e', badge: 'badge-e' },
    { name: 'D-RANK', minLevel: 6, cls: 'd', badge: 'badge-d' },
    { name: 'C-RANK', minLevel: 14, cls: 'c', badge: 'badge-c' },
    { name: 'B-RANK', minLevel: 25, cls: 'b', badge: 'badge-b' },
    { name: 'A-RANK', minLevel: 40, cls: 'a', badge: 'badge-a' },
    { name: 'S-RANK', minLevel: 60, cls: 's', badge: 'badge-s' },
    { name: 'NATIONAL', minLevel: 85, cls: 'national', badge: 'badge-national' },
    { name: 'MONARCH', minLevel: 100, cls: 'monarch', badge: 'badge-monarch' },
];

const WORKOUT_TEMPLATES = [
    { name: 'Push Day', tag: 'push', desc: 'Chest, Shoulders, Triceps', exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, weight: 60 },
        { name: 'Overhead Press', sets: 3, reps: 10, weight: 40 },
        { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 20 },
        { name: 'Lateral Raises', sets: 3, reps: 15, weight: 8 },
        { name: 'Tricep Pushdowns', sets: 3, reps: 12, weight: 25 },
    ]},
    { name: 'Pull Day', tag: 'pull', desc: 'Back, Biceps, Rear Delts', exercises: [
        { name: 'Deadlift', sets: 4, reps: 6, weight: 100 },
        { name: 'Pull-ups', sets: 3, reps: 10, weight: 0 },
        { name: 'Barbell Rows', sets: 4, reps: 10, weight: 60 },
        { name: 'Face Pulls', sets: 3, reps: 15, weight: 15 },
        { name: 'Barbell Curls', sets: 3, reps: 12, weight: 20 },
    ]},
    { name: 'Leg Day', tag: 'legs', desc: 'Quads, Hamstrings, Calves', exercises: [
        { name: 'Squats', sets: 4, reps: 8, weight: 80 },
        { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 60 },
        { name: 'Leg Press', sets: 3, reps: 12, weight: 120 },
        { name: 'Leg Curls', sets: 3, reps: 12, weight: 30 },
        { name: 'Calf Raises', sets: 4, reps: 15, weight: 40 },
    ]},
    { name: 'Full Body', tag: 'full', desc: 'Complete compound workout', exercises: [
        { name: 'Squats', sets: 3, reps: 8, weight: 70 },
        { name: 'Bench Press', sets: 3, reps: 8, weight: 55 },
        { name: 'Barbell Rows', sets: 3, reps: 10, weight: 50 },
        { name: 'Overhead Press', sets: 3, reps: 10, weight: 35 },
        { name: 'Deadlift', sets: 3, reps: 6, weight: 90 },
    ]},
    { name: 'Cardio HIIT', tag: 'cardio', desc: 'High intensity intervals', exercises: [
        { name: 'Burpees', sets: 4, reps: 15, weight: 0 },
        { name: 'Mountain Climbers', sets: 4, reps: 20, weight: 0 },
        { name: 'Jump Squats', sets: 4, reps: 15, weight: 0 },
        { name: 'Box Jumps', sets: 3, reps: 12, weight: 0 },
        { name: 'Battle Ropes', sets: 4, reps: 30, weight: 0 },
    ]},
    { name: 'Upper Body', tag: 'push', desc: 'Chest, Back, Arms', exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, weight: 60 },
        { name: 'Pull-ups', sets: 3, reps: 10, weight: 0 },
        { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 22 },
        { name: 'Dips', sets: 3, reps: 12, weight: 0 },
        { name: 'Hammer Curls', sets: 3, reps: 12, weight: 14 },
    ]},
];

const SHADOWS = [
    { id: 'igris', name: 'Igris', icon: '🗡️', role: 'Blood Red Commander', minLevel: 5, buffDesc: '+10% XP globally.' },
    { id: 'tank', name: 'Tank', icon: '🛡️', role: 'Iron Wall', minLevel: 10, buffDesc: '+15% XP for Str workouts.' },
    { id: 'iron', name: 'Iron', icon: '⚔️', role: 'Vanguard', minLevel: 15, buffDesc: '+10% Gold from drops.' },
    { id: 'beru', name: 'Beru', icon: '🐜', role: 'Shadow Ant King', minLevel: 25, buffDesc: '+20% XP for Agility.' }
];

const DAILY_QUESTS = [
    { icon: '🏋️', name: 'Iron Will', desc: 'Complete a full workout session', type: 'workout', target: 1, xp: 100 },
    { icon: '🔥', name: 'Arise!', desc: 'Check in at the gym today', type: 'checkin', target: 1, xp: 50 },
    { icon: '💪', name: 'Power Surge', desc: 'Log 3 different exercises', type: 'exercises', target: 3, xp: 75 },
    { icon: '⏱️', name: 'Rest Master', desc: 'Use the rest timer 5 times', type: 'timer', target: 5, xp: 40 },
    { icon: '🗡️', name: 'Shadow Training', desc: 'Log at least 10 total sets', type: 'sets', target: 10, xp: 80 },
    { icon: '🔱', name: 'Heavy Lifter', desc: 'Log an exercise with 50kg+ weight', type: 'heavy', target: 50, xp: 60 },
];

function getRank(level) {
    let rank = RANKS[0];
    for (const r of RANKS) { if (level >= r.minLevel) rank = r; }
    return rank;
}

function getXpForLevel(level) { return 50 + (level - 1) * 30; }

function calculateStats(data) {
    const days = data.attendance.length;
    const totalExercises = (data.workouts || []).reduce((sum, w) => sum + w.exercises.length, 0);
    const totalWeight = (data.workouts || []).reduce((sum, w) =>
        sum + w.exercises.reduce((s, e) => s + (e.weight * e.sets * e.reps), 0), 0);
    return {
        str: 10 + Math.floor(totalWeight / 500),
        agi: 8 + Math.floor(totalExercises * 0.8),
        vit: 12 + Math.floor(days * 3),
        int: 6 + Math.floor((data.workouts || []).length * 1.5),
    };
}

// ===== STORAGE =====
function getUsers() { return JSON.parse(localStorage.getItem('slgym_users') || '{}'); }
function saveUsers(users) { localStorage.setItem('slgym_users', JSON.stringify(users)); }
function getCurrentUser() {
    const u = localStorage.getItem('slgym_current');
    if (!u) return null;
    const users = getUsers();
    const data = users[u];
    if (!data) return null;

    if (data.gold === undefined) data.gold = 0;
    if (!data.shadows) data.shadows = [];
    if (!data.equippedShadow) data.equippedShadow = null;
    if (!data.titles) data.titles = ['The Player'];
    if (!data.equippedTitle) data.equippedTitle = 'The Player';
    if (!data.inventory) data.inventory = { potions: 0 };
    if (!data.themes) data.themes = ['default'];
    if (!data.activeTheme) data.activeTheme = 'default';
    if (!data.bossKills) data.bossKills = 0;

    return data;
}
function saveCurrentUser(data) {
    const u = localStorage.getItem('slgym_current');
    const users = getUsers(); users[u] = data; saveUsers(users);
}

// ===== PARTICLES =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4, vy: -Math.random() * 0.5 - 0.2,
            size: Math.random() * 2.5 + 0.5, alpha: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.5 ? '0,212,255' : '124,58,237',
        });
    }
    (function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10) p.x = canvas.width + 10;
            if (p.x > canvas.width + 10) p.x = -10;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`; ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha * 0.12})`; ctx.fill();
        }
        requestAnimationFrame(animate);
    })();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

// ===== VIEWS & TABS =====
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Force the viewport to the top whenever the view changes so no scrolling is needed post-login
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });

    // On dashboard, ensure feature panels land at the top of the viewport
    if (id === 'dashboard-view' && target) {
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }));
    }
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active');
}

// ===== LOGIN / REGISTER =====
let isRegisterMode = false;
let passwordVisible = false;

function setLoginLoading(state) {
    const btn = document.getElementById('login-btn');
    if (!btn) return;
    btn.disabled = state;
    btn.textContent = state ? 'PROCESSING...' : (isRegisterMode ? 'ARISE' : 'ENTER');
}

function togglePasswordVisibility() {
    const input = document.getElementById('input-password');
    const toggle = document.getElementById('password-toggle');
    if (!input || !toggle) return;
    passwordVisible = !passwordVisible;
    input.type = passwordVisible ? 'text' : 'password';
    toggle.textContent = passwordVisible ? 'Hide' : 'Show';
}

function toggleLoginMode() {
    isRegisterMode = !isRegisterMode;
    document.getElementById('login-title').textContent = isRegisterMode ? 'REGISTER' : 'HUNTER LOGIN';
    document.getElementById('login-btn').textContent = isRegisterMode ? 'ARISE' : 'ENTER';
    document.getElementById('login-toggle-text').innerHTML = isRegisterMode
        ? 'Already a hunter? <a onclick="toggleLoginMode()">Login</a>'
        : 'New hunter? <a onclick="toggleLoginMode()">Register</a>';
    document.getElementById('name-group').style.display = isRegisterMode ? 'block' : 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById(isRegisterMode ? 'input-name' : 'input-username')?.focus();
}

function handleLogin() {
    const username = document.getElementById('input-username').value.trim();
    const password = document.getElementById('input-password').value.trim();
    const displayName = document.getElementById('input-name')?.value.trim() || '';
    const errorEl = document.getElementById('login-error');
    if (!username || !password) { errorEl.textContent = 'All fields are required.'; return; }

    // Early validation to avoid showing "access granted" on failures
    const users = getUsers();
    if (!isRegisterMode && (!users[username] || users[username].password !== password)) {
        errorEl.textContent = 'Invalid credentials.';
        setLoginLoading(false);
        return;
    }
    if (isRegisterMode) {
        if (users[username]) { errorEl.textContent = 'Hunter name already taken.'; setLoginLoading(false); return; }
        if (!displayName) { errorEl.textContent = 'Enter your hunter name.'; setLoginLoading(false); return; }
    }

    setLoginLoading(true);
    errorEl.textContent = '';

    // System Access Animation Sequence (only runs after validation passes)
    const overlay = document.getElementById('system-access-overlay');
    const bar = document.getElementById('system-access-bar');
    const text = document.getElementById('system-access-text');
    
    overlay.style.display = 'flex';
    let progress = 0;
    const messages = [
        'INITIALIZING HUNTER PROTOCOL...',
        'CONNECTING TO ETERNAL THRONE...',
        'BYPASSING ARCHITECT SECURITY...',
        'AUTHENTICATING SHADOW SOUL...',
        'SYNCHRONIZING MANA CIRCUIT...',
        'ACCESS GRANTED.'
    ];

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        bar.style.width = progress + '%';
        
        const msgIndex = Math.floor((progress / 100) * (messages.length - 1));
        text.textContent = messages[msgIndex];

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                overlay.style.display = 'none';
                processAuth(username, password, displayName, errorEl);
            }, 600);
        }
    }, 150);
}

function processAuth(username, password, displayName, errorEl) {
    const users = getUsers();
    if (isRegisterMode) {
        if (users[username]) { errorEl.textContent = 'Hunter name already taken.'; setLoginLoading(false); return; }
        if (!displayName) { errorEl.textContent = 'Enter your hunter name.'; setLoginLoading(false); return; }
        users[username] = {
            username, displayName, password, level: 1, xp: 0, gold: 0,
            attendance: [], workouts: [], questProgress: {}, timerUses: 0,
            shadows: [], equippedShadow: null, titles: ['The Player'],
            equippedTitle: 'The Player', inventory: { potions: 0 },
            themes: ['default'], activeTheme: 'default', bossKills: 0,
            createdAt: new Date().toISOString(),
        };
        saveUsers(users);
        localStorage.setItem('slgym_current', username);
        showSystemNotification('WELCOME, HUNTER', 'Your journey begins now.');
        setTimeout(() => { setLoginLoading(false); loadDashboard(); }, 1200);
    } else {
        if (!users[username] || users[username].password !== password) {
            errorEl.textContent = 'Invalid credentials.'; setLoginLoading(false); return;
        }
        localStorage.setItem('slgym_current', username);
        setLoginLoading(false);
        loadDashboard();
    }
}

function logout() {
    localStorage.removeItem('slgym_current');
    showView('login-view');
}

// ===== DASHBOARD =====
function loadDashboard() {
    const data = getCurrentUser();
    if (!data) { showView('login-view'); return; }
    // Ensure fields exist (migration)
    if (!data.workouts) data.workouts = [];
    if (!data.questProgress) data.questProgress = {};
    if (!data.timerUses) data.timerUses = 0;
    saveCurrentUser(data);

    showView('dashboard-view');
    if (typeof applyTheme === 'function') applyTheme(data.activeTheme);
    updateStatusPanel(data);
    updateCheckinCard(data);
    updateCalendar(data);
    updateHistory(data);
    updateWorkoutLog(data);
    updateQuests(data);
    renderTemplates();
    
    // V3
    if (document.getElementById('gold-value')) {
        document.getElementById('gold-value').textContent = data.gold;
        if (typeof checkAchievements === 'function') {
            checkAchievements(data);
            renderTitlesDropdown(data);
            renderShadows(data);
            renderStore(data);
            renderBossRaid(data);
            setTimeout(() => renderCharts(data), 100);
        }
    }
}

function updateStatusPanel(data) {
    const rank = getRank(data.level);
    const stats = calculateStats(data);
    const xpNeeded = getXpForLevel(data.level);
    const xpPct = Math.min((data.xp / xpNeeded) * 100, 100);

    document.getElementById('hunter-initials').textContent =
        data.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    document.getElementById('hunter-name').textContent = data.displayName;

    const rankEl = document.getElementById('hunter-rank');
    rankEl.textContent = rank.name + ' HUNTER';
    rankEl.className = 'hunter-rank rank-' + rank.cls;

    const badge = document.getElementById('nav-rank');
    badge.textContent = rank.name;
    badge.className = 'nav-rank-badge ' + rank.badge;

    document.getElementById('nav-username').textContent = data.displayName;
    document.getElementById('xp-level').textContent = 'LV. ' + data.level;
    document.getElementById('xp-numbers').textContent = `${data.xp} / ${xpNeeded} XP`;
    document.getElementById('xp-fill').style.width = xpPct + '%';

    document.getElementById('stat-str').textContent = stats.str;
    document.getElementById('stat-agi').textContent = stats.agi;
    document.getElementById('stat-vit').textContent = stats.vit;
    document.getElementById('stat-int').textContent = stats.int;
}

function updateCheckinCard(data) {
    const today = new Date().toISOString().split('T')[0];
    const checked = data.attendance.includes(today);
    const streak = calculateStreak(data.attendance);
    document.getElementById('streak-count').textContent = streak;
    const btn = document.getElementById('btn-checkin');
    const status = document.getElementById('checkin-status');
    btn.disabled = checked;
    btn.textContent = checked ? 'COMPLETED' : 'CHECK IN';
    status.textContent = checked ? 'You have trained today. Rest well, hunter.' : 'Mark your attendance to earn XP';
    status.className = 'checkin-status' + (checked ? ' checked' : '');
}

function calculateStreak(att) {
    if (!att.length) return 0;
    const sorted = [...att].sort().reverse();
    const today = new Date(); today.setHours(0,0,0,0);
    const last = new Date(sorted[0]); last.setHours(0,0,0,0);
    if (Math.floor((today - last) / 86400000) > 1) return 0;
    let streak = 0;
    for (let i = 0; i < sorted.length; i++) {
        const d = new Date(sorted[i]); d.setHours(0,0,0,0);
        const expected = new Date(today); expected.setDate(expected.getDate() - i); expected.setHours(0,0,0,0);
        if (Math.abs(Math.floor((d - expected) / 86400000)) <= (i === 0 ? 1 : 0)) streak++;
        else break;
    }
    return streak;
}

function calculateXpGain(data, base, isCardio = false, isStr = false) {
    let multiplier = 1.0;
    if (data.equippedShadow === 'igris') multiplier += 0.10;
    if (data.equippedShadow === 'tank' && isStr) multiplier += 0.15;
    if (data.equippedShadow === 'beru' && isCardio) multiplier += 0.20;
    
    let xp = Math.floor(base * multiplier);
    
    let goldMultiplier = 1.0;
    if (data.equippedShadow === 'iron') goldMultiplier += 0.10;
    let gold = Math.floor((xp * 0.5) * goldMultiplier);
    
    return { xp, gold };
}

function doCheckIn() {
    const data = getCurrentUser(); if (!data) return;
    const today = new Date().toISOString().split('T')[0];
    if (data.attendance.includes(today)) return;
    data.attendance.push(today);
    const streak = calculateStreak(data.attendance);
    
    let baseGain = 50 + Math.min(streak, 10) * 5;
    const { xp: xpGain, gold: goldGain } = calculateXpGain(data, baseGain);
    
    data.xp += xpGain;
    data.gold += goldGain;
    
    let leveledUp = false;
    const prevRank = getRank(data.level).name;
    while (data.xp >= getXpForLevel(data.level)) { data.xp -= getXpForLevel(data.level); data.level++; leveledUp = true; }
    const curRank = getRank(data.level).name;
    saveCurrentUser(data);
    if (curRank !== prevRank) showSystemNotification('RANK UP!', `You evolved to ${curRank} HUNTER!`);
    else if (leveledUp) showSystemNotification('LEVEL UP!', `Now Level ${data.level}! (+${xpGain} XP, +${goldGain} Gold)`);
    else showSystemNotification('CHECK-IN COMPLETE', `+${xpGain} XP, +${goldGain} Gold`);
    setTimeout(() => loadDashboard(), 2500);
}

// ===== CALENDAR =====
function updateCalendar(data) {
    const grid = document.getElementById('calendar-grid');
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('calendar-month').textContent = `${months[month]} ${year}`;
    const headers = grid.querySelectorAll('.calendar-day-header');
    grid.innerHTML = ''; headers.forEach(h => grid.appendChild(h));
    for (let i = 0; i < firstDay; i++) { const e = document.createElement('div'); e.className = 'calendar-day empty'; grid.appendChild(e); }
    for (let d = 1; d <= daysInMonth; d++) {
        const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const cell = document.createElement('div'); cell.className = 'calendar-day'; cell.textContent = d;
        if (d === now.getDate()) cell.classList.add('today');
        if (data.attendance.includes(ds)) cell.classList.add('checked-in');
        grid.appendChild(cell);
    }
    const thisMonth = data.attendance.filter(a => { const dd = new Date(a); return dd.getFullYear()===year && dd.getMonth()===month; }).length;
    document.getElementById('att-total').textContent = data.attendance.length;
    document.getElementById('att-monthly').textContent = thisMonth;
    document.getElementById('att-streak').textContent = calculateStreak(data.attendance);
}

function updateHistory(data) {
    const list = document.getElementById('history-list'); list.innerHTML = '';
    if (!data.attendance.length) { list.innerHTML = '<div class="history-empty">No attendance yet. Begin your journey!</div>'; return; }
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const mons = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    [...data.attendance].sort().reverse().slice(0, 15).forEach(ds => {
        const d = new Date(ds + 'T00:00:00');
        const item = document.createElement('div'); item.className = 'history-item';
        item.innerHTML = `<span class="history-date">${days[d.getDay()]}, ${mons[d.getMonth()]} ${d.getDate()}</span><span class="history-xp">+50 XP</span>`;
        list.appendChild(item);
    });
}

// ===== WORKOUTS =====
let currentExercises = [];

function addExercise() {
    const name = document.getElementById('ex-name').value.trim();
    const sets = parseInt(document.getElementById('ex-sets').value) || 0;
    const reps = parseInt(document.getElementById('ex-reps').value) || 0;
    const weight = parseFloat(document.getElementById('ex-weight').value) || 0;
    if (!name || !sets || !reps) { showSystemNotification('ERROR', 'Fill in exercise name, sets, and reps.'); setTimeout(()=>{},1500); return; }
    currentExercises.push({ name, sets, reps, weight });
    renderCurrentExercises();
    document.getElementById('ex-name').value = '';
    document.getElementById('ex-sets').value = '';
    document.getElementById('ex-reps').value = '';
    document.getElementById('ex-weight').value = '';
}

function removeExercise(i) {
    currentExercises.splice(i, 1);
    renderCurrentExercises();
}

function renderCurrentExercises() {
    const list = document.getElementById('current-exercises');
    if (!currentExercises.length) { list.innerHTML = '<div class="history-empty">No exercises added yet</div>'; return; }
    list.innerHTML = currentExercises.map((e, i) => `
        <div class="exercise-item">
            <span class="exercise-name">${e.name}</span>
            <span class="exercise-detail">${e.sets}x${e.reps} ${e.weight ? '@ ' + e.weight + 'kg' : '(BW)'}</span>
            <button class="btn-danger" onclick="removeExercise(${i})">X</button>
        </div>
    `).join('');
}

function saveWorkout() {
    if (!currentExercises.length) { showSystemNotification('ERROR', 'Add at least one exercise.'); return; }
    const data = getCurrentUser(); if (!data) return;
    const totalSets = currentExercises.reduce((s, e) => s + e.sets, 0);
    const baseGain = 20 + totalSets * 5;
    
    const { xp: xpGain, gold: goldGain } = calculateXpGain(data, baseGain, false, true);

    data.workouts.push({
        date: new Date().toISOString().split('T')[0],
        exercises: [...currentExercises],
        xp: xpGain, createdAt: new Date().toISOString(),
    });
    data.xp += xpGain;
    data.gold += goldGain;
    
    const prevRank = getRank(data.level).name;
    while (data.xp >= getXpForLevel(data.level)) { data.xp -= getXpForLevel(data.level); data.level++; }
    const curRank = getRank(data.level).name;
    saveCurrentUser(data);
    currentExercises = [];
    renderCurrentExercises();
    if (curRank !== prevRank) showSystemNotification('RANK UP!', `Evolved to ${curRank} HUNTER!`);
    else showSystemNotification('WORKOUT SAVED', `+${xpGain} XP, +${goldGain} Gold`);
    setTimeout(() => loadDashboard(), 2500);
}

function loadTemplate(idx) {
    const t = WORKOUT_TEMPLATES[idx];
    currentExercises = t.exercises.map(e => ({...e}));
    renderCurrentExercises();
    switchTab('workouts');
    showSystemNotification('TEMPLATE LOADED', `${t.name} - ${t.desc}`);
}

function renderTemplates() {
    const grid = document.getElementById('template-grid');
    grid.innerHTML = WORKOUT_TEMPLATES.map((t, i) => `
        <div class="template-card" onclick="loadTemplate(${i})">
            <div class="template-name">${t.name}</div>
            <div class="template-desc">${t.desc}</div>
            <span class="template-tag ${t.tag}">${t.tag}</span>
        </div>
    `).join('');
}

function updateWorkoutLog(data) {
    const log = document.getElementById('workout-log');
    if (!data.workouts.length) { log.innerHTML = '<div class="history-empty">No workouts logged yet. Start training!</div>'; return; }
    log.innerHTML = [...data.workouts].reverse().slice(0, 10).map(w => `
        <div class="workout-entry">
            <div class="workout-entry-header">
                <span class="workout-entry-date">${w.date}</span>
                <span class="workout-entry-xp">+${w.xp} XP</span>
            </div>
            <div class="exercise-list">
                ${w.exercises.map(e => `
                    <div class="exercise-item">
                        <span class="exercise-name">${e.name}</span>
                        <span class="exercise-detail">${e.sets}x${e.reps} ${e.weight ? '@ '+e.weight+'kg' : '(BW)'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===== DAILY QUESTS =====
function getTodayQuests() {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').join('');
    const shuffled = [...DAILY_QUESTS].sort((a, b) => {
        const ha = hashStr(seed + a.name) % 1000;
        const hb = hashStr(seed + b.name) % 1000;
        return ha - hb;
    });
    return shuffled.slice(0, 4);
}

function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return Math.abs(h);
}

function updateQuests(data) {
    const grid = document.getElementById('quests-list');
    const quests = getTodayQuests();
    const today = new Date().toISOString().split('T')[0];
    const todayWorkouts = data.workouts.filter(w => w.date === today);
    const todayExercises = todayWorkouts.reduce((s, w) => s + w.exercises.length, 0);
    const todaySets = todayWorkouts.reduce((s, w) => s + w.exercises.reduce((ss, e) => ss + e.sets, 0), 0);
    const maxWeight = todayWorkouts.reduce((m, w) => Math.max(m, ...w.exercises.map(e => e.weight)), 0);
    const checkedIn = data.attendance.includes(today);

    grid.innerHTML = quests.map(q => {
        let progress = 0;
        if (q.type === 'checkin') progress = checkedIn ? 1 : 0;
        else if (q.type === 'workout') progress = todayWorkouts.length;
        else if (q.type === 'exercises') progress = todayExercises;
        else if (q.type === 'sets') progress = todaySets;
        else if (q.type === 'timer') progress = data.timerUses || 0;
        else if (q.type === 'heavy') progress = maxWeight;

        const done = progress >= q.target;
        const pct = Math.min((progress / q.target) * 100, 100);

        return `
            <div class="quest-item ${done ? 'completed' : ''}">
                <div class="quest-icon">${q.icon}</div>
                <div class="quest-name">${q.name}</div>
                <div class="quest-desc">${q.desc}</div>
                <div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${pct}%"></div></div>
                <div class="quest-progress-text">
                    <span>${progress} / ${q.target}</span>
                    <span class="quest-xp">${q.xp} XP</span>
                </div>
            </div>
        `;
    }).join('');
}

// ===== REST TIMER =====
let timerInterval = null;
let timerSeconds = 90;
let timerRunning = false;
let timerOriginal = 90;

function setTimer(secs) {
    timerSeconds = secs; timerOriginal = secs; timerRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    updateTimerDisplay();
    document.querySelectorAll('.preset-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.time) === secs);
    });
    document.getElementById('btn-start-timer').textContent = 'START';
    document.getElementById('btn-start-timer').className = 'btn-timer start';
}

function toggleTimer() {
    if (timerRunning) {
        clearInterval(timerInterval); timerInterval = null; timerRunning = false;
        document.getElementById('btn-start-timer').textContent = 'RESUME';
        document.getElementById('btn-start-timer').className = 'btn-timer start';
    } else {
        if (timerSeconds <= 0) timerSeconds = timerOriginal;
        timerRunning = true;
        document.getElementById('btn-start-timer').textContent = 'PAUSE';
        document.getElementById('btn-start-timer').className = 'btn-timer pause';
        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimerDisplay();
            if (timerSeconds <= 0) {
                clearInterval(timerInterval); timerInterval = null; timerRunning = false;
                document.getElementById('btn-start-timer').textContent = 'START';
                document.getElementById('btn-start-timer').className = 'btn-timer start';
                showSystemNotification('TIME UP!', 'Rest is over. Get back to work, hunter!');
                // Track timer use
                const data = getCurrentUser();
                if (data) { data.timerUses = (data.timerUses || 0) + 1; saveCurrentUser(data); }
            }
        }, 1000);
    }
}

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null; timerRunning = false;
    timerSeconds = timerOriginal;
    updateTimerDisplay();
    document.getElementById('btn-start-timer').textContent = 'START';
    document.getElementById('btn-start-timer').className = 'btn-timer start';
}

function setCustomTimer() {
    const mins = parseInt(document.getElementById('custom-mins').value) || 0;
    const secs = parseInt(document.getElementById('custom-secs').value) || 0;
    const total = mins * 60 + secs;
    if (total > 0) setTimer(total);
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const el = document.getElementById('timer-value');
    el.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    el.className = 'timer-value';
    if (timerSeconds <= 5 && timerSeconds > 0) el.classList.add('danger');
    else if (timerSeconds <= 15) el.classList.add('warning');
}

// ===== SYSTEM NOTIFICATION =====
function showSystemNotification(title, message) {
    const overlay = document.getElementById('overlay');
    const notif = document.getElementById('system-notification');
    document.getElementById('system-msg').textContent = title;
    document.getElementById('system-sub').textContent = message;
    overlay.classList.add('show'); notif.classList.add('show');
    setTimeout(() => { overlay.classList.remove('show'); notif.classList.remove('show'); }, 2200);
}

// ===== V3 FEATURES (SHADOWS, STORE, BOSS, CHARTS, TITLES) =====
function applyTheme(theme) {
    document.body.className = '';
    if (theme !== 'default') document.body.classList.add('theme-' + theme);
}

function renderTitlesDropdown(data) {
    const sel = document.getElementById('title-select');
    if(!sel) return;
    sel.innerHTML = data.titles.map(t => `<option value="${t}" ${data.equippedTitle === t ? 'selected' : ''}>${t}</option>`).join('');
}

function equipTitle(t) {
    const data = getCurrentUser(); if(!data) return;
    data.equippedTitle = t;
    saveCurrentUser(data);
}

function checkAchievements(data) {
    let changed = false;
    const streak = calculateStreak(data.attendance);
    const totalSets = (data.workouts || []).reduce((sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets, 0), 0);
    
    if (streak >= 7 && !data.titles.includes('Persistent Hunter')) {
        data.titles.push('Persistent Hunter'); changed = true;
        showSystemNotification('TITLE UNLOCKED', 'Persistent Hunter');
    }
    if (totalSets >= 50 && !data.titles.includes('Iron Body')) {
        data.titles.push('Iron Body'); changed = true;
        showSystemNotification('TITLE UNLOCKED', 'Iron Body');
    }
    if (data.bossKills > 0 && !data.titles.includes('Demon Hunter')) {
        data.titles.push('Demon Hunter'); changed = true;
        showSystemNotification('TITLE UNLOCKED', 'Demon Hunter');
    }
    
    if(changed) saveCurrentUser(data);
}

function renderShadows(data) {
    const list = document.getElementById('shadow-list');
    if(!list) return;
    
    list.innerHTML = SHADOWS.map(s => {
        const isUnlocked = data.level >= s.minLevel;
        const isEquipped = data.equippedShadow === s.id;
        
        return `
            <div class="shadow-item ${isUnlocked ? 'unlocked' : 'locked'} ${isEquipped ? 'equipped' : ''}" 
                 ${isUnlocked ? `onclick="equipShadow('${s.id}')" style="cursor:pointer;"` : ''}>
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:2rem; background:rgba(0,0,0,0.5); width:50px; height:50px; border-radius:10px; display:flex; align-items:center; justify-content:center; border:1px solid var(--glass-border);">${isUnlocked ? s.icon : '❓'}</div>
                    <div>
                        <div style="font-family:'Orbitron'; font-weight:700; color:${isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)'};">${isUnlocked ? s.name : 'Unknown Shadow'}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); margin-top:2px;">${isUnlocked ? s.role : 'Unlocks at Lv.' + s.minLevel}</div>
                    </div>
                </div>
                ${isUnlocked ? `
                    <div style="text-align:right;">
                        <div style="font-size:0.7rem; color:var(--blue-glow); max-width:120px; line-height:1.4;">${s.buffDesc}</div>
                        ${isEquipped ? '<div style="font-size:0.65rem; color:var(--green); font-weight:700; margin-top:4px; letter-spacing:1px;">EQUIPPED</div>' : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function equipShadow(id) {
    const data = getCurrentUser(); if(!data) return;
    const shadow = SHADOWS.find(s => s.id === id);
    if (!shadow || data.level < shadow.minLevel) return;
    
    data.equippedShadow = data.equippedShadow === id ? null : id; // Toggle
    saveCurrentUser(data);
    renderShadows(data);
    showSystemNotification('SHADOW ARMY', data.equippedShadow ? `${shadow.name} deployed.` : 'Shadow recalled.');
}

function renderStore(data) {
    if(!document.getElementById('store-gold')) return;
    document.getElementById('store-gold').textContent = data.gold;
    document.getElementById('potion-count').textContent = data.inventory.potions;
    
    // Update theme buttons
    const btnMonarch = document.getElementById('btn-theme-monarch');
    if (btnMonarch) {
        if (data.themes.includes('monarch')) {
            btnMonarch.textContent = data.activeTheme === 'monarch' ? 'ACTIVE' : 'EQUIP';
            btnMonarch.style.borderColor = data.activeTheme === 'monarch' ? 'var(--green)' : 'var(--text-secondary)';
            btnMonarch.style.color = data.activeTheme === 'monarch' ? 'var(--green)' : 'var(--text-primary)';
        } else {
            btnMonarch.innerHTML = 'Buy <span>🪙 1500</span>';
        }
    }
    
     const btnBlood = document.getElementById('btn-theme-blood');
    if (btnBlood) {
        if (data.themes.includes('blood')) {
            btnBlood.textContent = data.activeTheme === 'blood' ? 'ACTIVE' : 'EQUIP';
            btnBlood.style.borderColor = data.activeTheme === 'blood' ? 'var(--green)' : 'var(--text-secondary)';
            btnBlood.style.color = data.activeTheme === 'blood' ? 'var(--green)' : 'var(--text-primary)';
        } else {
            btnBlood.innerHTML = 'Buy <span>🪙 2500</span>';
        }
    }
}

function buyItem(item, cost) {
    const data = getCurrentUser(); if(!data) return;
    if (data.gold < cost) { showSystemNotification('STORE ERROR', 'Not enough Gold.'); return; }
    
    data.gold -= cost;
    if (item === 'potion') {
        data.inventory.potions++;
        showSystemNotification('ITEM PURCHASED', 'Recovery Potion acquired.');
    }
    saveCurrentUser(data);
    renderStore(data);
    document.getElementById('gold-value').textContent = data.gold;
}

function buyTheme(theme, cost) {
    const data = getCurrentUser(); if(!data) return;
    if (data.themes.includes(theme)) {
        // Equip
        data.activeTheme = theme;
        applyTheme(theme);
        saveCurrentUser(data);
        renderStore(data);
        showSystemNotification('THEME EQUIPPED', 'System appearance updated.');
        return;
    }
    
    if (data.gold < cost) { showSystemNotification('STORE ERROR', 'Not enough Gold.'); return; }
    
    data.gold -= cost;
    data.themes.push(theme);
    data.activeTheme = theme;
    applyTheme(theme);
    saveCurrentUser(data);
    renderStore(data);
    document.getElementById('gold-value').textContent = data.gold;
    showSystemNotification('THEME PURCHASED', 'System appearance updated.');
}

function usePotion() {
    const data = getCurrentUser(); if(!data) return;
    if (data.inventory.potions <= 0) { showSystemNotification('ERROR', 'No potions in inventory.'); return; }
    
    // Find missing day
    if (data.attendance.length === 0) return;
    const sorted = [...data.attendance].sort().reverse();
    const today = new Date(); today.setHours(0,0,0,0);
    
    let injected = false;
    for (let i = 1; i <= 30; i++) {
        const expected = new Date(today); expected.setDate(expected.getDate() - i);
        const ds = expected.toISOString().split('T')[0];
        if (!data.attendance.includes(ds)) {
            data.attendance.push(ds);
            injected = true;
            break;
        }
    }
    
    if (injected) {
        data.inventory.potions--;
        saveCurrentUser(data);
        showSystemNotification('POTION USED', 'Attendance streak restored!');
        loadDashboard();
    } else {
        showSystemNotification('ERROR', 'No missing days found recently.');
    }
}

function renderBossRaid(data) {
    if(!document.getElementById('boss-hp-fill')) return;
    
    // Calculate weekly volume
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); 
    startOfWeek.setHours(0,0,0,0);
    
    let weeklyVol = 0;
    data.workouts.forEach(w => {
        const d = new Date(w.date + 'T00:00:00');
        if (d >= startOfWeek) {
            weeklyVol += w.exercises.reduce((s, e) => s + (e.weight * e.reps * e.sets), 0);
        }
    });
    
    let maxHp = 5000 + (data.bossKills * 2000); 
    // If they beat it
    if (weeklyVol >= maxHp) {
        if (!data.bossesBeaten) data.bossesBeaten = {};
        const weekKey = startOfWeek.toISOString().split('T')[0];
        if (!data.bossesBeaten[weekKey]) {
            // Give reward once per week
            data.bossesBeaten[weekKey] = true;
            data.bossKills++;
            data.xp += 1000;
            data.gold += 500;
            saveCurrentUser(data);
            showSystemNotification('BOSS DEFEATED', '+1000 XP, +500 Gold!');
            checkAchievements(data);
        }
        document.getElementById('boss-hp-fill').style.width = '0%';
        document.getElementById('boss-hp-current').textContent = '0';
        document.getElementById('boss-hp-max').textContent = maxHp;
        document.getElementById('boss-name').textContent = 'Boss Defeated (Resets Sunday)';
        document.getElementById('boss-reward').textContent = 'Bounty Claimed!';
        return;
    }
    
    const maxNameLevel = 10 + (data.bossKills * 5);
    document.getElementById('boss-name').textContent = data.bossKills % 2 === 0 ? 'Igris, the Blood Red Commander' : 'Baruka, the Ice Elf King';
    document.getElementById('boss-level').textContent = 'Lv.' + maxNameLevel;
    
    const remaining = Math.max(0, maxHp - weeklyVol);
    const pct = (remaining / maxHp) * 100;
    
    document.getElementById('boss-hp-fill').style.width = pct + '%';
    document.getElementById('boss-hp-current').textContent = remaining;
    document.getElementById('boss-hp-max').textContent = maxHp;
}

let dashChart1 = null;
let dashChart2 = null;
function renderCharts(data) {
    const radarCtx = document.getElementById('radar-chart');
    const lineCtx = document.getElementById('line-chart');
    if(!radarCtx || !lineCtx || typeof Chart === 'undefined') return;
    
    document.getElementById('charts-card').style.display = 'block';
    
    if (dashChart1) dashChart1.destroy();
    if (dashChart2) dashChart2.destroy();
    
    // Theme colors
    const isMonarch = data.activeTheme === 'monarch';
    const isBlood = data.activeTheme === 'blood';
    const mainColor = isMonarch ? '#a78bfa' : (isBlood ? '#ff5555' : '#00d4ff');
    const mainGlow = isMonarch ? 'rgba(124,58,237,0.3)' : (isBlood ? 'rgba(255,85,85,0.3)' : 'rgba(0,212,255,0.3)');
    
    Chart.defaults.color = '#8892b0';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    const stats = calculateStats(data);
    dashChart1 = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['STR', 'AGI', 'VIT', 'INT'],
            datasets: [{
                label: 'System Attributes',
                data: [stats.str, stats.agi, stats.vit, stats.int],
                backgroundColor: mainGlow,
                borderColor: mainColor,
                pointBackgroundColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { font: { size: 12, family: "'Orbitron', sans-serif" }, color: '#fff' },
                    ticks: { display: false }
                }
            },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });
    
    // Line chart for last 7 days volume
    const days = [];
    const vols = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for(let i=6; i>=0; i--) {
        const d = new Date(today); d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        days.push(d.getDate() + '/' + (d.getMonth()+1));
        
        const wks = data.workouts.filter(w => w.date === ds);
        let vol = 0;
        wks.forEach(w => w.exercises.forEach(e => vol += e.weight * e.reps * e.sets));
        vols.push(vol);
    }
    
    dashChart2 = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Volume (kg)',
                data: vols,
                borderColor: mainColor,
                backgroundColor: mainGlow,
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: mainColor
            }]
        },
        options: {
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true },
                x: { grid: { color: 'rgba(255,255,255,0.05)' } }
            },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    const current = localStorage.getItem('slgym_current');
    if (current && getUsers()[current]) {
        const data = getCurrentUser();
        if (typeof applyTheme === 'function') applyTheme(data.activeTheme || 'default');
        loadDashboard();
    } else {
        showView('login-view');
    }
    updateTimerDisplay();
});
