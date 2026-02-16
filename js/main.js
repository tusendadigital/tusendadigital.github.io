// Main JavaScript file - Professional and optimized
(function() {
    'use strict';

    // Utility functions
    const Utils = {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        isElementInViewport: function(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        getScrollTop: function() {
            return window.pageYOffset || document.documentElement.scrollTop;
        }
    };

    // Loading Screen
    const LoadingScreen = {
        init: function() {
            window.addEventListener('load', () => {
                const loading = document.querySelector('.loading');
                if (loading) {
                    loading.style.opacity = '0';
                    setTimeout(() => {
                        loading.style.display = 'none';
                        // Trigger initial animations
                        this.triggerInitialAnimations();
                    }, 500);
                }
            });
        },

        triggerInitialAnimations: function() {
            const animatedElements = document.querySelectorAll('.animate-fadeInUp, .animate-fadeInDown, .animate-fadeInLeft, .animate-fadeInRight');
            animatedElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.animationPlayState = 'running';
                }, index * 100);
            });
        }
    };

    // Smooth Scroll Navigation
    const SmoothScroll = {
        init: function() {
            const links = document.querySelectorAll('a[href^="#"]');
            links.forEach(link => {
                link.addEventListener('click', this.handleClick.bind(this));
            });
        },

        handleClick: function(e) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileNav = document.querySelector('.main-nav');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                }
            }
        }
    };

    // Sticky Navigation
    const StickyNav = {
        init: function() {
            this.nav = document.querySelector('.main-nav-outer');
            if (this.nav) {
                window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 16));
            }
        },

        handleScroll: function() {
            const scrollTop = Utils.getScrollTop();
            if (scrollTop > 100) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        }
    };

    // Mobile Navigation
    const MobileNav = {
        init: function() {
            this.navToggle = document.querySelector('.res-nav_click');
            this.nav = document.querySelector('.main-nav');
            
            if (this.navToggle && this.nav) {
                this.navToggle.addEventListener('click', this.toggleNav.bind(this));
                
                // Close nav when clicking on links
                const navLinks = this.nav.querySelectorAll('a');
                navLinks.forEach(link => {
                    link.addEventListener('click', this.closeNav.bind(this));
                });

                // Close nav when clicking outside
                document.addEventListener('click', (e) => {
                    if (!this.nav.contains(e.target) && !this.navToggle.contains(e.target)) {
                        this.closeNav();
                    }
                });
            }
        },

        toggleNav: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.nav.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = this.navToggle.querySelector('.fa');
            if (this.nav.classList.contains('active')) {
                icon.style.transform = 'rotate(90deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        },

        closeNav: function() {
            this.nav.classList.remove('active');
            const icon = this.navToggle.querySelector('.fa');
            if (icon) {
                icon.style.transform = 'rotate(0deg)';
            }
        }
    };

    // Scroll Animations
    const ScrollAnimations = {
        init: function() {
            this.elements = document.querySelectorAll('.scroll-animate');
            if (this.elements.length > 0) {
                this.checkElements();
                window.addEventListener('scroll', Utils.throttle(this.checkElements.bind(this), 16));
            }
        },

        checkElements: function() {
            this.elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                
                if (rect.top <= windowHeight * 0.8) {
                    element.classList.add('active');
                }
            });
        }
    };

    // Portfolio Filter
    const PortfolioFilter = {
        init: function() {
            this.filterButtons = document.querySelectorAll('.portfolio-nav a');
            this.portfolioItems = document.querySelectorAll('.portfolio-box');
            
            if (this.filterButtons.length > 0) {
                this.filterButtons.forEach(button => {
                    button.addEventListener('click', this.handleFilter.bind(this));
                });
            }
        },

        handleFilter: function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            this.filterButtons.forEach(btn => btn.classList.remove('current'));
            
            // Add active class to clicked button
            e.target.classList.add('current');
            
            // Get filter value
            const filterValue = e.target.getAttribute('data-filter');
            
            // Filter items with smooth animation
            this.portfolioItems.forEach((item, index) => {
                setTimeout(() => {
                    if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8) translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8) translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, index * 50);
            });
        }
    };

    // Reviews Carousel
    
    const ReviewsCarousel = {
        init: function() {
            this.track = document.getElementById('reviewsTrack');
            this.slides = document.querySelectorAll('.review-slide');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.dots = document.querySelectorAll('.dot');
            
            if (!this.track || this.slides.length === 0) return;
            
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            
            this.setupEventListeners();
            this.startAutoPlay();
            this.updateCarousel();
        },

        setupEventListeners: function() {
            // Navigation buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => {
                    this.goToPrevSlide();
                });
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => {
                    this.goToNextSlide();
                });
            }

            // Dots navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });

            // Touch/Swipe support
            this.setupTouchEvents();

            // Pause autoplay on hover
            this.track.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });

            this.track.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        },

        setupTouchEvents: function() {
            let startX = 0;
            let endX = 0;

            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.pauseAutoPlay();
            });

            this.track.addEventListener('touchmove', (e) => {
                e.preventDefault();
            });

            this.track.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;

                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.goToNextSlide();
                    } else {
                        this.goToPrevSlide();
                    }
                }

                this.startAutoPlay();
            });
        },

        goToNextSlide: function() {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateCarousel();
        },

        goToPrevSlide: function() {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateCarousel();
        },

        goToSlide: function(slideIndex) {
            this.currentSlide = slideIndex;
            this.updateCarousel();
        },

        updateCarousel: function() {
            // Update track position
            const translateX = -this.currentSlide * 100;
            this.track.style.transform = `translateX(${translateX}%)`;

            // Update slide visibility
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentSlide);
            });

            // Update dots
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });

            // Add slide animation effects
            this.animateCurrentSlide();
        },

        animateCurrentSlide: function() {
            const currentSlideElement = this.slides[this.currentSlide];
            if (currentSlideElement) {
                const content = currentSlideElement.querySelector('.review-content');
                const stars = currentSlideElement.querySelector('.review-stars');
                const text = currentSlideElement.querySelector('.review-text');
                const author = currentSlideElement.querySelector('.review-author');

                // Reset animations
                [content, stars, text, author].forEach(el => {
                    if (el) {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                    }
                });

                // Apply animations with delays
                setTimeout(() => {
                    if (stars) stars.style.animation = 'fadeInDown 0.6s ease-out forwards';
                }, 100);
                
                setTimeout(() => {
                    if (text) text.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, 200);
                
                setTimeout(() => {
                    if (author) author.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, 300);
            }
        },

        startAutoPlay: function() {
            this.pauseAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.goToNextSlide();
            }, 5000);
        },

        pauseAutoPlay: function() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    };

    // Enhanced Hover Effects
    const HoverEffects = {
        init: function() {
            this.initServiceHovers();
            this.initPortfolioHovers();
            this.initButtonHovers();
            this.initFeatureHovers();
            this.initLogoHovers();
            this.initWhyChooseHovers();
        },

        initServiceHovers: function() {
            const serviceItems = document.querySelectorAll('.service-list');
            serviceItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                    this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        },

        initPortfolioHovers: function() {
            const portfolioItems = document.querySelectorAll('.portfolio-box');
            portfolioItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-15px) scale(1.02)';
                    this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        },

        initButtonHovers: function() {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-4px) scale(1.05)';
                    this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });

                // Add click effect
                button.addEventListener('mousedown', function() {
                    this.style.transform = 'translateY(-2px) scale(1.02)';
                });

                button.addEventListener('mouseup', function() {
                    this.style.transform = 'translateY(-4px) scale(1.05)';
                });
            });
        },

        initFeatureHovers: function() {
            const featureItems = document.querySelectorAll('.feature-item');
            featureItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(10deg)';
                        icon.style.transition = 'all 0.3s ease';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                });
            });
        },

        initLogoHovers: function() {
            const logoItems = document.querySelectorAll('.logo-grid img');
            logoItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.15) rotate(5deg)';
                    this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                });
            });
        },

        initWhyChooseHovers: function() {
            const whyChooseItems = document.querySelectorAll('.why-choose-item');
            whyChooseItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.why-choose-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(360deg)';
                        icon.style.transition = 'all 0.5s ease';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.why-choose-icon');
                    if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                });
            });
        }
    };

    // Parallax Effects
    const ParallaxEffects = {
        init: function() {
            this.elements = document.querySelectorAll('.bg-video, .video-overlay');
            if (this.elements.length > 0) {
                window.addEventListener('scroll', Utils.throttle(this.handleScroll.bind(this), 16));
            }
        },

        handleScroll: function() {
            const scrollTop = Utils.getScrollTop();
            const scrollSpeed = scrollTop * 0.5;
            
            this.elements.forEach(element => {
                element.style.transform = `translateY(${scrollSpeed}px)`;
            });
        }
    };

    // Dynamic Background
    const DynamicBackground = {
        init: function() {
            this.createFloatingElements();
        },

        createFloatingElements: function() {
            const container = document.body;
            const colors = ['#bd88fa', '#007bff', '#e15b5b'];
            
            for (let i = 0; i < 5; i++) {
                const element = document.createElement('div');
                element.style.position = 'fixed';
                element.style.width = Math.random() * 100 + 50 + 'px';
                element.style.height = element.style.width;
                element.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}20, transparent)`;
                element.style.borderRadius = '50%';
                element.style.left = Math.random() * 100 + '%';
                element.style.top = Math.random() * 100 + '%';
                element.style.zIndex = '-10';
                element.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
                element.style.animationDelay = Math.random() * 5 + 's';
                
                container.appendChild(element);
            }
        }
    };

    // Performance Monitor
    const PerformanceMonitor = {
        init: function() {
            this.monitorFPS();
            this.optimizeAnimations();
        },

        monitorFPS: function() {
            let lastTime = performance.now();
            let frames = 0;
            
            const checkFPS = (currentTime) => {
                frames++;
                if (currentTime >= lastTime + 1000) {
                    const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                    if (fps < 30) {
                        this.reduceAnimations();
                    }
                    frames = 0;
                    lastTime = currentTime;
                }
                requestAnimationFrame(checkFPS);
            };
            
            requestAnimationFrame(checkFPS);
        },

        optimizeAnimations: function() {
            // Reduce motion for users who prefer it
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                this.reduceAnimations();
            }
        },

        reduceAnimations: function() {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        LoadingScreen.init();
        SmoothScroll.init();
        StickyNav.init();
        MobileNav.init();
        ScrollAnimations.init();
        PortfolioFilter.init();
        ReviewsCarousel.init();
        HoverEffects.init();
        ParallaxEffects.init();
        DynamicBackground.init();
        PerformanceMonitor.init();
    });

    // Handle window resize
    window.addEventListener('resize', Utils.debounce(function() {
        const mobileNav = document.querySelector('.main-nav');
        if (window.innerWidth > 768 && mobileNav) {
            mobileNav.classList.remove('active');
        }
    }, 250));

    // Handle page visibility
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = '¡Vuelve! - Tusenda Digital';
        } else {
            document.title = 'Tusenda Digital | Desarrollo Web y Marketing para Empresas';
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileNav = document.querySelector('.main-nav');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        }

        // Keyboard navigation for carousel
        const carousel = document.querySelector('.reviews-carousel');
        if (carousel) {
            if (e.key === 'ArrowLeft') {
                const prevBtn = document.getElementById('prevBtn');
                if (prevBtn) prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                const nextBtn = document.getElementById('nextBtn');
                if (nextBtn) nextBtn.click();
            }
        }
    });


    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    // Funcionalidad del carrusel

    document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("reviewsTrack");
    const slides = Array.from(document.querySelectorAll(".review-slide"));
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = Array.from(document.querySelectorAll(".dot"));
  
    if (!track || slides.length === 0) return;
  
    let currentSlide = 0;
    const totalSlides = slides.length;
  
    function setActiveSlide(index) {
      // Seguridad de índice
      currentSlide = (index + totalSlides) % totalSlides;
  
      // Mover carrusel
      const offset = -(100 / totalSlides) * currentSlide;
      track.style.transform = `translateX(${offset}%)`;
  
      // Activar la slide correcta
      slides.forEach((slide, i) =>
        slide.classList.toggle("active", i === currentSlide)
      );
  
      // Activar el dot correspondiente
      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentSlide)
      );
    }
  
    // Navegación por botones
    prevBtn?.addEventListener("click", () => setActiveSlide(currentSlide - 1));
    nextBtn?.addEventListener("click", () => setActiveSlide(currentSlide + 1));

  
    // Navegación por dots
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => setActiveSlide(i))
    );
  
    // Inicializar carrusel
    setActiveSlide(currentSlide);
    });

    document.addEventListener("DOMContentLoaded", () => {
      const faqItems = document.querySelectorAll(".faq-item");

      faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");

        questionBtn.addEventListener("click", () => {
          const isOpen = item.classList.contains("active");

          // Cerrar todos
          faqItems.forEach(i => {
            i.classList.remove("active");
            i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
          });

          // Abrir el actual si estaba cerrado
          if (!isOpen) {
            item.classList.add("active");
            questionBtn.setAttribute("aria-expanded", "true");
          }
        });
      });
    });





    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Swipe right to open menu
        if (deltaX > 50 && Math.abs(deltaY) < 100) {
            const mobileNav = document.querySelector('.main-nav');
            if (mobileNav && !mobileNav.classList.contains('active')) {
                mobileNav.classList.add('active');
            }
        }

        // Swipe left to close menu
        if (deltaX < -50 && Math.abs(deltaY) < 100) {
            const mobileNav = document.querySelector('.main-nav');
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        }
    });

})();