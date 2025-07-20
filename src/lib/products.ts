import { getProductImagePath } from './image-utils';

// Helper function to generate product IDs
const pid = (num: number) => `PRD${String(num).padStart(3, '0')}`;

// Helper function to generate sequential image numbers
const getSequentialImages = (startNum: number): string[] => {
  const nums = [startNum, startNum + 1, startNum + 2];
  return nums.map(num => getProductImagePath(`product_${String(num).padStart(3, '0')}`));
};

// Product Types
export type ProductCategory = 'Traditional' | 'Modern' | 'Wedding' | 'Casual' | 'Formal' | 'Accessories';
export type ProductGender = 'Men' | 'Women' | 'Children' | 'Unisex';
export type ProductColor = 'White' | 'Black' | 'Navy' | 'Gold' | 'Silver' | 'Red' | 'Green' | 'Blue' | 'Brown' | 'Beige' | 'Multi' | 'Grey';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Custom';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  gender: ProductGender;
  colors: ProductColor[];
  sizes: ProductSize[];
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  customizable?: boolean;
  tags: string[];
}

// Product Data
export const products: Product[] = [
  {
    id: pid(1),
    name: "Traditional Ethiopian Wedding Dress",
    description: "Exquisite hand-embroidered wedding dress featuring intricate Ethiopian patterns and traditional tilf designs. Perfect for your special day.",
    price: 599.99,
    originalPrice: 799.99,
    images: getSequentialImages(1),
    category: 'Wedding',
    gender: 'Women',
    colors: ['White', 'Gold', 'Silver'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    features: [
      'Hand-embroidered traditional patterns',
      'Premium quality fabric',
      'Traditional tilf border design',
      'Customizable design elements',
      'Includes matching accessories'
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    customizable: true,
    tags: ['wedding', 'bridal', 'traditional', 'formal', 'luxury']
  },
  {
    id: pid(2),
    name: "Modern Ethiopian Suit",
    description: "Contemporary Ethiopian suit combining traditional elements with modern styling. Perfect for formal occasions.",
    price: 399.99,
    originalPrice: 499.99,
    images: getSequentialImages(4),
    category: 'Formal',
    gender: 'Men',
    colors: ['Black', 'Navy', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    features: [
      'Modern tailored fit',
      'Traditional pattern accents',
      'Premium wool blend',
      'Fully lined jacket',
      'Custom sizing available'
    ],
    inStock: true,
    customizable: true,
    tags: ['suit', 'formal', 'modern', 'business', 'wedding']
  },
  {
    id: pid(3),
    name: "Traditional Habesha Kemis",
    description: "Classic Ethiopian traditional dress with intricate embroidery and timeless design.",
    price: 299.99,
    originalPrice: 399.99,
    images: getSequentialImages(7),
    category: 'Traditional',
    gender: 'Women',
    colors: ['White', 'Beige', 'Multi'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    features: [
      'Traditional hand embroidery',
      '100% cotton fabric',
      'Authentic design',
      'Comfortable fit',
      'Suitable for all occasions'
    ],
    inStock: true,
    isBestseller: true,
    customizable: true,
    tags: ['traditional', 'cultural', 'everyday', 'special occasion']
  },
  {
    id: pid(4),
    name: "Modern Fusion Dress",
    description: "Contemporary dress design blending Ethiopian elements with modern fashion trends.",
    price: 349.99,
    images: getSequentialImages(10),
    category: 'Modern',
    gender: 'Women',
    colors: ['Blue', 'Green', 'Multi'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: [
      'Modern silhouette',
      'Traditional pattern elements',
      'Premium fabric blend',
      'Versatile styling options',
      'Perfect for special events'
    ],
    inStock: true,
    isNew: true,
    customizable: true,
    tags: ['modern', 'fusion', 'special occasion', 'trendy']
  },
  {
    id: pid(5),
    name: "Contemporary Business Suit",
    description: "Professional attire with subtle Ethiopian design elements.",
    price: 449.99,
    images: getSequentialImages(13),
    category: 'Formal',
    gender: 'Men',
    colors: ['Navy', 'Grey', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: [
      'Modern cut',
      'Business appropriate',
      'Traditional accents',
      'Premium wool blend',
      'Year-round weight'
    ],
    inStock: true,
    customizable: true,
    tags: ['business', 'formal', 'professional', 'modern']
  },
  {
    id: pid(6),
    name: "Modern Evening Gown",
    description: "Elegant evening wear with contemporary Ethiopian influences.",
    price: 499.99,
    images: getSequentialImages(16),
    category: 'Formal',
    gender: 'Women',
    colors: ['Black', 'Navy', 'Red'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: [
      'Modern silhouette',
      'Luxury fabric',
      'Hand-finished details',
      'Perfect for galas',
      'Optional customization'
    ],
    inStock: true,
    isBestseller: true,
    customizable: true,
    tags: ['formal', 'evening', 'luxury', 'special occasion']
  },
  {
    id: pid(7),
    name: "Casual Modern Set",
    description: "Comfortable and stylish casual wear with Ethiopian design elements.",
    price: 199.99,
    images: getSequentialImages(19),
    category: 'Casual',
    gender: 'Unisex',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      'Relaxed fit',
      'Breathable fabric',
      'Modern design',
      'Everyday wear',
      'Easy care'
    ],
    inStock: true,
    customizable: true,
    tags: ['casual', 'comfortable', 'everyday', 'modern']
  },
  {
    id: pid(8),
    name: "Modern Festival Outfit",
    description: "Vibrant festival wear combining modern style with cultural elements.",
    price: 299.99,
    images: getSequentialImages(22),
    category: 'Modern',
    gender: 'Women',
    colors: ['Multi', 'Blue', 'Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: [
      'Festive design',
      'Vibrant colors',
      'Modern patterns',
      'Comfortable fit',
      'Perfect for celebrations'
    ],
    inStock: true,
    isNew: true,
    customizable: true,
    tags: ['festival', 'celebration', 'modern', 'colorful']
  },
  {
    id: pid(9),
    name: "Modern Casual Suit",
    description: "Relaxed suit design perfect for semi-formal occasions.",
    price: 399.99,
    images: getSequentialImages(25),
    category: 'Casual',
    gender: 'Men',
    colors: ['Grey', 'Navy', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: [
      'Relaxed fit',
      'Casual styling',
      'Versatile pieces',
      'Premium fabric',
      'Easy to dress up or down'
    ],
    inStock: true,
    customizable: true,
    tags: ['casual', 'semi-formal', 'versatile', 'modern']
  },
  {
    id: pid(10),
    name: "Contemporary Celebration Dress",
    description: "Modern take on celebration wear with elegant details.",
    price: 379.99,
    images: getSequentialImages(28),
    category: 'Modern',
    gender: 'Women',
    colors: ['Gold', 'Silver', 'Blue'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: [
      'Contemporary design',
      'Celebration-ready',
      'Premium materials',
      'Elegant details',
      'Perfect for events'
    ],
    inStock: true,
    isBestseller: true,
    customizable: true,
    tags: ['celebration', 'modern', 'elegant', 'special occasion']
  },
  {
    id: pid(11),
    name: "Children's Traditional Set",
    description: "Adorable traditional outfit set for children, perfect for cultural celebrations.",
    price: 149.99,
    originalPrice: 199.99,
    images: [
      '/images/products/product_013.jpg',
      '/images/products/product_014.jpg',
      '/images/products/product_015.jpg'
    ],
    category: 'Traditional',
    gender: 'Children',
    colors: ['White', 'Gold', 'Multi'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: [
      'Child-friendly design',
      'Comfortable materials',
      'Traditional patterns',
      'Easy to wear',
      'Matching accessories included'
    ],
    inStock: true,
    customizable: true,
    tags: ['children', 'traditional', 'celebration', 'cultural']
  },
  {
    id: pid(12),
    name: "Casual Modern Tunic",
    description: "Comfortable and stylish tunic with subtle Ethiopian design elements.",
    price: 129.99,
    images: [
      '/images/products/product_016.jpg',
      '/images/products/product_017.jpg',
      '/images/products/product_018.jpg'
    ],
    category: 'Casual',
    gender: 'Unisex',
    colors: ['Black', 'White', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      'Relaxed fit',
      'Breathable fabric',
      'Modern design',
      'Everyday wear',
      'Easy care instructions'
    ],
    inStock: true,
    isNew: true,
    tags: ['casual', 'everyday', 'comfortable', 'modern']
  },
  {
    id: pid(13),
    name: "Traditional Accessories Set",
    description: "Complete set of traditional Ethiopian accessories to complement your outfit.",
    price: 89.99,
    images: [
      '/images/products/product_019.jpg',
      '/images/products/product_020.jpg',
      '/images/products/product_021.jpg'
    ],
    category: 'Accessories',
    gender: 'Unisex',
    colors: ['Gold', 'Silver', 'Multi'],
    sizes: ['Custom'],
    features: [
      'Authentic designs',
      'Premium materials',
      'Traditional craftsmanship',
      'Matching set',
      'Gift box included'
    ],
    inStock: true,
    isBestseller: true,
    tags: ['accessories', 'traditional', 'jewelry', 'gift']
  },
  {
    id: pid(14),
    name: "Formal Evening Dress",
    description: "Elegant evening dress combining Ethiopian luxury with modern sophistication.",
    price: 449.99,
    originalPrice: 599.99,
    images: [
      '/images/products/product_022.jpg',
      '/images/products/product_023.jpg',
      '/images/products/product_024.jpg'
    ],
    category: 'Formal',
    gender: 'Women',
    colors: ['Black', 'Navy', 'Red'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    features: [
      'Luxury fabric',
      'Elegant design',
      'Hand-finished details',
      'Perfect for galas',
      'Optional customization'
    ],
    inStock: true,
    customizable: true,
    tags: ['formal', 'evening', 'luxury', 'special occasion']
  },
  {
    id: pid(15),
    name: "Modern Business Attire",
    description: "Professional business wear with subtle Ethiopian design elements.",
    price: 299.99,
    images: [
      '/images/products/product_025.jpeg',
      '/images/products/product_026.jpeg',
      '/images/products/product_027.jpeg'
    ],
    category: 'Formal',
    gender: 'Men',
    colors: ['Black', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: [
      'Professional cut',
      'Business appropriate',
      'Comfortable fit',
      'Easy maintenance',
      'Year-round fabric'
    ],
    inStock: true,
    tags: ['business', 'professional', 'formal', 'modern']
  },
  {
    id: pid(16),
    name: "Wedding Guest Collection",
    description: "Beautiful ensemble perfect for wedding celebrations and special events.",
    price: 379.99,
    originalPrice: 459.99,
    images: [
      '/images/products/product_028.jpeg',
      '/images/products/product_029.jpeg',
      '/images/products/product_030.jpeg'
    ],
    category: 'Formal',
    gender: 'Women',
    colors: ['Gold', 'Silver', 'Multi'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    features: [
      'Celebration-ready design',
      'Premium fabrics',
      'Intricate details',
      'Customizable elements',
      'Includes accessories'
    ],
    inStock: true,
    customizable: true,
    tags: ['wedding', 'celebration', 'formal', 'special occasion']
  },
  {
    id: pid(17),
    name: "Traditional Festival Dress",
    description: "Vibrant festival dress perfect for cultural celebrations and special events.",
    price: 279.99,
    images: [
      '/images/products/product_031.jpeg',
      '/images/products/product_032.jpeg',
      '/images/products/product_033.jpeg'
    ],
    category: 'Traditional',
    gender: 'Women',
    colors: ['Multi', 'Gold', 'Red'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom'],
    features: [
      'Festive design',
      'Vibrant colors',
      'Traditional patterns',
      'Comfortable fit',
      'Perfect for celebrations'
    ],
    inStock: true,
    customizable: true,
    tags: ['festival', 'celebration', 'traditional', 'cultural']
  },
  {
    id: pid(18),
    name: "Modern Casual Set",
    description: "Contemporary casual wear with Ethiopian design influences.",
    price: 199.99,
    images: [
      '/images/products/product_034.jpeg',
      '/images/products/product_035.jpeg',
      '/images/products/product_036.jpeg'
    ],
    category: 'Casual',
    gender: 'Unisex',
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      'Modern design',
      'Comfortable fabric',
      'Versatile styling',
      'Easy care',
      'Great for daily wear'
    ],
    inStock: true,
    isNew: true,
    tags: ['casual', 'modern', 'everyday', 'comfortable']
  },
  {
    id: pid(19),
    name: "Traditional Men's Set",
    description: "Complete traditional Ethiopian men's outfit for special occasions.",
    price: 449.99,
    originalPrice: 549.99,
    images: [
      '/images/products/product_037.jpeg',
      '/images/products/product_038.jpeg',
      '/images/products/product_039.jpeg'
    ],
    category: 'Traditional',
    gender: 'Men',
    colors: ['White', 'Gold', 'Multi'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Custom'],
    features: [
      'Complete outfit set',
      'Traditional design',
      'Premium materials',
      'Hand-finished details',
      'Includes accessories'
    ],
    inStock: true,
    isBestseller: true,
    customizable: true,
    tags: ['traditional', 'formal', 'special occasion', 'cultural']
  },
  {
    id: pid(20),
    name: "Children's Celebration Outfit",
    description: "Festive children's outfit for special occasions and celebrations.",
    price: 169.99,
    originalPrice: 199.99,
    images: [
      '/images/products/product_043.jpeg',
      '/images/products/product_044.jpeg',
      '/images/products/product_045.jpeg'
    ],
    category: 'Traditional',
    gender: 'Children',
    colors: ['Multi', 'Gold', 'White'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: [
      'Child-friendly design',
      'Festive details',
      'Comfortable fit',
      'Easy to wear',
      'Perfect for events'
    ],
    inStock: true,
    customizable: true,
    tags: ['children', 'celebration', 'traditional', 'special occasion']
  }
];

// Add more products here using the actual images...

export const productCategories: ProductCategory[] = [
  'Traditional',
  'Modern',
  'Wedding',
  'Casual',
  'Formal',
  'Accessories'
];

export const productGenders: ProductGender[] = [
  'Men',
  'Women',
  'Children',
  'Unisex'
];

export const productColors: ProductColor[] = [
  'White',
  'Black',
  'Navy',
  'Gold',
  'Silver',
  'Red',
  'Green',
  'Blue',
  'Brown',
  'Beige',
  'Multi'
];

export const productSizes: ProductSize[] = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Custom'
];

// Helper functions for filtering
export const filterProducts = {
  byCategory: (products: Product[], category?: ProductCategory) =>
    category ? products.filter(p => p.category === category) : products,
    
  byGender: (products: Product[], gender?: ProductGender) =>
    gender ? products.filter(p => p.gender === gender) : products,
    
  byColor: (products: Product[], color?: ProductColor) =>
    color ? products.filter(p => p.colors.includes(color)) : products,
    
  bySize: (products: Product[], size?: ProductSize) =>
    size ? products.filter(p => p.sizes.includes(size)) : products,
    
  byPrice: (products: Product[], min?: number, max?: number) =>
    products.filter(p => 
      (!min || p.price >= min) && (!max || p.price <= max)
    ),
    
  bySearch: (products: Product[], search?: string) => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  },
  
  byCustomizable: (products: Product[], customizable?: boolean) =>
    customizable ? products.filter(p => p.customizable) : products,
    
  byAvailability: (products: Product[], inStock?: boolean) =>
    inStock ? products.filter(p => p.inStock) : products
}; 