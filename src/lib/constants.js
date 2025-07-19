export const BUSINESS_INFO = {
  brandName: "Fafresh Cultural Fashion",
  googleMapUrl: "https://share.google/JaLAipUnOJ3Ga24HU",
  instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/",
  youtubeUrl: "https://www.youtube.com/@fafreshfashion505",
  contactEmail: "info@fafreshfashion.com",
  phone: "+1 (123) 456-7890", // Replace with actual
  storeHours: {
    weekdays: "10 AM – 7 PM",
    saturday: "11 AM – 5 PM",
    sunday: "Closed"
  },
  apiKeys: {
    stripe: process.env.NEXT_PUBLIC_STRIPE_KEY,
    sendgrid: process.env.SENDGRID_API_KEY,
    analytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  },
  marketing: {
    deliveryTime: "3 WEEK FREE DELIVERY TO STORE",
    designCount: "OVER 1000 DESIGNS TO CHOOSE FROM",
    tagline: "TRADITIONAL. TRENDY. TAILORED."
  }
};

export const THEME = {
  colors: {
    primary: "#D61C4E",
    secondary: "#FF9F1C",
    text: "#333333",
    background: "#FFFFFF",
    accent: "#4A90E2"
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    headingFamily: "'Playfair Display', serif"
  },
  spacing: {
    section: "4rem",
    container: "1200px"
  }
};

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
];

export const ROUTES = {
  home: "/",
  shop: "/shop",
  customize: "/customize",
  contact: "/contact"
}; 