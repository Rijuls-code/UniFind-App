// Mock data for UniFinds mobile app

export const users = [
  {
    id: 1,
    name: 'Arjun Sharma',
    avatar: 'https://images.unsplash.com/photo-1760552069234-54b9c04bbb05?w=400',
    trustScore: 92,
    college: 'IIT Delhi',
    rating: 4.8,
    reviewCount: 34,
    memberSince: '2023'
  },
  {
    id: 2,
    name: 'Priya Mehta',
    avatar: 'https://images.unsplash.com/photo-1611181355758-089959e2cfb2?w=400',
    trustScore: 88,
    college: 'BITS Pilani',
    rating: 4.6,
    reviewCount: 28,
    memberSince: '2023'
  },
  {
    id: 3,
    name: 'Rahul Verma',
    avatar: 'https://images.pexels.com/photos/8617732/pexels-photo-8617732.jpeg?w=400',
    trustScore: 95,
    college: 'NIT Trichy',
    rating: 4.9,
    reviewCount: 42,
    memberSince: '2022'
  }
];

export const products = [
  {
    id: 1,
    title: 'MacBook Air M2 2023',
    price: 75000,
    condition: 'Like New',
    conditionScore: 95,
    category: 'Laptops',
    images: [
      'https://images.unsplash.com/photo-1592041275490-dcac548bad2e?w=800',
      'https://images.unsplash.com/photo-1627691673558-cf76f304f273?w=800'
    ],
    description: 'Gently used MacBook Air M2 with 8GB RAM and 256GB SSD. No scratches, battery health at 98%.',
    sellerId: 1,
    location: 'Delhi',
    postedDate: '2024-01-15',
    views: 234
  },
  {
    id: 2,
    title: 'iPhone 13 Pro 128GB',
    price: 52000,
    condition: 'Good',
    conditionScore: 85,
    category: 'Phones',
    images: ['https://images.unsplash.com/photo-1759863639101-d1ad4923d655?w=800'],
    description: 'iPhone 13 Pro in Sierra Blue. Minor scratches on the back. Battery health 87%.',
    sellerId: 2,
    location: 'Mumbai',
    postedDate: '2024-01-14',
    views: 189
  },
  {
    id: 3,
    title: 'Sony WH-1000XM5 Headphones',
    price: 18000,
    condition: 'Excellent',
    conditionScore: 92,
    category: 'Accessories',
    images: ['https://images.unsplash.com/photo-1627691673558-cf76f304f273?w=800'],
    description: 'Premium noise-canceling headphones. Used for 3 months.',
    sellerId: 3,
    location: 'Bangalore',
    postedDate: '2024-01-13',
    views: 156
  },
  {
    id: 4,
    title: 'Canon EOS M50 Camera',
    price: 38000,
    condition: 'Like New',
    conditionScore: 94,
    category: 'Cameras',
    images: ['https://images.unsplash.com/photo-1592041275490-dcac548bad2e?w=800'],
    description: 'Mirrorless camera with 15-45mm kit lens.',
    sellerId: 1,
    location: 'Pune',
    postedDate: '2024-01-12',
    views: 98
  },
  {
    id: 5,
    title: 'iPad Air 5th Gen 256GB',
    price: 45000,
    condition: 'Good',
    conditionScore: 88,
    category: 'Tablets',
    images: ['https://images.unsplash.com/photo-1759863639101-d1ad4923d655?w=800'],
    description: 'Space Gray iPad Air with Apple Pencil 2nd gen.',
    sellerId: 2,
    location: 'Chennai',
    postedDate: '2024-01-11',
    views: 167
  },
  {
    id: 6,
    title: 'Dell XPS 13 i7 11th Gen',
    price: 68000,
    condition: 'Excellent',
    conditionScore: 90,
    category: 'Laptops',
    images: ['https://images.unsplash.com/photo-1592041275490-dcac548bad2e?w=800'],
    description: 'Premium ultrabook with 16GB RAM and 512GB SSD.',
    sellerId: 3,
    location: 'Hyderabad',
    postedDate: '2024-01-10',
    views: 201
  }
];

export const categories = [
  'All',
  'Laptops',
  'Phones',
  'Tablets',
  'Cameras',
  'Accessories',
  'Books',
  'Furniture'
];

export const userStats = {
  bought: 12,
  sold: 8,
  rating: 4.8,
  earnings: 124500,
  savings: 89300,
  trustScore: 92
};
