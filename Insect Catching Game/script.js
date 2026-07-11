// ============================
// 🔧 FIREBASE CONFIG — replace with YOUR project's config
// (Get this from Firebase Console → Project Settings → General → Your apps)
// ============================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ============================
// ELEMENTS
// ============================
const screens = document.querySelectorAll('.screen');
const choose_insect_btn = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn');
const view_leaderboard_btn = document.getElementById('view-leaderboard-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const achievement = document.getElementById('achievement');

const gameoverScreen = document.getElementById('gameover-screen');
const finalScoreEl = document.getElementById('final-score');
const bestScoreTextEl = document.getElementById('best-score-text');
const playerNameInput = document.getElementById('player-name');
const submitScoreBtn = document.getElementById('submit-score-btn');
const postSaveButtons = document.getElementById('post-save-buttons');
const seeLeaderboardBtn = document.getElementById('see-leaderboard-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const leaderboardScreen = document.getElementById('leaderboard-screen');
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
let hasShownAnnoyed = false;
let hasShownAchievement = false;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

// ============================
// SCREEN 0 → START
// ============================
start_btn.addEventListener('click', () => screens[0].classList.add('up'));

view_leaderboard_btn.addEventListener('click', () => {
    screens[0].classList.add('up');
    showLeaderboard();
});

// ============================
// SCREEN 1 → CHOOSE INSECT
// ============================
choose_insect_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        selected_insect = { src, alt };
        screens[1].classList.add('up');
        resetGameState();
        setTimeout(createInsect, 1000);
        startGame();
    });
});

// ============================
// GAME LOGIC
// ============================
function resetGameState() {
    timeLeft = GAME_DURATION;
    score = 0;
    hasShownAnnoyed = false;
    hasShownAchievement = false;
    scoreEl.innerHTML = `Score: 0`;
    timeEl.innerHTML = `Time: ${formatTime(timeLeft)}`;
    message.classList.remove('visible');
    achievement.classList.remove('visible');

    // clear any leftover insects
    document.querySelectorAll('.insect').forEach(el => el.remove());
}

function startGame() {
    clearInterval(timerInterval);
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
    if (timeLeft <= 0) return; // stop spawning once time's up

    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

    insect.addEventListener('click', catchInsect);

    game_container.appendChild(insect);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
}

function catchInsect() {
    if (timeLeft <= 0) return;
    increaseScore();
    this.classList.add('caught');
    setTimeout(() => this.remove(), 2000);
    addInsects();
}

function addInsects() {
    if (timeLeft <= 0) return;
    setTimeout(createInsect, 1000);
    setTimeout(createInsect, 1500);
}

function increaseScore() {
    score++;
    scoreEl.innerHTML = `Score: ${score}`;

    // "Annoyed" popup — shows once at score 20, auto-hides after 3s
    if (score === 20 && !hasShownAnnoyed) {
        hasShownAnnoyed = true;
        message.classList.add('visible');
        setTimeout(() => message.classList.remove('visible'), 3000);
    }

    // New high score achievement — shows once per game, auto-hides after 3s
    if (score > bestScore && !hasShownAchievement) {
        hasShownAchievement = true;
        achievement.classList.add('visible');
        setTimeout(() => achievement.classList.remove('visible'), 3000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.querySelectorAll('.insect').forEach(el => el.remove());

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }

    finalScoreEl.innerHTML = `Your Score: ${score}`;
    bestScoreTextEl.innerHTML = `Best Score: ${bestScore}`;
    playerNameInput.value = '';
    postSaveButtons.classList.add('hidden');
    submitScoreBtn.disabled = false;
    submitScoreBtn.innerHTML = 'Save Score';

    screens[2].classList.add('up');
    gameoverScreen.classList.add('up');
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
        postSaveButtons.classList.remove('hidden');
    } catch (err) {
        console.error('Error saving score:', err);
        submitScoreBtn.innerHTML = 'Failed — Try Again';
        submitScoreBtn.disabled = false;
    }
});

seeLeaderboardBtn.addEventListener('click', () => {
    gameoverScreen.classList.add('up');
    showLeaderboard();
});

playAgainBtn.addEventListener('click', () => {
    gameoverScreen.classList.add('up');
    screens[2].classList.remove('up');
    screens[1].classList.remove('up');
    screens[0].classList.remove('up');
});

backHomeBtn.addEventListener('click', () => {
    leaderboardScreen.classList.add('up');
    screens[0].classList.remove('up');
    screens[1].classList.remove('up');
    screens[2].classList.remove('up');
    gameoverScreen.classList.remove('up');
});

// ============================
// LOAD LEADERBOARD FROM FIREBASE
// ============================
async function showLeaderboard() {
    leaderboardList.innerHTML = '<li>Loading...</li>';
    leaderboardScreen.classList.remove('up');

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
