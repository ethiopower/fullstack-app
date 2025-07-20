// Business Information
export const BUSINESS_INFO = {
  brandName: "Fafresh Cultural Fashion",
  address: {
    street: "Inside the Global Foods, 13814 Outlet Dr",
    city: "Silver Spring",
    state: "MD",
    zipCode: "20904",
    full: "Inside the Global Foods, 13814 Outlet Dr, Silver Spring, MD 20904"
  },
  location: "Briggs Chaney Market Place",
  googleMapUrl: "https://goo.gl/maps/YOUR_ACTUAL_MAP_LINK", // Update with your actual Google Maps link from the business profile
  instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/",
  youtubeUrl: "https://www.youtube.com/watch?v=Nkdo9jCUnRw", // Replace with your actual video URL
  tiktokUrl: "https://www.tiktok.com/@fafresh.cultural.fashion",
  whatsappUrl: `https://wa.me/13013286862?text=${encodeURIComponent("Hi, I found you through your website. I'm interested in your custom fashion services.")}`,
  contactEmail: "info@fafreshfashion.com",
  phone: "(240) 704-9915",
  phoneFormatted: "+1 (240) 704-9915",
  whatsappPhone: "+1 (301) 328-6862",
  storeHours: {
    weekdays: "Open - Closes 8:30 PM",
    saturday: "Open - Closes 8:30 PM",
    sunday: "Check store hours",
    display: "Open · Closes 8:30 PM"
  },
  marketing: {
    deliveryTime: "3 WEEK FREE DELIVERY TO STORE",
    designCount: "OVER 1000 DESIGNS TO CHOOSE FROM",
    tagline: "TRADITIONAL. TRENDY. TAILORED."
  }
} as const;

// Product Categories and Designs
export const PRODUCT_CATEGORIES = {
  traditional: {
    id: "traditional",
    name: "Traditional",
    description: "Authentic traditional wear with modern elegance"
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Contemporary fashion with traditional inspiration"
  },
  wedding: {
    id: "wedding",
    name: "Wedding",
    description: "Exquisite wedding attire"
  },
  accessories: {
    id: "accessories",
    name: "Accessories",
    description: "Traditional accessories"
  }
} as const;

// Product Designs - Static data that won't change during runtime
export const PRODUCT_DESIGNS = {
  men: {
    traditional: [
      {
        id: "mt1",
        name: "Classic Traditional Suit",
        description: "Traditional men's attire with intricate embroidery",
        images: [
          {
            src: "/images/instagram/imgi_2_284916394_974871336560236_5099521758296028136_n.webp",
            alt: "Classic Traditional Suit - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg",
            alt: "Classic Traditional Suit - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 299.99
      },
      {
        id: "mt2",
        name: "Modern Traditional Suit",
        description: "Contemporary take on traditional menswear",
        images: [
          {
            src: "/images/instagram/imgi_18_285489417_338460055105426_9071859713693865775_n.webp",
            alt: "Modern Traditional Suit - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_19_285025120_129252639746382_2835252277343536846_n.webp",
            alt: "Modern Traditional Suit - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 349.99
      }
    ],
    wedding: [
      {
        id: "mw1",
        name: "Royal Wedding Suit",
        description: "Luxurious wedding attire for men",
        images: [
          {
            src: "/images/instagram/imgi_11_278184439_698488201472262_8424562580223263652_n.webp",
            alt: "Royal Wedding Suit - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_12_278236374_709188663444049_484472670772547167_n.webp",
            alt: "Royal Wedding Suit - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 499.99
      }
    ]
  },
  women: {
    traditional: [
      {
        id: "wt1",
        name: "Classic Traditional Dress",
        description: "Traditional women's dress with detailed embroidery",
        images: [
          {
            src: "/images/instagram/imgi_4_278292359_1873496682850196_1929999068388655626_n.webp",
            alt: "Classic Traditional Dress - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_5_278430911_5220485997974230_5223933189179464051_n.webp",
            alt: "Classic Traditional Dress - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 349.99
      },
      {
        id: "wt2",
        name: "Modern Traditional Dress",
        description: "Contemporary dress with traditional elements",
        images: [
          {
            src: "/images/instagram/imgi_6_278048893_1088525645049426_4195131893231909479_n.webp",
            alt: "Modern Traditional Dress - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp",
            alt: "Modern Traditional Dress - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 399.99
      }
    ],
    wedding: [
      {
        id: "ww1",
        name: "Royal Wedding Dress",
        description: "Exquisite wedding dress",
        images: [
          {
            src: "/images/instagram/imgi_8_278414402_4983576831731269_5207514082339612036_n.webp",
            alt: "Royal Wedding Dress - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_9_278196211_1514753668920561_5538798167342816339_n.webp",
            alt: "Royal Wedding Dress - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 599.99
      }
    ]
  },
  children: {
    traditional: [
      {
        id: "ct1",
        name: "Traditional Children's Outfit",
        description: "Beautiful traditional wear designed for children",
        images: [
          {
            src: "/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg",
            alt: "Traditional Children's Outfit - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_2_284916394_974871336560236_5099521758296028136_n.webp",
            alt: "Traditional Children's Outfit - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 149.99
      },
      {
        id: "ct2",
        name: "Modern Kids Traditional Wear",
        description: "Contemporary children's traditional attire",
        images: [
          {
            src: "/images/instagram/imgi_4_278292359_1873496682850196_1929999068388655626_n.webp",
            alt: "Modern Kids Traditional Wear - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_5_278430911_5220485997974230_5223933189179464051_n.webp",
            alt: "Modern Kids Traditional Wear - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 179.99
      }
    ],
    special: [
      {
        id: "cs1",
        name: "Children's Special Occasion Outfit",
        description: "Perfect for special events and celebrations",
        images: [
          {
            src: "/images/instagram/imgi_6_278048893_1088525645049426_4195131893231909479_n.webp",
            alt: "Children's Special Occasion Outfit - Front View",
            width: 800,
            height: 1200
          },
          {
            src: "/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp",
            alt: "Children's Special Occasion Outfit - Detail View",
            width: 800,
            height: 1200
          }
        ],
        basePrice: 199.99
      }
    ]
  }
} as const;

// Theme Configuration
export const THEME = {
  colors: {
    primary: "#1a4d2e",    // Elegant deep green
    secondary: "#9b2226",  // Rich burgundy
    accent: "#daa520",     // Warm gold
    black: "#1a1a1a",
    white: "#ffffff",
    text: {
      primary: "#1a1a1a",
      secondary: "#4a4a4a"
    },
    background: {
      default: "#ffffff",
      paper: "#f8f8f8"
    }
  },
  spacing: {
    section: 12
  },
  typography: {
    headingFamily: "'Cormorant Garamond', serif"
  }
} as const;

// Routes Configuration
export const ROUTES = {
  home: "/",
  shop: "/shop",
  customize: "/customize",
  contact: "/contact",
  about: "/about",
  visit: "/visit",
  cart: "/cart",
  login: "/portal/login",
  dashboard: "/portal/dashboard"
} as const;

// Type Exports
export type BusinessInfo = typeof BUSINESS_INFO;
export type ProductCategory = typeof PRODUCT_CATEGORIES[keyof typeof PRODUCT_CATEGORIES];
export type ProductDesign = typeof PRODUCT_DESIGNS;
export type Theme = typeof THEME;
export type Routes = typeof ROUTES;

// Customization Steps
export const CUSTOMIZATION_STEPS = [
  {
    number: 1,
    title: "Measurements",
    description: "Get your perfect fit with our easy measurement guide",
    icon: "measuring_tape",
    color: THEME.colors.primary
  },
  {
    number: 2,
    title: "Confirmation", 
    description: "Review and confirm your design choices",
    icon: "design_services",
    color: THEME.colors.secondary
  },
  {
    number: 3,
    title: "Pickup",
    description: "Collect your custom creation at our store", 
    icon: "store",
    color: THEME.colors.accent
  }
] as const;

// Customization Types
export type Gender = keyof typeof PRODUCT_DESIGNS;
export type Occasion = keyof typeof PRODUCT_DESIGNS[Gender];
export type Design = typeof PRODUCT_DESIGNS[Gender][Occasion][number]; 