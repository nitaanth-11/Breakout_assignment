import sqlite3

def view_database():
    print("=" * 60)
    print("  DATABASE VIEWER")
    print("=" * 60)

    try:
        conn = sqlite3.connect("conversations.db")
        c = conn.cursor()

        print("\n--- SUMMARIES ---")
        c.execute("SELECT session_id, timestamp, summary FROM summaries")
        summaries = c.fetchall()
        if not summaries:
            print("No summaries found.")
        for row in summaries:
            print(f"\n[Session: {row[0]}] | [Time: {row[1]}]")
            print(f"Summary: {row[2]}")
            print("-" * 40)

        print("\n--- MESSAGES ---")
        c.execute("SELECT session_id, timestamp, role, content FROM messages ORDER BY timestamp ASC")
        messages = c.fetchall()
        if not messages:
            print("No messages found.")
        for row in messages:
            print(f"[{row[1]}] {row[2].upper()}: {row[3]}")

        conn.close()
    except Exception as e:
        print(f"Error reading database: {e}")

if __name__ == "__main__":
    view_database()
