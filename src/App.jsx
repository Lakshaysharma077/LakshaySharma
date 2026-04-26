import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToScene = (sceneId) => {
    setIsMenuOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const trigger = ScrollTrigger.getById('mainScroll');
        if (trigger) {
          const positions = { 'work': 0.3, 'about': 0.6, 'contact': 0.9 };
          const target = trigger.start + (trigger.end - trigger.start) * (positions[sceneId] || 0);
          window.scrollTo({ top: target, behavior: 'smooth' });
        }
      }, 500);
    } else {
      const trigger = ScrollTrigger.getById('mainScroll');
      if (trigger) {
        const positions = { 'work': 0.3, 'about': 0.6, 'contact': 0.9 };
        const target = trigger.start + (trigger.end - trigger.start) * (positions[sceneId] || 0);
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`navbar ${isMenuOpen ? 'menu-active' : ''}`}>
      <div className="nav-progress-bar" style={{ width: `${scrollProgress}%` }} />
      <div className="nav-logo" onClick={() => navigate('/')}>
        <span className="logo-mark">LS</span>
        <span className="logo-text">LAKSHAY SHARMA</span>
      </div>
      
      {/* Desktop Links */}
      <div className="nav-links desktop-only">
        <Link to="/" className="nav-link">HOME</Link>
        <button onClick={() => scrollToScene('work')} className="nav-link-btn">WORK</button>
        <button onClick={() => scrollToScene('about')} className="nav-link-btn">ABOUT</button>
        <button onClick={() => scrollToScene('contact')} className="nav-link-btn">CONTACT</button>
      </div>

      <div className="nav-cta">
        <Link to="/hire" className="btn-small desktop-only">HIRE ME</Link>
        
        {/* Hamburger Button */}
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setIsMenuOpen(false)}>
          <span className="close-bar" />
          <span className="close-bar" />
        </button>
        <div className="mobile-links">
          <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>HOME</Link>
          <button onClick={() => scrollToScene('work')} className="mobile-link">WORK</button>
          <button onClick={() => scrollToScene('about')} className="mobile-link">ABOUT</button>
          <button onClick={() => scrollToScene('contact')} className="mobile-link">CONTACT</button>
          <Link to="/hire" className="mobile-link accent" onClick={() => setIsMenuOpen(false)}>HIRE ME</Link>
        </div>
      </div>
    </nav>
  );
};

const Particles = () => {
  const containerRef = useRef();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 1;
      const type = Math.random();
      
      if (type > 0.8) {
        particle.style.width = `${size * 15}px`;
        particle.style.height = `1px`;
      } else if (type > 0.6) {
        particle.style.width = `${size * 2}px`;
        particle.style.height = `${size * 2}px`;
        particle.style.border = `1px solid var(--crimson)`;
        particle.style.background = 'transparent';
      } else {
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
      }
      
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      container.appendChild(particle);
      
      gsap.to(particle, {
        y: `-=${Math.random() * 100 + 50}`,
        x: `+=${Math.random() * 50 - 25}`,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: Math.random() * 5 + 5,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5
      });
    }
  }, []);

  return <div id="particles-container" ref={containerRef} />;
};

const Home = ({ mainRef }) => {
  // FIX 1: Use a local ref for the home section, not mainRef.current as dependency
  const homeRef = useRef();

  useLayoutEffect(() => {
    // FIX 2: Add home-active class BEFORE GSAP init so the page has correct height
    document.body.classList.add('home-active');
    document.documentElement.classList.add('home-active');

    // FIX 3: Use the wrapper div ref, not mainRef.current
    const el = homeRef.current;
    if (!el) return;

    // FIX 4: Kill any leftover ScrollTriggers from previous renders
    ScrollTrigger.getAll().forEach(t => t.kill());

    let ctx = gsap.context((self) => {
      const q = self.selector;

      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'mainScroll',
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      });

      // Scene Transitions
      tl.set(q('#scene-1'), { visibility: 'visible' });

      // Scene 1 -> 2
      tl.to(q('.hero-text'), { xPercent: 100, x: '40vw', opacity: 0, ease: 'power1.inOut' }, 0.5);
      tl.to(q('#undergrad-card'), { y: -300, opacity: 0, ease: 'power2.inOut' }, 0.5);
      tl.set(q('#scene-1'), { visibility: 'hidden' }, 1.5);

      tl.set(q('#scene-2'), { visibility: 'visible' }, 1.5);
      tl.to(q('#card-dev'), { y: -50, opacity: 1, duration: 1 }, 1.5);
      tl.to(q('#card-dev'), { y: -150, opacity: 0, duration: 1 }, 2.5);
      tl.to(q('#card-vibe'), { y: -50, opacity: 1, duration: 1 }, 2);
      tl.to(q('#card-vibe'), { y: -150, opacity: 0, duration: 1 }, 3);
      tl.set(q('#scene-2'), { visibility: 'hidden' }, 3.5);

      // Scene 3
      tl.set(q('#scene-3'), { visibility: 'visible' }, 3.5);
      tl.to(q('#bg-0'), { opacity: 0, duration: 1.5 }, 3.5);
      tl.to(q('#bg-1'), { opacity: 1, duration: 1.5 }, 3.5);

      const navItems = q('.nav-item');
      navItems.forEach((item, index) => {
        tl.fromTo(
          item,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, color: index === 1 ? '#ffffff' : 'rgba(255,255,255,0.05)', duration: 0.5 },
          4 + (index * 0.2)
        );
      });

      tl.to(q('.project-list'), { opacity: 1, x: 0, duration: 1 }, 4.5);
      tl.to(q('.project-list'), { opacity: 0, y: -50, duration: 0.5 }, 5.5);
      tl.set(q('#scene-3'), { visibility: 'hidden' }, 5.5);

      // Scene About
      tl.set(q('#scene-about'), { visibility: 'visible' }, 5.5);
      tl.to(q('#bg-1'), { opacity: 0, duration: 1.5 }, 5.5);
      tl.to(q('#bg-3'), { opacity: 1, duration: 1.5 }, 5.5);

      tl.fromTo(q('.about-left'), { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 6);
      tl.fromTo(q('.about-right'), { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, 6.2);
      tl.to([q('.about-left'), q('.about-right')], { opacity: 0, y: -50, duration: 0.5 }, 7.5);
      tl.set(q('#scene-about'), { visibility: 'hidden' }, 7.5);

      // Scene 4: Footer
      tl.set(q('#scene-4'), { visibility: 'visible' }, 7.5);
      tl.fromTo(q('.footer-content'), { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5 }, 8);

    }, el); // FIX 5: Scope to local homeRef el, not mainRef

    // FIX 6: Refresh after fonts/images load — use both load event and a delayed fallback
    const doRefresh = () => ScrollTrigger.refresh(true);

    if (document.readyState === 'complete') {
      // Already loaded (common in production after hydration)
      doRefresh();
    } else {
      window.addEventListener('load', doRefresh, { once: true });
    }

    // Extra safety: refresh after 800ms for lazy-loaded assets
    const timer1 = setTimeout(doRefresh, 800);
    const timer2 = setTimeout(doRefresh, 1500);

    return () => {
      ctx.revert();
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.body.classList.remove('home-active');
      document.documentElement.classList.remove('home-active');
    };
  }, []); // FIX 7: Empty dependency array — run once on mount

  return (
    // FIX 8: Attach homeRef to a wrapper div so gsap.context scopes correctly
    <div ref={homeRef}>
      <Particles />
      <div className="main-bg-container">
        <div className="bg-image-wrapper" id="bg-0">
          <img src="/image_0.png" alt="Hero" className="full-bg-img" />
          <div className="hero-overlay" />
        </div>
        <div className="bg-image-wrapper" id="bg-1" style={{ opacity: 0 }}>
          <img src="/image_1.png" alt="Work" className="full-bg-img" />
          <div className="hero-overlay gritty-overlay" />
        </div>
        <div className="bg-image-wrapper" id="bg-3" style={{ opacity: 0 }}>
          <img src="/IMG_3479.PNG" alt="About" className="full-bg-img" />
          <div className="hero-overlay deep-red-overlay" />
        </div>
      </div>

      <section className="scene" id="scene-1">
        <div className="hero-content">
          <div className="hero-top-info">
            <span className="location-tag">BASED IN INDIA — AVAILABLE WORLDWIDE</span>
          </div>
          <div className="hero-text">
            <h1 className="glitch-text" data-text="LAKSHAY SHARMA">LAKSHAY SHARMA</h1>
            <div className="hero-subline">
              <span className="accent-dash" />
              <span className="sub-text">CREATIVE TECHNOLOGIST & DIGITAL CRAFTSMAN</span>
            </div>
          </div>
          <div id="undergrad-card">
            <span className="card-label">CURRENT PURSUIT</span>
            <h2 className="card-title">3RD YEAR UNDERGRAD</h2>
            <p className="card-desc">Specializing in immersive web experiences and functional aesthetics.</p>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"><div className="wheel" /></div>
          <span className="scroll-text">DISCOVER THE CRAFT</span>
        </div>
      </section>

      <section className="scene" id="scene-2">
        <div className="vibe-card" id="card-dev">
          <span className="card-number">01</span>
          <h3>1.5+ YRS WEB DEV & EDITING</h3>
        </div>
        <div className="vibe-card" id="card-vibe">
          <span className="card-number">02</span>
          <h3>VIBE CODING SPECIALIST</h3>
        </div>
      </section>

      <section className="scene" id="scene-3">
        <div className="content-grid-right">
          <div className="empty-panel" />
          <div className="project-display">
            <div className="sidebar-nav-right">
              <div className="nav-item">EXPERIENCE</div>
              <div className="nav-item active-project">PROJECTS</div>
              <div className="nav-item">CONTACT</div>
            </div>
            <div className="project-list">
              <div className="project-item">
                <span className="project-year">2024</span>
                <a href="https://class-track.live" className="project-link">CLASS-TRACK.LIVE</a>
                <p className="project-desc">University Management System for streamlined tracking.</p>
              </div>
              <div className="project-item">
                <span className="project-year">2023</span>
                <a href="https://ksonsinternationalltd.com" className="project-link">KSONS INTERNATIONAL</a>
                <p className="project-desc">Industrial export and global trade platform.</p>
              </div>
              <div className="project-item">
                <span className="project-year">2023</span>
                <a href="https://ksonsexteriors.com" className="project-link">KSONS EXTERIORS</a>
                <p className="project-desc">Premium exterior design and architectural solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scene" id="scene-about">
        <div className="about-container">
          <div className="about-left">
            <span className="about-label">PERSONAL</span>
            <h2 className="about-title">WHO I AM</h2>
            <p className="about-text">A 3rd-year undergraduate specializing in "vibe coding"—creating digital experiences that feel as good as they function.</p>
          </div>
          <div className="about-right">
            <span className="about-label">INTERESTS</span>
            <div className="hobby-list">
              <div className="hobby-item">
                <span className="hobby-num">01</span>
                <div><h4>Creative Editing</h4><p>Manipulating visual narratives with industrial grit.</p></div>
              </div>
              <div className="hobby-item">
                <span className="hobby-num">02</span>
                <div><h4>Industrial Design</h4><p>Exploring the intersection of raw textures and modern tech.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scene" id="scene-4">
        <div className="footer-content">
          <div className="footer-top">
            <span className="footer-label">GET IN TOUCH</span>
            <h2 className="footer-title">LET'S BUILD SOMETHING EXTRAORDINARY</h2>
          </div>
          <div className="footer-grid">
            <div className="footer-column">
              <span className="col-label">CONTACT</span>
              <a href="tel:+918295895319" className="footer-info link-underline">+91 82958 95319</a>
              <a href="mailto:lakshaysharma866@gmail.com" className="footer-info link-underline">lakshaysharma866@gmail.com</a>
            </div>
            <div className="footer-column">
              <span className="col-label">SOCIAL</span>
              <a href="https://github.com/Lakshaysharma077" className="footer-info link-underline">GITHUB</a>
              <a href="https://linkedin.com" className="footer-info link-underline">LINKEDIN</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HireMe = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="hire-page">
      <div className="hire-bg-overlay" />
      <div className="hire-container">
        <div className="hire-info-side">
          <span className="hire-label">AVAILABILITY: Q2 2024</span>
          <h2 className="hire-heading">LET'S START <br /> A PROJECT</h2>
          <p className="hire-text">
            I'm currently accepting new freelance opportunities and collaborative ventures. 
            Whether you have a fully formed vision or just the seed of an idea, let's bring it to life.
          </p>
          
          <div className="contact-cards">
            <div className="contact-card">
              <span className="card-tag">EMAIL</span>
              <a href="mailto:lakshaysharma866@gmail.com">lakshaysharma866@gmail.com</a>
            </div>
            <div className="contact-card">
              <span className="card-tag">PHONE</span>
              <a href="tel:+918295895319">+91 82958 95319</a>
            </div>
          </div>
        </div>

        <div className="hire-form-side">
          {status === 'success' ? (
            <div className="success-message">
              <h3 className="success-title">INQUIRY RECEIVED</h3>
              <p>Thank you for reaching out. A confirmation email has been sent to your inbox. I will respond personally within 24 hours.</p>
              <button className="btn-cyan" onClick={() => setStatus('idle')}>SEND ANOTHER</button>
            </div>
          ) : (
            <form className="premium-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input 
                  type="text" 
                  required 
                  placeholder=" " 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <label htmlFor="name">YOUR NAME</label>
                <div className="input-bar" />
              </div>
              <div className="input-group">
                <input 
                  type="email" 
                  required 
                  placeholder=" " 
                  id="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <label htmlFor="email">EMAIL ADDRESS</label>
                <div className="input-bar" />
              </div>
              <div className="input-group">
                <textarea 
                  required 
                  placeholder=" " 
                  id="message" 
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
                <label htmlFor="message">TELL ME ABOUT YOUR VISION</label>
                <div className="input-bar" />
              </div>
              
              {status === 'error' && <p className="error-text">Failed to send enquiry. Please try again later.</p>}
              
              <button type="submit" className="hire-submit-btn" disabled={status === 'loading'}>
                <span>{status === 'loading' ? 'TRANSMITTING...' : 'SEND ENQUIRY'}</span>
                <div className="btn-glow" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const mainRef = useRef();
  const cursorRef = useRef();

  useLayoutEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <div ref={mainRef}>
        <Navbar />
        <div id="cursor-follower" ref={cursorRef} />
        <div className="noise-overlay" />
        <div className="vignette" />
        
        <Routes>
          <Route path="/" element={<Home mainRef={mainRef} />} />
          <Route path="/hire" element={<HireMe />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
