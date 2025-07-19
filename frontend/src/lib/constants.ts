export const BUSINESS_INFO = {
  brandName: "Fafresh Cultural Fashion",
  googleMapUrl: "https://share.google/JaLAipUnOJ3Ga24HU",
  instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/",
  youtubeUrl: "https://www.youtube.com/@fafreshfashion505",
  tiktokUrl: "https://www.tiktok.com/@fafresh.cultural.fashion",
  contactEmail: "fafresh@samifekadu.com",
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

export interface Routes {
  home: string;
  shop: string;
  customize: string;
  contact: string;
  about: string;
  visit: string;
  cart: string;
  login: string;
  dashboard: string;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    black: string;
    white: string;
    text: {
      primary: string;
      secondary: string;
    };
    background: {
      default: string;
      paper: string;
    };
  };
  spacing: {
    section: number;
  };
  typography: {
    headingFamily: string;
  };
}

export const THEME: Theme = {
  colors: {
    primary: "#078930",
    secondary: "#EF3340",
    accent: "#FDEF42",
    black: "#212121",
    white: "#FFFFFF",
    text: {
      primary: "#212121",
      secondary: "#666666"
    },
    background: {
      default: "#FFFFFF",
      paper: "#F5F5F5"
    }
  },
  spacing: {
    section: 12
  },
  typography: {
    headingFamily: "'Playfair Display', serif"
  }
};

export const ROUTES: Routes = {
  home: "/",
  shop: "/shop",
  customize: "/customize",
  contact: "/contact",
  about: "/about",
  visit: "/visit",
  cart: "/cart",
  login: "/portal/login",
  dashboard: "/portal/dashboard"
};

// Types
export type BusinessInfo = typeof BUSINESS_INFO; 