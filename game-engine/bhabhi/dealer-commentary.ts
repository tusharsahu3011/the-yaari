import { BhabhiGameState, GameEventRecord } from './types';
import { getCardShortCode } from './deck';

export type DealerPersonality = 'desi_host' | 'savage' | 'dramatic' | 'chill';

export interface DealerQuote {
  dealerName: string;
  avatar: string;
  text: string;
  mood: 'hype' | 'shock' | 'laugh' | 'celebrate' | 'roast';
}

const DESI_HOST_TEMPLATES = {
  GAME_START: [
    'Aao ji aao! The stage is set, cards are dealt. Let the Bhabhi showdown begin!',
    'Arre waah! Look who holds the Ace of Spades! Khel shuru!',
    'Welcome to the arena! Remember: in Bhabhi, pride hurts, but picking up the pile hurts more!',
  ],
  THULLA: [
    'O HO HO! Khel khatam, paisa hazam! Seedha THULLA!',
    'Arre baap re! The trap was set and someone walked right into it! Pura bundle uthao!',
    'THOKO! That is what happens when you lead so high, dost! Enjoy the heavy gift!',
    'Waah re waah! The ultimate betrayal! Pick up those cards with both hands!',
  ],
  CLEAN_SWEEP: [
    'Smooth as butter! Everyone respected the suit. Cards safely thrown out!',
    'Clean sweep ji! Shanti shanti... nobody got burned this turn.',
    'Phew! Everyone had the suit. The pile goes to the bin, game moves fast!',
  ],
  PLAYER_SAFE: [
    'WAHHH! Got away scot-free! One less candidate for the Bhabhi title!',
    'And they ESCAPED! Hands empty, tension zero! Brilliant play!',
    'Mubarak ho! Escaped the danger zone! Now sit back and watch the remaining drama!',
  ],
  GAME_OVER: [
    'KUDIYE OYE / BHAIYA JI! WE HAVE OUR BHABHI! Treat the house to tea & samosas!',
    'Areyyy re re! The last one standing with the deck! All salute the new BHABHI!',
    'GAME OVER! Put the crown on their head: Today\'s official Bhabhi has been crowned!',
  ],
  CARD_PLAYED_HIGH: [
    'Oof! Playing an Ace? Bold move... let\'s see if anyone has a Thulla ready!',
    'King on the board! The air is smelling like danger!',
  ],
};

const SAVAGE_TEMPLATES = {
  GAME_START: [
    'Don\'t cry when you get the whole deck. You agreed to play.',
    '4 enter, 1 becomes the laughing stock. Let\'s make it fast.',
  ],
  THULLA: [
    'BOOM! Did that hurt? Don\'t answer, just pick up your pile.',
    'That Thulla was personal. Enjoy your new 15-card hand!',
    'You wanted high cards? Have ALL of them. Bon appétit!',
  ],
  CLEAN_SWEEP: [
    'Boring. Everyone followed suit. Throw them away.',
    'A quiet trick. Don\'t worry, someone will choke soon.',
  ],
  PLAYER_SAFE: [
    'Barely slipped away. Don\'t act like you planned that.',
    'You survived. The others are sweating now.',
  ],
  GAME_OVER: [
    'Congratulations on losing completely. Wear the Bhabhi title with honor!',
    'And that\'s how you choke at card games. Meet our new Bhabhi!',
  ],
  CARD_PLAYED_HIGH: [
    'Playing high with no backup? You like living dangerously, don\'t you?',
  ],
};

const DRAMATIC_TEMPLATES = {
  GAME_START: [
    'The prophecy unfolds... one soul shall bear the eternal mantle of Bhabhi!',
    'Destiny rests upon the Ace of Spades! Behold the opening strike!',
  ],
  THULLA: [
    'BETRAYAL! The off-suit strike falls like thunder from a clear sky! THE PILE MUST BE CLAIMED!',
    'A catastrophic Thulla! The table quakes as the cards are gathered in despair!',
  ],
  CLEAN_SWEEP: [
    'Harmony prevails... the trick dissolves into the ether!',
  ],
  PLAYER_SAFE: [
    'FREEDOM! Against all odds, a champion breaks the chains and ascends to safety!',
  ],
  GAME_OVER: [
    'THE JUDGMENT IS COMPLETE! The final card remains in trembling hands. THE BHABHI IS REVEALED!',
  ],
  CARD_PLAYED_HIGH: [
    'The heavens tremble at such audacity! A royal card hits the felt!',
  ],
};

export function getDealerCommentary(
  event: GameEventRecord,
  gameState: BhabhiGameState,
  personality: DealerPersonality = 'desi_host'
): DealerQuote | null {
  const templates =
    personality === 'desi_host'
      ? DESI_HOST_TEMPLATES
      : personality === 'savage'
      ? SAVAGE_TEMPLATES
      : DRAMATIC_TEMPLATES;

  let pool: string[] | undefined;
  let mood: DealerQuote['mood'] = 'hype';

  switch (event.type) {
    case 'GAME_START':
      pool = templates.GAME_START;
      mood = 'hype';
      break;
    case 'THULLA':
      pool = templates.THULLA;
      mood = personality === 'savage' ? 'roast' : 'shock';
      break;
    case 'CLEAN_SWEEP':
      pool = templates.CLEAN_SWEEP;
      mood = 'hype';
      break;
    case 'PLAYER_SAFE':
      pool = templates.PLAYER_SAFE;
      mood = 'celebrate';
      break;
    case 'GAME_OVER':
      pool = templates.GAME_OVER;
      mood = 'roast';
      break;
    case 'CARD_PLAYED':
      // React to high cards (rank >= 13) or 1 card left
      if (event.card && event.card.rank >= 13 && gameState.activeTrick.cards.length === 1) {
        pool = templates.CARD_PLAYED_HIGH;
        mood = 'shock';
      }
      break;
  }

  if (!pool || pool.length === 0) return null;

  const text = pool[Math.floor(Math.random() * pool.length)];
  const dealerName =
    personality === 'desi_host'
      ? 'Chacha Chaudhary'
      : personality === 'savage'
      ? 'Viper'
      : 'The Grandmaster';

  const avatar =
    personality === 'desi_host' ? '👳‍♂️' : personality === 'savage' ? '🕶️' : '🧙‍♂️';

  return {
    dealerName,
    avatar,
    text,
    mood,
  };
}
