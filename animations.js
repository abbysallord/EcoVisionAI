// GSAP and Anime.js Animation Controller
class AnimationController {
    constructor() {
        this.initGSAP();
        this.initNavbar();
        this.initScrollAnimations();
        this.initButtonAnimations();
        this.initFormAnimations();
        this.initMobileMenu();
        this.initCounterAnimations();
        this.initTechAnimations();
    }

    initGSAP() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Set default animation settings
        gsap.defaults({
            duration: 1,
            ease: "power2.out"
        });

        // Refresh ScrollTrigger on window resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
    }

    initNavbar() {
        // Navbar slide-in animation on page load
        const navbar = document.getElementById('navbar');
        
        // Initial state
        gsap.set(navbar, { y: -100, opacity: 0 });
        
        // Animate navbar in after page load
        gsap.to(navbar, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.5,
            onComplete: () => {
                navbar.classList.add('active');
            }
        });

        // Navbar hide/show on scroll with GSAP ScrollTrigger[29][35][38]
        let lastScroll = 0;

        ScrollTrigger.create({
            start: "top -80",
            end: 99999,
            onUpdate: (self) => {
                const currentScroll = self.scroll();
                
                if (currentScroll > lastScroll && currentScroll > 150) {
                    // Scrolling down - hide navbar
                    gsap.to(navbar, {
                        y: -100,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                } else if (currentScroll < lastScroll) {
                    // Scrolling up - show navbar
                    gsap.to(navbar, {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
                
                lastScroll = currentScroll;
            }
        });

        // Active link highlighting based on scroll position[32]
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (correspondingLink) {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 100px",
                    end: "bottom 100px",
                    onToggle: (self) => {
                        if (self.isActive) {
                            navLinks.forEach(link => link.classList.remove('active'));
                            correspondingLink.classList.add('active');
                        }
                    }
                });
            }
        });
    }

    initScrollAnimations() {
        // Fade-in animations for elements with .fade-in-element class[16][44][47]
        const fadeElements = document.querySelectorAll('.fade-in-element');
        
        fadeElements.forEach((element, index) => {
            const delay = element.dataset.delay ? parseFloat(element.dataset.delay) / 1000 : 0;
            
            gsap.fromTo(element, 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: delay,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Staggered animations for service cards using GSAP[44]
        const serviceCards = document.querySelectorAll('.service-card');
        
        gsap.fromTo(serviceCards,
            {
                opacity: 0,
                y: 80,
                scale: 0.8
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".services-grid",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Testimonial cards staggered animation[42]
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        gsap.fromTo(testimonialCards,
            {
                opacity: 0,
                y: 60,
                rotationX: -15
            },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".testimonials-grid",
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Hero elements animation sequence
        const heroTimeline = gsap.timeline({ delay: 1 });
        
        heroTimeline
            .fromTo('.hero-title .title-line', 
                { opacity: 0, y: 100 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            )
            .fromTo('.hero-subtitle', 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.5"
            )
            .fromTo('.cta-container', 
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.3"
            )
            .fromTo('.scroll-indicator', 
                { opacity: 0 },
                { opacity: 0.7, duration: 0.5 },
                "-=0.2"
            );
    }

    initButtonAnimations() {
        // Enhanced button hover animations using Anime.js[2][8][11]
        const pulseButtons = document.querySelectorAll('.pulse-btn');
        
        pulseButtons.forEach(button => {
            let hoverAnimation = null;
            let isAnimating = false;

            button.addEventListener('mouseenter', () => {
                if (isAnimating) return;
                isAnimating = true;

                // Kill any existing animation
                if (hoverAnimation) hoverAnimation.pause();

                hoverAnimation = anime({
                    targets: button,
                    scale: [1, 1.05, 1.02],
                    translateY: [0, -3, -2],
                    boxShadow: [
                        '0 4px 15px rgba(34, 197, 94, 0.3)',
                        '0 8px 25px rgba(34, 197, 94, 0.4)',
                        '0 6px 20px rgba(34, 197, 94, 0.35)'
                    ],
                    duration: 600,
                    easing: 'easeOutElastic(1, .6)',
                    complete: () => {
                        isAnimating = false;
                    }
                });

                // Add ripple effect
                this.createRipple(button, event);
            });

            button.addEventListener('mouseleave', () => {
                if (hoverAnimation) hoverAnimation.pause();

                anime({
                    targets: button,
                    scale: 1,
                    translateY: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                isAnimating = false;
            });

            // Click animation
            button.addEventListener('click', (e) => {
                this.createClickEffect(button, e);
            });
        });

        // CTA buttons additional effects
        const ctaButtons = document.querySelectorAll('.cta-primary, .cta-secondary');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                anime({
                    targets: button,
                    scale: [1, 0.95, 1],
                    duration: 200,
                    easing: 'easeInOutQuad'
                });
            });
        });
    }

    createRipple(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        anime({
            targets: ripple,
            scale: 2,
            opacity: [0.3, 0],
            duration: 600,
            easing: 'easeOutQuad',
            complete: () => ripple.remove()
        });
    }

    createClickEffect(button, event) {
        // Create multiple particles for click effect
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            const rect = button.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            particle.style.left = startX + 'px';
            particle.style.top = startY + 'px';
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            
            anime({
                targets: particle,
                translateX: Math.cos(angle) * distance,
                translateY: Math.sin(angle) * distance,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 800,
                easing: 'easeOutQuad',
                complete: () => particle.remove()
            });
        }
    }

    initFormAnimations() {
        const form = document.getElementById('contact-form');
        const formInputs = document.querySelectorAll('.form-input');

        // Form input focus animations
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                anime({
                    targets: input,
                    scale: [1, 1.02, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });

            input.addEventListener('blur', () => {
                anime({
                    targets: input,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });

        // Form submission animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Button loading animation
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            anime({
                targets: submitBtn,
                rotate: [0, 360],
                duration: 1000,
                easing: 'easeInOutQuad',
                complete: () => {
                    // Simulate form submission
                    setTimeout(() => {
                        submitBtn.textContent = '✓ Message Sent!';
                        submitBtn.style.background = 'linear-gradient(45deg, #22c55e, #16a34a)';
                        
                        // Reset form
                        setTimeout(() => {
                            form.reset();
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            submitBtn.style.background = '';
                        }, 2000);
                    }, 1000);
                }
            });
        });
    }

    initMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate menu items when opening
            if (navMenu.classList.contains('active')) {
                const menuItems = navMenu.querySelectorAll('.nav-item');
                
                anime({
                    targets: menuItems,
                    translateY: [-20, 0],
                    opacity: [0, 1],
                    duration: 300,
                    delay: anime.stagger(100),
                    easing: 'easeOutQuad'
                });
            }
        });

        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    initCounterAnimations() {
        // Animated counters for statistics[44]
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 80%",
                onEnter: () => {
                    anime({
                        targets: stat,
                        innerHTML: [0, target],
                        duration: 2000,
                        round: 1,
                        easing: 'easeOutQuad',
                        update: function(anim) {
                            stat.innerHTML = Math.round(anim.animatables[0].target.innerHTML);
                        }
                    });
                }
            });
        });
    }

    initTechAnimations() {
        // AI brain node animations
        const brainNodes = document.querySelectorAll('.brain-node');
        
        // Staggered node activation
        gsap.fromTo(brainNodes,
            {
                scale: 0,
                opacity: 0
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".ai-brain",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Continuous node pulsing with Anime.js
        ScrollTrigger.create({
            trigger: ".ai-brain",
            start: "top 70%",
            onEnter: () => {
                brainNodes.forEach((node, index) => {
                    anime({
                        targets: node,
                        scale: [1, 1.2, 1],
                        duration: 2000 + (index * 200),
                        loop: true,
                        easing: 'easeInOutQuad',
                        delay: index * 400
                    });
                });
            }
        });

        // Connection lines animation (if you add SVG connections)
        const connections = document.querySelectorAll('.brain-connection');
        if (connections.length > 0) {
            gsap.fromTo(connections,
                {
                    strokeDasharray: "0 100",
                    opacity: 0
                },
                {
                    strokeDasharray: "100 0",
                    opacity: 0.6,
                    duration: 2,
                    stagger: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".ai-brain",
                        start: "top 60%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        }
    });
});

// Parallax effect for hero waves
gsap.to(".wave-1", {
    yPercent: -50,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

gsap.to(".wave-2", {
    yPercent: -30,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

gsap.to(".wave-3", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Page loading animation
window.addEventListener('load', () => {
    // Hide any loading screen if present
    const loader = document.querySelector('.loader');
    if (loader) {
        anime({
            targets: loader,
            opacity: 0,
            duration: 500,
            easing: 'easeOutQuad',
            complete: () => loader.remove()
        });
    }
    
    // Trigger initial animations
    ScrollTrigger.refresh();
});