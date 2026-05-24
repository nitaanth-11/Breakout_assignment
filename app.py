"""
Closira — AI Customer Support Agent for Breakout Escape Rooms
Uses Google Gemini to answer questions grounded strictly in SOP data.
No hardcoded responses. The LLM reads the SOP and reasons over it.
"""

import json
import os
import time
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# ── Load environment & config ─────────────────────────────────────────────────
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file. Please add: GEMINI_API_KEY=...")

genai.configure(api_key=API_KEY)

# ── Load SOP Data ─────────────────────────────────────────────────────────────
SOP_PATH = os.path.join(os.path.dirname(__file__), "sop_data.json")
with open(SOP_PATH, "r", encoding="utf-8") as f:
    SOP = json.load(f)

SOP_TEXT = json.dumps(SOP, indent=2, ensure_ascii=False)

# ── System Prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = f"""You are **Closira**, the AI customer support assistant for Breakout Escape Rooms.

You operate across TWO locations: **Mumbai** and **Bangalore**.

═══════════════════════════════════════════════════
COMPLETE SOP DATA (your ONLY source of truth):
═══════════════════════════════════════════════════
{SOP_TEXT}
═══════════════════════════════════════════════════

STRICT RULES — YOU MUST FOLLOW THESE AT ALL TIMES:

1. **ONLY answer from the SOP data above.** Never invent, assume, infer, or hallucinate any information.

2. **LOCATION DISAMBIGUATION — CRITICAL:**
   - Breakout has locations in BOTH Mumbai and Bangalore.
   - If the customer asks about pricing, rooms, timings, address, parking, or any location-specific info WITHOUT specifying which city → you MUST ask:
     "Sure! We have locations in both Mumbai and Bangalore. Which city are you asking about?"
   - Do NOT guess the location. Always clarify first.
   - Once the customer specifies a location, answer with ONLY that location's data.

3. **ESCALATION & SENTIMENT ANALYSIS (NLP) — you MUST escalate if ANY of these 10 cases occur:**
   1. Unsupported/Out-of-SOP Question (e.g., "Do you have VR escape rooms?")
   2. Frustration/Anger (Use sentiment analysis. If negative sentiment/frustration is detected, escalate.)
   3. Refund Request (e.g., "I want my money back.")
   4. Injury/Safety Complaint (e.g., "Someone got hurt during the game.")
   5. Technical Failure (e.g., "The lock in the room stopped working.")
   6. Discount Negotiation (e.g., "Can you give us 40% off?")
   7. Large Corporate Booking (e.g., "We want booking for 35 employees.")
   8. Explicit Human Request (e.g., "I want to speak to a real person.")
   9. Repeated AI Failure / Low Confidence (e.g., "That's not what I asked.")
   10. Legal / Liability Questions (e.g., "Who is responsible if someone gets injured?")
   If any of these cases happen, acknowledge the issue, guide them to customer care (+91-9876543210), and set needs_escalation to true.

4. **LEAD QUALIFICATION:**
   After answering the customer's question, include 2-3 natural follow-up questions to qualify the lead.
   Pick from: location preference, booking purpose, group size, difficulty preference, visit date, prior experience.
   Only ask questions that haven't been answered yet in the conversation.

5. **TONE:**
   - Warm, professional, calm, concise, helpful.
   - NEVER say: "As an AI language model", "I think", "Maybe", "Probably".
   - Use emojis sparingly for friendliness.

6. **IF SOP DATA IS MISSING / OUT OF SCOPE:**
   If the question is outside the SOP, say EXACTLY: "I am unable to help with that."
   Set needs_escalation to true.

7. **NEVER:**
   - Make up pricing, policies, timings, or offers
   - Answer questions outside the SOP confidently
   - Pretend information exists if it doesn't

8. **PROFANITY & ALL CAPS:**
   If the user uses capital letters and cuss words, guide them to the customer helpline at +91-9876543210.

9. **TECHNICAL & INCOMPLETE TRANSACTIONS:**
   For technical issues and incomplete transactions, prompt the user to check their SMS and email. If the user replies that they still have not received it, prompt them with the customer care number (+91-9876543210).

10. **TIME & DATE RESOLUTION:**
   The user may say "tomorrow", "yesterday", or "today". Use the system's current Date & Time context (provided at the start of your message) to identify exactly when they want to book.

11. **MULTIPLE QUESTIONS:**
   If the user asks multiple questions in a single message, you MUST answer all of them in a single response using a clear, bulleted list.

12. **BOOKING OPTIONS:**
   If the user asks how to book a room, inform them they can book via WhatsApp, our App, or through our Phone Number.

RESPONSE FORMAT — Always respond in this exact JSON structure:
{{
  "answer": "<your customer-facing response>",
  "confidence": <0.0 to 1.0>,
  "needs_escalation": <true or false>,
  "escalation_reason": "<reason string or null>",
  "lead_qualification_questions": ["<question1>", "<question2>"]
}}

Return ONLY the JSON object. No markdown fences. No extra text outside the JSON.
"""

# Initialize Gemini Model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=SYSTEM_PROMPT,
    generation_config={
        "temperature": 0.2,
        "max_output_tokens": 1024,
        "response_mime_type": "application/json"
    }
)

# ── Database Setup ────────────────────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect("conversations.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS messages
                 (session_id TEXT, timestamp TEXT, role TEXT, content TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS summaries
                 (session_id TEXT, timestamp TEXT, summary TEXT)''')
    conn.commit()
    conn.close()

init_db()

# ── Flask App ─────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# In-memory conversation storage (per-session)
conversations = {}


def build_messages(conversation_id: str, user_message: str) -> list[dict]:
    """Build the Gemini messages array with conversation history."""
    if conversation_id not in conversations:
        conversations[conversation_id] = []

    history = conversations[conversation_id]
    messages = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        messages.append({"role": role, "parts": [msg["content"]]})
        
    current_time_context = f"[System: Current Date & Time is {datetime.now().strftime('%Y-%m-%d %H:%M:%S (%A)')}]\n"
    messages.append({"role": "user", "parts": [current_time_context + user_message]})
    return messages


def call_gemini(messages: list[dict]) -> dict:
    """Call Google Gemini API and parse the structured JSON response."""
    try:
        response = model.generate_content(messages)
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "Quota" in error_msg:
            return {
                "answer": "Our support system is temporarily experiencing high demand. Please try again in a few minutes or contact us directly at +91-9876543210.",
                "confidence": 0.0,
                "needs_escalation": True,
                "escalation_reason": f"API rate limit: {error_msg[:100]}",
                "lead_qualification_questions": [],
            }
        elif "API_KEY" in error_msg or "403" in error_msg or "401" in error_msg:
            return {
                "answer": "I'm experiencing a configuration issue. Please contact us directly at +91-9876543210.",
                "confidence": 0.0,
                "needs_escalation": True,
                "escalation_reason": f"API auth error: {error_msg[:100]}",
                "lead_qualification_questions": [],
            }
        else:
            return {
                "answer": "I'm experiencing a temporary issue. Please try again shortly or contact us directly at +91-9876543210.",
                "confidence": 0.0,
                "needs_escalation": True,
                "escalation_reason": f"API error: {error_msg[:100]}",
                "lead_qualification_questions": [],
            }

    # Extract text from Gemini's response
    raw = ""
    if response.candidates and response.candidates[0].content.parts:
        raw = response.candidates[0].content.parts[0].text

    raw = raw.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
        lines = raw.split("\n")
        # Remove first line (```json or ```) and last line (```)
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw = "\n".join(lines).strip()

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {
            "answer": raw,
            "confidence": 0.5,
            "needs_escalation": False,
            "escalation_reason": None,
            "lead_qualification_questions": [],
        }

    # Ensure all required fields exist
    parsed.setdefault("answer", "I'm sorry, something went wrong. Please try again.")
    parsed.setdefault("confidence", 0.5)
    parsed.setdefault("needs_escalation", False)
    parsed.setdefault("escalation_reason", None)
    parsed.setdefault("lead_qualification_questions", [])

    return parsed


def process_message(user_message: str, conversation_id: str = "default") -> dict:
    """Process a user message through the Gemini-powered Closira agent."""
    messages = build_messages(conversation_id, user_message)
    result = call_gemini(messages)

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Store conversation history for multi-turn context
    conversations.setdefault(conversation_id, [])
    conversations[conversation_id].append({"role": "user", "content": user_message})
    conversations[conversation_id].append({"role": "assistant", "content": json.dumps(result, ensure_ascii=False)})

    # Save to SQLite
    try:
        conn = sqlite3.connect("conversations.db")
        c = conn.cursor()
        c.execute("INSERT INTO messages VALUES (?, ?, ?, ?)", (conversation_id, now_str, "user", user_message))
        c.execute("INSERT INTO messages VALUES (?, ?, ?, ?)", (conversation_id, now_str, "assistant", result["answer"]))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"DB Error: {e}")

    # Keep history manageable (last 20 turns = 40 messages)
    if len(conversations[conversation_id]) > 40:
        conversations[conversation_id] = conversations[conversation_id][-40:]

    return result


def save_summary(conversation_id: str):
    if conversation_id not in conversations or not conversations[conversation_id]:
        return
    
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in conversations[conversation_id]])
    
    summary = "Summary could not be generated."
    # Retry logic for free tier rate limits
    for attempt in range(3):
        try:
            summary_prompt = f"Summarize this customer support conversation briefly:\n\n{history_text}"
            response = model.generate_content(summary_prompt)
            summary = response.text.strip()
            break
        except Exception as e:
            if "429" in str(e) or "retry" in str(e).lower():
                print(f"\n[Rate Limit hit. Waiting 10s before summarizing... (Attempt {attempt+1}/3)]")
                time.sleep(10)
            else:
                print(f"Summary Generation Error: {e}")
                break

    try:    
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        conn = sqlite3.connect("conversations.db")
        c = conn.cursor()
        c.execute("INSERT INTO summaries VALUES (?, ?, ?)", (conversation_id, now_str, summary))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Summary DB Error: {e}")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "agent": SOP["agent"]["name"],
        "business": SOP["business"]["name"],
        "locations": list(SOP["locations"].keys()),
        "status": "online",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "endpoints": {
            "POST /chat": "Send a message to Closira. Body: {message, conversation_id?}",
            "GET /sop": "View full SOP data",
            "GET /rooms/<location>": "View rooms for mumbai or bangalore",
            "GET /pricing/<location>": "View pricing for mumbai or bangalore",
            "GET /discounts": "View all discounts and offers",
            "DELETE /chat/<conversation_id>": "Clear conversation history",
        },
    })


@app.route("/chat", methods=["POST"])
def chat():
    """Main chat endpoint. Body: { "message": "...", "conversation_id": "..." }"""
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' field in request body"}), 400

    message = data["message"].strip()
    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    conversation_id = data.get("conversation_id", "default")
    result = process_message(message, conversation_id)
    return jsonify(result)


@app.route("/chat/<conversation_id>", methods=["DELETE"])
def clear_chat(conversation_id: str):
    """Clear conversation history for a given session."""
    conversations.pop(conversation_id, None)
    return jsonify({"status": "cleared", "conversation_id": conversation_id})


@app.route("/sop", methods=["GET"])
def get_sop():
    return jsonify(SOP)


@app.route("/rooms/<location>", methods=["GET"])
def get_rooms(location: str):
    loc = location.lower()
    if loc not in SOP["locations"]:
        return jsonify({"error": f"Unknown location '{location}'. Available: mumbai, bangalore"}), 404
    return jsonify({"location": loc, "rooms": SOP["locations"][loc]["escape_rooms"]})


@app.route("/pricing/<location>", methods=["GET"])
def get_pricing(location: str):
    loc = location.lower()
    if loc not in SOP["locations"]:
        return jsonify({"error": f"Unknown location '{location}'. Available: mumbai, bangalore"}), 404
    return jsonify({"location": loc, "pricing": SOP["locations"][loc]["pricing"]})


@app.route("/discounts", methods=["GET"])
def get_discounts():
    return jsonify(SOP["discounts_and_offers"])


# ── CLI Mode ──────────────────────────────────────────────────────────────────

def run_cli():
    """Interactive CLI mode for testing Closira."""
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

    print("=" * 60)
    print(f"  {SOP['agent']['name']} — {SOP['business']['name']}")
    print(f"  Powered by Gemini | Locations: Mumbai | Bangalore")
    print("  Type 'quit' to exit  |  Type 'reset' to clear history")
    print("=" * 60)
    print(f"\n{SOP['agent']['greeting']}\n")

    conversation_id = "cli_session"

    while True:
        now_str = datetime.now().strftime("%H:%M:%S")
        try:
            user_input = input(f"[{now_str}] You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nSaving conversation summary to database...")
            save_summary(conversation_id)
            print(f"\n{SOP['agent']['farewell']}")
            break

        if not user_input:
            continue
        if user_input.lower() == "quit":
            print("\nSaving conversation summary to database...")
            save_summary(conversation_id)
            print(f"\n{SOP['agent']['farewell']}")
            break
        if user_input.lower() == "reset":
            print("\nSaving conversation summary to database...")
            save_summary(conversation_id)
            conversations.pop(conversation_id, None)
            print("\n🔄 Conversation history cleared.\n")
            continue

        print("\n⏳ Thinking...\n")
        response = process_message(user_input, conversation_id)

        now_str = datetime.now().strftime("%H:%M:%S")
        print(f"[{now_str}] Closira: ", end="")
        for char in response['answer']:
            print(char, end="")
            sys.stdout.flush()
            time.sleep(0.015)  # Simulate real-time typing
        print("\n")


# ── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys
    if "--cli" in sys.argv:
        run_cli()
    else:
        print(f"🚀 {SOP['agent']['name']} is starting on http://127.0.0.1:5000")
        app.run(debug=True, host="0.0.0.0", port=5000)
