// Enhanced JavaScript for TechOrg Website
class TechOrgWebsite {
  constructor() {
    this.isLoaded = false;
    this.scrollPosition = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeComponents();
    this.handleLoading();
  }

  bindEvents() {
    // DOM Content Loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }

    // Window events
    window.addEventListener("load", () => this.onWindowLoad());
    window.addEventListener("scroll", () => this.onScroll(), { passive: true });
    window.addEventListener("resize", () => this.onResize(), { passive: true });

    // Smooth scrolling for navigation links
    this.initSmoothScrolling();

    // Mobile menu toggle
    this.initMobileMenu();

    // Back to top button
    this.initBackToTop();
  }

  onDOMReady() {
    console.log("DOM is ready");
    this.initScrollAnimations();
    this.createParticles();
    this.initTypewriter();
  }

  onWindowLoad() {
    console.log("Window loaded");
    this.isLoaded = true;
    this.hideLoadingScreen();
    this.initParallax();
  }

  onScroll() {
    this.scrollPosition = window.pageYOffset;

    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateScrollEffects();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  onResize() {
    this.updateParticles();
    this.updateParallax();
  }

  // Loading Screen
  handleLoading() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      // Simulate loading time
      setTimeout(() => {
        if (this.isLoaded) {
          this.hideLoadingScreen();
        }
      }, 2000);
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }
  }

  // Smooth Scrolling
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }

  // Mobile Menu
  initMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const menuLinks = document.querySelectorAll(".mobile-nav-links a");

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        menu.classList.toggle("active");
        document.body.style.overflow = menu.classList.contains("active")
          ? "hidden"
          : "";
      });

      // Close menu when clicking on links
      menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.closeMobileMenu();
        });
      });

      // Close menu when clicking outside
      menu.addEventListener("click", (e) => {
        if (e.target === menu) {
          this.closeMobileMenu();
        }
      });
    }
  }

  closeMobileMenu() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");

    if (toggle && menu) {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Back to Top Button
  initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  // Scroll Effects
  updateScrollEffects() {
    this.updateHeader();
    this.updateBackToTop();
    this.updateParallax();
  }

  updateHeader() {
    const header = document.querySelector("header");
    if (header) {
      if (this.scrollPosition > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  }

  updateBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (backToTopBtn) {
      if (this.scrollPosition > 500) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  }

  // Scroll Animations
  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Add stagger effect for cards
          if (
            entry.target.classList.contains("person-card") ||
            entry.target.classList.contains("project-card") ||
            entry.target.classList.contains("blog-card")
          ) {
            this.animateCard(entry.target);
          }
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });
  }

  animateCard(card) {
    const delay = parseFloat(card.dataset.delay) || 0;
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, delay * 1000);
  }

  // Particles System
  createParticles() {
    const particlesContainer = document.getElementById("particles");
    if (!particlesContainer) return;

    const particleCount = window.innerWidth > 768 ? 80 : 40;

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(particlesContainer, i);
    }
  }

  createParticle(container, index) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random positioning
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particle.style.animationDuration = Math.random() * 3 + 5 + "s";

    // Random colors
    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff88"];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    container.appendChild(particle);

    // Remove and recreate particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
        this.createParticle(container, index);
      }
    }, 8000);
  }

  updateParticles() {
    const particlesContainer = document.getElementById("particles");
    if (particlesContainer) {
      // Clear existing particles
      particlesContainer.innerHTML = "";
      // Recreate with new count based on screen size
      this.createParticles();
    }
  }

  // Parallax Effects
  initParallax() {
    this.parallaxElements = document.querySelectorAll(".floating-element");
  }

  updateParallax() {
    if (!this.parallaxElements) return;

    this.parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = -(this.scrollPosition * speed);
      element.style.transform = `translateY(${yPos}px) rotate(${this.scrollPosition * 0.1}deg)`;
    });
  }

  // Typewriter Effect
  initTypewriter() {
    const heroTitle = document.querySelector(".hero-title");
    if (!heroTitle) return;

    const lines = heroTitle.querySelectorAll(".line");
    lines.forEach((line, index) => {
      this.typewriterEffect(line, index * 800);
    });
  }

  typewriterEffect(element, delay) {
    const text = element.textContent;
    element.textContent = "";
    element.style.opacity = "1";

    setTimeout(() => {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, 100);
    }, delay);
  }

  // Enhanced Card Interactions
  initializeComponents() {
    this.initCardHoverEffects();
    this.initProjectFilters();
    this.initFormValidation();
    this.initThemeToggle();
  }

  initCardHoverEffects() {
    const cards = document.querySelectorAll(
      ".person-card, .project-card, .blog-card",
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", (e) => {
        this.addCardGlow(e.target);
      });

      card.addEventListener("mouseleave", (e) => {
        this.removeCardGlow(e.target);
      });

      card.addEventListener("mousemove", (e) => {
        this.updateCardTilt(e);
      });
    });
  }

  addCardGlow(card) {
    card.style.boxShadow = "0 20px 40px rgba(0, 255, 255, 0.3)";
    card.style.transform = "translateY(-10px) scale(1.02)";
  }

  removeCardGlow(card) {
    card.style.boxShadow = "";
    card.style.transform = "";
  }

  updateCardTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  // Project Filters (if needed)
  initProjectFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        this.filterProjects(filter, projectCards);
        this.updateActiveFilter(button, filterButtons);
      });
    });
  }

  filterProjects(filter, cards) {
    cards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  updateActiveFilter(activeButton, allButtons) {
    allButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  // Form Validation (for contact forms)
  initFormValidation() {
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach((input) => {
        input.addEventListener("blur", () => {
          this.validateField(input);
        });
      });
    });
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll("input[required], textarea[required]");

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      message = "This field is required";
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = "Please enter a valid email address";
      }
    }

    this.showFieldValidation(field, isValid, message);
    return isValid;
  }

  showFieldValidation(field, isValid, message) {
    // Remove existing validation
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    field.classList.remove("error", "success");

    if (!isValid) {
      field.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      field.parentNode.appendChild(errorDiv);
    } else if (field.value.trim()) {
      field.classList.add("success");
    }
  }

  // Theme Toggle (optional dark/light mode)
  initThemeToggle() {
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme();
      });

      // Load saved theme
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
      }
    }
  }

  toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  // Utility Functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Performance monitoring
  logPerformance() {
    if (performance.mark) {
      performance.mark("website-interactive");
      const navigationStart = performance.timing.navigationStart;
      const interactive = performance.now();
      console.log(`Website became interactive in ${interactive}ms`);
    }
  }
}

// Enhanced Intersection Observer for better animations
class AnimationController {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.createObservers();
    this.observeElements();
  }

  createObservers() {
    // Fade in observer
    this.observers.set(
      "fadeIn",
      new IntersectionObserver(this.handleFadeIn.bind(this), {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }),
    );

    // Slide in observer
    this.observers.set(
      "slideIn",
      new IntersectionObserver(this.handleSlideIn.bind(this), {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }),
    );

    // Scale observer
    this.observers.set(
      "scale",
      new IntersectionObserver(this.handleScale.bind(this), { threshold: 0.3 }),
    );
  }

  observeElements() {
    // Observe fade-in elements
    document.querySelectorAll(".fade-in").forEach((el) => {
      this.observers.get("fadeIn").observe(el);
    });

    // Observe slide-in elements
    document.querySelectorAll(".slide-in").forEach((el) => {
      this.observers.get("slideIn").observe(el);
    });

    // Observe scale elements
    document.querySelectorAll(".scale-in").forEach((el) => {
      this.observers.get("scale").observe(el);
    });
  }

  handleFadeIn(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        this.observers.get("fadeIn").unobserve(entry.target);
      }
    });
  }

  handleSlideIn(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        this.observers.get("slideIn").unobserve(entry.target);
      }
    });
  }

  handleScale(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        this.observers.get("scale").unobserve(entry.target);
      }
    });
  }
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize main website functionality
  const website = new TechOrgWebsite();

  // Initialize enhanced animations
  const animationController = new AnimationController();

  // Log performance
  window.addEventListener("load", () => {
    website.logPerformance();
  });

  // Handle errors gracefully
  window.addEventListener("error", (e) => {
    console.error("Website error:", e.error);
  });

  // Service worker registration (for PWA capabilities)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
});

// Export for potential module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TechOrgWebsite, AnimationController };
}
