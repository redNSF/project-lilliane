# Motionbrief 🎬

**Motionbrief** is a powerful **Script-to-Motion Design Brief Generator** built with Next.js and powered by Groq's high-speed AI inference (LLaMA 3.3). 

It takes an ordinary video script and instantly transforms it into a professional, highly detailed motion design brief. Designed for animators, creative directors, and motion studios, Motionbrief streamlines pre-production by generating timecodes, scene breakdowns, color palettes, typography suggestions, and asset lists.

## Features ✨

- **Fast AI Generation:** Leverages Groq for lightning-fast brief generation.
- **Scene-by-Scene Breakdown:** Automatically splits your script into logical motion scenes.
- **Color Palettes:** Generates matching hex codes with one-click copy to clipboard functionality.
- **Export Options:** Instantly copy the brief to your clipboard or download it as a `.md` (Markdown) file for your project management tools (Notion, Obsidian, GitHub).
- **Premium UI:** Smooth, staggered animations and a sleek dark-mode glassmorphism interface powered by Framer Motion and Tailwind CSS.

## Getting Started 🚀

### Prerequisites
Make sure you have Node.js installed, and you will need a free API key from [Groq](https://console.groq.com/keys) to power the AI generations.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/redNSF/project-lilliane.git
   cd project-lilliane
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or yarn, pnpm, bun
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## How to Use 📖

1. **Enter API Key:** On the landing page, enter your Groq API Key. (Your key is only used locally and is not stored on any server).
2. **Provide the Script:** Paste the script for your video or animation.
3. **Configure Options:** Select your desired *Style* (e.g., Explainer, Commercial, UI Demo) and *Overall Mood*.
4. **Generate:** Click the generate button and watch as Motionbrief instantly creates a detailed, professional brief.
5. **Use the Brief:**
   - **Click on Color Swatches** to instantly copy exact hex codes to your clipboard.
   - **Click "Download md"** to save a markdown file of the entire brief to your computer.
   - **Click "Copy md"** to copy the full markdown text to your clipboard.

## Tech Stack 🛠️

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI Integration:** Groq SDK (LLaMA)
- **Icons:** Lucide React

---
*Transforming scripts into visual roadmaps, one scene at a time.*
