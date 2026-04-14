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
  {
    title: 'Stay happy, my dear.',
    media: [{ type: 'video', src: '/media/Vid4.mp4', alt: 'Birthday Video 4' }],
  },
  {
    title: 'You are my favorite story.',
    media: [{ type: 'image', src: '/media/Pic8.png', alt: 'Birthday Photo 5' }],
  },
  {
    title: 'A story I want to read forever.',
    media: [{ type: 'video', src: '/media/Vid2.mp4', alt: 'Birthday Video 2' }],
  },
  {
    title: 'You are a wonderful favorite story.',
    media: [{ type: 'image', src: '/media/Pic4.jpg', alt: 'Birthday Photo 4' }],
  },
  {
    title: 'Our memories keep going...',
    media: [{ type: 'video', src: '/media/Vid3.mp4', alt: 'Birthday Video 3' }],
  },
];

function HeartIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const countdownRef = useRef(null);
  const [count, setCount] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const heartCenterX = canvas.width / 2;
      const heartCenterY = canvas.height / 2 - 80;

      ctx.fillStyle = '#ff4d97';
      for (let i = 0; i < 360; i++) {
        const k = (i * Math.PI) / 180;
        const x = 15 * Math.pow(Math.sin(k), 3) * 20 + heartCenterX;
        const y = -(12 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k)) * 20 + heartCenterY;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.fillStyle = 'rgba(255,77,151,0.18)';
      ctx.filter = 'blur(28px)';
      ctx.beginPath();
      ctx.arc(heartCenterX, heartCenterY, 250, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, []);

  const [started, setStarted] = useState(false);

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
    <div className="hero-screen" onClick={handleStart} style={{ cursor: started ? 'default' : 'pointer' }}>
      <canvas ref={canvasRef} className="heart-canvas" />
      {!started ? (
        <div className="countdown" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', whiteSpace: 'nowrap' }}>Tap to Start</div>
      ) : (
        <div className="countdown">{count >= 0 ? count : ''}</div>
      )}
      <div className="hero-text">Happy Birthday Love</div>
      <div className="subtext">Let's start the celebration!🥳🥳</div>
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

function Fireworks() {
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
    <div className="fireworks-screen">
      <canvas ref={canvasRef} className="fireworks-canvas" />
      <div className="final-message">
        <h1>Happy Birthday ❤️!</h1>
        <p>The Story continues. The future is definitely going to be great</p>
      </div>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState('intro');

  const content = useMemo(() => {
    if (stage === 'intro') return <HeartIntro onComplete={() => setStage('card')} />;
    if (stage === 'card') return <GiftCard onFinish={() => setStage('finale')} />;
    return <Fireworks />;
  }, [stage]);

  return (
    <div className="app-shell">
      {content}
      <audio id="bg-music" src="/media/music1.mp3" loop />
    </div>
  );
}

