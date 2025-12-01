# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---------------------
# Love Story Timeline

A beautiful, animated timeline to document your love story with loading animations, hero section, and frosted glass effects.

## 🎨 Features

- ❤️ Animated loading screen with beating heart
- 💕 Hero section with floating hearts
- 📜 Beautiful timeline with frosted glass cards
- 🎭 Smooth scroll animations
- 📱 Fully responsive design
- 🔒 Private content support (keep your stories safe!)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Your Private Content
```bash
# Copy the example file
cp src/milestones.private.js.example src/milestones.private.js

# Edit with your own stories
# (This file is gitignored and won't be committed)
```

### 3. Run the Project
```bash
npm run dev
```

## 📝 Adding Your Stories

Open `src/milestones.private.js` and add your memories:
```javascript
{
  id: 1,
  position: 'left', // or 'right'
  date: 'September 4, 2024',
  title: 'Our First Date',
  description: 'Tell your story here...',
  imageUrl: 'your-image-url-here'
}
```

### Image Options:

1. **Use placeholder images** (default):
```
   https://placehold.co/600x350/ff6b6b/ffffff?text=Your+Text
```

2. **Upload to image hosting**:
   - [Imgur](https://imgur.com)
   - [Cloudinary](https://cloudinary.com)
   - [ImageKit](https://imagekit.io)

3. **Use public folder**:
   - Place images in `/public/images/`
   - Reference as `/images/your-photo.jpg`

## 🎨 Customization

### Colors

Edit `src/App.css` to change colors:
```css
/* Hero gradient */
.hero {
  background: linear-gradient(135deg, #ffffff 0%, #ffe5e5 50%, #ffd4db 100%);
}

/* Card colors */
.timeline-content {
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.35), rgba(255, 160, 180, 0.4));
}
```

### Text Content

Edit in `src/App.jsx`:
```javascript
<h1 className="hero-title">Our Love Story</h1>
<p className="hero-subtitle">Your Names Here</p>
<div className="hero-date">2024 — forever</div>
```

## 📁 Project Structure
```
src/
├── App.jsx                        # Main component
├── App.css                        # All styles & animations
├── milestones.js                  # Data loader (public)
├── milestones.private.js          # YOUR STORIES (gitignored)
└── milestones.private.js.example  # Template
```

## 🔒 Privacy

Your personal content in `milestones.private.js` is automatically gitignored and will never be committed to the repository. Only the template example is public.

## 📦 Build for Production
```bash
npm run build
```

## 💝 Credits

Made with love for preserving beautiful memories.

---

**Note**: Remember to never commit your `milestones.private.js` file. It's already in `.gitignore` for your protection! 🔐