/* -------------------------------------------------------------------------
   BlinkMoney Clone JavaScript
   ------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initHeroCarousel();
    initSipCalculator();
    initAudienceTabs();
    initLamfCalculator();
    initTestimonialsAutoscroll();
    initFaqAccordion();
    
    // Premium UI Enhancements
    initParticlesBackground();
    initScrollReveal();
    init3dTilt();
});

/* 1. Mobile Navigation Menu Toggle */
function initMobileNav() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
    const mobileLinks = document.querySelectorAll(".mobile-nav-item, .mobile-nav-overlay .btn");

    if (!menuToggle || !mobileNavOverlay) return;

    menuToggle.addEventListener("click", () => {
        const expanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", !expanded);
        menuToggle.classList.toggle("active");
        mobileNavOverlay.classList.toggle("active");
        document.body.style.overflow = expanded ? "" : "hidden";
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.classList.remove("active");
            mobileNavOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    });
}

/* 2. Hero Slideshow / Carousel */
function initHeroCarousel() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot-indicator");
    let currentSlide = 0;
    let slideInterval;

    if (!slides.length || !dots.length) return;

    function goToSlide(index) {
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 6500);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });

    startAutoSlide();
}

/* Helper: Animate numeric displays smoothly */
function animateValue(element, start, end, duration, formatFn) {
    if (!element) return;
    const startRange = start;
    const endRange = end;
    let startTimestamp = null;
    
    // Add glowing pulse highlight
    element.classList.add("pulse-highlight");
    setTimeout(() => element.classList.remove("pulse-highlight"), 400);

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const val = progress * (endRange - startRange) + startRange;
        element.textContent = formatFn(val);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/* 3. Daily SIP Calculator with 10% Step-Up and 15% p.a. compounding */
function initSipCalculator() {
    const dailySipInput = document.getElementById("daily-sip");
    const yearsInput = document.getElementById("years");
    
    const dailySipVal = document.getElementById("daily-sip-val");
    const yearsVal = document.getElementById("years-val");
    const totalWealthVal = document.getElementById("total-wealth");
    const totalInvestedVal = document.getElementById("total-invested");
    const wealthGainedVal = document.getElementById("wealth-gained");
    const sipSummaryText = document.getElementById("sip-summary-text");

    const barInvestedEl = document.getElementById("bar-invested-el");
    const barGainedEl = document.getElementById("bar-gained-el");
    const barInvestedVal = document.getElementById("bar-invested-val");
    const barGainedVal = document.getElementById("bar-gained-val");

    if (!dailySipInput || !yearsInput) return;

    // Track previous values for scroll-up ticker animations
    let prevWealth = 0;
    let prevInvested = 0;
    let prevGained = 0;

    function formatCurrency(num) {
        if (num >= 10000000) { // Crore
            return "₹" + (num / 10000000).toFixed(2) + " Cr";
        } else if (num >= 100000) { // Lakh
            return "₹" + (num / 100000).toFixed(2) + " L";
        } else if (num >= 1000) { // Thousand
            return "₹" + (num / 1000).toFixed(1) + " K";
        } else {
            return "₹" + Math.round(num);
        }
    }

    function calculateSIP(isInitial = false) {
        const dailyAmount = parseFloat(dailySipInput.value);
        const years = parseInt(yearsInput.value);
        const stepUp = 0.10; // 10% annual salary step-up
        const annualReturnRate = 0.15; // 15% p.a.
        const monthlyRate = annualReturnRate / 12;

        let totalInvested = 0;
        let currentBalance = 0;

        // Perform month-by-month calculation to account for daily deposits and compounding
        for (let y = 0; y < years; y++) {
            // Daily SIP increases by 10% every year
            const currentDaily = dailyAmount * Math.pow(1 + stepUp, y);
            const currentMonthlySip = currentDaily * 365 / 12;

            for (let m = 0; m < 12; m++) {
                currentBalance = (currentBalance + currentMonthlySip) * (1 + monthlyRate);
                totalInvested += currentMonthlySip;
            }
        }

        const wealthGained = Math.max(0, currentBalance - totalInvested);

        // Update basic text nodes
        dailySipVal.textContent = "₹" + Math.round(dailyAmount).toLocaleString("en-IN");
        yearsVal.textContent = years + " years";

        // Update SIP summary description text
        const endDaily = dailyAmount * Math.pow(1 + stepUp, years - 1);
        const endDailyStr = endDaily >= 1000 ? (endDaily / 1000).toFixed(1) + " K" : Math.round(endDaily);
        sipSummaryText.textContent = `Your SIP: ₹${Math.round(dailyAmount)}/day now → ₹${endDailyStr}/day in Year ${years}`;

        // Animate key numbers smoothly
        if (isInitial) {
            totalWealthVal.textContent = formatCurrency(currentBalance);
            totalInvestedVal.textContent = formatCurrency(totalInvested);
            wealthGainedVal.textContent = formatCurrency(wealthGained);
            
            barInvestedVal.textContent = formatCurrency(totalInvested);
            barGainedVal.textContent = formatCurrency(currentBalance);
        } else {
            animateValue(totalWealthVal, prevWealth, currentBalance, 250, formatCurrency);
            animateValue(totalInvestedVal, prevInvested, totalInvested, 250, formatCurrency);
            animateValue(wealthGainedVal, prevGained, wealthGained, 250, formatCurrency);
            
            animateValue(barInvestedVal, prevInvested, totalInvested, 250, formatCurrency);
            animateValue(barGainedVal, prevWealth, currentBalance, 250, formatCurrency);
        }

        prevWealth = currentBalance;
        prevInvested = totalInvested;
        prevGained = wealthGained;

        // Set heights based on ratios
        const maxVal = Math.max(totalInvested, currentBalance);
        if (maxVal > 0) {
            const investedHeight = (totalInvested / maxVal) * 100;
            const gainedHeight = (currentBalance / maxVal) * 100;

            barInvestedEl.style.height = `${Math.max(15, investedHeight)}%`;
            barGainedEl.style.height = `${Math.max(15, gainedHeight)}%`;
        }
    }

    dailySipInput.addEventListener("input", () => calculateSIP(false));
    yearsInput.addEventListener("input", () => calculateSIP(false));

    // Initial calculation (skip transition on page load)
    calculateSIP(true);
}

/* 4. Audience Segment Tabs */
function initAudienceTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    if (!tabBtns.length || !tabPanes.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Deactivate all
            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            // Activate current
            btn.classList.add("active");
            const activePane = document.getElementById(targetTab);
            if (activePane) {
                activePane.classList.add("active");
            }
        });
    });
}

/* 5. Loan Against Mutual Funds (LAMF) Calculator */
function initLamfCalculator() {
    const portfolioSlider = document.getElementById("portfolio-slider");
    const portfolioValText = document.getElementById("portfolio-val");
    const creditLimitText = document.getElementById("credit-limit-val");

    if (!portfolioSlider || !portfolioValText || !creditLimitText) return;

    let prevLimit = 0;

    function formatCurrency(num) {
        if (num >= 10000000) { // Crore
            return "₹" + (num / 10000000).toFixed(2) + " Cr";
        } else if (num >= 100000) { // Lakh
            return "₹" + (num / 100000).toFixed(2) + " L";
        } else if (num >= 1000) { // Thousand
            return "₹" + (num / 1000).toFixed(1) + " K";
        } else {
            return "₹" + num;
        }
    }

    function calculateCreditLimit(isInitial = false) {
        const portfolioValue = parseFloat(portfolioSlider.value);
        const creditLimit = portfolioValue * 0.80; // 80% LTV limit

        portfolioValText.textContent = "₹" + portfolioValue.toLocaleString("en-IN");
        
        if (isInitial) {
            creditLimitText.textContent = formatCurrency(creditLimit);
        } else {
            animateValue(creditLimitText, prevLimit, creditLimit, 250, formatCurrency);
        }

        prevLimit = creditLimit;
    }

    portfolioSlider.addEventListener("input", () => calculateCreditLimit(false));

    // Initial calculation
    calculateCreditLimit(true);
}

/* 6. Testimonials Autoscroll & Hover Pause */
function initTestimonialsAutoscroll() {
    const track = document.getElementById("testimonials-track-el");
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;

    // Manual Drag/Swipe support
    track.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        clearInterval(autoScrollInterval);
    });

    track.addEventListener("mouseleave", () => {
        isDown = false;
        startAutoscroll();
    });

    track.addEventListener("mouseup", () => {
        isDown = false;
        startAutoscroll();
    });

    track.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll speed
        track.scrollLeft = scrollLeft - walk;
    });

    // Auto-Scroll Loop
    function startAutoscroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (isDown) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 1) {
                // Smooth loop back to start
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: 240, behavior: "smooth" });
            }
        }, 5000);
    }

    // Touch events for mobile
    track.addEventListener("touchstart", () => {
        clearInterval(autoScrollInterval);
    });

    track.addEventListener("touchend", () => {
        startAutoscroll();
    });

    startAutoscroll();
}

/* 7. FAQ Accordion Expanding panels */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const item = question.parentElement;
            const answer = item.querySelector(".faq-answer");
            const isActive = item.classList.contains("active");

            // Close all open FAQs
            document.querySelectorAll(".faq-item").forEach(i => {
                i.classList.remove("active");
                const ans = i.querySelector(".faq-answer");
                if (ans) ans.style.maxHeight = null;
            });

            // Toggle current FAQ
            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

/* -------------------------------------------------------------------------
   Premium Enhancements Implementations
   ------------------------------------------------------------------------- */

/* 8. HTML5 Canvas Particles Background */
function initParticlesBackground() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let particlesArray = [];
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = {
        x: null,
        y: null,
        radius: 120
    };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check boundary collisions
            if (this.x > width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact (push away)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < width - this.size * 10) {
                        this.x += 3;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 3;
                    }
                    if (mouse.y < this.y && this.y < height - this.size * 10) {
                        this.y += 3;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 3;
                    }
                }
            }

            // Move particle
            this.x += this.directionX * 0.8;
            this.y += this.directionY * 0.8;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = Math.floor((width * height) / 18000);
        // Cap particles for performance
        numberOfParticles = Math.min(numberOfParticles, 60);

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.6) - 0.3;
            let directionY = (Math.random() * 0.6) - 0.3;
            // Neon Green color matching our accent
            let color = "rgba(159, 232, 112, 0.22)";

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Connect particles close to each other
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    opacityValue = 1 - (distance / 110);
                    ctx.strokeStyle = `rgba(159, 232, 112, ${opacityValue * 0.12})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* 9. Scroll Reveal triggers */
function initScrollReveal() {
    const sections = document.querySelectorAll("section");
    const cards = document.querySelectorAll(".feature-card, .testimonial-card, .comp-box, .calculator-card, .calculator-results-card, .step-card, .table-container, .faq-item");

    // Add reveal class to all elements dynamically
    sections.forEach(s => s.classList.add("reveal"));
    cards.forEach(c => c.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active-reveal");
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    sections.forEach(s => revealObserver.observe(s));
    cards.forEach(c => revealObserver.observe(c));
}

/* 10. 3D Card Hover Tilt Interaction */
function init3dTilt() {
    const tiltElements = document.querySelectorAll(".feature-card, .testimonial-card, .comp-box, .calculator-card, .calculator-results-card, .cta-card");
    
    // Add tilt-card class dynamically
    tiltElements.forEach(el => el.classList.add("tilt-card"));

    tiltElements.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Limit tilt angles (max 10 degrees)
            const rotateX = -(y / (rect.height / 2)) * 10;
            const rotateY = (x / (rect.width / 2)) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });
}
