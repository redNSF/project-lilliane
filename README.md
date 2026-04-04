# Motionbrief 🎬 — The Intelligent Motion Design Briefing Engine

**Motionbrief** is a high-end, production-ready **Script-to-Motion Design Brief Generator**. Built with **Next.js 16**, **Tailwind CSS 4**, **Framer Motion**, and powered by **LLaMA 3.3 (via Groq)**, it transforms raw ideas into professional creative roadmaps in seconds.

Designed for motion designers, creative directors, and motion studios, Motionbrief streamlines pre-production by generating timecodes, scene breakdowns, color palettes, typography suggestions, and asset lists.

---

## 💎 Premium Features

### 🎙️ AI Voice-to-Script Terminal
Stop typing, start directing. Our custom **Premium Voice Input** features real-time, high-accuracy Web Speech transcription with an elegant, neon-glow interface. Speak your vision, and watch it materialize instantly.

### 📋 Storyboard Mode (Production Doc)
Switch from gorgeous visual cards to a strict, minimalist **Production Document** view. It generates a perfectly formatted B&W shot list with shot numbers, timecodes, and technical specs—ready for the studio floor.

### 📄 Pro PDF Export
Export your briefing documents as crisp, vector-quality PDFs. Optimized with custom print-CSS to ensure your production documents look professional on paper or digital tablets.

### 🎨 Automated Moodboarding & Type
- **1-Click Moodboards:** Every scene automatically generates a **Coolors.co** palette and a targeted **Pinterest** reference search.
- **Font Pairing Suggestions:** AI-suggested Google Font combinations (e.g., *Inter + Playfair*) tailored to the emotional tone of each specific scene.

### ⚡ Style Presets
Jumpstart your workflow with professional script templates for **30s Promo Ads**, **YouTube Intros**, and **Instagram Reels**. One click fills the terminal and selects the ideal motion style.

### ☁️ Cloud Storage & Secure Sharing
Share your generated briefs instantly with persistent cloud storage powered by **Neon Postgres**. You can now **password-protect** your shared briefs with client-side encryption, ensuring your creative visions remain private until ready for reveal.

---

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **AI Integration:** Groq SDK (LLaMA 3.3 70B)
- **Database:** Neon Serverless Postgres
- **Security:** bcryptjs (for script protection)
- **Icons:** Lucide React
- **Voice Logic:** Web Speech API

---

## 🛠️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/redNSF/project-lilliane.git
   cd project-lilliane
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   DATABASE_URL=your_neon_postgres_url_here
   ```
   *Note: You can get a free Groq API key from the [Groq Console](https://console.groq.com/keys).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start generating.

---
*Transforming scripts into visual roadmaps, one scene at a time.*
