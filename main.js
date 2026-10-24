// Singularity Space Engine: Stars, Constellations, Falling Meteors & Parallax

document.addEventListener("DOMContentLoaded", () => {
  initSpaceCanvas();
  initParallax();
  initEventsScroll();
});

/* ---------------- Space Canvas (Stars, Constellations & Meteors) ---------------- */
function initSpaceCanvas() {
  const canvas = document.getElementById("space-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Starfield
  const starCount = Math.min(Math.floor((width * height) / 5000), 200);
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.7 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.12 + 0.04,
      color: Math.random() > 0.8 ? '#52d8ff' : (Math.random() > 0.65 ? '#ffd59e' : '#ffffff'),
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2
    });
  }

  // Authentic Astronomical Constellations
  const constellations = [
    {
      name: "ORION",
      stars: [
        { id: "betelgeuse", rx: 0.76, ry: 0.14, size: 3.2, color: "#ffb58a" },
        { id: "bellatrix",  rx: 0.87, ry: 0.17, size: 2.6, color: "#d6ecff" },
        { id: "alnitak",    rx: 0.79, ry: 0.26, size: 2.2, color: "#ffffff" },
        { id: "alnilam",    rx: 0.82, ry: 0.28, size: 2.4, color: "#ffffff" },
        { id: "mintaka",    rx: 0.85, ry: 0.29, size: 2.2, color: "#ffffff" },
        { id: "saiph",      rx: 0.78, ry: 0.40, size: 2.5, color: "#ffffff" },
        { id: "rigel",      rx: 0.89, ry: 0.38, size: 3.4, color: "#aae0ff" }
      ],
      lines: [
        ["betelgeuse", "bellatrix"],
        ["betelgeuse", "alnitak"],
        ["bellatrix", "mintaka"],
        ["alnitak", "alnilam"],
        ["alnilam", "mintaka"],
        ["alnitak", "saiph"],
        ["mintaka", "rigel"],
        ["saiph", "rigel"]
      ],
      labelPos: { rx: 0.82, ry: 0.43 }
    },
    {
      name: "CASSIOPEIA",
      stars: [
        { id: "caph",     rx: 0.14, ry: 0.11, size: 2.4, color: "#ffffff" },
        { id: "schedar",  rx: 0.19, ry: 0.16, size: 2.8, color: "#ffd59e" },
        { id: "gamma",    rx: 0.24, ry: 0.12, size: 2.7, color: "#c2e6ff" },
        { id: "ruchbah",  rx: 0.29, ry: 0.17, size: 2.4, color: "#ffffff" },
        { id: "segin",    rx: 0.33, ry: 0.13, size: 2.2, color: "#ffffff" }
      ],
      lines: [
        ["caph", "schedar"],
        ["schedar", "gamma"],
        ["gamma", "ruchbah"],
        ["ruchbah", "segin"]
      ],
      labelPos: { rx: 0.23, ry: 0.20 }
    },
    {
      name: "URSA MAJOR",
      stars: [
        { id: "alkaid",  rx: 0.42, ry: 0.08, size: 2.4, color: "#d0ebff" },
        { id: "mizar",   rx: 0.46, ry: 0.11, size: 2.2, color: "#ffffff" },
        { id: "alioth",  rx: 0.49, ry: 0.14, size: 2.4, color: "#ffffff" },
        { id: "megrez",  rx: 0.53, ry: 0.18, size: 2.0, color: "#ffffff" },
        { id: "phecda",  rx: 0.52, ry: 0.24, size: 2.4, color: "#ffffff" },
        { id: "merak",   rx: 0.57, ry: 0.25, size: 2.5, color: "#ffffff" },
        { id: "dubhe",   rx: 0.58, ry: 0.19, size: 2.8, color: "#ffd59e" }
      ],
      lines: [
        ["alkaid", "mizar"],
        ["mizar", "alioth"],
        ["alioth", "megrez"],
        ["megrez", "phecda"],
        ["phecda", "merak"],
        ["merak", "dubhe"],
        ["dubhe", "megrez"]
      ],
      labelPos: { rx: 0.51, ry: 0.28 }
    }
  ];

  // Falling Meteors
  const meteors = [];
  let nextMeteorTime = Date.now() + 1500;

  function spawnMeteor() {
    const startX = Math.random() * (width * 0.75) + (width * 0.1);
    const startY = Math.random() * (height * 0.25);
    const angle = Math.PI / 4 + (Math.random() * 0.24 - 0.12); // ~45 deg
    const speed = Math.random() * 7 + 13;
    const length = Math.random() * 70 + 80;

    meteors.push({
      x: startX,
      y: startY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      angle: angle,
      length: length,
      opacity: 1,
      size: Math.random() * 1.5 + 1.6,
      color: Math.random() > 0.3 ? '#52d8ff' : '#ffffff',
      sparks: []
    });

    // Schedule next meteor: 3.5 to 7.5 seconds
    nextMeteorTime = Date.now() + Math.random() * 4000 + 3500;
  }

  // Main Render Loop
  let pulsePhase = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    pulsePhase += 0.02;

    // 1. Render Stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.twinklePhase += s.twinkleSpeed;
      const currentAlpha = Math.max(0.15, s.alpha * (0.6 + 0.4 * Math.sin(s.twinklePhase)));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = currentAlpha;
      ctx.fill();

      // Slow celestial drift
      s.y -= s.speed;
      if (s.y < 0) {
        s.y = height;
        s.x = Math.random() * width;
      }
    }

    // 2. Render Constellations
    const isMobile = width < 768;
    const constellationAlpha = Math.sin(pulsePhase * 0.5) * 0.1 + 0.35; // gentle breathing glow

    constellations.forEach(c => {
      const starMap = {};

      // Calculate star pixel coordinates
      c.stars.forEach(st => {
        // Offset on small screens so they fit nicely
        const scaleFactor = isMobile ? 0.75 : 1;
        const x = (st.rx * width * scaleFactor) + (isMobile ? width * 0.15 : 0);
        const y = st.ry * height * scaleFactor;
        starMap[st.id] = { x, y, size: st.size, color: st.color };
      });

      // Draw constellation lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(165, 218, 255, " + (constellationAlpha * 0.45) + ")";
      c.lines.forEach(([id1, id2]) => {
        const p1 = starMap[id1];
        const p2 = starMap[id2];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw constellation stars (glowing nodes)
      c.stars.forEach(st => {
        const pt = starMap[st.id];
        if (!pt) return;

        // Outer halo
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = constellationAlpha * 0.3;
        ctx.fill();

        // Core star
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();
      });

      // Subtle constellation name label
      if (!isMobile && c.labelPos) {
        const lx = c.labelPos.rx * width;
        const ly = c.labelPos.ry * height;
        ctx.font = "9px 'Orbitron', monospace";
        ctx.fillStyle = "#52d8ff";
        ctx.globalAlpha = constellationAlpha * 0.6;
        ctx.textAlign = "center";
        ctx.letterSpacing = "2px";
        ctx.fillText(c.name, lx, ly);
      }
    });

    // 3. Render Falling Meteors
    if (Date.now() > nextMeteorTime) {
      spawnMeteor();
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const tailX = m.x - Math.cos(m.angle) * m.length;
      const tailY = m.y - Math.sin(m.angle) * m.length;

      // Draw luminous trail
      ctx.save();
      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, "rgba(82, 216, 255, 0)");
      grad.addColorStop(0.65, "rgba(82, 216, 255, " + (m.opacity * 0.45) + ")");
      grad.addColorStop(1, "rgba(255, 255, 255, " + m.opacity + ")");

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = m.size;
      ctx.lineCap = "round";
      ctx.stroke();

      // Glowing meteor head
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = m.opacity;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();

      // Flake off spark particle
      if (Math.random() < 0.35) {
        m.sparks.push({
          x: m.x - Math.cos(m.angle) * (Math.random() * 20),
          y: m.y - Math.sin(m.angle) * (Math.random() * 20),
          alpha: 0.8,
          size: Math.random() * 1.2 + 0.6
        });
      }

      // Draw and update sparks
      for (let s = m.sparks.length - 1; s >= 0; s--) {
        const sp = m.sparks[s];
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = "#52d8ff";
        ctx.globalAlpha = sp.alpha * m.opacity;
        ctx.fill();
        sp.alpha -= 0.05;
        if (sp.alpha <= 0) m.sparks.splice(s, 1);
      }

      // Advance meteor
      m.x += m.dx;
      m.y += m.dy;
      m.opacity -= 0.016;

      if (m.opacity <= 0 || m.x > width + 100 || m.y > height + 100) {
        meteors.splice(i, 1);
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  render();
}

/* ---------------- Parallax & Smooth Transitions ---------------- */
function initParallax() {
  const heroContent = document.querySelector(".hero-content");
  const heroScene = document.querySelector(".hero-scene");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.22}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrollY / 650);
    }
    if (heroScene) {
      heroScene.style.transform = `translateY(${scrollY * 0.12}px)`;
      heroScene.style.opacity = Math.max(0, 1 - scrollY / 700);
    }
  });
}

/* ---------------- Horizontal Wheel Scroll for Events ---------------- */
function initEventsScroll() {
  document.querySelectorAll(".events-track-wrapper").forEach(wrapper => {
    wrapper.addEventListener("wheel", e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        wrapper.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });
  });
}
