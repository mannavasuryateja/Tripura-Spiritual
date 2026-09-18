export interface BookChapter {
  title: string;
  duration: string;
  isFree?: boolean;
}

export interface BookItem {
  id: string;
  title: string;
  teluguTitle?: string;
  author: string;
  tag: string;
  duration: string;
  episodesCount: number;
  price: number;
  coverImage: string;
  synopsis: string;
  masterQuote: string;
  chapters: BookChapter[];
}

export const SPIRITUAL_BOOKS: BookItem[] = [
  {
    id: 'tripura-rahasya',
    title: 'Tripura Rahasya',
    teluguTitle: 'త్రిపుర రహస్యము (జ్ఞాన ఖండము)',
    author: 'Sage Haritayana / Dattatreya Lineage',
    tag: 'SUPREME NON-DUALITY',
    duration: '3 hrs 45 mins',
    episodesCount: 6,
    price: 199,
    coverImage: '/hero.jpg',
    synopsis: 'The crown jewel of Advaita and Shakta philosophy. Dattatreya reveals the mystery of the Goddess as Pure Consciousness (Chiti Shakti) to Sage Parasurama through profound allegorical stories and direct methods for abiding in effortless self-realization.',
    masterQuote: 'In Tripura Rahasya, the universe is not an illusion to run away from, but the vibrant reflection of Pure Awareness. When you see your own mind without judgment, you realize there never was a separate observer.',
    chapters: [
      { title: 'Chapter 1: The Disillusionment of Parasurama & Meeting Dattatreya', duration: '34:10', isFree: true },
      { title: 'Chapter 2: The Nature of the Cosmos as Mirror of Consciousness', duration: '38:25', isFree: true },
      { title: 'Chapter 3: The Story of Queen Hemalekha & The Wisdom of Discernment', duration: '42:50', isFree: false },
      { title: 'Chapter 4: The Mystery of the Unmanifest Space (Chidakasha)', duration: '36:15', isFree: false },
      { title: 'Chapter 5: How Thoughts Arise and Dissolve in Inner Silence', duration: '40:20', isFree: false },
      { title: 'Chapter 6: Abiding in Continuous Natural Samadhi (Sahaja Sthiti)', duration: '45:00', isFree: false }
    ]
  },
  {
    id: 'bhagavad-gita-sthitaprajna',
    title: 'Bhagavad Gita: The Sthitaprajna State',
    teluguTitle: 'భగవద్గీత: స్థితప్రజ్ఞ లక్షణములు',
    author: 'Bhagavan Sri Krishna / Vyasa',
    tag: 'EQUANIMITY IN ACTION',
    duration: '4 hrs 10 mins',
    episodesCount: 5,
    price: 199,
    coverImage: '/card2.jpg',
    synopsis: 'An intensive, verse-by-verse audio exploration of the Sthitaprajna (one of steady wisdom) from Chapter 2 and Dhyana Yoga from Chapter 6. Practical tools to remain unshakable amidst joy, sorrow, praise, and blame in daily modern life.',
    masterQuote: 'Sthitaprajna is not someone who suppresses emotions. It is someone whose depth is like the ocean — hundreds of rivers rush into it, yet its surface remains calm and untroubled.',
    chapters: [
      { title: 'Discourse 1: The Questions of Arjuna — Who is the Steady Minded?', duration: '42:10', isFree: true },
      { title: 'Discourse 2: Conquering Desire & The Subtle Traps of the Senses', duration: '48:30', isFree: false },
      { title: 'Discourse 3: The Ocean Analogy — Transcending Emotional Reactive Patterns', duration: '51:15', isFree: false },
      { title: 'Discourse 4: Chapter 6 Dhyana Yoga — Posture, Breath and Mind Stillness', duration: '46:40', isFree: false },
      { title: 'Discourse 5: Living as Sthitaprajna in Modern Corporate & Family Life', duration: '52:00', isFree: false }
    ]
  },
  {
    id: 'yoga-vasistha',
    title: 'Yoga Vasistha: Supreme Consciousness',
    teluguTitle: 'యోగ వాసిష్ఠము - మహా జ్ఞాన తరంగాలు',
    author: 'Sage Valmiki / Sage Vasistha',
    tag: 'COSMIC WISDOM',
    duration: '5 hrs 20 mins',
    episodesCount: 7,
    price: 249,
    coverImage: '/card3.jpg',
    synopsis: 'The profound dialogues between Sage Vasistha and young Sri Rama addressing existential melancholy, the architecture of time and space, mental projection, and the liberation of the living master (Jivanmukti).',
    masterQuote: 'The world is as you imagine it. Change the lens of the conditioned mind, and the very same world turns from a prison into a playground of divine play (Lila).',
    chapters: [
      { title: 'Part 1: The Spiritual Melancholy of Sri Rama (Vairagya Prakarana)', duration: '45:10', isFree: true },
      { title: 'Part 2: The Power of Noble Self-Effort (Purushartha)', duration: '44:20', isFree: false },
      { title: 'Part 3: The Origin of the Universe & The Web of Mental Conceptions', duration: '48:35', isFree: false },
      { title: 'Part 4: The Story of King Lavana — Time, Dreams & Alternate Realities', duration: '50:15', isFree: false },
      { title: 'Part 5: The Seven Stages of Spiritual Awakening (Jnana Bhumikas)', duration: '49:00', isFree: false },
      { title: 'Part 6: Dissolution of the Ego (Mano Nasha)', duration: '53:40', isFree: false },
      { title: 'Part 7: The Bliss of the Living Liberated Being (Jivanmukta)', duration: '58:00', isFree: false }
    ]
  },
  {
    id: 'patanjali-yoga-sutras',
    title: 'Patanjali Yoga Sutras',
    teluguTitle: 'పతంజలి యోగ సూత్రాలు',
    author: 'Maharishi Patanjali',
    tag: 'MIND MASTERY',
    duration: '3 hrs 30 mins',
    episodesCount: 4,
    price: 199,
    coverImage: '/card4.jpg',
    synopsis: 'A direct practical blueprint for silencing mental fluctuations (Chitta Vritti Nirodha). Master Peddi Raju Garu explains the 8 limbs of Ashtanga Yoga with modern psychological clarity and energetic breath techniques.',
    masterQuote: 'Yoga does not mean bending your body into difficult postures. Yoga means bringing your scattered thoughts into a laser-sharp single stream of awareness.',
    chapters: [
      { title: 'Sutra 1.1 - 1.4: Definition of Yoga & The Observer State', duration: '40:15', isFree: true },
      { title: 'Sutra 1.12 - 1.16: Practice (Abhyasa) and Non-Attachment (Vairagya)', duration: '45:30', isFree: false },
      { title: 'Sutra 2.28 - 2.55: The Eightfold Path & Mastery of Breath and Prana', duration: '54:10', isFree: false },
      { title: 'Sutra 3.1 - 3.8: Samyama — Concentration, Meditation & Total Union', duration: '48:20', isFree: false }
    ]
  },
  {
    id: 'i-am-that',
    title: 'I Am That (Nisargadatta Maharaj)',
    teluguTitle: 'ఐ యామ్ దట్ - నేను అదియే',
    author: 'Sri Nisargadatta Maharaj',
    tag: 'DIRECT REALIZATION',
    duration: '4 hrs 00 mins',
    episodesCount: 5,
    price: 199,
    coverImage: '/hero.jpg',
    synopsis: 'Direct non-dual pointers cutting straight to the core of identity. By resting deeply in the feeling "I Am" prior to words and concepts, all psychological burdens dissolve instantly.',
    masterQuote: 'Whatever you can observe is not you. You are the silent space in which all experiences come and go. Don’t hold on to anything; just witness.',
    chapters: [
      { title: 'Discourse 1: The Sense of "I Am" — The Starting and Ending Point', duration: '44:00', isFree: true },
      { title: 'Discourse 2: Transcending Memory and Identity', duration: '46:15', isFree: false },
      { title: 'Discourse 3: The Witness (Sakshi) and the Supreme State', duration: '48:50', isFree: false },
      { title: 'Discourse 4: Pain, Suffering, and the Fear of Death', duration: '50:30', isFree: false },
      { title: 'Discourse 5: Effortless Being — Living as Unbound Consciousness', duration: '52:10', isFree: false }
    ]
  },
  {
    id: 'autobiography-of-a-yogi',
    title: 'Autobiography of a Yogi',
    teluguTitle: 'ఒక యోగి ఆత్మకథ',
    author: 'Paramahansa Yogananda',
    tag: 'SACRED KRIYA TRADITIONS',
    duration: '4 hrs 45 mins',
    episodesCount: 6,
    price: 199,
    coverImage: '/card2.jpg',
    synopsis: 'A life-transforming spiritual journey unveiling the science of Kriya Yoga, encounters with immortal masters (Mahavatar Babaji, Lahiri Mahasaya, Sri Yukteswar), and the cosmic laws governing miracles and breath.',
    masterQuote: 'Kriya Yoga is the airplane route to God. It accelerates natural spiritual evolution by magnetizing the spine and elevating human consciousness into celestial bliss.',
    chapters: [
      { title: 'Episode 1: The Early Search for God & Meeting the Guru', duration: '42:20', isFree: true },
      { title: 'Episode 2: The Cosmic Law of Miracles & Materialization', duration: '45:10', isFree: false },
      { title: 'Episode 3: Sri Yukteswar’s Hermitage & The Strict Training of Ego', duration: '48:30', isFree: false },
      { title: 'Episode 4: Mahavatar Babaji and the Revival of Kriya Yoga', duration: '52:40', isFree: false },
      { title: 'Episode 5: The Science of Kriya Yoga & Spinal Energy Awakening', duration: '50:15', isFree: false },
      { title: 'Episode 6: Cosmic Vision of Samadhi & The Infinite Light', duration: '56:00', isFree: false }
    ]
  }
];

export const SACRED_BOOKS = SPIRITUAL_BOOKS;
