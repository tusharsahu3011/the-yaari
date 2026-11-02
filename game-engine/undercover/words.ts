import { WordPair } from './types';

export const WORD_PAIRS: WordPair[] = [
  // Food & Drinks
  { id: 'fd-1', category: 'Food & Drinks', civilianWord: 'Coffee', undercoverWord: 'Tea' },
  { id: 'fd-2', category: 'Food & Drinks', civilianWord: 'Pizza', undercoverWord: 'Burger' },
  { id: 'fd-3', category: 'Food & Drinks', civilianWord: 'Butter', undercoverWord: 'Margarine' },
  { id: 'fd-4', category: 'Food & Drinks', civilianWord: 'Apple', undercoverWord: 'Pear' },
  { id: 'fd-5', category: 'Food & Drinks', civilianWord: 'Chocolate', undercoverWord: 'Candy' },
  { id: 'fd-6', category: 'Food & Drinks', civilianWord: 'Ice Cream', undercoverWord: 'Frozen Yogurt' },
  { id: 'fd-7', category: 'Food & Drinks', civilianWord: 'Pancake', undercoverWord: 'Waffle' },
  { id: 'fd-8', category: 'Food & Drinks', civilianWord: 'Ketchup', undercoverWord: 'Mustard' },

  // Everyday Objects & Clothing
  { id: 'obj-1', category: 'Everyday Objects', civilianWord: 'Pen', undercoverWord: 'Pencil' },
  { id: 'obj-2', category: 'Everyday Objects', civilianWord: 'Pillow', undercoverWord: 'Cushion' },
  { id: 'obj-3', category: 'Everyday Objects', civilianWord: 'Glasses', undercoverWord: 'Sunglasses' },
  { id: 'obj-4', category: 'Everyday Objects', civilianWord: 'Jacket', undercoverWord: 'Coat' },
  { id: 'obj-5', category: 'Everyday Objects', civilianWord: 'Soap', undercoverWord: 'Shampoo' },
  { id: 'obj-6', category: 'Everyday Objects', civilianWord: 'Backpack', undercoverWord: 'Handbag' },
  { id: 'obj-7', category: 'Everyday Objects', civilianWord: 'Blanket', undercoverWord: 'Quilt' },

  // Tech & Pop Culture
  { id: 'tech-1', category: 'Tech & Media', civilianWord: 'Laptop', undercoverWord: 'Tablet' },
  { id: 'tech-2', category: 'Tech & Media', civilianWord: 'YouTube', undercoverWord: 'TikTok' },
  { id: 'tech-3', category: 'Tech & Media', civilianWord: 'Instagram', undercoverWord: 'Snapchat' },
  { id: 'tech-4', category: 'Tech & Media', civilianWord: 'iPhone', undercoverWord: 'Android' },
  { id: 'tech-5', category: 'Tech & Media', civilianWord: 'Spotify', undercoverWord: 'Apple Music' },
  { id: 'tech-6', category: 'Tech & Media', civilianWord: 'Headphones', undercoverWord: 'Earbuds' },

  // Nature & Animals
  { id: 'nat-1', category: 'Nature & Animals', civilianWord: 'Lion', undercoverWord: 'Tiger' },
  { id: 'nat-2', category: 'Nature & Animals', civilianWord: 'Ocean', undercoverWord: 'Sea' },
  { id: 'nat-3', category: 'Nature & Animals', civilianWord: 'River', undercoverWord: 'Lake' },
  { id: 'nat-4', category: 'Nature & Animals', civilianWord: 'Rain', undercoverWord: 'Snow' },
  { id: 'nat-5', category: 'Nature & Animals', civilianWord: 'Cat', undercoverWord: 'Dog' },
  { id: 'nat-6', category: 'Nature & Animals', civilianWord: 'Forest', undercoverWord: 'Jungle' },

  // Travel & Places
  { id: 'pl-1', category: 'Travel & Places', civilianWord: 'Hotel', undercoverWord: 'Resort' },
  { id: 'pl-2', category: 'Travel & Places', civilianWord: 'Train', undercoverWord: 'Bus' },
  { id: 'pl-3', category: 'Travel & Places', civilianWord: 'Airport', undercoverWord: 'Train Station' },
  { id: 'pl-4', category: 'Travel & Places', civilianWord: 'Beach', undercoverWord: 'Swimming Pool' },
  { id: 'pl-5', category: 'Travel & Places', civilianWord: 'Cinema', undercoverWord: 'Theatre' },
];

export function getRandomWordPair(category?: string, rng: () => number = Math.random): WordPair {
  let pool = WORD_PAIRS;
  if (category && category !== 'All') {
    const filtered = WORD_PAIRS.filter((p) => p.category === category);
    if (filtered.length > 0) pool = filtered;
  }
  const idx = Math.floor(rng() * pool.length);
  return pool[idx];
}
