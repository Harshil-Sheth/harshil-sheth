# Harshil Sheth - Portfolio Website

A minimalist, high-performance portfolio website showcasing professional experience, projects, and skills. Built with vanilla HTML, CSS, and JavaScript with dark/light theme support.

## Features

- ✨ **Minimalist Design** - Black, white, and grayscale color palette
- 🌓 **Dark/Light Mode** - Theme toggle with localStorage persistence
- 📱 **Fully Responsive** - Mobile-first design, works on all devices
- ⚡ **High Performance** - No external libraries, zero build process
- 📊 **Analytics Integration** - Visitor tracking via shared backend
- 📄 **Resume Downloads** - Tracked PDF downloads
- 📧 **Contact Forms** - Contact and freelance inquiry forms
- ♿ **Accessible** - Semantic HTML, ARIA labels, keyboard navigation

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid
- **Vanilla JavaScript** - ES6+ classes, Fetch API

### Backend (Shared)
- **Node.js + Express** - API server
- **MongoDB** - Analytics and form data storage
- **Mongoose** - ODM for MongoDB

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend server running (from `../backend/`)

### Installation

```bash
# Install dev dependencies
npm install
```

### Development

```bash
# Start dev server (runs on http://localhost:3001)
npm run dev
```

### Backend Setup

The portfolio shares the Job Tracker backend. Ensure it's running:

```bash
# In ../backend/ directory
npm run dev
```

Backend API should be available at `http://localhost:5000`

## Project Structure

```
portfolio/
├── index.html          # Main HTML with all sections
├── styles.css          # Minimalist CSS with theming
├── script.js           # Vanilla JS for interactivity
├── package.json        # Dev server config
├── README.md           # This file
└── AGENTS.md           # AI agent guidelines
```

## Sections

1. **Hero** - Name, title, tagline, social links
2. **About** - Professional summary with metrics
3. **Experience** - Work history timeline
4. **Projects** - Featured project cards
5. **Skills** - Technical skills by category
6. **Contact** - Contact form
7. **Freelance** - Freelance inquiry form

## Backend API Endpoints

All endpoints prefixed with `/api/portfolio`:

### Analytics
- `POST /analytics/visit` - Track page visits
- `POST /analytics/time-spent` - Track session duration
- `POST /analytics/event` - Track custom events

### Resume
- `POST /resume/download` - Download resume PDF (tracked)

### Forms
- `POST /contact` - Submit contact message
- `POST /freelance` - Submit freelance inquiry

### Admin (Protected)
- `GET /admin/analytics` - Get analytics stats
- `GET /admin/contact-messages` - Get contact messages
- `GET /admin/freelance-inquiries` - Get freelance inquiries

## Configuration

Update API base URL in `script.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api/portfolio', // Dev
    // API_BASE_URL: 'https://your-domain.com/api/portfolio', // Production
};
```

## Customization

### Colors (Dark/Light Themes)

Edit CSS variables in `styles.css`:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #0a0a0a;
    /* ... */
}

[data-theme="dark"] {
    --bg-primary: #0a0a0a;
    --text-primary: #ffffff;
    /* ... */
}
```

### Content Updates

All content is in `index.html`. Source data is in:
```
../Data/HARSHIL_SHETH_PROFESSIONAL_PROFILE.md
```

## Performance

- **No build process** - Direct file serving
- **No external libraries** - Pure vanilla JS
- **System fonts only** - Zero web font latency
- **Lazy loading** - Intersection Observer for animations
- **Minimal CSS** - ~500 lines, well-organized

## Browser Support

Modern evergreen browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Deployment

### Static Hosting

Deploy to any static host:

**Netlify/Vercel:**
```bash
# Build command: (none)
# Publish directory: .
```

**GitHub Pages:**
```bash
# Push to gh-pages branch
git subtree push --prefix portfolio origin gh-pages
```

**AWS S3:**
```bash
aws s3 sync . s3://your-bucket --exclude "node_modules/*" --exclude ".git/*"
```

### Production Checklist

1. ✅ Update `CONFIG.API_BASE_URL` in `script.js`
2. ✅ Ensure backend CORS allows production domain
3. ✅ Verify resume PDF path in backend
4. ✅ Test all forms and downloads
5. ✅ Configure backend environment variables

## Data Privacy

**Collected data:**
- Page visits (non-PII: user agent, screen resolution)
- Time spent on page
- Resume download events
- Form submissions (with consent)

**No cookies, no third-party tracking**

## Analytics Schema

### PortfolioVisitor
- page, referrer, userAgent, screenResolution
- ipAddress, country, city
- timeSpent, visitedAt

### ResumeDownload
- userAgent, ipAddress, country, city
- source, downloadedAt

### ContactMessage
- name, email, subject, message
- isRead, isReplied, submittedAt

### FreelanceInquiry
- name, email, company, budget
- projectDescription, status, submittedAt

## Development

### Adding New Sections

1. Add HTML section in `index.html`
2. Add styles in `styles.css`
3. Add JavaScript logic in `script.js` (if needed)
4. Update navigation links

### Adding Backend Features

1. Create/update models in `../backend/models/`
2. Add controller functions in `../backend/controllers/portfolioController.js`
3. Add routes in `../backend/routes/portfolio.js`
4. Update frontend JS to call new endpoints

## Troubleshooting

**Forms not submitting:**
- Check backend server is running
- Verify CORS settings allow portfolio origin
- Check browser console for errors

**Resume download fails:**
- Ensure `../Data/Harshil_Sheth_Resume.pdf` exists
- Check backend controller path resolution

**Theme not persisting:**
- Check localStorage in browser DevTools
- Verify `ThemeManager` class initializes

## License

Private portfolio website. All rights reserved.

## Contact

**Harshil Sheth**
- Email: harshilsheth181888@gmail.com
- LinkedIn: [linkedin.com/in/harshilsheth1888](https://linkedin.com/in/harshilsheth1888)
- GitHub: [github.com/Harshil-Sheth](https://github.com/Harshil-Sheth)

---

**Last Updated:** April 2026
