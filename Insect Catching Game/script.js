// ============================
// 🔧 FIREBASE CONFIG
// ============================
const firebaseConfig = {
  apiKey: "AIzaSyD-BpUGzlPbhQ1bLUIZwW2zCN3tm-0DNyY",
  authDomain: "insect-game-6ec5d.firebaseapp.com",
  projectId: "insect-game-6ec5d",
  storageBucket: "insect-game-6ec5d.firebasestorage.app",
  messagingSenderId: "643887928455",
  appId: "1:643887928455:web:0847fc892c301fdc3f9422",
  measurementId: "G-FNNYRCEPB1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ============================
// SCREEN MANAGEMENT — only ONE screen visible at any time
// ============================
const SCREEN_IDS = ['screen-start', 'screen-choose', 'screen-game', 'screen-gameover', 'screen-leaderboard'];

function showScreen(id) {
    SCREEN_IDS.forEach(sid => {
        const el = document.getElementById(sid);
        el.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

// ============================
// ELEMENTS
// ============================
const choose_insect_btn = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn');
const view_leaderboard_btn = document.getElementById('view-leaderboard-btn');
const game_container = document.getElementById('screen-game');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const achievement = document.getElementById('achievement');

const finalScoreEl = document.getElementById('final-score');
const bestScoreTextEl = document.getElementById('best-score-text');
const nameEntry = document.getElementById('name-entry');
const playerNameInput = document.getElementById('player-name');
const submitScoreBtn = document.getElementById('submit-score-btn');
const postSaveButtons = document.getElementById('post-save-buttons');
const seeLeaderboardBtn = document.getElementById('see-leaderboard-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const leaderboardList = document.getElementById('leaderboard-list');
const backHomeBtn = document.getElementById('back-home-btn');

// ============================
// GAME STATE
// ============================
const GAME_DURATION = 30; // seconds
let timeLeft = GAME_DURATION;
let score = 0;
let selected_insect = {};
let timerInterval = null;
let spawnTimeouts = [];
let hasShownAnnoyed = false;
let hasShownAchievement = false;
let gameActive = false;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

// ============================
// NAVIGATION
// ============================
start_btn.addEventListener('click', () => showScreen('screen-choose'));

view_leaderboard_btn.addEventListener('click', () => {
    showScreen('screen-leaderboard');
    loadLeaderboard();
});

choose_insect_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        selected_insect = { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
        showScreen('screen-game');
        beginGame();
    });
});

backHomeBtn.addEventListener('click', () => showScreen('screen-start'));

playAgainBtn.addEventListener('click', () => showScreen('screen-choose'));

seeLeaderboardBtn.addEventListener('click', () => {
    showScreen('screen-leaderboard');
    loadLeaderboard();
});

// ============================
// GAME LOGIC
// ============================
function beginGame() {
    // clear any leftovers from a previous round
    clearInterval(timerInterval);
    spawnTimeouts.forEach(t => clearTimeout(t));
    spawnTimeouts = [];
    document.querySelectorAll('.insect').forEach(el => el.remove());

    timeLeft = GAME_DURATION;
    score = 0;
    hasShownAnnoyed = false;
    hasShownAchievement = false;
    gameActive = true;

    scoreEl.innerHTML = `Score: 0`;
    timeEl.innerHTML = `Time: ${formatTime(timeLeft)}`;
    message.classList.remove('visible');
    achievement.classList.remove('visible');

    spawnTimeouts.push(setTimeout(createInsect, 1000));
    timerInterval = setInterval(countdown, 1000);
}

function countdown() {
    timeLeft--;
    timeEl.innerHTML = `Time: ${formatTime(timeLeft)}`;

    if (timeLeft <= 0) {
        endGame();
    }
}

function formatTime(totalSeconds) {
    const s = totalSeconds < 0 ? 0 : totalSeconds;
    return s < 10 ? `00:0${s}` : `00:${s}`;
}

function createInsect() {
    if (!gameActive) return;

    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

    insect.addEventListener('click', () => catchInsect(insect));

    game_container.appendChild(insect);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
}

function catchInsect(insectEl) {
    if (!gameActive) return;
    increaseScore();
    insectEl.classList.add('caught');
    setTimeout(() => insectEl.remove(), 2000);
    spawnTimeouts.push(setTimeout(createInsect, 1000));
    spawnTimeouts.push(setTimeout(createInsect, 1500));
}

function increaseScore() {
    score++;
    scoreEl.innerHTML = `Score: ${score}`;

    if (score === 20 && !hasShownAnnoyed) {
        hasShownAnnoyed = true;
        message.classList.add('visible');
        setTimeout(() => message.classList.remove('visible'), 3000);
    }

    if (score > bestScore && !hasShownAchievement) {
        hasShownAchievement = true;
        achievement.classList.add('visible');
        setTimeout(() => achievement.classList.remove('visible'), 3000);
    }
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    spawnTimeouts.forEach(t => clearTimeout(t));
    spawnTimeouts = [];
    document.querySelectorAll('.insect').forEach(el => el.remove());

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    finalScoreEl.innerHTML = `Your Score: ${score}`;
    bestScoreTextEl.innerHTML = `Best Score: ${bestScore}`;
    playerNameInput.value = '';
    nameEntry.classList.remove('hidden');
    postSaveButtons.classList.add('hidden');
    submitScoreBtn.disabled = false;
    submitScoreBtn.innerHTML = 'Save Score';

    showScreen('screen-gameover');
}

// ============================
// SAVE SCORE TO FIREBASE
// ============================
submitScoreBtn.addEventListener('click', async () => {
    const name = playerNameInput.value.trim() || 'Anonymous';

    submitScoreBtn.disabled = true;
    submitScoreBtn.innerHTML = 'Saving...';

    try {
        await db.collection('scores').add({
            name: name,
            score: score,
            insect: selected_insect.alt || 'unknown',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        submitScoreBtn.innerHTML = 'Saved! ✅';
        nameEntry.classList.add('hidden');
        postSaveButtons.classList.remove('hidden');
    } catch (err) {
        console.error('Error saving score:', err);
        submitScoreBtn.innerHTML = 'Failed — Try Again';
        submitScoreBtn.disabled = false;
    }
});

// ============================
// LOAD LEADERBOARD FROM FIREBASE
// ============================
async function loadLeaderboard() {
    leaderboardList.innerHTML = '<li>Loading...</li>';

    try {
        const snapshot = await db.collection('scores')
            .orderBy('score', 'desc')
            .limit(10)
            .get();

        if (snapshot.empty) {
            leaderboardList.innerHTML = '<li>No scores yet — be the first!</li>';
            return;
        }

        leaderboardList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `<span class="lb-name">${escapeHtml(data.name)}</span><span class="lb-score">${data.score}</span>`;
            leaderboardList.appendChild(li);
        });
    } catch (err) {
        console.error('Error loading leaderboard:', err);
        leaderboardList.innerHTML = '<li>Could not load leaderboard. Try again later.</li>';
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
