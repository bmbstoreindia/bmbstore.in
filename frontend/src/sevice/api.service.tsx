// apiService.ts
import axiosInstance from "./axiosInstance";
import type {
  DashboardResponse,
  CartAPIResponse,
  LoginResponse,
  OtpAuthResponse,
  CheckoutData,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  GetAllOrdersResponse,
  CreateLeadRequest,
  CreateLeadResponse,
  UpdateAccountRequest,
  UpdateAccountResponse, // ✅ NEW
} from "./type";

function apiService() {
  // =========================
  // Get Dashboard
  // =========================
  async function getDashboard(): Promise<DashboardResponse> {
    try {
      const response = await axiosInstance.get<DashboardResponse>(
        "/dashboard/getDashboardData"
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        error,
      };
    }
  }



  // =========================
  // Add to Cart
  // =========================
  async function addToCart(
    product_id: string,
    weight: string,
    quantity = 1,
    sessionId: string,
    userId?: string
  ): Promise<CartAPIResponse> {
    try {

      const response = await axiosInstance.post<CartAPIResponse>(
        "/cart/addToCart",
        { product_id, quantity, sessionId, userId, weight }
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        cart: undefined,
        error,
      };
    }
  }

  // =========================
  // Remove from Cart
  // =========================
  async function removeFromCart(
    product_id: string,
    sessionId: string,
    checkDelete: boolean,
    cartId?: string,
    weightSize?: string,
  ): Promise<CartAPIResponse> {
    try {
      const response = await axiosInstance.post<CartAPIResponse>(
        "/cart/removeFromCart",
        { product_id, sessionId, cartId, weight: weightSize, checkDelete }
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        cart: undefined,
        error,
      };
    }
  }

  // =========================
  // Login / Send OTP
  // =========================
  async function loginUser(userId: string, email?: string): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/user/login", {
        userId,
        email
      });
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        message: "Failed to send OTP",
        userId: "",
      };
    }
  }

  async function otpAuth(otp: number): Promise<OtpAuthResponse> {
    try {
      const response = await axiosInstance.post<OtpAuthResponse>(
        "/user/otpAuth",
        { otp }
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        message: "OTP verification failed",
        error,
      };
    }
  }

  async function sendLead(reqbody: any) {
    try {
      const response = await axiosInstance.post(
        "/user/sendEmail",
        { reqbody }
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        message: "OTP verification failed",
        error,
      };
    }
  }

  // =========================
  // Create Order
  // =========================
  async function createOrder(
    payload: CheckoutData
  ): Promise<CreateOrderResponse> {
    try {
      const response = await axiosInstance.post<CreateOrderResponse>(
        "/payment/createOrder",
        payload
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        error,
      };
    }
  }

  // =========================
  // Verify Payment
  // =========================
  async function verifyPayment(
    payload: VerifyPaymentRequest
  ): Promise<VerifyPaymentResponse> {
    try {
      const response = await axiosInstance.post(
        "/payment/verify",
        payload
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        error,
      };
    }
  }

  // =========================
  // Get All Orders (by userId)
  // =========================
  async function getAllOrders(
    userId: string
  ): Promise<GetAllOrdersResponse> {
    try {
      const response = await axiosInstance.get<GetAllOrdersResponse>(
        `/payment/getAllOrders/${userId}`
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        error,
      };
    }
  }

  /* =========================
   Create Lead
========================= */
  async function addLead(
    payload: CreateLeadRequest
  ): Promise<CreateLeadResponse> {
    try {
      const response = await axiosInstance.post<CreateLeadResponse>(
        "user/addLead", // ✅ matches backend route
        payload
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        error,
      };
    }
  }

  // =========================
  // Update Account Details (Profile + Address)
  // =========================
  async function updateAccountDetails(
    payload: UpdateAccountRequest
  ): Promise<UpdateAccountResponse> {
    try {
      // ✅ route should match your backend route
      // e.g. POST /account/update  (change if different)
      const response = await axiosInstance.post<UpdateAccountResponse>(
        "/user/updateAccount",
        payload
      );
      return response.data;
    } catch (error: any) {
      return {
        errorCode: "Server_Error",
        message: "Failed to update account details",
        error,
      };
    }
  }


  return {
    getDashboard,
    addToCart,
    removeFromCart,
    loginUser,
    otpAuth,
    createOrder,
    verifyPayment,
    getAllOrders, // ✅ NEW
    sendLead,
    addLead,
    updateAccountDetails
  };
}

export { apiService };
