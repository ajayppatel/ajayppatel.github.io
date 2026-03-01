/* ============================================
   Ajay Patel — Personal Website Scripts
   Typing effect, particle canvas, scroll reveal
   ============================================ */

(function () {
  'use strict';

  // ---------- Typing Animation ----------
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'I love building things that make a difference.',
    'Always exploring, always learning.',
    'Turning curiosity into code.',
    'Welcome to my little corner of the web.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const TYPE_SPEED = 50;
  const DELETE_SPEED = 30;
  const PAUSE_END = 2000;
  const PAUSE_START = 500;

  function typeLoop() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      delay = PAUSE_END;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_START;
    }

    setTimeout(typeLoop, delay);
  }

  if (typedEl) {
    setTimeout(typeLoop, 1200);
  }

  // ---------- Particle Canvas ----------
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 1.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 99, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((w * h) / 15000), 80);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108, 99, 255, ${0.06 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
      }, 200);
    });
  }

  // ---------- Navbar Scroll Effect ----------
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
          } else {
            nav.classList.remove('nav--scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
