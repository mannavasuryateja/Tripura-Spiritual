-- Tripura Spiritual Seed Full Sacred Library
-- V4__seed_full_spiritual_library.sql

-- Clear and populate books with full metadata
TRUNCATE TABLE book_episodes CASCADE;
DELETE FROM books;

-- 1. Tripura Rahasya
INSERT INTO books (id, slug, title, telugu_title, author, tag, cover_image, price, episodes_count, preview_duration_minutes, is_published, sort_order, problem_statement, summary_story, synopsis, master_quote)
VALUES (
    1,
    'tripura-rahasya',
    'Tripura Rahasya (The Mystery Beyond Trinity)',
    'త్రిపుర రహస్యము (జ్ఞాన ఖండము)',
    'Sage Haritayana / Dattatreya Lineage',
    'SUPREME NON-DUALITY',
    '/hero.jpg',
    199.00,
    6,
    5,
    true,
    1,
    'Struggling with psychological separation, recurring existential anxiety, and inability to reconcile daily active life with deep inner spiritual peace.',
    'Sage Parasurama, exhausted by endless external conquests and spiritual rituals, arrives at the feet of Lord Dattatreya demanding the ultimate truth. Dattatreya teaches that the entire cosmos is the self-luminous reflection of Tripura (Pure Consciousness). Through Queen Hemalekha’s wisdom, the student learns to dissolve mental projections without leaving their household responsibilities.',
    'The crown jewel of Advaita and Shakta philosophy. Dattatreya reveals the mystery of the Goddess as Pure Consciousness (Chiti Shakti) to Sage Parasurama through profound allegorical stories and direct methods for abiding in effortless self-realization.',
    'In Tripura Rahasya, the universe is not an illusion to run away from, but the vibrant reflection of Pure Awareness. When you see your own mind without judgment, you realize there never was a separate observer.'
);

-- Episodes for Tripura Rahasya
INSERT INTO book_episodes (book_id, episode_number, title, duration, duration_seconds, audio_url, is_free, is_published, sort_order, description)
VALUES
(1, 1, 'Chapter 1: The Disillusionment of Parasurama & Meeting Dattatreya', '34:10', 2050, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', true, true, 1, 'Parasurama encounters Lord Dattatreya and questions the futility of worldly power.'),
(1, 2, 'Chapter 2: The Nature of the Cosmos as Mirror of Consciousness', '38:25', 2305, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 2, 'How the objective world mirrors internal awareness without any external substance.'),
(1, 3, 'Chapter 3: The Story of Queen Hemalekha & The Wisdom of Discernment', '42:50', 2570, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 3, 'Queen Hemalekha instructs King Hemachuda on how to transcend sensory attachments while ruling a kingdom.'),
(1, 4, 'Chapter 4: The Mystery of the Unmanifest Space (Chidakasha)', '36:15', 2175, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', false, true, 4, 'Understanding the space of pure awareness beyond waking, dreaming, and deep sleep.'),
(1, 5, 'Chapter 5: How Thoughts Arise and Dissolve in Inner Silence', '40:20', 2420, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 5, 'Practical methods to trace any vritti back into its source of stillness.'),
(1, 6, 'Chapter 6: Abiding in Continuous Natural Samadhi (Sahaja Sthiti)', '45:00', 2700, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 6, 'Effortless enlightenment while walking, working, talking, and sleeping.');

-- 2. Bhagavad Gita: The Sthitaprajna State
INSERT INTO books (id, slug, title, telugu_title, author, tag, cover_image, price, episodes_count, preview_duration_minutes, is_published, sort_order, problem_statement, summary_story, synopsis, master_quote)
VALUES (
    2,
    'bhagavad-gita-sthitaprajna',
    'Bhagavad Gita: The Sthitaprajna State',
    'భగవద్గీత: స్థితప్రజ్ఞ లక్షణములు',
    'Bhagavan Sri Krishna / Vyasa',
    'EQUANIMITY IN ACTION',
    '/card2.jpg',
    199.00,
    5,
    5,
    true,
    2,
    'Emotional turbulence, panic under pressure, reactive anger, and the tendency of the mind to swing violently between excessive excitement and despair.',
    'On the battlefield of Kurukshetra, Arjuna collapses in grief and mental paralysis. Krishna instructs him not on renouncing action, but on transforming consciousness into the Sthitaprajna state — one whose awareness remains as undisturbed and deep as an ocean into which all rivers merge without causing it to overflow.',
    'An intensive, verse-by-verse audio exploration of the Sthitaprajna (one of steady wisdom) from Chapter 2 and Dhyana Yoga from Chapter 6. Practical tools to remain unshakable amidst joy, sorrow, praise, and blame in daily modern life.',
    'Sthitaprajna is not someone who suppresses emotions. It is someone whose depth is like the ocean — hundreds of rivers rush into it, yet its surface remains calm and untroubled.'
);

-- Episodes for Bhagavad Gita
INSERT INTO book_episodes (book_id, episode_number, title, duration, duration_seconds, audio_url, is_free, is_published, sort_order, description)
VALUES
(2, 1, 'Discourse 1: The Questions of Arjuna — Who is the Steady Minded?', '42:10', 2530, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', true, true, 1, 'Arjuna asks how the Sthitaprajna speaks, sits, and walks in the world.'),
(2, 2, 'Discourse 2: Conquering Desire & The Subtle Traps of the Senses', '48:30', 2910, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 2, 'Understanding the chain of attachment: contemplation to desire, anger, delusion, and ruin.'),
(2, 3, 'Discourse 3: The Ocean Analogy — Transcending Emotional Reactive Patterns', '51:15', 3075, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 3, 'Becoming like the ocean that receives all turbulent rivers without overflowing.'),
(2, 4, 'Discourse 4: Chapter 6 Dhyana Yoga — Posture, Breath and Mind Stillness', '46:40', 2800, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', false, true, 4, 'Practical mechanics of setting up the seat, balancing breath, and fixing attention on the Self.'),
(2, 5, 'Discourse 5: Living as Sthitaprajna in Modern Corporate & Family Life', '52:00', 3120, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 5, 'Translating battlefield wisdom into career decisions, relationship equanimity, and inner freedom.');

-- 3. Yoga Vasistha: Supreme Consciousness
INSERT INTO books (id, slug, title, telugu_title, author, tag, cover_image, price, episodes_count, preview_duration_minutes, is_published, sort_order, problem_statement, summary_story, synopsis, master_quote)
VALUES (
    3,
    'yoga-vasistha',
    'Yoga Vasistha: Supreme Consciousness',
    'యోగ వాసిష్ఠము - మహా జ్ఞాన తరంగాలు',
    'Sage Valmiki / Sage Vasistha',
    'COSMIC WISDOM',
    '/card3.jpg',
    249.00,
    7,
    5,
    true,
    3,
    'Existential emptiness, feeling trapped in the mechanical monotony of life, and fear of time, aging, and impermanence.',
    'Young Prince Rama returns from pilgrimage disillusioned by the transient nature of youth, wealth, and worldly achievements. Sage Vasistha delivers the most comprehensive discourse on how mental projections create suffering, and how through noble self-effort (Purushartha) one awakens into the bliss of the living liberated being (Jivanmukta).',
    'The profound dialogues between Sage Vasistha and young Sri Rama addressing existential melancholy, the architecture of time and space, mental projection, and the liberation of the living master (Jivanmukti).',
    'The world is as you imagine it. Change the lens of the conditioned mind, and the very same world turns from a prison into a playground of divine play (Lila).'
);

-- Episodes for Yoga Vasistha
INSERT INTO book_episodes (book_id, episode_number, title, duration, duration_seconds, audio_url, is_free, is_published, sort_order, description)
VALUES
(3, 1, 'Part 1: The Spiritual Melancholy of Sri Rama (Vairagya Prakarana)', '45:10', 2710, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', true, true, 1, 'Sri Rama questions the value of worldly pursuits and reveals his divine dispassion.'),
(3, 2, 'Part 2: The Power of Noble Self-Effort (Purushartha)', '44:20', 2660, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 2, 'Why fatalism is a myth and how noble determination transforms destiny.'),
(3, 3, 'Part 3: The Origin of the Universe & The Web of Mental Conceptions', '48:35', 2915, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 3, 'How the mind weaves the illusion of space and time from subtle impressions.'),
(3, 4, 'Part 4: The Story of King Lavana — Time, Dreams & Alternate Realities', '50:15', 3015, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', false, true, 4, 'The classic allegory demonstrating how sixty years of life experience can happen in two seconds of awareness.'),
(3, 5, 'Part 5: The Seven Stages of Spiritual Awakening (Jnana Bhumikas)', '49:00', 2940, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 5, 'From Subheccha (good intention) to Turyaga (perpetual transcendental awareness).'),
(3, 6, 'Part 6: Dissolution of the Ego (Mano Nasha)', '53:40', 3220, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 6, 'Methods to extinguish residual latent desires (vasanas) safely and permanently.'),
(3, 7, 'Part 7: The Bliss of the Living Liberated Being (Jivanmukta)', '58:00', 3480, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', false, true, 7, 'Living in complete harmony with society while established in supreme non-dual bliss.');

-- 4. Patanjali Yoga Sutras
INSERT INTO books (id, slug, title, telugu_title, author, tag, cover_image, price, episodes_count, preview_duration_minutes, is_published, sort_order, problem_statement, summary_story, synopsis, master_quote)
VALUES (
    4,
    'patanjali-yoga-sutras',
    'Patanjali Yoga Sutras',
    'పతంజలి యోగ సూత్రములు - సాధనా రహస్యాలు',
    'Maharshi Patanjali',
    'MEDITATION SCIENCE',
    '/card4.jpg',
    199.00,
    4,
    5,
    true,
    4,
    'Inability to concentrate, restless chattering mind (monkey mind), emotional impulsivity, and lack of systematic meditation methodology.',
    'Maharshi Patanjali synthesizes the eightfold path (Ashtanga) to still the fluctuations of consciousness (Chitta Vritti Nirodha). Through master commentary, each sutra becomes an immediate psychological experiment rather than dry scholastic memorization.',
    'A classical psychological manual decoded for modern seekers. Clear guidance through Samadhi Pada (Consciousness), Sadhana Pada (Practice), Vibhuti Pada (Powers), and Kaivalya Pada (Liberation).',
    'Yoga is not holding strange physical postures; yoga is the unruffled stillness where the seer abides effortlessly in their true nature.'
);

-- Episodes for Patanjali Yoga Sutras
INSERT INTO book_episodes (book_id, episode_number, title, duration, duration_seconds, audio_url, is_free, is_published, sort_order, description)
VALUES
(4, 1, 'Episode 1: Samadhi Pada — The Definition and Stilling of Thought Waves', '40:15', 2415, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', true, true, 1, 'Yogas chitta vritti nirodha explained with daily mental observations.'),
(4, 2, 'Episode 2: Sadhana Pada — The Kriya Yoga Formula (Tapas, Svadhyaya, Ishvara Pranidhana)', '45:30', 2730, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tibetan-singing-bowl-meditation-21221.mp3', false, true, 2, 'The 3-fold engine that purifies karmic affliction and prepares the mind for deep dhyana.'),
(4, 3, 'Episode 3: Vibhuti Pada — The Art of Samyama (Concentration, Meditation, Absorption)', '47:20', 2840, 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c7a73467.mp3?filename=om-chant-spiritual-frequencies-10903.mp3', false, true, 3, 'How focused attention penetrates the subtle nature of any object or thought.'),
(4, 4, 'Episode 4: Kaivalya Pada — Absolute Freedom & The Isolation of Pure Awareness', '50:00', 3000, 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-spiritual-112197.mp3', false, true, 4, 'The final resting of consciousness in its transcendent eternal source.');

-- Reset sequence to highest ID
SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));
SELECT setval('book_episodes_id_seq', (SELECT MAX(id) FROM book_episodes));
