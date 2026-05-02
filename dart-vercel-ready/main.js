// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Update GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0, 0);

// Loader Animation
window.addEventListener('load', () => {
    const loaderTL = gsap.timeline();

    loaderTL.fromTo('.loader-text', 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    .to('.loader-text', 
        { y: -50, opacity: 0, duration: 0.8, ease: 'power4.in', delay: 0.5 }
    )
    .to('#loader', 
        { yPercent: -100, duration: 1, ease: 'power4.inOut' }
    )
    .call(initAnimations); // Start other animations after loader
});

// Animations Initialization
function initAnimations() {
    // Hero Animations
    const heroTL = gsap.timeline();

    heroTL.to('.hero-title .word', {
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out'
    })
    .to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, "-=0.8")
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
    }, "-=0.5");

    // Hero Image Parallax
    gsap.to('.hero-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // About Section Texts
    gsap.from('.about-text .section-title, .about-text .section-desc, .about-text .link-hover', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
        }
    });

    // About Image Reveal
    gsap.from('.about-image-wrapper', {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 60%',
        }
    });

    // About Image Parallax
    gsap.fromTo('.about-img', 
        { yPercent: -12 },
        {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
                trigger: '.about-image-wrapper',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        }
    );

    // Services Cards - Static visibility
    gsap.set('.service-card', { opacity: 1, y: 0 });

    // Infinite Marquee Clones for Testimonials
    document.querySelectorAll('.testimonials-column-inner').forEach(inner => {
        const cards = Array.from(inner.children);
        // Clone the existing 2 sets twice more to have 6 sets total, preventing any empty gaps on ultra-wide screens
        for (let i = 0; i < 2; i++) {
            cards.forEach(card => {
                if (card.nodeType === 1) { // Only clone elements, not text/comments
                    inner.appendChild(card.cloneNode(true));
                }
            });
        }
    });

    // Portfolio Wheel ScrollTrigger
    gsap.to('.wheel3d', {
        rotateY: -360,
        ease: 'none',
        scrollTrigger: {
            trigger: '.portfolio-wheel',
            start: 'top top',
            end: '+=2500', // Controls scroll duration (2500px scroll for 1 orbit)
            scrub: 1,      // Smooth interpolation
            pin: true,     // Pin the section during animation
        }
    });

    // Gallery Text Scale
    gsap.fromTo('.huge-text',
        { scale: 0.8, opacity: 0 },
        {
            scale: 1,
            opacity: 0.8,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.gallery',
                start: 'top 50%',
            }
        }
    );

    // CTA Section
    gsap.from('.cta .section-title, .cta .section-desc, .cta .cta-buttons', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.cta',
            start: 'top 70%',
        }
    });

    // Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .btn-solid, .btn-primary');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            
            // Magnetic effect for buttons
            if (el.classList.contains('btn-solid') || el.classList.contains('btn-primary')) {
                const rect = el.getBoundingClientRect();
                const btnX = rect.left + rect.width / 2;
                const btnY = rect.top + rect.height / 2;
                
                el.addEventListener('mousemove', (e) => {
                    const diffX = e.clientX - btnX;
                    const diffY = e.clientY - btnY;
                    gsap.to(el, { x: diffX * 0.2, y: diffY * 0.2, duration: 0.4, ease: "power2.out" });
                });
            }
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            if (el.classList.contains('btn-solid') || el.classList.contains('btn-primary')) {
                gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
                // Clean up mousemove to avoid glitches
                el.onmousemove = null;
            }
        });
    });
}
