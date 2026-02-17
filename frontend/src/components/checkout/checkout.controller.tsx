/* =========================================================
   checkout.controller.ts (UPDATED)
   ✅ Removed email requirement
   ✅ Added phone requirement
   ✅ Razorpay prefill uses contact + optional email
   ✅ Confirmation page now passes phone instead of email
========================================================= */

import { useState } from "react";
import { useAppContext } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";
import { useLocation, useNavigate } from "react-router-dom";

function useCheckoutController() {
  const {
    productData,
    appliedCoupon,
    setAppliedCoupon,
    showCoupon,
    setShowCoupon,
    showLogin,
    cart,
    userID,
    showCart,
  } = useAppContext();

  const { createOrder, verifyPayment } = apiService();
  const { state } = useLocation() as any;
  const { data } = state ?? {};
  const { addrData, userData } = data ?? {};

  const subtotal = cart!.total_price;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = 99;
  const total = subtotal - discount;

  const [payload, setPayload] = useState<any>();
  const navigate = useNavigate();

  const collectCheckoutData = () => {
    const formData: Record<string, any> = {};

    const inputs = document.querySelectorAll(
      ".checkout-left input"
    ) as NodeListOf<HTMLInputElement>;

    inputs.forEach((input) => {
      if (input.type === "radio") {
        if (input.checked) {
          formData[input.name] = input.value;
        }
      } else {
        formData[input.name] = input.value.trim();
      }
    });

    // 🔥 REQUIRED FIELD VALIDATION (email removed, phone added)
    const requiredFields: Record<string, string> = {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      address: "Address",
      locality: "Locality",
      city: "City",
      state: "State",
      country: "Country",
      pincode: "Pincode",
      paymentMethod: "Payment Method",
    };

    for (const key in requiredFields) {
      if (!formData[key]) {
        alert(`Please enter ${requiredFields[key]}`);
        return null; // ⛔ stop execution
      }
    }

    // ✅ Basic phone validation (India-friendly, still generic)
    const phoneDigits = String(formData.phone).replace(/\D/g, "");
    if (phoneDigits.length < 8) {
      alert("Please enter a valid phone number");
      return null;
    }

    const pincodeDigits = String(formData.pincode).replace(/\D/g, "");
    if (pincodeDigits.length < 4) {
      alert("Please enter a valid pincode");
      return null;
    }

    // ✅ ALL GOOD — return payload
    return {
      customer: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: phoneDigits,
      },
      address: {
        address_line: formData.address,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: pincodeDigits,
      },
      payment_method: formData.paymentMethod,
      cart: {
        subtotal,
        discount,
        shipping,
        total,
        couponId: appliedCoupon?.code || null,
      },
    };
  };

  const handleProceed = async () => {
    try {
      const data = collectCheckoutData();

      // ⛔ validation failed, stop here
      if (!data) return;

      // 1️⃣ Create order (backend already stores everything)
      const orderRes = await createOrder({
        ...data,
        userId: userID!,
      });
      if (orderRes.errorCode !== "NO_ERROR" || !orderRes.data) {
        alert("Order creation failed");
        return;
      }

      // =========================
      // ✅ ONLINE PAYMENT
      // =========================
      if (data.payment_method === "ONLINE") {
        const rzp = new (window as any).Razorpay({
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderRes.data.amount * 100,
          currency: "INR",
          name: "Build My Body",
          description: `Order #${orderRes.data.razorpay_order_id}`,
          order_id: orderRes.data.razorpay_order_id,

          handler: async (response: any) => {
            try {
              await verifyPayment({
                order_id: orderRes.data!.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              setPayload(data);
              localStorage.setItem("sessionId", userID);

              navigate("/conformationPage", {
                state: {
                  order_id: orderRes.data!.order_id,
                  phone: data.customer.phone,
                },
              });
            } catch (e) {
              console.error("Payment verification failed:", e);
              alert("Payment verification failed. Please contact support.");
            }
          },

          prefill: {
            name: `${data.customer.first_name} ${data.customer.last_name}`,
            contact: data.customer.phone, // ✅ phone in Razorpay
          },
          theme: { color: "#3399cc" },
        });

        rzp.open();
        return;
      }

      // =========================
      // ✅ COD (NO RAZORPAY)
      // =========================
      if (data.payment_method === "COD") {
        const res = await verifyPayment({
          order_id: orderRes.data.order_id,
        });

        if (res.errorCode === "NO_ERROR") {
          setPayload(data);
          localStorage.setItem("sessionId", userID);

          navigate("/conformationPage", {
            state: {
              order_id: orderRes.data.order_id,
              phone: data.customer.phone,
            },
          });
          return;
        }

        alert("COD verification failed");
        return;
      }

      alert("Invalid payment method selected");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong");
    }
  };

  return {
    navbarLeft: [
      { path: "/about", name: "OUR JOURNEY" },
      { path: "/shop", name: "SHOP" },
      { path: "/recipe", name: "RECIPES" },
    ],
    productData: productData!.filter((item) => item.count > 0),
    appliedCoupon,
    setAppliedCoupon,
    showCoupon,
    setShowCoupon,
    showLogin,
    handleProceed,
    total,
    subtotal,
    discount,
    shipping,
    payload,
    userData,
    addrData,
    showCart,
  };
}

export { useCheckoutController };
