const WEB3FORMS_KEY = '2310c1c1-a852-4294-b90c-c5c1492e1f60';

let currentStep = 0;
const answers = {};

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.015;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        const o = this.opacity + Math.sin(this.pulse) * 0.15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,182,66,${Math.max(0, o)})`;
        ctx.fill();
    }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

function showStep(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`[data-step="${n}"]`);
    if (target) {
        target.classList.add('active');
        target.style.animation = 'none';
        target.offsetHeight;
        target.style.animation = '';
    }
}

const supportMessages = {
    1: {
        'terrible': "I'm really sorry you're feeling this way. You don't have to carry it alone. 💛",
        'low': "It takes courage to admit that. Thank you for being honest. 💛",
        'okay': "Okay is perfectly valid. You don't have to be more than okay. 💛",
        'good': "That makes me happy to hear. You deserve to feel good. 🌻",
        'great': "Amazing! Your light is shining today. Keep glowing! ✨"
    },
    3: {
        'storm': "Storms pass. They always do. Hold on tight. 🫂",
        'rain': "Rain isn't forever. Sometimes it helps things grow. 🌧️",
        'cloudy': "Behind those clouds, the sky is still blue. ☁️",
        'fog': "The path will clear. One step at a time. 🌫️",
        'partly-sunny': "There's light breaking through. That matters. ⅅ",
        'sunny': "Your sunshine is radiating. Soak it in! ☀️"
    },
    7: {
        'hug': "Consider this page one big, warm hug. 🤗💛",
        'tea': "Imagine wrapping your hands around the warmest cup. 🍵",
        'walk': "Sometimes fresh air is the best medicine. 🍃",
        'music': "Put on that one song that understands you. 🎧",
        'sleep': "Rest is not laziness — it's healing. 😴",
        'talk': "You never have to face things alone. I'm here. 💬"
    }
};

function showSupport(step, val) {
    const msgs = supportMessages[step];
    if (!msgs || !msgs[val]) return;
    const el = document.createElement('p');
    el.className = 'support-msg';
    el.textContent = msgs[val];

    const stepEl = document.querySelector(`[data-step="${step}"]`);
    const existing = stepEl.querySelector('.support-msg');
    if (existing) existing.remove();

    stepEl.insertBefore(el, stepEl.querySelector('.progress-bar'));
}

function selectMood(btn) {
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    answers.mood = btn.dataset.val;
    showSupport(1, btn.dataset.val);
    setTimeout(() => nextStep(), 1200);
}

function selectWeather(card) {
    document.querySelectorAll('.weather-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    answers.weather = card.dataset.val;
    showSupport(3, card.dataset.val);
    setTimeout(() => nextStep(), 1200);
}

function selectComfort(card) {
    document.querySelectorAll('.comfort-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    answers.comfort = card.dataset.val;
    showSupport(7, card.dataset.val);
    setTimeout(() => nextStep(), 1200);
}

function initEnergy() {
    const container = document.getElementById('energyVisual');
    container.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const bar = document.createElement('div');
        bar.className = 'energy-bar';
        bar.style.height = `${16 + i * 5}px`;
        container.appendChild(bar);
    }
    updateEnergy(5);
}

function updateEnergy(val) {
    const bars = document.querySelectorAll('.energy-bar');
    bars.forEach((bar, i) => {
        bar.classList.toggle('active', i < val);
    });
    answers.energy = val;
}

function nextStep() {
    const mindEl = document.getElementById('mind');
    const letoutEl = document.getElementById('letout');
    const smileEl = document.getElementById('smile');
    const anythingEl = document.getElementById('anything');

    if (mindEl) answers.weighing = mindEl.value;
    if (letoutEl) answers.letOut = letoutEl.value;
    if (smileEl) answers.smile = smileEl.value;
    if (anythingEl) answers.anything = anythingEl.value;

    currentStep++;
    showStep(currentStep);

    if (currentStep === 6) initEnergy();
}

async function submitAnswers() {
    const anythingEl = document.getElementById('anything');
    if (anythingEl) answers.anything = anythingEl.value;

    const overlay = document.getElementById('sendingOverlay');
    overlay.classList.add('active');

    const finalMsg = document.getElementById('finalMsg');
    if (answers.mood === 'terrible' || answers.mood === 'low') {
        finalMsg.textContent = "I know things feel heavy right now, but you are so incredibly valued. Whatever you're going through — it's valid, and you're not alone. One breath at a time. 💛";
    } else if (answers.mood === 'okay') {
        finalMsg.textContent = "You're doing okay, and that's enough. You don't always have to be soaring — just being here is something. Take care of yourself. 🌻";
    } else {
        finalMsg.textContent = "Your light is beautiful. Keep holding onto that feeling — you deserve every bit of it. Shine on. ✨";
    }

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                access_key: WEB3FORMS_KEY,
                subject: '💛 She checked in — here are her answers',
                from_name: 'Check-in Page',
                ...answers
            })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
    } catch (err) {
        console.error(err);
        showToast('Something went wrong sending, but her feelings still matter. 💛');
    }

    setTimeout(() => {
        overlay.classList.remove('active');
        currentStep++;
        showStep(currentStep);
    }, 1800);
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}
