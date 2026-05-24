// ── API Service Layer ────────────────────────────────────────────────────────
// Single wrapper for all backend communication with the Flask server.

const BASE_URL = 'http://127.0.0.1:5000';

/**
 * Send a chat message to the Closira backend.
 * @param {string} message - The user's message
 * @param {string} conversationId - Session identifier
 * @returns {Promise<Object>} - The structured JSON response from Closira
 */
export async function sendMessage(message, conversationId = 'default') {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });
  if (!response.ok) throw new Error(`Chat API error: ${response.status}`);
  return response.json();
}

/**
 * Fetch the full SOP data from the backend.
 * @returns {Promise<Object>}
 */
export async function fetchSOP() {
  const response = await fetch(`${BASE_URL}/sop`);
  if (!response.ok) throw new Error(`SOP API error: ${response.status}`);
  return response.json();
}

/**
 * Fetch rooms for a specific location.
 * @param {string} location - 'mumbai' or 'bangalore'
 * @returns {Promise<Object>}
 */
export async function fetchRooms(location) {
  const response = await fetch(`${BASE_URL}/rooms/${location}`);
  if (!response.ok) throw new Error(`Rooms API error: ${response.status}`);
  return response.json();
}

/**
 * Fetch pricing for a specific location.
 * @param {string} location - 'mumbai' or 'bangalore'
 * @returns {Promise<Object>}
 */
export async function fetchPricing(location) {
  const response = await fetch(`${BASE_URL}/pricing/${location}`);
  if (!response.ok) throw new Error(`Pricing API error: ${response.status}`);
  return response.json();
}

/**
 * Fetch available discounts and offers.
 * @returns {Promise<Object>}
 */
export async function fetchDiscounts() {
  const response = await fetch(`${BASE_URL}/discounts`);
  if (!response.ok) throw new Error(`Discounts API error: ${response.status}`);
  return response.json();
}

/**
 * Clear conversation history on the backend.
 * @param {string} conversationId
 * @returns {Promise<Object>}
 */
export async function clearConversation(conversationId) {
  const response = await fetch(`${BASE_URL}/chat/${conversationId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error(`Clear API error: ${response.status}`);
  return response.json();
}
