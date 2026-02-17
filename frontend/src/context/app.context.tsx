import React, { createContext, useContext } from "react";

export type AppContextType = {
  showMenu: boolean;
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>;

  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;

  productData: Product[] | null;
  setProductData: React.Dispatch<React.SetStateAction<Product[] | null>>;

  blogData: BlogCard[] | null;
  setBlogData: React.Dispatch<React.SetStateAction<BlogCard[] | null>>;

  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;

  isLoginedIn: boolean;
  setIsLoginedIn: React.Dispatch<React.SetStateAction<boolean>>;

  toProfile: boolean;
  setToProfile: React.Dispatch<React.SetStateAction<boolean>>;


  appliedCoupon: appliedCoupon;
  setAppliedCoupon: React.Dispatch<React.SetStateAction<appliedCoupon>>;

  showCoupon: boolean;
  setShowCoupon: React.Dispatch<React.SetStateAction<boolean>>;

  showShop: boolean;
  setShowShop: React.Dispatch<React.SetStateAction<boolean>>;

  showloader: boolean;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;

  showPopup: boolean;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;

  showProductDetails: boolean;
  setShowProductDetails: React.Dispatch<React.SetStateAction<boolean>>;

  showAboutUs: boolean;
  setAboutUs: React.Dispatch<React.SetStateAction<boolean>>;

  showGetLeads: boolean;
  setSetGetLeads: React.Dispatch<React.SetStateAction<boolean>>;

  ipAddress: string;
  setIp: React.Dispatch<React.SetStateAction<string>>;

  userID: string;
  setUserID: React.Dispatch<React.SetStateAction<string>>;

  offerId: string;
  setOfferId: React.Dispatch<React.SetStateAction<string>>;

  selectedWeightIndex: number;
  setSelectedWeightIndex: React.Dispatch<React.SetStateAction<number>>;

  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;

  coupon: Coupon[] | null;
  setCoupon: React.Dispatch<React.SetStateAction<Coupon[] | null>>;

  toast: toast,
  setToast: React.Dispatch<React.SetStateAction<toast>>
};

export type toast = {
  show: boolean;
  message: string;
}

export type Coupon = {
  id: string;
  code: string;
  title: string;               // New: Coupon name/title
  description: string;         // New: Coupon description/details
  discount_percent: number;
  valid_from: string;          // ISO date string (YYYY-MM-DD)
  valid_to: string;            // ISO date string (YYYY-MM-DD)
  product_id: string | null;
  product_type: string | null;
  applicable_to_cart: boolean;
};



export type appliedCoupon = null | {
  code: string;
  discount: number;
}

export interface BlogCard {
  img: {
    path: string;
    name: string;
  };
  header: string;
  icon: {
    path: string;
    name: string;
  };
  subheader1: string;
  paragraph1: string;
  subheader2: string;
  paragraph2: string;
}
// ================= FRONTEND TYPES =================

export interface CartItem {
  product_id: string;
  size: string;                 // weight/size key (410gm, 1kg, etc.)

  quantity: number;

  price: number;                // unit discounted/current
  original_price: number;       // unit original price

  total_price: number;          // price * quantity
  total_original_price: number; // original_price * quantity

  // frontend-only enrichments
  product_name?: string;
  product_image?: string;
  product_type?: string;

  offer_id?: string;
}

export interface Cart {
  id: string;
  created_at: string;

  user_id: string | null;
  session_id: string | null;

  items: CartItem[];

  product_count: number;        // sum of all quantities
  total_price: number;          // sum of item.total_price
  total_original_price: number; // sum of item.total_original_price
}

export interface Product {
  id: string;
  header: string;
  subHeader: string;
  originalPrice: string;       // fallback price if no sizes
  price: string;               // fallback price if no sizes
  total_original_price?: string;       // fallback price if no sizes
  total_price?: string;               // fallback price if no sizes
  image: {
    path: string;
    name: string;
  }[];
  count: number;
  priority: number;
  // New: store weight info per size
  weights: {
    size: string;              // e.g., "227gm", "410gm"
    originalPrice: string;     // original price for this size
    price: string;
    quantity?: number;           // discounted price for this size
  }[];
  offers?: ProductOffer[];
}

export type ProductOffer = {
  id: string;
  minQuantity: number;      // Buy 1, Buy 2, etc.
  discountPercent: number;  // 10 = 10%
};

export const AppContext = createContext<AppContextType | undefined>(
  undefined
);


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}