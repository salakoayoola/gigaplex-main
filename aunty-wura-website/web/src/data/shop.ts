export interface Product {
  id: string;
  title: string;
  yoruba_title?: string;
  description: string;
  price: number;
  currency: 'NGN';
  image_url: string;
  category: 'books' | 'flashcards' | 'worksheets' | 'bundles' | 'merch';
  rating: number;
  review_count: number;
  tags: string[];
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Animals of the Rainforest',
    yoruba_title: 'Àwọn Ẹranko Igó',
    description: 'Discover the majestic animals of the Nigerian rainforest. Beautifully illustrated with scientific accuracy.',
    price: 4500,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887&auto=format&fit=crop', // Placeholder: Book
    category: 'books',
    rating: 5,
    review_count: 24,
    tags: ['Ages 7-9', 'Nature'],
  },
  {
    id: '2',
    title: 'Yoruba Alphabet Flashcards',
    yoruba_title: 'Káàbọ̀ sí Ábídí',
    description: '25 durable, laminated cards featuring the Yoruba alphabet and associated vocabulary words.',
    price: 3000,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1974&auto=format&fit=crop', // Placeholder: Cards
    category: 'flashcards',
    rating: 4.8,
    review_count: 12,
    tags: ['Beginner', 'Essentials'],
  },
  {
    id: '3',
    title: 'My Family Worksheet Pack',
    yoruba_title: 'Ẹbí Mi',
    description: 'Printable activity sheets to learn family titles and relationships. Includes coloring pages.',
    price: 1500,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1974&auto=format&fit=crop', // Placeholder: Papers
    category: 'worksheets',
    rating: 4.5,
    review_count: 8,
    tags: ['Digital Download', 'Ages 5-8'],
  },
  {
    id: '4',
    title: 'Complete Starter Bundle',
    description: 'Everything you need to start: The Alphabet Book, Flashcards, and the Greetings Worksheet.',
    price: 8500,
    currency: 'NGN',
    image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', // Placeholder: Gift box
    category: 'bundles',
    rating: 5,
    review_count: 5,
    tags: ['Best Value', 'Gift Idea'],
  },
];
