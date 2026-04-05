# AGENTS.md — Portfolio (Static Site)

This document guides AI coding agents and human contributors working on the **Portfolio** static website for Harshil Sheth.

---

## 1. Overview

The portfolio is a **minimalist, performant static website** showcasing professional experience, projects, and skills. It emphasizes clean design with only black/white/grayscale colors and supports dark/light themes.

**Key Features:**
- Static HTML/CSS/JavaScript (no build process required)
- Dark/light mode with localStorage persistence
- Fully responsive mobile-first design
- Backend integration for analytics, resume downloads, and form submissions
- Zero external libraries (vanilla JS only)
- Fast load times, minimal dependencies

---

## 2. File Structure

```
portfolio/
├── index.html           # Main HTML structure with all sections
├── styles.css           # Minimalist CSS with CSS variables for theming
├── script.js            # Vanilla JS for interactivity and backend integration
├── package.json         # Dev server only (http-server)
└── AGENTS.md           # This file
```

**No build artifacts**: The site is served directly as static files.

---

## 3. Design Philosophy

### 3.1 Minimalism

- **Colors**: Only white, black, and grayscale shades (no vibrant colors)
- **Typography**: System fonts (`-apple-system`, `Segoe UI`, etc.) for zero latency
- **Spacing**: Generous whitespace, clear visual hierarchy
- **Animations**: Subtle, performance-optimized (CSS transitions only)

### 3.2 Dark/Light Mode

- **Implementation**: CSS variables (`--bg-primary`, `--text-primary`, etc.)
- **Toggle**: Theme persisted in `localStorage`, applied via `data-theme` attribute
- **Defaults**: Light mode by default

### 3.3 Responsiveness

- **Breakpoints**: 
  - Desktop: > 968px
  - Tablet: 768px - 968px
  - Mobile: < 768px
  - Small mobile: < 480px
- **Mobile-first**: All sections fully usable on mobile devices
- **Navigation**: Hamburger menu on mobile, horizontal menu on desktop

---

## 4. Sections

The portfolio contains these sections in order:

1. **Hero**: Name, title, tagline, CTA buttons, social links
2. **About**: Professional summary with animated metrics counters
3. **Experience**: Timeline view of work history and education
4. **Projects**: Grid of featured projects with tech stacks
5. **Skills**: Categorized technical skills
6. **Contact**: Contact form with validation
7. **Freelance**: Freelance services and project inquiry form

---

## 5. Backend Integration

The portfolio shares the **Job Tracker backend** for:

### 5.1 Analytics

- **Page visits**: Track visitor metadata (page, referrer, user agent, screen resolution)
- **Time spent**: Track session duration via `beforeunload` event
- **Events**: Custom event tracking (resume downloads, form submissions)

**Models**: `PortfolioVisitor`, `PortfolioEvent`  
**Routes**: `/api/portfolio/analytics/*`

### 5.2 Resume Downloads

- **Tracking**: Log each download with metadata
- **File**: Serves `Data/Harshil_Sheth_Resume.pdf`
- **Response**: Blob download via `res.download()`

**Model**: `ResumeDownload`  
**Route**: `POST /api/portfolio/resume/download`

### 5.3 Contact Form

- **Validation**: Client-side and server-side email/required field validation
- **Storage**: Saves to MongoDB for admin review
- **Response**: Success/error status displayed in UI

**Model**: `ContactMessage`  
**Route**: `POST /api/portfolio/contact`

### 5.4 Freelance Inquiry

- **Fields**: Name, email, company, budget, project description
- **Validation**: Required fields + email format
- **Storage**: Saves with status tracking (`new`, `reviewed`, etc.)

**Model**: `FreelanceInquiry`  
**Route**: `POST /api/portfolio/freelance`

---

## 6. Technical Stack

### 6.1 Frontend

- **HTML5**: Semantic markup, accessibility attributes
- **CSS3**: Custom properties, Flexbox, Grid, media queries
- **JavaScript (ES6+)**: Vanilla JS classes, async/await, Fetch API

### 6.2 Backend (Shared)

- **Framework**: Express.js (Node.js)
- **Database**: MongoDB via Mongoose
- **Models**: Portfolio-specific collections prefixed with `portfolio_`

### 6.3 Development

- **Dev Server**: `http-server` on port 3001
- **CORS**: Backend allows `localhost:3001` in dev mode
- **No Build**: Direct file serving (production-ready as-is)

---

## 7. Agent Behavior

When working on the portfolio:

1. **Preserve minimalism**: Do not add colors, libraries, or frameworks unless explicitly requested
2. **Respect design patterns**: Follow existing CSS variable naming, class conventions
3. **Backend integration**: API calls use `CONFIG.API_BASE_URL` from `script.js`
4. **Mobile-first**: Test responsive behavior at all breakpoints
5. **Performance**: Avoid heavy libraries; prefer vanilla JS and CSS
6. **Accessibility**: Maintain ARIA labels, semantic HTML, keyboard navigation

---

## 8. Development Workflow

### 8.1 Running Locally

```bash
# Terminal 1: Start backend (from backend/)
cd backend
npm run dev

# Terminal 2: Start portfolio dev server (from portfolio/)
cd portfolio
npm run dev
```

Portfolio will be available at `http://localhost:3001`  
Backend API at `http://localhost:5000`

### 8.2 Testing Backend Integration

1. Open browser DevTools → Network tab
2. Interact with forms, download resume, toggle pages
3. Verify API calls to `/api/portfolio/*` succeed
4. Check MongoDB collections: `portfolio_visitors`, `portfolio_contact_messages`, etc.

### 8.3 Theme Testing

- Toggle dark/light mode
- Verify localStorage persistence (refresh page)
- Check contrast ratios in both themes

---

## 9. Data Source

All content is sourced from:

```
Data/HARSHIL_SHETH_PROFESSIONAL_PROFILE.md
```

**Update process**:
1. Edit professional profile markdown
2. Manually update `index.html` with new content
3. No automated sync (intentional for full control)

---

## 10. Future Enhancements (Not Implemented)

Potential extensions (require user approval):

- Email notifications for contact/freelance submissions (via Nodemailer)
- Admin dashboard for viewing analytics/messages
- Blog section with markdown rendering
- Project detail pages
- Testimonials section
- Multi-language support

---

## 11. Performance Checklist

- ✅ No external CSS frameworks (no Tailwind, Bootstrap)
- ✅ No JavaScript libraries (no jQuery, React)
- ✅ System fonts only (no web fonts)
- ✅ Inline SVG icons (no icon libraries)
- ✅ CSS variables for theming (no SCSS compilation)
- ✅ Vanilla JS classes (no transpilation needed)
- ✅ Lazy-loaded sections via Intersection Observer
- ✅ Optimized images (when added, use modern formats)

---

## 12. Browser Support

**Target**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

**Features requiring polyfills** (not included):
- Intersection Observer (for scroll animations)
- CSS Grid/Flexbox (modern browsers only)

Graceful degradation on older browsers.

---

## 13. Security Considerations

- **Input validation**: Client-side and server-side
- **XSS prevention**: No `innerHTML` usage with user input
- **CORS**: Backend restricts origins
- **Rate limiting**: Backend should implement (TODO in production)
- **Email validation**: Regex pattern on client and server

---

## 14. Analytics & Privacy

**Data collected**:
- Page visits (non-PII: user agent, screen resolution, referrer)
- Time spent on page
- Resume download events
- Form submissions (with user consent via submission)

**No tracking cookies**: Uses MongoDB backend only  
**No third-party analytics**: Self-hosted analytics only

---

## 15. Deployment (Production)

**Static hosting options**:
1. GitHub Pages
2. Netlify
3. Vercel
4. AWS S3 + CloudFront
5. Traditional web server (nginx/Apache)

**Backend**:
- Deploy backend separately (Heroku, Railway, AWS EC2)
- Update `CONFIG.API_BASE_URL` in `script.js` to production backend URL
- Ensure CORS allows production portfolio domain

**Steps**:
1. Update API endpoint in `script.js`
2. Upload `index.html`, `styles.css`, `script.js` to static host
3. Verify resume PDF path in backend controller
4. Test all forms and downloads in production

---

## 16. Maintenance

- **Content updates**: Edit `index.html` directly
- **Styling changes**: Edit `styles.css` (CSS variables preferred)
- **Backend changes**: See `backend/AGENTS.md` and `backend/routes/portfolio.js`
- **Analytics review**: Query MongoDB collections or build admin dashboard

---

## 17. Troubleshooting

**Issue**: Forms not submitting  
**Solution**: Check backend server running, CORS allowed, network tab for errors

**Issue**: Resume download fails  
**Solution**: Verify `Data/Harshil_Sheth_Resume.pdf` exists, check backend controller path

**Issue**: Theme not persisting  
**Solution**: Check localStorage in DevTools, ensure `ThemeManager` initializes

**Issue**: Mobile menu not working  
**Solution**: Check `Navigation` class event listeners, viewport width

---

## 18. Code Style

- **HTML**: 2-space indentation, semantic tags, lowercase attributes
- **CSS**: 2-space indentation, grouped by section, alphabetical properties
- **JavaScript**: ES6+ classes, camelCase naming, async/await preferred

---

## 19. Version History

- **v1.0** (April 2026): Initial release with all core sections and backend integration

---

**For parent project context, see**: [../AGENTS.md](../AGENTS.md)  
**For backend integration details, see**: [../backend/AGENTS.md](../backend/AGENTS.md)
