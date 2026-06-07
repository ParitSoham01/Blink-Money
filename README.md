# Blink Money Landing Page Clone

A high-fidelity landing page clone of Blink Money (India's First Liquid Wealth Account). Built using raw HTML, custom CSS, and vanilla JavaScript for maximum performance and interactive fluid animations.

## Features Included
- **Interactive Daily SIP Calculator**: Calculate compound growth with a 10% annual salary step-up and 15% p.a.* target returns.
- **Interactive Loan Against Mutual Funds Slider**: Drag the slider to check your credit limit line (unlocked at up to 80% LTV) in real-time.
- **CSS Infinite Scrolling Marquees**: Seamless scrolling loops for both customer testimonials and co-founder profiles (Rishabh Roy, Abhay Agarwal, Bikram Nath) with auto-pause on hover.
- **Canvas Particle Background**: Interactive neon particles moving in response to mouse movements.
- **Responsive Layout**: Designed for mobile-first viewports, scaling beautifully onto tablets and desktops.
- **Legitimacy Visuals**: Trust section illustrating bank-grade security, long-term wealth compounding, and happy families.
- **Full Legal Disclosures**: Compliant with AMFI ARN (330047), Capline Ventures entity details, CIN, and Thane office address.

---

## How to Run Locally

You can run this project using any local web server. For example, using Python:

```bash
# Python 3
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## How to Deploy (Deploy Ready)

This is a **purely static website** (HTML, CSS, JS, and media files), meaning it requires no server build step and is ready to deploy on any static hosting provider. 

Here are the three best ways to deploy it for free:

### 1. Vercel (Recommended)
Vercel offers automatic SSL, global CDN, and previews for every push.
1. Sign up for a free account at [Vercel](https://vercel.com).
2. Click **New Project** and connect your GitHub account.
3. Import the `Blink-Money` repository.
4. Keep the default settings (Framework Preset: **Other**, Build Command: empty, Output Directory: empty) and click **Deploy**.
5. Vercel will give you a live URL. Every time you run `git push`, your live site will update automatically!

### 2. Netlify
1. Sign up for a free account at [Netlify](https://www.netlify.com).
2. Select **Add new site** -> **Import an existing project**.
3. Choose **GitHub** and authorize Netlify.
4. Select the `Blink-Money` repository.
5. Click **Deploy Site**.

### 3. GitHub Pages
1. Go to your repository page on GitHub.
2. Navigate to **Settings** -> **Pages** (in the left sidebar).
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose **main** branch and folder **/ (root)**. Click **Save**.
5. Your site will be live at `https://<your-username>.github.io/Blink-Money/` in a few minutes.
