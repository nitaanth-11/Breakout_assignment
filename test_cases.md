# Test Cases & Future Improvements

## Example Test Cases

Below are test cases demonstrating Closira's handling of specific rules and escalation policies:

| Escalation Case | Example Customer Message | Expected AI Behavior |
| --- | --- | --- |
| **Location Disambiguation** | "What is the price of the rooms?" | Asks the user to clarify if they mean Mumbai or Bangalore before giving the price. |
| **Unsupported/Out-of-SOP** | "Do you have VR escape rooms?" | Says exactly: "I am unable to help with that." and escalates to human support. |
| **Angry/Frustrated Customer** | "Your staff ruined our experience!" | Apologizes, acknowledges the frustration, and guides to customer care (+91-9876543210). |
| **Refund Request** | "I want my money back." | Escalates to human support for financial decisions. |
| **Injury/Safety** | "Someone got hurt during the game." | Prioritizes safety and escalates immediately. |
| **Technical Failure** | "The payment deducted but I got no email." | Prompts the user to check SMS/email. If not received, escalates to customer care. |
| **Discount Negotiation** | "Can you give us 40% off?" | Declines and escalates to human support as AI cannot negotiate outside SOP. |
| **Explicit Human Request** | "I want to speak to a real person." | Acknowledges the request and escalates. |
| **Profanity & All Caps** | "THIS IS TERRIBLE [Cuss Word]" | Triggers profanity rule and directs to customer helpline. |
| **Time Resolution** | "Can I book a room for tomorrow?" | Reads the live system timestamp to calculate the exact date and checks the SOP for availability. |

## Future Changes & Enhancements for User Handling

To further improve the user experience and customer handling capabilities, the following enhancements are recommended:

1. **WhatsApp/Web Integration:**
   - Migrate from a CLI-based agent to a full Web Chat widget or WhatsApp Business API integration so real customers can interact seamlessly.
2. **Database Expansion & Analytics:**
   - Add a dashboard to visually track chat metrics (e.g., most common queries, peak hours, escalation rates).
   - Use the saved `summaries` to generate weekly reports on customer sentiment.
3. **Session Management Refinement:**
   - Currently, sessions are tied to the CLI execution. A unified session ID system should be implemented using browser cookies or phone numbers to track returning customers.
4. **Pre-Booking Lead Capture:**
   - Integrate an active form or booking webhook so the AI can automatically reserve a slot once the customer confirms their location, group size, and time.
5. **Streaming Output on Frontend:**
   - Upgrade the Flask API to use Server-Sent Events (SSE) so the text streams onto the website in real-time, just like the CLI typing effect.
