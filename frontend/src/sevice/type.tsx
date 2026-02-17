import type { Cart, Coupon } from "../context/app.context";

export type Product = {
  id: string;
  created_at: string | null;
  user_id: string;
  name: string | null;
  description: string | null;
  price: number;
  stock: number;
  product_type: string | null;
  image_urls: string[];
  priority: number;

  /* ✅ NEW */
  offers?: ProductOffer[];
};

export type ProductOffer = {
  id: string;
  min_quantity: number;      // Buy 1, Buy 2, etc.
  discount_percent: number;  // 10 = 10%
};

/* ===============================
   LEADS
================================ */

export type CreateLeadRequest = {
  phoneNumber?: string;
  email?: string;
  sessionId: string;
};

export type CreateLeadResponse = {
  errorCode: "NO_ERROR" | "Server_Error";
  message?: string;
  leadId?: string;
  error?: any;
};


export type Blog = {
  id: string;
  created_at: string | null;
  user_id: string;
  header: string;
  details: string;
  image_urls: string[];
};

// Define type for VerifyPaymentRequest
export type VerifyPaymentRequest = {
  order_id: string;

  // Razorpay fields (ONLY for ONLINE)
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};

/* ===============================
   DASHBOARD RESPONSE (Updated)
================================ */
export type DashboardResponse = {
  errorCode: "NO_ERROR" | "Server_Error";
  data?: {
    products: Product[];
    blogs: Blog[];
    cart: Cart;          // legacy cart (for old usage)
    cart_v2?: Cart;      // new API-compatible cart with weight/size support
    coupons: Coupon[];
  };
  error?: any;
  sessionId?: string; // store x-session-id from headers
};

export interface LoginResponse {
  errorCode: string;
  message?: string;
  userId?: string;
  token?: string,
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  address?: {
    address: string | null;
    locality: string | null;
    pincode: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  } | {};
  error?: any;
}

export interface ApiCartItem {
  product_id: string;
  size: string;
  quantity: number;
  price: number;               // unit discounted/current
  total_price: number;         // price * quantity
  total_original_price: number; // backend total
  offer_id?: string
}

export interface CartResponse {
  id: string;
  created_at: string;
  updated_at?: string;

  user_id: string | null;
  session_id: string | null;

  items: ApiCartItem[];

  product_count: number;
  total_price: number;
  total_original_price: number;
}

export interface CartAPIResponse {
  errorCode: string;
  cart?: CartResponse;
  error?: any;
}

export interface OtpAuthResponse {
  errorCode: string;
  message?: string;
  userId?: string;
  token?:string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
  address?: {
    address: string | null;
    locality: string | null;
    pincode: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  } | {};
  error?: any;
}

// -----------------------------
// Types for createOrder
// -----------------------------
export type CheckoutCustomer = {
  first_name: string;
  last_name: string;
  phone: string;
};

export type CheckoutAddress = {
  address_line: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type CartItems = {
  id: string;
  header: string;
  price: number;
  count: number;
};

export type CheckoutCart = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string | null;
};

export type CheckoutData = {
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  payment_method: "ONLINE" | "COD" | string;
  cart: CheckoutCart;
  userId: string;
};

export type CreateOrderResponse = {
  errorCode: string;
  data?: {
    order_id: string;
    razorpay_order_id: string;
    amount: number;
    currency: string;
    customer: CheckoutCustomer;
    address: CheckoutAddress;
    couponId: string | null;
  };
  error?: any;
};

export type VerifyPaymentResponse = {
  errorCode: "NO_ERROR" | "INVALID_SIGNATURE" | "ORDER_NOT_FOUND" | "Server_Error";
  data?: {
    order_id: string;
    payment_id: string;
    status: "paid" | "COD";
  };
  error?: any;
};

export interface OrderItem {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  product_ids: string[];
  product_count: number;

  // payment info
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status?: string;
  payment_method?: string;

  // shipping info
  shipping_status?: string;
  tracking_number?: string;
  expected_delivery?: string;
}

export interface GetAllOrdersResponse {
  errorCode?: string;
  orders?: OrderItem[];
  error?: any;
}

// sevice/type.ts

export type OrderStatus =
  | "pending"
  | "paid"
  | "cod_confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | string; // ✅ backward compatible

export type PaymentMethod = "COD" | "ONLINE" | null;
export type PaymentStatus =
  | "initiated"
  | "pending"
  | "success"
  | "failed"
  | null
  | string; // ✅ backward compatible

export interface OrderPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number | null;
  paid_at: string | null;
  razorpay_payment_id: string | null;
}

export interface OrderShippingInfo {
  status: string | null;
  tracking_number: string | null;
  location: string | null;
  expected_delivery: string | null;
}

export interface OrderItem {
  order_id: string;
  created_at: string;
  order_status: OrderStatus;
  total_amount: number;

  product_ids: string[];
  product_count: number;

  // ✅ IMPORTANT: these exist now
  payment?: OrderPaymentInfo;
  shipping?: OrderShippingInfo;

  // ✅ extra safety for old fields
  [key: string]: any;
}

// ===============================
// ✅ Add these types in ./type.ts
// ===============================

export type UserAddressItem = {
  id: string;
  address: string;
  locality: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
};

export type UpdateAccountSuccessResponse = {
  errorCode: "NO_ERROR";
  message: string;
  userId: string;
 
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  // ✅ NEW: all addresses
  addresses: UserAddressItem[];
};

export type UpdateAccountErrorResponse = {
  errorCode: "INVALID_REQUEST" | "UNAUTHORIZED" | "EMAIL_IN_USE" | "SERVER_ERROR" | "Server_Error";
  message: string;
  details?: string[];
  error?: any;
};

export type UpdateAccountResponse =
  | UpdateAccountSuccessResponse
  | UpdateAccountErrorResponse;

 export  type UpdateAccountRequest = {
  operation?: "UPDATE" | "DELETE_ADDRESS";

  // PROFILE
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;

  // ADDRESS
  address?: string;
  locality?: string;
  pincode?: string;
  city?: string;
  state?: string;
  country?: string;
};