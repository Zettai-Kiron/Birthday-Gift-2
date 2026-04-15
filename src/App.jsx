import { useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

const pages = [
  {
    title: 'Happy Birthday Dear ❤️',
    media: [{ type: 'image', src: '/media/Pic1.jpeg', alt: 'Birthday Photo 1' }],
    hint: 'Tap anywhere to continue',
  },
  {
    title: 'Every moment is special.',
    media: [{ type: 'video', src: '/media/Vid1.mp4', alt: 'Birthday Video 1' }],
  },
  {
    title: 'As long as you’re smiling, I’m happy.',
    media: [{ type: 'image', src: '/media/Pic3.jpg', alt: 'Birthday Photo 3' }],
  },
  // {
  //   title: 'Stay happy, my dear.',
  //   media: [{ type: 'video', src: '/media/Vid4.mp4', alt: 'Birthday Video 4' }],
  // },
  // {
  //   title: 'You are my favorite story.',
  //   media: [{ type: 'image', src: '/media/Pic8.png', alt: 'Birthday Photo 5' }],
  // },
  // {
  //   title: 'A story I want to read forever.',
  //   media: [{ type: 'video', src: '/media/Vid2.mp4', alt: 'Birthday Video 2' }],
  // },
  // {
  //   title: 'You are a wonderful favorite story.',
  //   media: [{ type: 'image', src: '/media/Pic4.jpg', alt: 'Birthday Photo 4' }],
  // },
  // {
  //   title: 'Our memories keep going...',
  //   media: [{ type: 'video', src: '/media/Vid3.mp4', alt: 'Birthday Video 3' }],
  // },
];

function HeartIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const [count, setCount] = useState(5);
  const [started, setStarted] = useState(false);

  // Fireworks background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle(x, y, hue) {
      const speed = Math.random() * 4 + 2;
      const angle = Math.random() * Math.PI * 2;
      return {
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        hue,
      };
    }

    function createFirework() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
      const hue = Math.random() * 360;
      for (let i = 0; i < 30; i++) {
        particles.push(createParticle(x, y, hue));
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(4, 8, 26, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.alpha > 0.02);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      });
    }

    function loop() {
      if (Math.random() < 0.07) createFirework();
      draw();
      animationFrame = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!started) return;
    if (count < 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => {
      setCount((current) => current - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count, started, onComplete]);

  function handleStart() {
    if (!started) {
      setStarted(true);
      const audio = document.getElementById('bg-music');
      if (audio) {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(e => console.log('Audio init failed:', e));
      }
    }
  }

  return (
    <div
      className="hero-screen"
      onClick={handleStart}
      style={{ cursor: started ? 'default' : 'pointer', position: 'relative', overflow: 'hidden', gap: '1rem', padding: '2rem 1rem' }}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div className="hero-text">Happy Birthday Love 🎂</div>
      <div className="subtext">Let's start the celebration! 🥳🥳</div>
      {!started ? (
        <div className="countdown" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', whiteSpace: 'nowrap' }}>Tap to Start ✨</div>
      ) : (
        <div className="countdown">{count >= 0 ? count : ''}</div>
      )}
    </div>
  );
}

const floatingEmojis = ['🎂', '🕯️', '🎉', '🎁', '🎈', '🍰'];

function FloatingElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // Generate an array of random floating objects
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)],
      left: Math.random() * 100,
      animationDuration: Math.random() * 12 + 15,
      animationDelay: Math.random() * -20,
      scale: Math.random() * 0.8 + 0.6,
      rotateParams: `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg)`,
      depth: (Math.random() * 160) - 80
    }));
    setElements(items);
  }, []);

  return (
    <div className="floating-container">
      {elements.map((el) => (
        <div
          key={el.id}
          className="floating-emoji"
          style={{
            '--left': `${el.left}%`,
            '--duration': `${el.animationDuration}s`,
            '--delay': `${el.animationDelay}s`,
            '--scale': el.scale,
            '--depth': `${el.depth}px`,
            '--rotateParams': el.rotateParams
          }}
        >
          {el.emoji}
        </div>
      ))}
    </div>
  );
}

function GiftCard({ onFinish }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const audio = document.getElementById('bg-music');
    if (audio) {
      audio.play().catch((e) => console.log('Audio autoplay blocked, will play on click', e));
    }

    // Periodic subtle confetti pops
    const interval = setInterval(() => {
      confetti({
        particleCount: 25,
        spread: 80,
        origin: { y: 1.05 },
        colors: ['#ff4d97', '#ff7cb4', '#ffffff', '#ffd700', '#a36eff'],
        gravity: 0.6,
        ticks: 200,
        scalar: 1.2
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const page = pages[pageIndex];

  function handleNext() {
    if (isAnimating) return;

    const audio = document.getElementById('bg-music');
    if (audio && audio.paused) {
      audio.play().catch(e => console.log(e));
    }

    // Confetti on click to make interactions feel more alive
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: Math.random() * 0.6 + 0.2, y: 0.8 },
      colors: ['#ff4d97', '#ff7cb4', '#ffffff', '#ffd700'],
    });

    setIsAnimating(true);
    setTimeout(() => {
      if (pageIndex === pages.length - 1) {
        onFinish();
      } else {
        setPageIndex(pageIndex + 1);
      }
      setIsAnimating(false);
    }, 450);
  }

  return (
    <div className="gift-card-screen" onClick={handleNext}>
      <FloatingElements />
      <div className={`gift-card ${isAnimating ? 'flipping' : ''}`}>
        <div className="card-header">{page.title}</div>
        <div className="media-grid">
          {page.media.map((item, index) => (
            <div key={index} className="media-card">
              {item.type === 'image' ? (
                <img src={item.src} alt={item.alt} />
              ) : (
                <video src={item.src} autoPlay loop muted playsInline />
              )}
            </div>
          ))}
        </div>
        <div className="card-footer">
          <span>{page.hint || 'Tap to proceed...'}</span>
        </div>
      </div>
    </div>
  );
}

function Fireworks({ onFinish }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle(x, y, hue) {
      const speed = Math.random() * 4 + 2;
      const angle = Math.random() * Math.PI * 2;
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        hue,
      };
    }

    function createFirework() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
      const hue = Math.random() * 360;
      for (let i = 0; i < 28; i += 1) {
        particles.push(createParticle(x, y, hue));
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(4, 8, 26, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.alpha > 0.02);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.alpha *= 0.96;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
        ctx.fill();
      });
    }

    function loop() {
      if (Math.random() < 0.09) createFirework();
      draw();
      animationFrame = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="fireworks-screen" onClick={onFinish} style={{ cursor: 'pointer' }}>
      <canvas ref={canvasRef} className="fireworks-canvas" />
      <div className="final-message">
        <h1>Happy Birthday ❤️!</h1>
        <p>The Story continues. The future is definitely going to be great</p>
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.8 }}>Tap to see one last surprise...</p>
      </div>
    </div>
  );
}

function TurtleHeart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Heart functions
    function hearta(k) {
        return 15 * Math.pow(Math.sin(k), 3);
    }

    function heartb(k) {
        return 12 * Math.cos(k)
            - 5 * Math.cos(2 * k)
            - 2 * Math.cos(3 * k)
            - Math.cos(4 * k);
    }

    let i = 0;

    function resize() {
      // Full screen canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      startDrawing();
    }

    function startDrawing() {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      // Reset transform to clear screen
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move origin to center
      ctx.translate(canvas.width / 2, canvas.height / 2);

      i = 0;

      function drawStep() {
        if (i < 300) {
          ctx.fillStyle = "red";
          
          let x = hearta(i) * 20;
          let y = -heartb(i) * 20; // Note: added negative to keep heart right-side up for HTML Canvas

          // Draw dot (small circle)
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();

          i++;
          animationFrameId = requestAnimationFrame(drawStep);
        } else {
          // Restart loop to keep drawing
          i = 0;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.translate(canvas.width / 2, canvas.height / 2);
          animationFrameId = requestAnimationFrame(drawStep);
        }
      }

      drawStep();
    }

    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="turtle-heart-screen" style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: 'black', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, zIndex: 0 }} />
      <div className="final-message" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, textAlign: 'center', pointerEvents: 'none' }}>
        <h1 style={{ color: 'white', textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 10px rgba(255,77,151,0.8)' }}>Happy Birthday ❤️!</h1>
        <p style={{ color: 'white', marginTop: '1rem', fontSize: '1.2rem', textShadow: '0 0 15px rgba(255,255,255,0.8), 0 0 8px rgba(255,77,151,0.8)' }}>The Story continues. The future is definitely going to be great</p>
      </div>
    </div>
  );
}


const BIRTHDAY_NAME = 'Kiron';
const WORDS = ['Happy', 'Birthday', 'to', BIRTHDAY_NAME];

// Timings per word (ms)
const FADE_IN  = 400;
const HOLD     = 2000;
const FADE_OUT = 400;
const WORD_TOTAL = FADE_IN + HOLD + FADE_OUT;

function BirthdaySplash({ onComplete }) {
  const canvasRef = useRef(null);

  // Which word is showing (-1 = none yet)
  const [wordIdx, setWordIdx] = useState(-1);
  // CSS opacity for the current word
  const [wordOpacity, setWordOpacity] = useState(0);

  // Sequence: cycle through each word, then call onComplete
  useEffect(() => {
    const timers = [];

    WORDS.forEach((_, i) => {
      const start = i * WORD_TOTAL;

      // Fade in
      timers.push(setTimeout(() => {
        setWordIdx(i);
        setWordOpacity(1);
      }, start));

      // Fade out
      timers.push(setTimeout(() => {
        setWordOpacity(0);
      }, start + FADE_IN + HOLD));

      // Hide (clear word) after fade out completes
      timers.push(setTimeout(() => {
        setWordIdx(-1);
      }, start + WORD_TOTAL));
    });

    // Advance to cards after last word fully fades
    const totalTime = WORDS.length * WORD_TOTAL + 300;
    timers.push(setTimeout(onComplete, totalTime));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Matrix rain — only "2"
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    const fontSize = 18;
    let cols = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const colCount = Math.floor(canvas.width / fontSize);
      cols = Array.from({ length: colCount }, () => Math.random() * -canvas.height / fontSize);
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      cols.forEach((y, i) => {
        const x = i * fontSize;
        const b = Math.random();
        ctx.fillStyle = b > 0.96 ? '#ffffff' : b > 0.65 ? '#ff2d9b' : '#c0206e';
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillText('2', x, y * fontSize);
        cols[i] += 0.6;
        if (y * fontSize > canvas.height && Math.random() > 0.97) cols[i] = 0;
      });
    }

    function loop() { draw(); animFrame = requestAnimationFrame(loop); }

    resize();
    window.addEventListener('resize', resize);
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const isName = wordIdx === WORDS.length - 1;

  return (
    <div className="splash-screen" onClick={onComplete}>
      <canvas ref={canvasRef} className="splash-canvas" />

      {wordIdx >= 0 && (
        <div
          className="splash-word-wrap"
          style={{
            opacity: wordOpacity,
            transition: `opacity ${wordOpacity === 1 ? FADE_IN : FADE_OUT}ms ease`,
          }}
        >
          <span className={`splash-word ${isName ? 'splash-word--name' : ''}`}>
            {WORDS[wordIdx]}
          </span>
        </div>
      )}
    </div>
  );
}


export default function App() {
  const [stage, setStage] = useState('intro');

  const content = useMemo(() => {
    if (stage === 'intro') return <HeartIntro onComplete={() => setStage('splash')} />;
    if (stage === 'splash') return <BirthdaySplash onComplete={() => setStage('card')} />;
    if (stage === 'card') return <GiftCard onFinish={() => setStage('turtleHeart')} />;
    return <TurtleHeart />;
  }, [stage]);

  return (
    <div className="app-shell">
      {content}
      <audio id="bg-music" src="/media/music1.mp3" loop />
    </div>
  );
}

