// ── Location Constants — sourced directly from sop_data.json ─────────────────
// Real addresses, real contacts, real timings from the SOP.

export const LOCATIONS = {
  mumbai: {
    id: 'mumbai',
    name: 'Breakout Escape Rooms — Mumbai',
    shortName: 'Mumbai',
    coords: [19.0860, 72.8907],   // Phoenix Marketcity, Kurla West
    address: 'Breakout Escape Rooms, 3rd Floor, Phoenix Marketcity, LBS Marg, Kurla West, Mumbai, Maharashtra 400070',
    landmark: 'Inside Phoenix Marketcity Mall, 3rd Floor',
    phone: '+91-9876543210',
    whatsapp: '+91-9876543210',
    email: 'support@breakoutmumbai.com',
    timings: '11:00 AM – 11:00 PM (Mon–Sun)',
    lastSlot: '9:30 PM',
    holidays: 'Open on all public holidays. Closed only on Holi and Diwali.',
    parking: 'Mall parking available at Phoenix Marketcity. Paid parking (mall rates). Valet available.',
    rooms: [
      { name: 'Prison Break', difficulty: 'Medium (3/5)', duration: '60 min', team: '2–6 players', successRate: '35%' },
      { name: 'Haunted Mansion', difficulty: 'Hard (4.5/5)', duration: '75 min', team: '4–8 players', successRate: '18%' },
    ],
    pricing: { weekday: '₹899/person (Mon–Thu)', weekend: '₹1,099/person (Fri–Sun)' },
  },
  bangalore: {
    id: 'bangalore',
    name: 'Breakout Escape Rooms — Bangalore',
    shortName: 'Bangalore',
    coords: [12.9906, 77.5571],   // Orion Mall, Rajajinagar
    address: 'Breakout Escape Rooms, 2nd Floor, Orion Mall, Dr. Rajkumar Road, Rajajinagar, Bangalore, Karnataka 560010',
    landmark: 'Inside Orion Mall, 2nd Floor near PVR Cinemas',
    phone: '+91-9123456780',
    whatsapp: '+91-9123456780',
    email: 'support@breakoutbangalore.com',
    timings: '10:30 AM – 10:30 PM (Mon–Sun)',
    lastSlot: '9:00 PM',
    holidays: 'Open on all public holidays. Closed only on Ugadi and Diwali.',
    parking: 'Mall parking available at Orion Mall. Paid parking (mall rates). Valet available.',
    rooms: [
      { name: 'The Heist', difficulty: 'Medium (3.5/5)', duration: '60 min', team: '2–6 players', successRate: '30%' },
      { name: 'Zombie Apocalypse', difficulty: 'Hard (4/5)', duration: '70 min', team: '3–8 players', successRate: '22%' },
      { name: 'Prison Break', difficulty: 'Medium (3/5)', duration: '60 min', team: '2–6 players', successRate: '35%' },
    ],
    pricing: { weekday: '₹799/person (Mon–Thu)', weekend: '₹999/person (Fri–Sun)' },
  },
};

export const DEFAULT_LOCATION = 'mumbai';

export default LOCATIONS;
