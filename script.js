(function () {
    'use strict';
    const pkg = document.getElementById('package');
    const btnFlip = document.getElementById('btnFlip');
    let state = { flipped: false };
    try {
        const saved = localStorage.getItem('hw-invite-state');
        if (saved) state = { ...state, ...JSON.parse(saved) };
    } catch (_) { }
    function flip() {
        state.flipped = !state.flipped;
        pkg.classList.toggle('flipped', state.flipped);
        btnFlip.textContent = state.flipped ? '🔄 Ver Frontal' : '🔄 Ver Reverso';
        triggerShake();
    }
    pkg.addEventListener('click', flip);
    btnFlip.addEventListener('click', (e) => { e.stopPropagation(); flip(); });
    function triggerShake() {
        pkg.style.animation = 'none';
        pkg.offsetHeight;
        pkg.style.animation = 'cardShake 0.4s ease';
        setTimeout(() => { pkg.style.animation = ''; }, 400);
    }
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
    @keyframes cardShake {
      0%   { transform: rotateZ(0deg); }
      20%  { transform: rotateZ(-2deg) scale(1.01); }
      40%  { transform: rotateZ(2deg)  scale(1.01); }
      60%  { transform: rotateZ(-1deg); }
      80%  { transform: rotateZ(1deg); }
      100% { transform: rotateZ(0deg); }
    }
  `;
    document.head.appendChild(shakeStyle);
    function showToast(msg) {
        const existing = document.querySelector('.hw-toast');
        if (existing) existing.remove();
        const t = document.createElement('div');
        t.className = 'hw-toast';
        t.textContent = msg;
        t.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #e30000;
      color: white;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 2px;
      padding: 10px 28px;
      border-radius: 30px;
      box-shadow: 0 4px 20px #00000088;
      z-index: 999;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
    `;
        document.body.appendChild(t);
        requestAnimationFrame(() => {
            t.style.opacity = '1';
            t.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => t.remove(), 300);
        }, 2400);
    }
    function countdown() {
        const party = new Date('2026-07-22T19:00:00');
        const now = new Date();
        const diff = party - now;
        if (diff <= 0) {
            document.getElementById("countdown-days").textContent = "0";
            document.getElementById("countdown-hours").textContent = "0";
            document.getElementById("countdown-minutes").textContent = "0";
            document.getElementById("countdown-seconds").textContent = "0";
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById("countdown-days").textContent = days;
        document.getElementById("countdown-hours").textContent = hours;
        document.getElementById("countdown-minutes").textContent = mins;
        document.getElementById("countdown-seconds").textContent = secs;
    }
    setInterval(countdown, 1000);
    countdown();
    pkg.style.opacity = '0';
    pkg.style.transform = 'translateY(40px) scale(0.92)';
    pkg.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.2,0.8,0.3,1)';
    requestAnimationFrame(() => {
        setTimeout(() => {
            pkg.style.opacity = '1';
            pkg.style.transform = 'translateY(0) scale(1)';
        }, 100);
    });
    document.addEventListener('click', (e) => {
        if (e.target.closest('.modal') || e.target.closest('.controls')) return;
        spawnSparks(e.clientX, e.clientY, 8);
    });
    function spawnSparks(x, y, count) {
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const size = 4 + Math.random() * 6;
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
            const dist = 30 + Math.random() * 60;
            const dur = 400 + Math.random() * 400;
            const color = ['#ffd700', '#ff6600', '#ff0000', '#ffffff'][Math.floor(Math.random() * 4)];
            el.style.cssText = `
        position: fixed;
        left: ${x}px; top: ${y}px;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 6px 2px ${color}88;
        transform: translate(-50%, -50%);
        transition: transform ${dur}ms ease-out, opacity ${dur}ms ease-out;
      `;
            document.body.appendChild(el);
            requestAnimationFrame(() => {
                el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(0)`;
                el.style.opacity = '0';
            });

            setTimeout(() => el.remove(), dur + 50);
        }
    }
})();