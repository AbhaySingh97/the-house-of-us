/**
 * ============================================================================
 * THE HOUSE OF US — CENTRAL CUSTOMIZATION CONFIGURATION
 * ============================================================================
 * 
 * Edit this file to personalize the story, letters, memories, recipient,
 * sender, and final surprise. No 3D engine or geometry changes are needed!
 */

export interface GameCustomConfig {
  meta: {
    gameTitle: string;
    subTitle: string;
    version: string;
  };
  names: {
    recipientName: string;
    senderName: string;
  };
  narrative: {
    introGreeting: string;
    introParagraphs: string[];
    welcomeNote: {
      title: string;
      body: string[];
      signature: string;
    };
    letters: {
      memoryRoom: {
        title: string;
        date: string;
        body: string[];
        hint: string;
      };
      library: {
        title: string;
        date: string;
        body: string[];
        hint: string;
      };
      conservatory: {
        title: string;
        date: string;
        body: string[];
        hint: string;
      };
    };
    finalSurprise: {
      title: string;
      subtitle: string;
      letterHeading: string;
      paragraphs: string[];
      closing: string;
      signature: string;
      questionPrompt?: string;
      questionOptions?: string[];
      responseFeedback?: Record<string, string>;
    };
  };
  puzzles: {
    memoryPuzzle: {
      title: string;
      description: string;
      hint: string;
      correctSequence: ('hourglass' | 'rose_quartz' | 'music_box')[];
      items: {
        id: 'hourglass' | 'rose_quartz' | 'music_box';
        label: string;
        meaning: string;
        lore: string;
      }[];
    };
    libraryPuzzle: {
      title: string;
      description: string;
      hint: string;
      combination: [number, number, number];
      books: {
        id: string;
        title: string;
        author: string;
        clueNumber: number;
        symbol: string;
        quote: string;
      }[];
    };
    gardenPuzzle: {
      title: string;
      description: string;
      hint: string;
      correctSequence: ('dawn' | 'meadow' | 'twilight' | 'starlight')[];
      lanterns: {
        id: 'dawn' | 'meadow' | 'twilight' | 'starlight';
        title: string;
        subtitle: string;
        color: string;
      }[];
    };
    finalRiddle: {
      title: string;
      prompt: string;
      hint: string;
      options: {
        id: string;
        word: string;
        symbol: string;
        theme: string;
      }[];
      correctSequence: string[];
    };
  };
  defaultSettings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    mouseSensitivity: number;
    reducedMotion: boolean;
  };
}

export const GAME_CONFIG: GameCustomConfig = {
  meta: {
    gameTitle: "The House of Us",
    subTitle: "A Romantic First-Person 3D Journey",
    version: "1.0.0",
  },

  names: {
    recipientName: "Beloved",
    senderName: "Yours, Always",
  },

  narrative: {
    introGreeting: "Welcome to The House of Us",
    introParagraphs: [
      "Every room in this house holds a chapter of something tender and enduring.",
      "The doors are locked not to keep you out, but to invite you to walk slowly, remember, and discover what was built for you.",
      "Follow the soft lantern light, listen to the rain on the glass, and unlock the memories within."
    ],

    welcomeNote: {
      title: "Before You Step In",
      body: [
        "If you are reading this, you found the keyhole in the rain and stepped inside.",
        "Take off the cold outside world. Walk freely through these halls.",
        "To begin, search the entrance hall table — there is an ornate brass key waiting just beside the dried lavender that opens the door to our memories."
      ],
      signature: "— Look around the console table"
    },

    letters: {
      memoryRoom: {
        title: "Chapter I: The Echo of Beginning",
        date: "An Unforgettable Evening",
        body: [
          "Do you remember the night time seemed to pause for us?",
          "First came the patience of hours slipping by like sand through the hourglass.",
          "Then, the quiet blush of feeling — tender and soft as rose quartz.",
          "And finally, the melody we couldn't stop humming together, like a sweet music box winding into the night.",
          "Arrange the three keepsakes on the velvet box in that gentle order to open the heart of this room."
        ],
        hint: "Sand through the hourglass first, the blush of rose quartz second, the melody of the music box third."
      },

      library: {
        title: "Chapter II: Written in the Margins",
        date: "Between the Pages",
        body: [
          "I placed our memories into three favorite volumes on these mahogany shelves.",
          "Volume I: Chapter 7 — 'The First Glance'",
          "Volume II: Chapter 2 — 'The Second Chance We Never Needed'",
          "Volume III: Chapter 4 — 'Four Seasons Spent Beside You'",
          "Enter these chapter numbers into the brass dials on the secret desk compartment to open the path to the winter garden."
        ],
        hint: "The three numbered volumes read 7 - 2 - 4."
      },

      conservatory: {
        title: "Chapter III: The Garden of Seasons",
        date: "Under Glass & Starlight",
        body: [
          "Our love did not bloom all at once; it grew like this greenhouse under gentle weather.",
          "First came the warm golden promise of DAWN.",
          "Then the vibrant green shelter of the MEADOW.",
          "Next the quiet stillness of TWILIGHT.",
          "And at last, the eternal glow of STARLIGHT.",
          "Kindle the four lanterns in this order, and the grand doors to our sanctuary will swing wide."
        ],
        hint: "Follow the sky: Dawn (Amber) → Meadow (Green) → Twilight (Purple) → Starlight (Rose Gold)."
      }
    },

    finalSurprise: {
      title: "The Sanctuary of Us",
      subtitle: "A Promise Kept in Petals & Light",
      letterHeading: "To My Favorite Person in the World,",
      paragraphs: [
        "You walked through every hallway, solved every puzzle, and arrived at the center of everything I cherish.",
        "Every brick of this house was imagined with you in mind: the laughter in the corridors, the quiet moments between the pages, the rain that only made our room feel warmer.",
        "No matter where life takes us, through every storm or quiet dawn, you will always have a sanctuary here.",
        "Thank you for being my anchor, my sweetest joy, and my greatest adventure."
      ],
      closing: "With all my love, forever and a day,",
      signature: "Yours, Always",
      questionPrompt: "Will you keep building this beautiful story with me?",
      questionOptions: [
        "Yes, with all my heart! ❤️",
        "Always, in every room of life 🕊️",
        "A thousand times yes ✨"
      ],
      responseFeedback: {
        "Yes, with all my heart! ❤️": "Then our story has only just begun. Happy moments, beautiful memories, and a lifetime ahead.",
        "Always, in every room of life 🕊️": "Every room, every hallway, every season — hand in hand.",
        "A thousand times yes ✨": "Then here is to a thousand tomorrows, each brighter than the last."
      }
    }
  },

  puzzles: {
    memoryPuzzle: {
      title: "The Keepsake Alignment",
      description: "Place the three symbolic keepsakes into the casket in the order of our story.",
      hint: "Remember the letter: Time (Hourglass) → Feeling (Rose Quartz) → Song (Music Box).",
      correctSequence: ['hourglass', 'rose_quartz', 'music_box'],
      items: [
        {
          id: 'hourglass',
          label: 'Antique Brass Hourglass',
          meaning: 'The Patience of Time',
          lore: 'Golden sand measuring the sweet hours we spent talking until sunrise.'
        },
        {
          id: 'rose_quartz',
          label: 'Raw Rose Quartz Crystal',
          meaning: 'The Softness of Love',
          lore: 'Warm and translucent, glowing with the gentle warmth of true affection.'
        },
        {
          id: 'music_box',
          label: 'Enamelled Music Box',
          meaning: 'Our Shared Melody',
          lore: 'A delicate wind-up melody that plays the song that first brought us together.'
        }
      ]
    },

    libraryPuzzle: {
      title: "The Scholar's Combination Lock",
      description: "Turn the three brass dials to the chapters hidden within the library books.",
      hint: "Check the inscribed volumes: First Glance (7), Second Chance (2), Four Seasons (4).",
      combination: [7, 2, 4],
      books: [
        {
          id: 'book_1',
          title: 'The First Glance',
          author: 'Memoirs of Autumn',
          clueNumber: 7,
          symbol: 'VII',
          quote: '"Chapter 7: When two eyes meet in an crowded room and everything else falls silent."'
        },
        {
          id: 'book_2',
          title: 'The Second Chance',
          author: 'Chronicles of Grace',
          clueNumber: 2,
          symbol: 'II',
          quote: '"Chapter 2: We never needed second chances; truth was in our first conversation."'
        },
        {
          id: 'book_3',
          title: 'Four Seasons',
          author: 'Essays in Devotion',
          clueNumber: 4,
          symbol: 'IV',
          quote: '"Chapter 4: Spring blossomed, summer warmed, autumn glowed, and winter held us close."'
        }
      ]
    },

    gardenPuzzle: {
      title: "The Conservatory Lanterns",
      description: "Activate the four glass lanterns in the natural rhythm of the day.",
      hint: "Follow the cycle of sky: Dawn → Meadow → Twilight → Starlight.",
      correctSequence: ['dawn', 'meadow', 'twilight', 'starlight'],
      lanterns: [
        { id: 'dawn', title: 'Lantern of Dawn', subtitle: 'Warm Amber Light', color: '#ffaa33' },
        { id: 'meadow', title: 'Lantern of Meadow', subtitle: 'Verdant Emerald Glow', color: '#33dd77' },
        { id: 'twilight', title: 'Lantern of Twilight', subtitle: 'Deep Amethyst Haze', color: '#aa55ee' },
        { id: 'starlight', title: 'Lantern of Starlight', subtitle: 'Rose Gold Radiance', color: '#ff66aa' }
      ]
    },

    finalRiddle: {
      title: "The Heart of the Sanctuary",
      prompt: "Touch the three pillars of our journey to unlock the celestial chest.",
      hint: "The three foundations: Where we began (MEMORIES), how we grew (GROWTH), and what we promise (FOREVER).",
      options: [
        { id: 'MEMORIES', word: 'MEMORIES', symbol: '🗝️', theme: 'The Foundation' },
        { id: 'GROWTH', word: 'GROWTH', symbol: '🌿', theme: 'The Journey' },
        { id: 'FOREVER', word: 'FOREVER', symbol: '💍', theme: 'The Promise' },
        { id: 'FEAR', word: 'SHADOWS', symbol: '🌑', theme: 'The Past' },
        { id: 'DISTANCE', word: 'DISTANCE', symbol: '⌛', theme: 'The Space' }
      ],
      correctSequence: ['MEMORIES', 'GROWTH', 'FOREVER']
    }
  },

  defaultSettings: {
    masterVolume: 0.75,
    musicVolume: 0.65,
    sfxVolume: 0.8,
    mouseSensitivity: 1.0,
    reducedMotion: false
  }
};
