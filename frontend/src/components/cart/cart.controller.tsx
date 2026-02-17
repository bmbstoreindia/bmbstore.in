import { useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext, type Cart, type CartItem, type Coupon, type Product } from "../../context/app.context";
import { apiService } from "../../sevice/api.service";
import { useNavigate } from "react-router-dom";
import type { CartResponse } from "../../sevice/type";

function useCartController() {
  const {
    cart,
    setCart,
    showCart,
    setShowCart,
    appliedCoupon,
    setAppliedCoupon,
    showCoupon,
    setShowCoupon,
    productData,
    setProductData,
    coupon,
    userID,
    showLogin,
    setShowLogin,
    isLoginedIn,
    setToProfile
  } = useAppContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { removeFromCart, addToCart, loginUser } = apiService();
  const navigate = useNavigate();

  const [showBillSummary, setShowBillSummary] = useState(false);
  const [enteredCode, setEnteredCode] = useState("");
  // -----------------------------
  // Apply coupon by input code
  // -----------------------------
  const applyInputCoupon = () => {
    if (!enteredCode) return alert("Please enter a coupon code");

    const matchedCoupon = coupon?.find(
      (c) => c.code.toUpperCase() === enteredCode.toUpperCase()
    );

    if (matchedCoupon) {
      setAppliedCoupon({
        code: matchedCoupon.code,
        discount: Math.round(
          (matchedCoupon.discount_percent / 100) * (cart?.total_price || 0)
        ),
      });
      setShowCoupon(false);
      setEnteredCode("");
    } else {
      alert("Invalid Coupon Code");
    }
  };

  // -----------------------------
  // Apply coupon by clicking a card
  // -----------------------------
  const applyCouponCard = (coupon: Coupon) => {
    setAppliedCoupon({
      code: coupon.code,
      discount: Math.round(
        (coupon.discount_percent / 100) * (cart?.total_price || 0)
      ),
    });
    setShowCoupon(false);
  };

  /** ---------------------------------------------------
   * Cart mapping
   * -------------------------------------------------- */
  function mapApiCartToCart(apiCart: CartResponse, products: Product[]): Cart {
    // ✅ sort cart items so offer items go last
    const sortedApiItems = [...(apiCart.items ?? [])].sort(
      (a, b) => Number(!!a.offer_id) - Number(!!b.offer_id)
    );

    const items: CartItem[] = sortedApiItems.map((item) => {
      const product = products.find((p) => p.id === item.product_id);

      return {
        product_id: item.product_id,
        size: item.size,
        // ✅ if offer_id comes, quantity becomes 0 (so it won’t affect product count)
        quantity: item.offer_id ? 0 : item.quantity,
        price: item.price,
        original_price: item.total_original_price,
        total_price: item.total_price,
        // ✅ include offer_id only if backend sent it
        ...(item.offer_id ? { offer_id: item.offer_id } : {}),
        total_original_price: item.total_original_price,
        product_name: product?.header ?? "",
        product_type: product?.subHeader ?? "",
        product_image: product?.image?.[0]?.path ?? "",
      };
    });

    return {
      id: apiCart.id,
      created_at: apiCart.created_at,
      user_id: apiCart.user_id,
      session_id: apiCart.session_id!,
      items,
      product_count: apiCart.product_count,
      total_price: apiCart.total_price,
      total_original_price: items.reduce((sum, i) => sum + i.total_original_price, 0),
    };
  }

  /* ================= API BASED QUANTITY UPDATE ================= */
  async function updateCartQuantity(
    productId: string,
    delta: number,
    weight?: string,
    checkDelete?: boolean
  ) {
    if (!weight || !productData) return;

    try {
      // -------------------- CALL API --------------------
      const res =
        delta > 0
          ? await addToCart(productId, weight, delta, userID)
          : await removeFromCart(
            productId,
            userID,
            checkDelete ? checkDelete : false,
            cart?.id,
            weight,
          );

      if (!res?.cart) return;

      // -------------------- NORMALIZE API CART → CONTEXT CART --------------------
      const normalizedCart = mapApiCartToCart(res.cart, productData);
      setCart(normalizedCart);

      // ✅ Precompute which productIds have offer items (for sorting)
      const offerProductIds = new Set<string | number>(
        normalizedCart.items
          .filter((ci) => !!ci.offer_id)
          .map((ci) => ci.product_id)
      );

      // -------------------- UPDATE PRODUCT DATA --------------------
      setProductData((prev) =>
        prev
          ? [...prev]
            // ✅ ONE sort only: priority first, then offer-products last (without breaking priority)
            .sort((a, b) => {
              const ap = a.priority ?? 0;
              const bp = b.priority ?? 0;

              if (ap !== bp) return ap - bp;

              const aHasOffer = offerProductIds.has(a.id);
              const bHasOffer = offerProductIds.has(b.id);

              return Number(aHasOffer) - Number(bHasOffer);
            })
            .map((product) => {
              // Filter cart items for this product
              const relatedCartItems = normalizedCart.items.filter(
                (ci) => ci.product_id === product.id
              );

              // Update weights: quantity & totals (✅ ignore offer items)
              const updatedWeights =
                product.weights?.map((w) => {
                  // ✅ pick only NON-OFFER cart item for this weight
                  const cartItem = relatedCartItems.find(
                    (ci) => ci.size === w.size && !ci.offer_id
                  );

                  const quantity = cartItem?.quantity ?? 0;

                  const unitPrice = Number(w.price);
                  const unitOriginalPrice = Number(w.originalPrice);

                  return {
                    ...w,
                    quantity,
                    price: w.price, // keep original string
                    originalPrice: w.originalPrice, // keep original string
                    total_price: (unitPrice * quantity).toString(),
                    total_original_price: (unitOriginalPrice * quantity).toString(),
                  };
                }) ?? [];

              // ✅ count should ONLY include NON-OFFER quantities
              const totalCount = updatedWeights.reduce(
                (sum, w) => sum + (w.quantity ?? 0),
                0
              );

              const totalPrice = updatedWeights.reduce(
                (sum, w) => sum + Number(w.total_price ?? 0),
                0
              );

              const totalOriginalPrice = updatedWeights.reduce(
                (sum, w) => sum + Number(w.total_original_price ?? 0),
                0
              );

              return {
                ...product,
                count: totalCount,
                weights: updatedWeights,
                total_price: totalPrice.toString(),
                total_original_price: totalOriginalPrice.toString(),
              };
            })
          : prev
      );

      // -------------------- CLOSE CART IF EMPTY --------------------
      if (normalizedCart.items.length === 0) {
        setShowCart(false);
      }
    } catch (err) {
      console.error("Cart update failed", err);
    }
  }


  /* ================= PRICE CALCULATION ================= */
  function calculatePrice() {
    if (!cart) return 0;

    let total = cart.items.reduce((acc, item) => {
      const price = Number(item.price || 0);
      return acc + item.quantity * price;
    }, 0);

    if (appliedCoupon) total -= appliedCoupon.discount;

    return Math.max(0, total);
  }

  /* ================= TOTAL ITEM COUNT ================= */
  const count = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  /* ================= EFFECTS ================= */
  useEffect(() => {
    // if (showCart) {
    //   document.documentElement.style.overflow = "hidden";
    // }
    // return () => {
    //   document.documentElement.style.overflow = "";
    // };
  }, [showCart]);

  /* ================= NAVIGATION ================= */
  async function handleProceed() {
    if (isLoginedIn) {
      const email = localStorage.getItem('email')!
      const token = localStorage.getItem('email')!
      const res = await loginUser(token,email)
      navigate("/checkout", {
        state: {
          data: {
            addrData: res.address,
            userData: res.user
          }
        }
      });
    } else {
      setToProfile(false)
      setShowLogin(true);
    }
    setShowCart(false);
  }

  function handleShowBillSummary() {
    setShowBillSummary((prev) => !prev);
  }

  return {
    handleShowBillSummary,
    handleProceed,
    calculatePrice,
    updateCartQuantity,
    setAppliedCoupon,
    setShowCoupon,
    showCoupon,
    count,
    isMobile,
    cart,
    showCart,
    setShowCart,
    appliedCoupon,
    showBillSummary,
    productData,
    coupon,
    applyCouponCard,
    applyInputCoupon,
    enteredCode,
    setEnteredCode,
    showLogin
  };
}

export { useCartController };
