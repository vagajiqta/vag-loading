const audio = document.getElementById('audio');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const volumeSlider = document.getElementById('volume-slider');
const playerName = document.getElementById('player-name');

let isPlaying = false;

audio.volume = 0.5;

window.addEventListener('load', () => {
    const video = document.getElementById('bg-video');

    const tryPlay = () => {
        Promise.all([audio.play(), video.play()]).then(() => {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }).catch(() => {
            // Blocked — unlock on first interaction
            const unlock = () => {
                audio.play().then(() => {
                    isPlaying = true;
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                });
                video.play();
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
            };
            document.addEventListener('click', unlock);
            document.addEventListener('keydown', unlock);
        });
    };

    tryPlay();
});

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }
    isPlaying = !isPlaying;
}

function setVolume(val) {
    audio.volume = val / 100;
    document.getElementById('volume-label').textContent = val + '%';

    volumeSlider.style.background = `linear-gradient(to right, rgba(255,255,255,0.8) ${val}%, rgba(255,255,255,0.15) ${val}%)`;
}

setVolume(50);

window.addEventListener('message', (event) => {
    const data = event.data;

    if (data.eventName === 'loadProgress') {
        const pct = Math.round(data.loadFraction * 100);
        progressFill.style.width = pct + '%';
        progressPercent.textContent = pct + '%';
    }

    if (data.eventName === 'playerName') {
        playerName.textContent = data.name || 'player';
    }

    if (data.eventName === 'startFadeOut') {
        document.body.style.transition = 'opacity 0.8s ease';
        document.body.style.opacity = '0';
        setTimeout(() => {
            fetch('https://loadingscreen/shutdown', { method: 'POST' });
        }, 800);
    }
});

const statusMessages = [
    'Connecting to server...',
    'Loading resources...',
    'Initializing scripts...',
    'Almost there...',
    'Welcome!'
];

window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.eventName === 'loadProgress') {
        const pct = data.loadFraction;
        if (pct < 0.2)       progressText.textContent = statusMessages[0];
        else if (pct < 0.4)  progressText.textContent = statusMessages[1];
        else if (pct < 0.7)  progressText.textContent = statusMessages[2];
        else if (pct < 0.95) progressText.textContent = statusMessages[3];
        else                 progressText.textContent = statusMessages[4];
    }
});
