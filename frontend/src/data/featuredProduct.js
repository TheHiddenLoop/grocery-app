export const featuredProducts = [
    {
        _id: '1',
        name: 'Organic Avocados',
        description: ['Fresh, creamy Hass avocados', 'Perfect for guacamole and salads'],
        price: 6.99,
        offerPrice: 4.99,
        images: [
          'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80',
          'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=800&q=80',
          'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&q=80'
        ],
        category: 'Fruits',
        inStock: true,
        badge: 'Best Seller',
        rating: 4.5,
        reviews: 2847
    },
    {
        _id: '2',
        name: 'Fresh Strawberries',
        description: ['Sweet and juicy strawberries', '500g pack'],
        price: 7.99,
        offerPrice: 5.49,
        images: [
          'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
          'https://images.unsplash.com/photo-1543528176-61b239494933?w=800&q=80',
          'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&q=80'
        ],
        category: 'Fruits',
        inStock: true,
        badge: 'Trending',
        rating: 4.7,
        reviews: 1523
    },
    {
        _id: '3',
        name: 'Organic Whole Milk',
        description: ['Farm-fresh organic milk', '1 gallon bottle'],
        price: 5.49,
        offerPrice: 3.99,
        images: [
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80',
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80'
        ],
        category: 'Dairy',
        inStock: true,
        badge: 'Fresh',
        rating: 4.6,
        reviews: 987
    },
    {
        _id: '4',
        name: 'Artisan Sourdough Bread',
        description: ['Freshly baked sourdough', 'Crusty exterior, soft interior'],
        price: 5.99,
        offerPrice: 4.29,
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
          'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&q=80',
          'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80'
        ],
        category: 'Bakery',
        inStock: true,
        badge: 'New',
        rating: 4.8,
        reviews: 654
    },
    {
        _id: '5',
        name: 'Extra Virgin Olive Oil',
        description: ['Premium cold-pressed olive oil', '500ml bottle'],
        price: 12.99,
        offerPrice: 9.99,
        images: [
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80',
          'https://images.unsplash.com/photo-1608181715097-7d3f0b9d2b6c?w=800&q=80',
          'https://images.unsplash.com/photo-1586511925171-4f28f917648a?w=800&q=80'
        ],
        category: 'Pantry',
        inStock: true,
        badge: 'Premium',
        rating: 4.9,
        reviews: 3421
    },
    {
        _id: '6',
        name: 'Fresh Salmon Fillet',
        description: ['Wild-caught Atlantic salmon', '400g portion'],
        price: 16.99,
        offerPrice: 13.99,
        images: [
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
          'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&q=80',
          'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&q=80'
        ],
        category: 'Seafood',
        inStock: false,
        badge: 'Best Seller',
        rating: 4.4,
        reviews: 876
    },
    {
        _id: '7',
        name: 'Organic Spinach',
        description: ['Fresh baby spinach leaves', '300g pack'],
        price: 4.99,
        offerPrice: 3.49,
        images: [
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
          'https://images.unsplash.com/photo-1557844352-761f2565b576?w=800&q=80',
          'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80'
        ],
        category: 'Vegetables',
        inStock: true,
        badge: 'Fresh',
        rating: 4.3,
        reviews: 445
    },
    {
        _id: '8',
        name: 'Greek Yogurt',
        description: ['Thick and creamy Greek yogurt', '500g container'],
        price: 6.49,
        offerPrice: 4.99,
        images: [
          'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
          'https://images.unsplash.com/photo-1571212515416-fca3ed6f0b4b?w=800&q=80',
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80'
        ],
        category: 'Dairy',
        inStock: true,
        badge: 'Trending',
        rating: 4.6,
        reviews: 1234
    }
];


export const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      review: "Fresh vegetables every time! The quality is consistently excellent and everything arrives in perfect condition.",
      date: "2 days ago",
      avatar: "PS",
      image: "https://i.pravatar.cc/150?img=5"
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      review: "Delivery on time, every single order. Never had any issues with late deliveries. Highly recommended!",
      date: "1 week ago",
      avatar: "RK",
      image: "https://i.pravatar.cc/150?img=12"
    },
    {
      name: "Anita Patel",
      rating: 5,
      review: "Best prices in town with no hidden charges. Great variety of products and excellent customer service.",
      date: "2 weeks ago",
      avatar: "AP",
      image: "https://i.pravatar.cc/150?img=9"
    },
    {
      name: "Vikram Singh",
      rating: 5,
      review: "Easy return process made my experience stress-free. The app is user-friendly and shopping is a breeze!",
      date: "3 weeks ago",
      avatar: "VS",
      image: "https://i.pravatar.cc/150?img=15"
    }
  ];