# 🤖 AI-Powered Co-Browsing Chatbot for Portfolio Website

An AI-powered conversational chatbot that acts as a **co-browsing assistant** for a portfolio website.  
It dynamically understands website content and helps users explore it using natural language by performing actions such as **scrolling, navigation, highlighting, clicking, and form filling**.

---

## ✨ Features

- **Dynamic Content Understanding**
  - Extracts visible website content in real time
- **Conversational AI**
  - Powered by Google Gemini API
- **Co-Browsing Actions**
  - Scroll to specific sections
  - Highlight page elements
  - Click buttons and links
  - Fill form inputs
  - Navigate between sections
- **Tool-Based Architecture**
  - AI decides actions and executes browser tools
- **Real-Time Interaction**
  - Immediate visual feedback on the webpage

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **AI / ML:** Google Gemini API
- **Utilities:** DOM manipulation, real-time content extraction

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Indrajit-Mandol/portfolio-chatbot.git
cd portfolio-chatbot
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Environment Variables
Create a .env.local file in the root directory:

env
Copy code
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
4️⃣ Get a Gemini API Key
Visit Google AI Studio

Create a new API key

Copy the key into .env.local

5️⃣ Run the Development Server
bash
Copy code
npm run dev
Open your browser and visit:
👉 http://localhost:3000

🏗️ Project Structure
text
Copy code
portfolio-chatbot/
├── app/
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Testimonials.tsx
│   │   └── Contact.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── content-extractor.ts
│   ├── tools.ts
│   ├── gemini-client.ts
│   └── types.ts
└── public/
🎯 Usage Examples
Command	Action
"Go to skills section"	Scrolls to skills
"Highlight experience"	Highlights experience section
"What projects are shown?"	Summarizes page content
"Go to contact form"	Navigates to contact section
"Fill contact name with John"	Fills form input

🧠 Architecture Overview
ContentExtractor
Extracts visible DOM text

Identifies sections and positions

Generates CSS selectors

BrowserTools
Executes scrolling, clicking, highlighting

Handles form filling

Exposes tools for AI to call

Gemini Client
Communicates with Gemini API

Maintains chat context

Generates structured tool calls

Chat Interface
Main UI for conversation

Executes AI-driven browser actions

Example Tool Call
json
Copy code
{
  "name": "scroll_to_section",
  "parameters": {
    "sectionId": "experience"
  }
}
