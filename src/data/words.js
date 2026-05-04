// Word bank organized by category and difficulty.
// Hints are shown only when the player spends a hint token.
export const CATEGORIES = ['animals', 'countries', 'movies', 'science', 'food', 'sports'];

export const WORDS = {
  animals: {
    easy:   [
      { word: 'cat', hint: 'Purrs and chases mice' },
      { word: 'dog', hint: "Man's best friend" },
      { word: 'cow', hint: 'Says moo' },
      { word: 'fish', hint: 'Lives in water' },
      { word: 'bird', hint: 'Has feathers and wings' },
      { word: 'lion', hint: 'King of the jungle' },
      { word: 'bear', hint: 'Loves honey' },
      { word: 'frog', hint: 'Jumps and croaks' },
    ],
    medium: [
      { word: 'panda', hint: 'Black and white bamboo lover' },
      { word: 'tiger', hint: 'Striped big cat' },
      { word: 'horse', hint: 'You can ride it' },
      { word: 'eagle', hint: 'Soars high above' },
      { word: 'shark', hint: 'Apex ocean predator' },
      { word: 'zebra', hint: 'Stripes on the savanna' },
      { word: 'koala', hint: 'Sleeps in eucalyptus trees' },
    ],
    hard: [
      { word: 'octopus',  hint: 'Eight arms, very smart' },
      { word: 'penguin',  hint: 'Tuxedoed flightless bird' },
      { word: 'dolphin',  hint: 'Friendly sea mammal' },
      { word: 'giraffe',  hint: 'Tallest land animal' },
      { word: 'cheetah',  hint: 'Fastest land animal' },
      { word: 'elephant', hint: 'Long trunk, big ears' },
    ],
    expert: [
      { word: 'chameleon',   hint: 'Changes color to blend in' },
      { word: 'hippopotamus',hint: 'Massive river dweller' },
      { word: 'rhinoceros',  hint: 'Has a horn on its nose' },
      { word: 'platypus',    hint: 'Egg-laying mammal with a bill' },
      { word: 'pterodactyl', hint: 'Flying prehistoric reptile' },
    ],
  },
  countries: {
    easy:   [
      { word: 'india',  hint: 'Land of the Taj Mahal' },
      { word: 'japan',  hint: 'Rising sun and sushi' },
      { word: 'spain',  hint: 'Flamenco and paella' },
      { word: 'italy',  hint: 'Boot-shaped, home of pizza' },
      { word: 'china',  hint: 'Great Wall is here' },
    ],
    medium: [
      { word: 'brazil',  hint: 'Carnival and Amazon rainforest' },
      { word: 'canada',  hint: 'Maple syrup country' },
      { word: 'france',  hint: 'Eiffel Tower stands here' },
      { word: 'mexico',  hint: 'Tacos and pyramids' },
      { word: 'norway',  hint: 'Land of fjords' },
      { word: 'turkey',  hint: 'Bridge between Europe and Asia' },
    ],
    hard: [
      { word: 'portugal',  hint: 'Famous for fado music' },
      { word: 'thailand',  hint: 'Land of smiles and temples' },
      { word: 'malaysia',  hint: 'Petronas Towers landmark' },
      { word: 'mongolia',  hint: 'Genghis Khan came from here' },
      { word: 'argentina', hint: 'Tango and the Pampas' },
    ],
    expert: [
      { word: 'kazakhstan',    hint: 'Largest landlocked country' },
      { word: 'liechtenstein', hint: 'Tiny Alpine principality' },
      { word: 'madagascar',    hint: 'African island, unique wildlife' },
      { word: 'mozambique',    hint: 'Indian Ocean coastline in Africa' },
    ],
  },
  movies: {
    easy:   [
      { word: 'jaws',  hint: 'A great white shark thriller' },
      { word: 'rocky', hint: 'A boxer from Philadelphia' },
      { word: 'shrek', hint: 'A green ogre and a donkey' },
      { word: 'cars',  hint: 'Pixar racing animation' },
    ],
    medium: [
      { word: 'matrix', hint: 'Red pill or blue pill?' },
      { word: 'avatar', hint: 'Blue people on Pandora' },
      { word: 'frozen', hint: 'Let it go!' },
      { word: 'titanic',hint: 'A doomed ocean liner' },
    ],
    hard: [
      { word: 'gladiator',   hint: 'Roman general turned fighter' },
      { word: 'inception',   hint: 'Dreams within dreams' },
      { word: 'starwars',    hint: 'A galaxy far, far away' },
      { word: 'goodfellas',  hint: 'Mob life classic' },
    ],
    expert: [
      { word: 'interstellar',   hint: 'Wormholes and time dilation' },
      { word: 'pulpfiction',    hint: 'Tarantino non-linear classic' },
      { word: 'shawshank',      hint: 'Hope and a prison escape' },
      { word: 'casablanca',     hint: 'Of all the gin joints...' },
    ],
  },
  science: {
    easy:   [
      { word: 'atom',  hint: 'Smallest unit of matter' },
      { word: 'cell',  hint: 'Basic unit of life' },
      { word: 'mass',  hint: 'Amount of matter in an object' },
      { word: 'force', hint: 'Push or pull' },
    ],
    medium: [
      { word: 'gravity', hint: 'Keeps you on the ground' },
      { word: 'neuron',  hint: 'Cell in your brain' },
      { word: 'photon',  hint: 'Particle of light' },
      { word: 'genome',  hint: 'Complete set of DNA' },
    ],
    hard: [
      { word: 'molecule',   hint: 'Two or more bonded atoms' },
      { word: 'mitochondria', hint: 'Powerhouse of the cell' },
      { word: 'velocity',   hint: 'Speed with direction' },
      { word: 'frequency',  hint: 'Cycles per second' },
    ],
    expert: [
      { word: 'photosynthesis', hint: 'How plants make food' },
      { word: 'thermodynamics', hint: 'Study of heat and energy' },
      { word: 'electromagnetism',hint: 'Force linking electricity and magnetism' },
      { word: 'biodiversity',   hint: 'Variety of life on Earth' },
    ],
  },
  food: {
    easy: [
      { word: 'pizza', hint: 'Italian round, cheesy delight' },
      { word: 'sushi', hint: 'Japanese rice and fish' },
      { word: 'taco',  hint: 'Mexican folded shell' },
      { word: 'pasta', hint: 'Italian noodle dish' },
    ],
    medium: [
      { word: 'burger',  hint: 'Patty in a bun' },
      { word: 'noodles', hint: 'Long stringy carbs' },
      { word: 'biryani', hint: 'Spiced rice dish from South Asia' },
      { word: 'lasagna', hint: 'Layered pasta and cheese' },
    ],
    hard: [
      { word: 'bruschetta',  hint: 'Toasted bread with toppings' },
      { word: 'croissant',   hint: 'Flaky French pastry' },
      { word: 'guacamole',   hint: 'Avocado-based dip' },
      { word: 'tiramisu',    hint: 'Italian coffee dessert' },
    ],
    expert: [
      { word: 'ratatouille',     hint: 'French vegetable stew' },
      { word: 'schnitzel',       hint: 'Breaded thin cutlet' },
      { word: 'caprese',         hint: 'Tomato, mozzarella, basil' },
      { word: 'chimichurri',     hint: 'Argentinian green sauce' },
    ],
  },
  sports: {
    easy: [
      { word: 'golf',  hint: 'Played with clubs and small ball' },
      { word: 'judo',  hint: 'Japanese martial art' },
      { word: 'polo',  hint: 'Played on horseback' },
      { word: 'chess', hint: 'Board game of kings' },
    ],
    medium: [
      { word: 'tennis',  hint: 'Played on a court with a net' },
      { word: 'soccer',  hint: 'World’s most popular sport' },
      { word: 'hockey',  hint: 'Played on ice with a puck' },
      { word: 'boxing',  hint: 'Two fighters with gloves' },
    ],
    hard: [
      { word: 'baseball',   hint: 'Bat, ball, and bases' },
      { word: 'cricket',    hint: 'Played with a bat and wickets' },
      { word: 'lacrosse',   hint: 'Stick with a netted head' },
      { word: 'archery',    hint: 'Bow and arrow precision' },
    ],
    expert: [
      { word: 'snowboarding', hint: 'Down a mountain on one board' },
      { word: 'taekwondo',    hint: 'Korean kicking art' },
      { word: 'badminton',    hint: 'Played with a shuttlecock' },
      { word: 'gymnastics',   hint: 'Beams, bars and floor routines' },
    ],
  },
};

export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert'];

export const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   maxWrong: 8, points: 50,  timeLimit: 90 },
  medium: { label: 'Medium', maxWrong: 6, points: 100, timeLimit: 75 },
  hard:   { label: 'Hard',   maxWrong: 5, points: 200, timeLimit: 60 },
  expert: { label: 'Expert', maxWrong: 4, points: 350, timeLimit: 45 },
};

// Sample a random word entry from a category + difficulty.
export function pickWord(category, difficulty, exclude = new Set()) {
  const pool = (WORDS[category]?.[difficulty] || []).filter((w) => !exclude.has(w.word));
  const source = pool.length ? pool : WORDS[category][difficulty];
  return source[Math.floor(Math.random() * source.length)];
}

// Pick a word from any category at a given difficulty (for non-Categories modes).
export function pickWordAnyCategory(difficulty, exclude = new Set()) {
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  return { ...pickWord(cat, difficulty, exclude), category: cat };
}
