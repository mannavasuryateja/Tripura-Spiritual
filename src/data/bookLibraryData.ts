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
  problemStatement: string;
  synopsis: string;
  summaryStory: string;
  masterQuote: string;
  previewDurationMinutes: number;
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
    previewDurationMinutes: 5,
    problemStatement: 'Struggling with psychological separation, recurring existential anxiety, and inability to reconcile daily active life with deep inner spiritual peace.',
    summaryStory: 'Sage Parasurama, exhausted by endless external conquests and spiritual rituals, arrives at the feet of Lord Dattatreya demanding the ultimate truth. Dattatreya teaches that the entire cosmos is the self-luminous reflection of Tripura (Pure Consciousness). Through Queen Hemalekha’s wisdom, the student learns to dissolve mental projections without leaving their household responsibilities.',
    synopsis: 'The crown jewel of Advaita and Shakta philosophy. Dattatreya reveals the mystery of the Goddess as Pure Consciousness (Chiti Shakti) to Sage Parasurama through profound allegorical stories and direct methods for abiding in effortless self-realization.',
    masterQuote: 'In Tripura Rahasya, the universe is not an illusion to run away from, but the vibrant reflection of Pure Awareness. When you see your own mind without judgment, you realize there never was a separate observer.',
    chapters: [
      { title: 'Chapter 1: The Disillusionment of Parasurama & Meeting Dattatreya', duration: '34:10', isFree: true },
      { title: 'Chapter 2: The Nature of the Cosmos as Mirror of Consciousness', duration: '38:25', isFree: false },
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
    previewDurationMinutes: 5,
    problemStatement: 'Emotional turbulence, panic under pressure, reactive anger, and the tendency of the mind to swing violently between excessive excitement and despair.',
    summaryStory: 'On the battlefield of Kurukshetra, Arjuna collapses in grief and mental paralysis. Krishna instructs him not on renouncing action, but on transforming consciousness into the Sthitaprajna state — one whose awareness remains as undisturbed and deep as an ocean into which all rivers merge without causing it to overflow.',
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
    previewDurationMinutes: 5,
    problemStatement: 'Existential emptiness, feeling trapped in the mechanical monotony of life, and fear of time, aging, and impermanence.',
    summaryStory: 'Young Prince Rama returns from pilgrimage disillusioned by the transient nature of youth, wealth, and worldly achievements. Sage Vasistha delivers the most comprehensive discourse on how mental projections create suffering, and how through noble self-effort (Purushartha) one awakens into the bliss of the living liberated being (Jivanmukta).',
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
    previewDurationMinutes: 5,
    problemStatement: 'Severe mental wandering, inability to concentrate during meditation, scattered life energy, and restless thoughts (Chitta Vritti).',
    summaryStory: 'Maharishi Patanjali systematizes the entire science of human consciousness into concise aphorisms. Beginning with the famous definition "Yoga is the cessation of the fluctuations of the mind", Master Peddi Raju Garu breaks down how breath and prana can be harnessed to still the mind effortlessly.',
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
    previewDurationMinutes: 5,
    problemStatement: 'Over-identifying with personality, past trauma, self-doubt, and the chronic illusion of feeling separate from God or the Universe.',
    summaryStory: 'Sitting in his modest Mumbai loft, Sri Nisargadatta delivers fiery, uncompromising pointers to global seekers: "You are not the body, you are not the mind. Stay in the sense of pure existence \'I Am\' before thoughts begin." Master Peddi Raju Garu translates these pointers into experiential daily contemplation practices.',
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
    previewDurationMinutes: 5,
    problemStatement: 'Lack of faith in subtle spiritual dimensions, stagnation in dry intellectual study, and seeking the direct transmission of authentic Kriya masters.',
    summaryStory: 'The legendary narrative chronicling Paramahansa Yogananda’s quest for his Guru, encounters with Himalayan saints, and the revival of the ancient science of Kriya Yoga. Master Peddi Raju Garu explains the energetic mechanics of Mahavatar Babaji’s transmission and how everyday seekers can activate spinal energy centers.',
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
