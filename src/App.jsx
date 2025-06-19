import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const LuaDataApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('predictive');
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  const heroParticlesRef = useRef(null);
  const observerRef = useRef(null);
  const lastScrollY = useRef(0);
  const particlesRef = useRef([]);

  // Initialize website functionality
  useEffect(() => {
    initializeWebsite();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const initializeWebsite = () => {
    setupScrollProgress();
    setupHeaderScroll();
    setupSmoothScrolling();
    setupAnimations();
    setupCounters();
    setupParticles();
    setupPerformanceOptimizations();
    startAnimations();

    console.log('🚀 LuaData Website Initialized');
  };

  // Scroll Progress Bar
  const setupScrollProgress = () => {
    const updateProgress = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  };

  // Header Scroll Effects
  const setupHeaderScroll = () => {
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;

      setIsHeaderScrolled(scrollY > 100);

      // Hide/show header on scroll
      if (scrollY > lastScrollY.current && scrollY > 200) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }

      lastScrollY.current = scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  };

  // Smooth Scrolling for Navigation
  const setupSmoothScrolling = () => {
    const handleClick = (e, href) => {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      // Close mobile menu if open
      setIsMenuOpen(false);
    };

    return handleClick;
  };

  const handleNavClick = setupSmoothScrolling();

  // Intersection Observer for Animations
  const setupAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          if (entry.target.classList.contains('stat-card')) {
            animateStatCard(entry.target);
          }

          if (entry.target.classList.contains('service-card')) {
            animateServiceCard(entry.target);
          }

          observerRef.current.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements after component mounts
    setTimeout(() => {
      const animateElements = document.querySelectorAll('.service-card, .stat-card, .solution-card, .contact-feature');
      animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observerRef.current.observe(el);
      });
    }, 100);
  };

  // Animated Counters
  const setupCounters = () => {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    const animateCounter = (counter) => {
      const targetAttr = counter.getAttribute('data-target');

      // Check if it's a text value like "24/7"
      if (!targetAttr || isNaN(parseInt(targetAttr))) {
        return; // Don't animate non-numeric values
      }

      const target = parseInt(targetAttr);
      const duration = 2000;
      const start = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * easeOutQuart);

        counter.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target + '+';
        }
      };

      requestAnimationFrame(animate);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    setTimeout(() => {
      counters.forEach(counter => counterObserver.observe(counter));
    }, 100);
  };

  // Particle System
  const setupParticles = () => {
    if (!heroParticlesRef.current) return;

    const particleCount = 50;

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight;
      }

      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -10;
        this.speed = 0.5 + Math.random() * 2;
        this.size = 1 + Math.random() * 3;
        this.opacity = 0.3 + Math.random() * 0.7;
      }

      update() {
        this.y += this.speed;
        if (this.y > window.innerHeight) {
          this.reset();
        }
      }
    }

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    const animateParticles = () => {
      if (!heroParticlesRef.current) return;

      particlesRef.current.forEach(particle => particle.update());

      const particleElements = particlesRef.current.map(particle => 
        `<div class="particle" style="
          position: absolute;
          left: ${particle.x}px;
          top: ${particle.y}px;
          width: ${particle.size}px;
          height: ${particle.size}px;
          background: rgba(255, 255, 255, ${particle.opacity});
          border-radius: 50%;
          pointer-events: none;
        "></div>`
      ).join('');

      heroParticlesRef.current.innerHTML = particleElements;
      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  };

  // Performance Optimizations
  const setupPerformanceOptimizations = () => {
    const statBars = document.querySelectorAll('.stat-fill');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.getAttribute('data-width') || '100';
          fill.style.width = width + '%';
          statObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    setTimeout(() => {
      statBars.forEach(bar => statObserver.observe(bar));
    }, 100);
  };

  // Animation Functions
  const animateStatCard = (card) => {
    card.style.animation = 'slideInUp 0.6s ease both';

    const statBar = card.querySelector('.stat-fill');
    if (statBar) {
      setTimeout(() => {
        const width = statBar.getAttribute('data-width') || '100';
        statBar.style.width = width + '%';
      }, 300);
    }
  };

  const animateServiceCard = (card) => {
    card.style.animation = 'slideInUp 0.6s ease both';

    const icon = card.querySelector('.service-icon');
    if (icon) {
      setTimeout(() => {
        icon.style.animation = 'scaleIn 0.4s ease both';
      }, 200);
    }
  };

  const startAnimations = () => {
    setTimeout(() => {
      const techTrack = document.querySelector('.tech-track');
      if (techTrack) {
        const items = techTrack.innerHTML;
        techTrack.innerHTML = items + items;
      }

      const cards3d = document.querySelectorAll('.card-3d');
      cards3d.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
      });
    }, 100);
  };

  const [showNotification, setShowNotification] = useState(false);

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsFormLoading(true);

  const form = e.target;
  const formData = new FormData(form);

  // Add form name for Netlify
  formData.append('form-name', 'contact');

  try {
    // Submit to Netlify with correct headers
    const response = await fetch('/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      console.log('Form submitted successfully to Netlify');

      // Fire gtag events after successful submission
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
          'currency': 'USD',
          'value': 50,
          'event_category': 'Lead Generation',
          'event_label': 'Contact Form Submitted'
        });
        
        gtag('event', 'conversion', {
          'send_to': 'AW-17153791006/5c18CMjFoNcaEJ6oyPM_',
          'value': 50.0,
          'currency': 'USD',
          'transaction_id': Date.now().toString()
        });
        
        gtag('event', 'form_submit_success', {
          'event_category': 'Lead Generation',
          'event_label': 'Contact Form Completed',
          'value': 50
        });
      }

      // Show success notification
      setShowNotification(true);
      
      // Reset form
      form.reset();
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);

    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Form submission error:', error);
    
    // Show error notification
    alert('There was an error submitting the form. Please try again.');
  } finally {
    setIsFormLoading(false);
  }
};

  // Tab handling
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'tab_click', {
        'event_category': 'Navigation',
        'event_label': tabId
      });
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Service card click
  const handleServiceCardClick = (serviceName) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'service_interest', {
        'event_category': 'Services',
        'event_label': serviceName
      });
    }
  };

  // CTA button click
  const handleCTAClick = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        'event_category': 'CTA',
        'event_label': 'Get Started Button'
      });
    }
  };

  return (
    <div className="App">
      {/* Progress Bar */}
      <div 
        className="progress-bar" 
        style={{ width: `${scrollProgress}%` }}
        role="progressbar" 
        aria-label="Page scroll progress"
      />

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      />

      {/* Header */}
      <header 
        className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}
        style={{ transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        role="banner"
      >
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <div className="container">
            <div className="nav-content">
              <div className="logo-container">
                <a href="/" className="logo" aria-label="LuaData Homepage">
                  <span className="logo-text">LuaData</span>
                  <div className="logo-pulse" aria-hidden="true"></div>
                </a>
              </div>

              <ul className={`nav-links ${isMenuOpen ? 'mobile-open' : ''}`} role="menubar">
                <li role="none">
                  <a href="#services" className="nav-link" role="menuitem" onClick={(e) => handleNavClick(e, '#services')}>Services</a>
                </li>
                <li role="none">
                  <a href="#machinelearning" className="nav-link" role="menuitem" onClick={(e) => handleNavClick(e, '#machinelearning')}>Solutions</a>
                </li>
                <li role="none">
                  <a href="#about" className="nav-link" role="menuitem" onClick={(e) => handleNavClick(e, '#about')}>About</a>
                </li>
                <li role="none">
                  <a href="#contact" className="nav-link" role="menuitem" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
                </li>
              </ul>

              <div className="header-actions">
                <a href="#contact" className="cta-button" aria-label="Get started with LuaData" onClick={(e) => { handleNavClick(e, '#contact'); handleCTAClick(); }}>
                  <span>Get Started</span>
                </a>
                <button 
                  className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu" 
                  aria-expanded={isMenuOpen}
                >
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hero" role="main">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-gradient"></div>
          <div className="hero-particles" ref={heroParticlesRef}></div>
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="title-line">Transform Your Business</span>
                <span className="title-line gradient-text">with Intelligent AI Solutions</span>
              </h1>

              <p className="hero-description">
                We build cutting-edge AI and machine learning systems that drive real business results. 
                From predictive analytics to automated workflows, unlock the power of your data.
              </p>

              <div className="hero-buttons">
                <a href="#contact" className="btn-primary" onClick={(e) => handleNavClick(e, '#contact')}>
                  <span>Start Your Project</span>
                </a>
                <a href="#services" className="btn-secondary" onClick={(e) => handleNavClick(e, '#services')}>
                  <span>Explore Services</span>
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-hidden="true">
              <div className="floating-cards">
                {[
                  { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "AI Models" },
                  { icon: "M18 20L18 10M12 20L12 4M6 20L6 14", title: "Analytics" },
                  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Automation" },
                  { icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01 20.73 6.96M12 22.08L12 12", title: "Smart Apps" },
                  { icon: "M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01", title: "Mobile AI" },
                  { icon: "M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z", title: "Predictions" }
                ].map((card, index) => (
                  <div key={index} className="card-3d">
                    <div className="card-content">
                      <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d={card.icon}/>
                      </svg>
                      <div className="card-title">{card.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator" aria-hidden="true">
          <div className="scroll-icon"></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>Our Expertise</span>
            </div>
            <h2 className="section-title">AI & Data Science Services</h2>
            <p className="section-subtitle">Comprehensive solutions that drive innovation and growth through intelligent automation</p>
          </div>

          <div className="services-grid">
            {[
              {
                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                title: "Machine Learning Models",
                description: "Custom ML algorithms and predictive models that learn from your data to automate decisions and forecast trends with precision.",
                metrics: [{ value: "95%", label: "Accuracy" }, { value: "Real-time", label: "Processing" }]
              },
              {
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "AI Integration",
                description: "Seamlessly integrate artificial intelligence into your existing workflows to enhance productivity and unlock new capabilities.",
                metrics: [{ value: "60%", label: "Efficiency" }, { value: "24/7", label: "Automation" }]
              },
              {
                icon: "M18 20L18 10M12 20L12 4M6 20L6 14",
                title: "Data Science Consulting",
                description: "Transform raw data into actionable insights with advanced analytics, statistical modeling, and data visualization.",
                metrics: [{ value: "10x", label: "Insights" }, { value: "Custom", label: "Solutions" }]
              },
              {
                icon: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01 20.73 6.96M12 22.08L12 12",
                title: "AI-Powered Web Apps",
                description: "Interactive web applications that leverage machine learning to deliver intelligent user experiences and real-time insights.",
                metrics: [{ value: "Lightning", label: "Fast" }, { value: "Smart", label: "UI/UX" }]
              },
              {
                icon: "M5 2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zM12 18h.01",
                title: "Smart Mobile Apps",
                description: "Mobile applications enhanced with AI capabilities like computer vision, natural language processing, and predictive analytics.",
                metrics: [{ value: "Native", label: "Performance" }, { value: "AI-First", label: "Design" }]
              },
              {
                icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
                title: "Data Pipeline & MLOps",
                description: "Scalable data pipelines and ML operations infrastructure to automate model deployment and monitoring at scale.",
                metrics: [{ value: "Auto", label: "Deploy" }, { value: "Scale", label: "Ready" }]
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="service-card" 
                tabIndex="0" 
                role="article"
                onClick={() => handleServiceCardClick(service.title)}
              >
                <div className="service-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d={service.icon}/>
                  </svg>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-metrics">
                  {service.metrics.map((metric, idx) => (
                    <div key={idx} className="metric">
                      <span className="metric-value">{metric.value}</span>
                      <span className="metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Machine Learning Solutions Section */}
      <section className="solutions" id="machinelearning">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>Advanced Solutions</span>
            </div>
            <h2 className="section-title">Machine Learning Excellence</h2>
            <p className="section-subtitle">Harness the power of AI to transform your business operations and drive intelligent decision-making</p>
          </div>

          <div className="solutions-tabs">
            <div className="tab-nav" role="tablist" aria-label="Solution categories">
              {[
                { id: 'predictive', icon: "M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z", label: 'Predictive Analytics' },
                { id: 'automation', icon: "M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2zM14 2v6h6", label: 'Automation' },
                { id: 'analytics', icon: "M18 20L18 10M12 20L12 4M6 20L6 14", label: 'Advanced Analytics' }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                  role="tab" 
                  aria-selected={activeTab === tab.id}
                  aria-controls={tab.id}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d={tab.icon}/>
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="tab-content">
              <div className={`tab-panel ${activeTab === 'predictive' ? 'active' : ''}`} id="predictive" role="tabpanel">
                <div className="solution-card">
                  <div className="solution-header">
                    <div className="solution-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z"/>
                      </svg>
                    </div>
                    <h3>Predictive Analytics Solutions</h3>
                  </div>
                  <div className="solution-content">
                    {[
                      {
                        title: "Sales Forecasting",
                        description: "Predict future sales trends with 95%+ accuracy using advanced time series analysis and ensemble methods.",
                        tags: ["95% Accuracy", "Real-time"]
                      },
                      {
                        title: "Customer Behavior Analysis",
                        description: "Identify at-risk customers before they leave with machine learning models that analyze behavior patterns.",
                        tags: ["Early Detection", "Behavioral AI"]
                      },
                      {
                        title: "Demand Planning",
                        description: "Optimize inventory and supply chain with intelligent demand forecasting models.",
                        tags: ["Supply Chain", "Optimization"]
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="solution-feature">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                        <div className="feature-tags">
                          {feature.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`tab-panel ${activeTab === 'automation' ? 'active' : ''}`} id="automation" role="tabpanel">
                <div className="solution-card">
                  <div className="solution-header">
                    <div className="solution-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2zM14 2v6h6"/>
                      </svg>
                    </div>
                    <h3>Intelligent Automation</h3>
                  </div>
                  <div className="solution-content">
                    {[
                      {
                        title: "Document Processing",
                        description: "Automate document classification and data extraction using computer vision and NLP techniques.",
                        tags: ["Computer Vision", "NLP"]
                      },
                      {
                        title: "Quality Control",
                        description: "Implement automated quality inspection systems using image recognition and anomaly detection.",
                        tags: ["Image Recognition", "Anomaly Detection"]
                      },
                      {
                        title: "Process Optimization",
                        description: "Optimize business processes with reinforcement learning and intelligent workflow automation.",
                        tags: ["Workflow AI", "Process Mining"]
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="solution-feature">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                        <div className="feature-tags">
                          {feature.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`tab-panel ${activeTab === 'analytics' ? 'active' : ''}`} id="analytics" role="tabpanel">
                <div className="solution-card">
                  <div className="solution-header">
                    <div className="solution-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M18 20L18 10M12 20L12 4M6 20L6 14"/>
                      </svg>
                    </div>
                    <h3>Advanced Analytics</h3>
                  </div>
                  <div className="solution-content">
                    {[
                      {
                        title: "Customer Segmentation",
                        description: "Discover hidden customer segments using unsupervised learning and clustering algorithms.",
                        tags: ["Clustering", "Unsupervised ML"]
                      },
                      {
                        title: "Recommendation Systems",
                        description: "Build personalized recommendation engines that increase engagement and sales.",
                        tags: ["Personalization", "Deep Learning"]
                      },
                      {
                        title: "Real-time Analytics",
                        description: "Process millions of data points in real-time to provide instant business insights and decision support.",
                        tags: ["Real-time", "Big Data"]
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="solution-feature">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                        <div className="feature-tags">
                          {feature.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="tech-showcase">
            <h3>Technologies We Master</h3>
            <div className="tech-carousel">
              <div className="tech-track">
                {[
                  { icon: "M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13L16.17 9.5l.69-.88c.11-.14.24-.28.38-.42.35-.35.85-.64 1.5-.84L19.08 8l.8.33.66.45.49.56.35.66.17.76.02.85-.12.82-.25.8-.35.7-.42.55-.42.42-.4.3-.35.17-.28.07-.24.01L18.1 14.5l.9.11.85.26.78.45.7.62.6.8.48.96.36 1.08.25 1.18.15 1.25.07 1.28-.02 1.27-.1 1.23-.17 1.14-.25 1.02-.3.88-.33.72-.34.54-.32.36-.27.17-.2.05-.1.01-.13-.05L11.84 23l-.69.88c-.11.14-.24.28-.38.42-.35.35-.85.64-1.5.84L9.93 24l-.8-.33-.66-.45-.49-.56-.35-.66-.17-.76-.02-.85.12-.82.25-.8-.35.7-.42.55-.42.42-.4.3-.35.17-.28.07-.24.01L5.9 9.5l-.9-.11-.85-.26-.78-.45-.7-.62-.6-.8-.48-.96-.36-1.08-.25-1.18-.15-1.25-.07-1.28.02-1.27.1-1.23.17-1.14.25-1.02.3-.88.33-.72.34-.54.32-.36.27-.17.2-.05.1-.01.13.05L12.16 1l.69-.88c.11-.14.24-.28.38-.42.35-.35.85-.64 1.5-.84L14.31.18", name: "Python", desc: "TensorFlow, PyTorch, scikit-learn" },
                  { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", name: "Cloud ML", desc: "AWS SageMaker, Google AI Platform" },
                  { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", name: "MLOps", desc: "Docker, Kubernetes, MLflow" },
                  { icon: "M3 3v18h18V3H3zm16 16H5V5h14v14z", name: "Big Data", desc: "Spark, Hadoop, Kafka" },
                  { icon: "M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z", name: "React", desc: "Next.js, TypeScript, Node.js" },
                  { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z", name: "Database", desc: "PostgreSQL, MongoDB, Redis" }
                ].map((tech, index) => (
                  <div key={index} className="tech-item">
                    <div className="tech-logo">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={tech.icon}/>
                      </svg>
                    </div>
                    <span className="tech-name">{tech.name}</span>
                    <span className="tech-desc">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-content">
            <div className="stats-header">
              <h2>Proven Track Record</h2>
              <p>Numbers that speak for our expertise and commitment to excellence</p>
            </div>
            <div className="stats-grid">
              {[
                { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", number: "200", text: "ML Models Deployed", width: "90" },
                { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", number: "95", text: "Model Accuracy Rate", width: "95" },
                { icon: "M18 20L18 10M12 20L12 4M6 20L6 14", number: "50", text: "Data Science Projects", width: "80" },
                { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", number: "24/7", text: "AI Model Monitoring", width: "100", isText: true }
              ].map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                      <path d={stat.icon}/>
                    </svg>
                  </div>
                  <h3 className="stat-number" data-target={stat.isText ? null : stat.number}>
                    {stat.isText ? stat.number : "0+"}
                  </h3>
                  <p>{stat.text}</p>
                  <div className="stat-bar">
                    <div className="stat-fill" data-width={stat.width}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <div className="section-badge">
                <span>Get Started</span>
              </div>
              <h2>Ready to Transform Your Business with AI?</h2>
              <p>Let's build intelligent solutions that drive real results. Get started with a free consultation and discover the potential of your data.</p>

              <div className="contact-features">
                {[
                  { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Quick Response", desc: "Get a response within 24 hours" },
                  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Custom Solutions", desc: "Tailored to your specific needs" },
                  { icon: "M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z", title: "Proven Results", desc: "Track record of successful projects" }
                ].map((feature, index) => (
                  <div key={index} className="contact-feature">
                    <div className="feature-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d={feature.icon}/>
                      </svg>
                    </div>
                    <div className="feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form-container">
              <form name="contact" method="POST" data-netlify="true" className="contact-form" onSubmit={handleFormSubmit} noValidate>
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: 
                    <input name="bot-field" />
                  </label>
                </p>

                <div className="form-group floating-label">
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    className="form-input" 
                    required 
                    autoComplete="name"
                    placeholder=" "
                    aria-describedby="name-error"
                  />
                  <label htmlFor="name">Your Name *</label>
                  <div className="input-line"></div>
                  <div className="error-message" id="name-error" role="alert"></div>
                </div>

                <div className="form-group floating-label">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-input" 
                    required 
                    autoComplete="email"
                    placeholder=" "
                    aria-describedby="email-error"
                  />
                  <label htmlFor="email">Your Email *</label>
                  <div className="input-line"></div>
                  <div className="error-message" id="email-error" role="alert"></div>
                </div>

                <div className="form-group floating-label">
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    className="form-input" 
                    autoComplete="organization"
                    placeholder=" "
                  />
                  <label htmlFor="company">Company Name</label>
                  <div className="input-line"></div>
                </div>

                <div className="form-group floating-label">
                  <textarea 
                    id="message" 
                    rows="4" 
                    name="message" 
                    className="form-input" 
                    required
                    placeholder=" "
                    aria-describedby="message-error"
                  ></textarea>
                  <label htmlFor="message">Tell us about your project... *</label>
                  <div className="input-line"></div>
                  <div className="error-message" id="message-error" role="alert"></div>
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isFormLoading ? 'loading' : ''}`}
                  aria-describedby="submit-status"
                >
                  <span className="btn-text">Send Message</span>
                  <div className="btn-loader" aria-hidden="true">
                    <div className="loader-circle"></div>
                  </div>
                  <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeWidth="2"/>
                  </svg>
                </button>
                <div id="submit-status" className="sr-only" role="status" aria-live="polite"></div>
              </form>
                {showNotification && (
    <div className="form-notification success-notification">
      <div className="notification-content">
        <div className="notification-icon">
          ✓
        </div>
        <div className="notification-text">
          <strong>Submission received!</strong>
          <p>We will get back to you at our earliest.</p>
        </div>
      </div>
    </div>
  )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" role="contentinfo">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <h3>LuaData</h3>
                <div className="logo-tagline">AI • ML • Data Science</div>
              </div>
              <p>Transforming businesses through intelligent AI, machine learning, and data science solutions that drive real results and sustainable growth.</p>
              <div className="social-links">
                <a href="https://www.linkedin.com/company/luadata/" className="social-link" aria-label="Connect on LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/18vSNmE9Gc/" className="social-link" aria-label="Follow us on Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24h11.495v-9.294H9.691V11.01h3.129V8.414c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.406 24 24 23.406 24 22.676V1.325C24 .593 23.406 0 22.675 0z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Services</h3>
              <ul className="footer-links">
                <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Machine Learning</a></li>
                <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>AI Integration</a></li>
                <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Data Science</a></li>
                <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Smart Apps</a></li>
                <li><a href="#machinelearning" onClick={(e) => handleNavClick(e, '#machinelearning')}>MLOps</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Company</h3>
              <ul className="footer-links">
                <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About Us</a></li>
                <li><a href="#machinelearning" onClick={(e) => handleNavClick(e, '#machinelearning')}>Our Solutions</a></li>
                <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contact Info</h3>
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <a href="mailto:sales@luadata.net">sales@luadata.net</a>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div><a href="tel:+16076087411">+1 (607) 608-7411</a></div>
                <div><a href="tel:+923174592503">+92 (317) 459-2503</a></div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div><span>WorkVille 39 St. Midtown Manhattan, NY</span></div>
                <div><span>Colabs Johar Town, Lahore, Pakistan</span></div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 LuaData. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LuaDataApp;
