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

/* 2. Hero Slideshow / Carousel Carousel */
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

    function calculateSIP() {
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

        // Update displays
        dailySipVal.textContent = "₹" + Math.round(dailyAmount).toLocaleString("en-IN");
        yearsVal.textContent = years + " years";
        totalWealthVal.textContent = formatCurrency(currentBalance);
        totalInvestedVal.textContent = formatCurrency(totalInvested);
        wealthGainedVal.textContent = formatCurrency(wealthGained);

        // Update SIP summary description text
        const endDaily = dailyAmount * Math.pow(1 + stepUp, years - 1);
        const endDailyStr = endDaily >= 1000 ? (endDaily / 1000).toFixed(1) + " K" : Math.round(endDaily);
        sipSummaryText.textContent = `Your SIP: ₹${Math.round(dailyAmount)}/day now → ₹${endDailyStr}/day in Year ${years}`;

        // Update visual chart bars
        barInvestedVal.textContent = formatCurrency(totalInvested);
        barGainedVal.textContent = formatCurrency(currentBalance);

        // Set heights based on ratios
        const maxVal = Math.max(totalInvested, currentBalance);
        if (maxVal > 0) {
            const investedHeight = (totalInvested / maxVal) * 100;
            const gainedHeight = (currentBalance / maxVal) * 100;

            barInvestedEl.style.height = `${Math.max(15, investedHeight)}%`;
            barGainedEl.style.height = `${Math.max(15, gainedHeight)}%`;
        }
    }

    dailySipInput.addEventListener("input", calculateSIP);
    yearsInput.addEventListener("input", calculateSIP);

    // Initial calculation
    calculateSIP();
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

    function calculateCreditLimit() {
        const portfolioValue = parseFloat(portfolioSlider.value);
        const creditLimit = portfolioValue * 0.80; // 80% LTV limit

        portfolioValText.textContent = "₹" + portfolioValue.toLocaleString("en-IN");
        creditLimitText.textContent = formatCurrency(creditLimit);
    }

    portfolioSlider.addEventListener("input", calculateCreditLimit);

    // Initial calculation
    calculateCreditLimit();
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
