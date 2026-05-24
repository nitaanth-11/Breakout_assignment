// ── Mock Data — seeded from real SOP scenarios ──────────────────────────────
// All data reflects realistic Breakout customer interactions
// grounded in actual rooms, policies, and escalation rules from sop_data.json.

export const MOCK_STATS = {
  totalLeadsToday: 14,
  missedEnquiries: 3,
  openEscalations: 2,
  followUpsDue: 5,
};

export const MOCK_LEADS = [
  {
    id: '1',
    customerName: 'Rahul Mehta',
    channel: 'whatsapp',
    status: 'new',
    time: '2 min ago',
    preview: 'Hi, I want to book Prison Break for 4 people this Saturday in Mumbai.',
    conversationId: 'conv_001',
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    channel: 'email',
    status: 'qualified',
    time: '15 min ago',
    preview: 'We need a corporate team-building event for 25 people at Bangalore.',
    conversationId: 'conv_002',
  },
  {
    id: '3',
    customerName: 'Arjun Kapoor',
    channel: 'call',
    status: 'escalated',
    time: '45 min ago',
    preview: 'I was charged twice for my Haunted Mansion booking, I need a refund.',
    conversationId: 'conv_003',
  },
  {
    id: '4',
    customerName: 'Sneha Reddy',
    channel: 'whatsapp',
    status: 'new',
    time: '1 hr ago',
    preview: 'What rooms do you have at Orion Mall in Bangalore?',
    conversationId: 'conv_004',
  },
  {
    id: '5',
    customerName: 'Vikram Desai',
    channel: 'email',
    status: 'qualified',
    time: '2 hr ago',
    preview: 'Looking for a birthday party package for 8 people at Phoenix Marketcity.',
    conversationId: 'conv_005',
  },
];

export const MOCK_ESCALATIONS = [
  {
    id: 'e1',
    customerName: 'Arjun Kapoor',
    reason: 'Refund request — double charge on Haunted Mansion booking',
    channel: 'call',
    time: '45 min ago',
    urgency: 'high',
    resolved: false,
    conversationId: 'conv_003',
  },
  {
    id: 'e2',
    customerName: 'Neha Gupta',
    reason: 'Customer reported a broken lock inside The Heist room at Bangalore',
    channel: 'whatsapp',
    time: '1 hr ago',
    urgency: 'high',
    resolved: false,
    conversationId: 'conv_006',
  },
  {
    id: 'e3',
    customerName: 'Amit Joshi',
    reason: 'Legal question about liability for personal belongings lost in locker',
    channel: 'email',
    time: '3 hr ago',
    urgency: 'medium',
    resolved: true,
    conversationId: 'conv_007',
  },
];

export const MOCK_FOLLOWUPS = [
  {
    id: 'f1',
    customerName: 'Rahul Mehta',
    dueTime: 'Today, 4:00 PM',
    preview: 'Confirm Saturday Prison Break booking at Phoenix Marketcity (4 players)',
    done: false,
  },
  {
    id: 'f2',
    customerName: 'Priya Sharma',
    dueTime: 'Today, 5:30 PM',
    preview: 'Send corporate package details — 25 people at Orion Mall, Bangalore',
    done: false,
  },
  {
    id: 'f3',
    customerName: 'Vikram Desai',
    dueTime: 'Tomorrow, 11:00 AM',
    preview: 'Confirm birthday party date and headcount — birthday person plays free (6+ rule)',
    done: false,
  },
  {
    id: 'f4',
    customerName: 'Meera Nair',
    dueTime: 'Yesterday, 3:00 PM',
    preview: 'Check if Zombie Apocalypse booking was completed after rescheduling',
    done: true,
  },
];

export const MOCK_CONVERSATIONS = {
  conv_003: {
    customerName: 'Arjun Kapoor',
    channel: 'call',
    status: 'escalated',
    sopMatch: 'Cancellation & Refund Policy',
    summary: 'Customer reported a double charge on credit card for Haunted Mansion booking (May 22, Mumbai). Requested immediate refund. Escalated per SOP — refund disputes must go to human support. Refund processed to original payment method within 5–7 business days.',
    messages: [
      { id: 'm1', role: 'user', content: 'I was charged twice for my Haunted Mansion booking yesterday!', time: '2:15 PM' },
      { id: 'm2', role: 'assistant', content: 'I understand how frustrating a double charge must be, and I sincerely apologize for the inconvenience. As per our policy, refund disputes must be handled by our support team. Please contact Mumbai support at +91-9876543210 or email feedback@breakout.in. Refunds are processed to the original payment method within 5–7 business days.', time: '2:15 PM' },
      { id: 'm3', role: 'user', content: 'This is unacceptable, I want my money back NOW!', time: '2:16 PM' },
      { id: 'm4', role: 'assistant', content: 'I completely understand your urgency. Your case has been escalated to our senior support team with high priority. They will reach out to you within 30 minutes during operating hours. You can also call us directly at +91-9876543210 for immediate assistance.', time: '2:16 PM' },
    ],
  },
  conv_001: {
    customerName: 'Rahul Mehta',
    channel: 'whatsapp',
    status: 'new',
    sopMatch: 'Booking & Pricing — Mumbai',
    summary: 'Customer enquired about booking Prison Break at Phoenix Marketcity for 4 people on Saturday. Provided weekend pricing (₹1,099/person) and room details (Medium difficulty, 60 min, success rate 35%). Reminded to arrive 15 minutes early for briefing.',
    messages: [
      { id: 'm1', role: 'user', content: 'Hi, I want to book Prison Break for 4 people this Saturday in Mumbai.', time: '3:05 PM' },
      { id: 'm2', role: 'assistant', content: 'Welcome to Breakout! 🎉 Great choice! Prison Break at Phoenix Marketcity is perfect for 4 players. Saturday pricing is ₹1,099 per person (GST included). The room is 60 minutes, Medium difficulty (3/5) with a 35% success rate. Please arrive 15 minutes early for your safety briefing. Would you like to proceed with booking via WhatsApp or our website (breakout.in/book)?', time: '3:05 PM' },
      { id: 'm3', role: 'user', content: 'What time slots are available?', time: '3:06 PM' },
      { id: 'm4', role: 'assistant', content: 'Our Mumbai location at Phoenix Marketcity operates from 11:00 AM to 11:00 PM, with the last slot at 9:30 PM. To check exact available slots for this Saturday, you can book through our website at breakout.in/book or WhatsApp us at +91-9876543210. Is this booking for a special occasion like a birthday or just a fun outing with friends? 🧩', time: '3:06 PM' },
    ],
  },
  conv_002: {
    customerName: 'Priya Sharma',
    channel: 'email',
    status: 'qualified',
    sopMatch: 'Corporate Packages',
    summary: 'Customer enquired about corporate team-building for 25 people at Bangalore. Provided 21–40 people tier: 20% discount with dedicated game master, scorecards, photos, custom challenges, and certificates. Advised to book 5 business days in advance. Escalated to corporate events team (corporate@breakout.in) as required by SOP for groups above 20.',
    messages: [
      { id: 'm1', role: 'user', content: 'We need a corporate team-building event for 25 people at Bangalore.', time: '1:30 PM' },
      { id: 'm2', role: 'assistant', content: 'That sounds exciting! For 25 people at our Bangalore location (Orion Mall), you qualify for our corporate package with 20% off. This includes a dedicated game master, team scorecards, group photos, custom challenges, and certificates. Full advance payment is required, and we recommend booking at least 5 business days in advance. GST invoicing is available. Since this is a group above 20, I\'ll need to connect you with our corporate events team for personalized planning. Please email corporate@breakout.in or WhatsApp +91-9123456780.', time: '1:30 PM' },
    ],
  },
};

export const MOCK_ACTIVITY = [
  { id: 'a1', text: 'New lead: Rahul Mehta — Prison Break booking via WhatsApp', time: '2 min ago', type: 'lead' },
  { id: 'a2', text: 'Escalation resolved: Amit Joshi (liability question, Bangalore)', time: '30 min ago', type: 'escalation' },
  { id: 'a3', text: 'Follow-up completed: Meera Nair (Zombie Apocalypse reschedule)', time: '1 hr ago', type: 'followup' },
  { id: 'a4', text: 'New lead: Priya Sharma — Corporate event for 25 via Email', time: '2 hr ago', type: 'lead' },
  { id: 'a5', text: 'Escalation: Arjun Kapoor — double charge refund (Haunted Mansion)', time: '3 hr ago', type: 'escalation' },
];
