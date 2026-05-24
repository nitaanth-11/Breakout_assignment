# Closira — AI Support Agent for Breakout Escape Rooms

![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange)
![Flask](https://img.shields.io/badge/Flask-Web%20API-green)

An intelligent, autonomous customer support agent powered by **Google Gemini 2.5 Flash**, specifically built to handle customer inquiries for **Breakout Escape Rooms** across their Mumbai and Bangalore locations. 

Unlike standard conversational bots, Closira uses a rigid JSON Standard Operating Procedure (SOP) file as its single source of truth, guaranteeing accurate, hallucination-free answers to customers.

---

## 📑 Table of Contents
- [Overview & Architecture](#overview--architecture)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Database & Analytics](#database--analytics)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## 🧠 Overview & Architecture

Closira operates through a dynamic Python backend that feeds contextual awareness into the Google Gemini LLM. 

Whenever a user sends a message, the system invisibly injects:
1. The **Full SOP Data** (Pricing, Rooms, Policies, Discounts)
2. **Strict Escalation Rules** (When to hand off to a human)
3. **Live System Timestamp** (To resolve relative time phrases like "tomorrow")

The AI is forced to output a strictly structured JSON response containing the actual message, an internal confidence score, and boolean flags indicating if a human escalation is required.

---

## ✨ Core Features

1. **Zero-Hallucination SOP Grounding**
   The agent is strictly instructed to *never* invent pricing, rooms, or policies. If the requested information does not exist in `sop_data.json`, it is explicitly programmed to decline gracefully and escalate the query.

2. **Intelligent Location Disambiguation**
   Breakout has branches in Mumbai and Bangalore with differing prices and rooms. If a user asks "What is the price?", the AI automatically intercepts and requests city clarification before dispensing information.

3. **10-Point Strict Escalation Matrix & NLP Sentiment Analysis**
   The bot uses built-in NLP capabilities to analyze the sentiment of every customer message. It auto-escalates to a human agent (`+91-9876543210`) if it detects:
   - Frustration / Negative Sentiment (Using NLP)
   - Profanity / Cuss words
   - Refund requests
   - Safety / Injury reports
   - Corporate bookings (>20 people)
   - Technical failures
   - Discount negotiations

4. **Dynamic Time & Date Context**
   The user can say "Can I book a room for tomorrow?". Closira automatically reads your system's live timestamp dynamically injected into the backend, allowing it to correctly identify the date and apply weekend/weekday pricing rules perfectly.

5. **SQL Database Logging & Auto-Summarization**
   Every single message exchanged is logged seamlessly into a native SQLite database table (`conversations.db`). This allows Administrators to easily view SQL tables of conversations, timestamps, and AI-generated chat summaries.

6. **Free-Tier Rate Limit Resilience**
   Google Gemini's free tier heavily throttles requests. Closira includes built-in exception handling that detects `429 Rate Limit` errors, pauses operation for 10 seconds, and retries the summary generation safely without crashing the system.

7. **Multi-Question Handling (Bullet Points)**
   If a user fires off 3 questions in a single message, the AI systematically catches all of them and organizes the answers cleanly into a bulleted list.

8. **Unified Booking Options**
   Users are specifically prompted with all valid booking channels: via WhatsApp, the internal App, or direct Phone Number.

---

## 🛠 Technology Stack

- **Core Language:** Python 3.10+
- **LLM Engine:** Google Generative AI SDK (`gemini-2.5-flash`)
- **Web Framework:** Flask & Flask-CORS (for optional web frontend hooks)
- **Database:** SQLite3 (Native Python)
- **Environment Management:** `python-dotenv`

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed on your system:
- Python 3.9 or higher
- `pip` (Python package manager)
- A valid **Google Gemini API Key** (Can be obtained for free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

## 🚀 Installation & Setup

1. **Clone or Download the Repository**
   Navigate to the project folder in your terminal.

2. **Install Required Dependencies**
   Run the following command to install Flask, Google AI SDK, and Dotenv:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure the Environment Variables**
   Create a file named `.env` in the root folder of the project.
   Add your Gemini API key to the file exactly like this:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKeyGoesHere"
   ```

---

## 💬 Usage Guide

### Starting the AI Chat (Interactive Mode)
To chat with the agent in a simulated real-time terminal interface:
```bash
python app.py --cli
```
- Type your questions normally at the `You:` prompt.
- The AI will simulate typing character-by-character.
- Type `reset` to clear the current chat memory and start a new session.
- Type `quit` to end the session. **Note:** Only typing `quit` gracefully closes the session and triggers the AI to save a summary of your chat to the database!

### Starting the Flask Server (API Mode)
If you wish to hook this agent up to a React frontend or WhatsApp Bot:
```bash
python app.py
```
This will spin up a local server at `http://127.0.0.1:5000` with multiple endpoints (`POST /chat`, `GET /rooms/mumbai`, etc.)

---

## 📊 Database & Analytics

All conversations and session summaries are stored securely in `conversations.db`. Since `.db` files are binary and cannot be easily read in a text editor, a dedicated viewing script is provided.

To read your past conversations and their AI-generated summaries, open a new terminal window and run:
```bash
python view_db.py
```
This will print a beautifully formatted log of all messages and chat summaries directly to your console.

---

## 📁 Project Structure

```text
Breakout_Assignment/
│
├── app.py               # Main application logic, AI routing, and CLI interface
├── view_db.py           # Helper script to read and print SQLite database contents
├── test_cases.md        # Detailed breakdown of testing rules and future enhancements
├── sop_data.json        # The central brain/knowledge base of the company
├── requirements.txt     # Python dependencies
├── .env                 # Secret environment variables (API Key)
├── .gitignore           # Git ignore file for security
└── conversations.db     # Auto-generated SQLite database containing logs
```

---

## ⚠️ Troubleshooting & Known Limitations

### Troubleshooting
**1. "I'm experiencing a configuration issue..."**
This means your Gemini API key is missing or invalid. Double-check your `.env` file and ensure there are no spaces around the `=` sign.

**2. "Rate Limit hit. Waiting 10s before summarizing..."**
If you chat too fast and then type `quit`, the free-tier API gets overwhelmed. The script will automatically pause for 10 seconds and retry saving your summary. Just wait patiently!

**3. The Database viewer (`view_db.py`) says "No summaries found."**
Summaries are ONLY generated when you gracefully exit a chat by typing the word `quit`. If you close the terminal window forcefully (or hit `Ctrl+C`), the AI does not get a chance to save the summary.

### Trade-offs & Known Limitations
- **CLI Dependency:** The current iteration relies entirely on the command-line interface. For a production deployment, this backend would need to be coupled with a Web Socket (e.g. Socket.io) or WhatsApp Business API to be usable by real customers.
- **In-Memory State Loss:** The chat context (history) is managed via an in-memory python dictionary (`conversations = {}`). While messages are saved permanently to SQL for analytics, if the server restarts, ongoing active chat sessions will lose their context. For a robust production environment, session state should be mapped to Redis or the SQLite database.
- **LLM Rate Limits:** Because the system currently relies on the Google Gemini Free Tier, high concurrency would cause API failures. Scaling this requires upgrading to a paid tier.
