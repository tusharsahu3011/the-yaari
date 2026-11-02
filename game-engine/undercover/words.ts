import { WordPair } from './types';

export interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  desc: string;
  sample: string;
  accentColor: string;
}

export const UNDERCOVER_CATEGORIES: CategoryDef[] = [
  {
    id: 'all',
    label: 'All Categories',
    icon: 'Sparkles',
    desc: 'A rich eclectic mix of all categories',
    sample: 'Coffee/Tea, Marvel/DC, Paris/Rome...',
    accentColor: '#c084fc',
  },
  {
    id: 'food',
    label: 'Food & Drinks',
    icon: 'Utensils',
    desc: 'Delicious eats, street foods, snacks & beverages',
    sample: 'Pizza/Burger, Sushi/Sashimi, Pancake/Waffle...',
    accentColor: '#fbbf24',
  },
  {
    id: 'tech_pop',
    label: 'Pop Culture & Tech',
    icon: 'Gamepad2',
    desc: 'Movies, apps, heroes, gaming & gadgets',
    sample: 'Netflix/YouTube, Batman/Spider-Man, Instagram/TikTok...',
    accentColor: '#f472b6',
  },
  {
    id: 'places',
    label: 'Places & Travel',
    icon: 'Compass',
    desc: 'Destinations, cities, geography & landmarks',
    sample: 'Beach/Pool, Airport/Station, Paris/Rome...',
    accentColor: '#34d399',
  },
  {
    id: 'college',
    label: 'College & Social Life',
    icon: 'GraduationCap',
    desc: 'Campus vibes, exams, friendships & hangouts',
    sample: 'Canteen/Café, Assignment/Exam, Lecture/Seminar...',
    accentColor: '#fb923c',
  },
  {
    id: 'objects',
    label: 'Everyday Objects',
    icon: 'Package',
    desc: 'Things you see, wear, and use every day',
    sample: 'Pencil/Pen, Watch/Smartwatch, Umbrella/Raincoat...',
    accentColor: '#38bdf8',
  },
  {
    id: 'nature',
    label: 'Animals & Nature',
    icon: 'TreePine',
    desc: 'Wildlife, pets, habitats & natural wonders',
    sample: 'Lion/Tiger, Dolphin/Whale, Wolf/Fox...',
    accentColor: '#4ade80',
  },
];

export const WORD_PAIRS: WordPair[] = [
  // 1. Food & Drinks
  { id: 'fd-1', category: 'food', civilianWord: 'Coffee', undercoverWord: 'Tea' },
  { id: 'fd-2', category: 'food', civilianWord: 'Pizza', undercoverWord: 'Burger' },
  { id: 'fd-3', category: 'food', civilianWord: 'Pancake', undercoverWord: 'Waffle' },
  { id: 'fd-4', category: 'food', civilianWord: 'Sushi', undercoverWord: 'Sashimi' },
  { id: 'fd-5', category: 'food', civilianWord: 'Apple', undercoverWord: 'Pear' },
  { id: 'fd-6', category: 'food', civilianWord: 'Coca-Cola', undercoverWord: 'Pepsi' },
  { id: 'fd-7', category: 'food', civilianWord: 'Chocolate', undercoverWord: 'Vanilla' },
  { id: 'fd-8', category: 'food', civilianWord: 'Cake', undercoverWord: 'Brownie' },
  { id: 'fd-9', category: 'food', civilianWord: 'Butter', undercoverWord: 'Margarine' },
  { id: 'fd-10', category: 'food', civilianWord: 'Taco', undercoverWord: 'Burrito' },
  { id: 'fd-11', category: 'food', civilianWord: 'Orange', undercoverWord: 'Tangerine' },
  { id: 'fd-12', category: 'food', civilianWord: 'Ice Cream', undercoverWord: 'Frozen Yogurt' },
  { id: 'fd-13', category: 'food', civilianWord: 'Sandwich', undercoverWord: 'Toast' },
  { id: 'fd-14', category: 'food', civilianWord: 'Spaghetti', undercoverWord: 'Noodles' },
  { id: 'fd-15', category: 'food', civilianWord: 'Potato Chips', undercoverWord: 'Popcorn' },
  { id: 'fd-16', category: 'food', civilianWord: 'Croissant', undercoverWord: 'Bagel' },
  { id: 'fd-17', category: 'food', civilianWord: 'Jam', undercoverWord: 'Honey' },
  { id: 'fd-18', category: 'food', civilianWord: 'Cookie', undercoverWord: 'Biscuit' },
  { id: 'fd-19', category: 'food', civilianWord: 'Donut', undercoverWord: 'Churro' },
  { id: 'fd-20', category: 'food', civilianWord: 'Smoothie', undercoverWord: 'Milkshake' },
  { id: 'fd-21', category: 'food', civilianWord: 'Lemonade', undercoverWord: 'Iced Tea' },
  { id: 'fd-22', category: 'food', civilianWord: 'Soup', undercoverWord: 'Stew' },
  { id: 'fd-23', category: 'food', civilianWord: 'Ketchup', undercoverWord: 'Mayonnaise' },
  { id: 'fd-24', category: 'food', civilianWord: 'Samosa', undercoverWord: 'Kachori' },
  { id: 'fd-25', category: 'food', civilianWord: 'Biryani', undercoverWord: 'Pulao' },

  // 2. Pop Culture & Tech
  { id: 'tp-1', category: 'tech_pop', civilianWord: 'Netflix', undercoverWord: 'YouTube' },
  { id: 'tp-2', category: 'tech_pop', civilianWord: 'Instagram', undercoverWord: 'TikTok' },
  { id: 'tp-3', category: 'tech_pop', civilianWord: 'Marvel', undercoverWord: 'DC' },
  { id: 'tp-4', category: 'tech_pop', civilianWord: 'Batman', undercoverWord: 'Spider-Man' },
  { id: 'tp-5', category: 'tech_pop', civilianWord: 'PlayStation', undercoverWord: 'Xbox' },
  { id: 'tp-6', category: 'tech_pop', civilianWord: 'Harry Potter', undercoverWord: 'Lord of the Rings' },
  { id: 'tp-7', category: 'tech_pop', civilianWord: 'Spotify', undercoverWord: 'Apple Music' },
  { id: 'tp-8', category: 'tech_pop', civilianWord: 'Laptop', undercoverWord: 'Tablet' },
  { id: 'tp-9', category: 'tech_pop', civilianWord: 'Headphones', undercoverWord: 'Earbuds' },
  { id: 'tp-10', category: 'tech_pop', civilianWord: 'WhatsApp', undercoverWord: 'Telegram' },
  { id: 'tp-11', category: 'tech_pop', civilianWord: 'Minecraft', undercoverWord: 'Roblox' },
  { id: 'tp-12', category: 'tech_pop', civilianWord: 'Star Wars', undercoverWord: 'Star Trek' },
  { id: 'tp-13', category: 'tech_pop', civilianWord: 'iPhone', undercoverWord: 'Android' },
  { id: 'tp-14', category: 'tech_pop', civilianWord: 'Google', undercoverWord: 'Wikipedia' },
  { id: 'tp-15', category: 'tech_pop', civilianWord: 'Twitter', undercoverWord: 'Reddit' },
  { id: 'tp-16', category: 'tech_pop', civilianWord: 'Anime', undercoverWord: 'Cartoon' },
  { id: 'tp-17', category: 'tech_pop', civilianWord: 'Cinema', undercoverWord: 'Television' },
  { id: 'tp-18', category: 'tech_pop', civilianWord: 'Guitar', undercoverWord: 'Violin' },
  { id: 'tp-19', category: 'tech_pop', civilianWord: 'Piano', undercoverWord: 'Keyboard' },
  { id: 'tp-20', category: 'tech_pop', civilianWord: 'Fortnite', undercoverWord: 'PUBG' },

  // 3. Places & Travel
  { id: 'pl-1', category: 'places', civilianWord: 'Beach', undercoverWord: 'Swimming Pool' },
  { id: 'pl-2', category: 'places', civilianWord: 'Hotel', undercoverWord: 'Resort' },
  { id: 'pl-3', category: 'places', civilianWord: 'Airport', undercoverWord: 'Train Station' },
  { id: 'pl-4', category: 'places', civilianWord: 'Forest', undercoverWord: 'Jungle' },
  { id: 'pl-5', category: 'places', civilianWord: 'Mountain', undercoverWord: 'Hill' },
  { id: 'pl-6', category: 'places', civilianWord: 'Paris', undercoverWord: 'Rome' },
  { id: 'pl-7', category: 'places', civilianWord: 'Museum', undercoverWord: 'Art Gallery' },
  { id: 'pl-8', category: 'places', civilianWord: 'Zoo', undercoverWord: 'Safari' },
  { id: 'pl-9', category: 'places', civilianWord: 'Island', undercoverWord: 'Peninsula' },
  { id: 'pl-10', category: 'places', civilianWord: 'Desert', undercoverWord: 'Beach' },
  { id: 'pl-11', category: 'places', civilianWord: 'River', undercoverWord: 'Lake' },
  { id: 'pl-12', category: 'places', civilianWord: 'Castle', undercoverWord: 'Palace' },
  { id: 'pl-13', category: 'places', civilianWord: 'Subway', undercoverWord: 'Bus' },
  { id: 'pl-14', category: 'places', civilianWord: 'Library', undercoverWord: 'Bookstore' },
  { id: 'pl-15', category: 'places', civilianWord: 'Gym', undercoverWord: 'Stadium' },
  { id: 'pl-16', category: 'places', civilianWord: 'Tent', undercoverWord: 'Cabin' },
  { id: 'pl-17', category: 'places', civilianWord: 'Amusement Park', undercoverWord: 'Carnival' },
  { id: 'pl-18', category: 'places', civilianWord: 'Bridge', undercoverWord: 'Tunnel' },

  // 4. College & Social Life
  { id: 'cl-1', category: 'college', civilianWord: 'Canteen', undercoverWord: 'Café' },
  { id: 'cl-2', category: 'college', civilianWord: 'Assignment', undercoverWord: 'Exam' },
  { id: 'cl-3', category: 'college', civilianWord: 'Lecture', undercoverWord: 'Seminar' },
  { id: 'cl-4', category: 'college', civilianWord: 'Library', undercoverWord: 'Hostel Room' },
  { id: 'cl-5', category: 'college', civilianWord: 'All-nighter', undercoverWord: 'Power Nap' },
  { id: 'cl-6', category: 'college', civilianWord: 'Internship', undercoverWord: 'Part-time Job' },
  { id: 'cl-7', category: 'college', civilianWord: 'Professor', undercoverWord: 'Teaching Assistant' },
  { id: 'cl-8', category: 'college', civilianWord: 'Backpack', undercoverWord: 'Tote Bag' },
  { id: 'cl-9', category: 'college', civilianWord: 'Highlighter', undercoverWord: 'Marker' },
  { id: 'cl-10', category: 'college', civilianWord: 'Group Project', undercoverWord: 'Solo Assignment' },
  { id: 'cl-11', category: 'college', civilianWord: 'Presentation', undercoverWord: 'Essay' },
  { id: 'cl-12', category: 'college', civilianWord: 'Syllabus', undercoverWord: 'Textbook' },
  { id: 'cl-13', category: 'college', civilianWord: 'GPA', undercoverWord: 'Attendance' },
  { id: 'cl-14', category: 'college', civilianWord: 'Campus', undercoverWord: 'City Center' },
  { id: 'cl-15', category: 'college', civilianWord: 'Freshman', undercoverWord: 'Senior' },
  { id: 'cl-16', category: 'college', civilianWord: 'Bicycle', undercoverWord: 'Scooter' },

  // 5. Everyday Objects
  { id: 'ob-1', category: 'objects', civilianWord: 'Pencil', undercoverWord: 'Pen' },
  { id: 'ob-2', category: 'objects', civilianWord: 'Backpack', undercoverWord: 'Briefcase' },
  { id: 'ob-3', category: 'objects', civilianWord: 'Sunglasses', undercoverWord: 'Reading Glasses' },
  { id: 'ob-4', category: 'objects', civilianWord: 'Umbrella', undercoverWord: 'Raincoat' },
  { id: 'ob-5', category: 'objects', civilianWord: 'Wristwatch', undercoverWord: 'Smartwatch' },
  { id: 'ob-6', category: 'objects', civilianWord: 'Mirror', undercoverWord: 'Window' },
  { id: 'ob-7', category: 'objects', civilianWord: 'Toothbrush', undercoverWord: 'Hairbrush' },
  { id: 'ob-8', category: 'objects', civilianWord: 'Pillow', undercoverWord: 'Cushion' },
  { id: 'ob-9', category: 'objects', civilianWord: 'Blanket', undercoverWord: 'Duvet' },
  { id: 'ob-10', category: 'objects', civilianWord: 'Candle', undercoverWord: 'Flashlight' },
  { id: 'ob-11', category: 'objects', civilianWord: 'Wallet', undercoverWord: 'Coin Pouch' },
  { id: 'ob-12', category: 'objects', civilianWord: 'Scissors', undercoverWord: 'Cutter' },
  { id: 'ob-13', category: 'objects', civilianWord: 'Coffee Mug', undercoverWord: 'Tumbler' },
  { id: 'ob-14', category: 'objects', civilianWord: 'Key', undercoverWord: 'Passcode' },
  { id: 'ob-15', category: 'objects', civilianWord: 'Soap', undercoverWord: 'Shower Gel' },
  { id: 'ob-16', category: 'objects', civilianWord: 'Towel', undercoverWord: 'Bathrobe' },
  { id: 'ob-17', category: 'objects', civilianWord: 'Curtain', undercoverWord: 'Blinds' },
  { id: 'ob-18', category: 'objects', civilianWord: 'Spoon', undercoverWord: 'Fork' },

  // 6. Animals & Nature
  { id: 'nt-1', category: 'nature', civilianWord: 'Lion', undercoverWord: 'Tiger' },
  { id: 'nt-2', category: 'nature', civilianWord: 'Dolphin', undercoverWord: 'Whale' },
  { id: 'nt-3', category: 'nature', civilianWord: 'Butterfly', undercoverWord: 'Moth' },
  { id: 'nt-4', category: 'nature', civilianWord: 'Crocodile', undercoverWord: 'Alligator' },
  { id: 'nt-5', category: 'nature', civilianWord: 'Wolf', undercoverWord: 'Fox' },
  { id: 'nt-6', category: 'nature', civilianWord: 'Duck', undercoverWord: 'Goose' },
  { id: 'nt-7', category: 'nature', civilianWord: 'Rabbit', undercoverWord: 'Hare' },
  { id: 'nt-8', category: 'nature', civilianWord: 'Leopard', undercoverWord: 'Cheetah' },
  { id: 'nt-9', category: 'nature', civilianWord: 'Eagle', undercoverWord: 'Falcon' },
  { id: 'nt-10', category: 'nature', civilianWord: 'Frog', undercoverWord: 'Toad' },
  { id: 'nt-11', category: 'nature', civilianWord: 'Bee', undercoverWord: 'Wasp' },
  { id: 'nt-12', category: 'nature', civilianWord: 'Horse', undercoverWord: 'Donkey' },
  { id: 'nt-13', category: 'nature', civilianWord: 'Penguin', undercoverWord: 'Puffin' },
  { id: 'nt-14', category: 'nature', civilianWord: 'Octopus', undercoverWord: 'Squid' },
  { id: 'nt-15', category: 'nature', civilianWord: 'Owl', undercoverWord: 'Bat' },
  { id: 'nt-16', category: 'nature', civilianWord: 'Shark', undercoverWord: 'Swordfish' },
];

export function getRandomWordPair(
  category: string = 'all',
  rng: () => number = Math.random,
  customPair?: { civilian: string; undercover: string }
): WordPair {
  if (customPair && customPair.civilian && customPair.undercover) {
    return {
      id: `custom-${Date.now()}`,
      category: 'custom',
      civilianWord: customPair.civilian.trim(),
      undercoverWord: customPair.undercover.trim(),
    };
  }

  let pool = WORD_PAIRS;
  if (category && category !== 'all' && category !== 'All') {
    const filtered = WORD_PAIRS.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  const idx = Math.floor(rng() * pool.length);
  const chosen = pool[idx];

  // 50% chance to flip civilian and undercover so the first word isn't always civilian
  const flip = rng() > 0.5;

  return {
    id: chosen.id,
    category: chosen.category,
    civilianWord: flip ? chosen.civilianWord : chosen.undercoverWord,
    undercoverWord: flip ? chosen.undercoverWord : chosen.civilianWord,
  };
}
