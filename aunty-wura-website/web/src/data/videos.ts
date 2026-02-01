export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  youtube_id: string; // Storing ID is safer/easier for embeds
  category: 'stories' | 'songs' | 'nature' | 'grammar';
  duration: string;
  featured?: boolean;
}

export const videos: Video[] = [
  {
    id: '1',
    title: 'The Tortoise and the Wisdom Gourd',
    description: 'Why is the tortoise called "Alabahun"? Let\'s find out in this classic folktale.',
    thumbnail_url: 'https://images.unsplash.com/photo-1534145353245-c397072a2e41?q=80&w=2070&auto=format&fit=crop', // Placeholder: Tortoise/Nature
    youtube_id: 'VIDEO_ID_1', // Placeholder
    category: 'stories',
    duration: '12:45',
    featured: true,
  },
  {
    id: '2',
    title: 'Colors of the Market (Àwọn Àwọ̀)',
    description: 'Learn your colors while we visit a bustling Lagos market.',
    thumbnail_url: 'https://images.unsplash.com/photo-1599827552599-0f04c6326161?q=80&w=2070&auto=format&fit=crop', // Placeholder: Market
    youtube_id: 'VIDEO_ID_2',
    category: 'nature',
    duration: '08:20',
    featured: true,
  },
  {
    id: '3',
    title: 'Counting 1-10 with Butterflies',
    description: 'Kà wọ́n! Let\'s count the butterflies in the garden.',
    thumbnail_url: 'https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=2076&auto=format&fit=crop', // Placeholder: Butterfly
    youtube_id: 'VIDEO_ID_3',
    category: 'nature',
    duration: '05:30',
    featured: true,
  },
  {
    id: '4',
    title: 'My Body (Ara Mi)',
    description: 'Head, shoulders, knees and toes - but in Yoruba!',
    thumbnail_url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972&auto=format&fit=crop', // Placeholder: Kids playing
    youtube_id: 'VIDEO_ID_4',
    category: 'songs',
    duration: '03:15',
    featured: false,
  },
  {
    id: '5',
    title: 'Greetings for Morning and Night',
    description: 'Ẹ káàárọ̀! Ẹ káalẹ́! Learn the right way to greet your elders.',
    thumbnail_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop', // Placeholder: Greeting/Village
    youtube_id: 'VIDEO_ID_5',
    category: 'grammar',
    duration: '07:10',
    featured: false,
  },
];

export const categories = [
  { id: 'all', label: 'All Videos' },
  { id: 'stories', label: 'Stories (Àlọ́)' },
  { id: 'songs', label: 'Songs (Orin)' },
  { id: 'nature', label: 'Nature (Iseda)' },
  { id: 'grammar', label: 'Lessons (Ẹ̀kọ́)' },
] as const;
