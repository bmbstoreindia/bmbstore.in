/* =========================================================
   checkout.page.tsx (UPDATED)
   ✅ Removed Email input
   ✅ Added Phone Number input
   ✅ Opens number keyboard on mobile (type="tel" + inputMode="numeric")
========================================================= */

import type { JSX } from "@emotion/react/jsx-runtime";
import { Navbar } from "../../common/navbar/navbar";
import { useCheckoutController } from "./checkout.controller";

import onlineOption from "../../assets/onlineOption.svg";
import truck from "../../assets/truck.svg";
import tag from "../../assets/tag.svg";

import "./checkout.css";
import { Cart } from "../cart/cart.page";

function CheckoutPage(): JSX.Element {
  const {
    navbarLeft,
    productData,
    appliedCoupon,
    setAppliedCoupon,
    showCoupon,
    setShowCoupon,
    handleProceed,
    total,
    subtotal,
    discount,
    // shipping,
    userData,
    addrData,
    showCart,
  } = useCheckoutController();

  return (
    <>
      <Navbar navbarLeft={navbarLeft} />

      <div className="page-wrapper">
        <div className="checkout-container">
          {/* LEFT */}
          <div className="checkout-left">
            <section>
              <h2 className="section-title">Contact Information</h2>
              <div className="grid-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  defaultValue={userData?.firstName || ""}
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  defaultValue={userData?.lastName || ""}
                />
              </div>

              {/* ✅ PHONE (replaces email) */}
              <input
                name="phone"
                className="full"
                placeholder="Phone Number"
                defaultValue={(userData as any)?.phone || ""}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="tel"
              />
            </section>

            <section>
              <h2 className="section-title">Address</h2>

              <input
                name="address"
                className="full"
                placeholder="Enter your Address"
                defaultValue={addrData?.address || ""}
              />

              <div className="grid-2">
                <input
                  name="locality"
                  placeholder="Locality"
                  defaultValue={addrData?.locality || ""}
                />
                {/* ✅ PINCODE numeric keyboard */}
                <input
                  name="pincode"
                  placeholder="Pin code"
                  defaultValue={addrData?.pincode || ""}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="postal-code"
                />
              </div>

              <div className="grid-3">
                <input
                  name="city"
                  placeholder="City"
                  defaultValue={addrData?.city || ""}
                />
                <input
                  name="state"
                  placeholder="State"
                  defaultValue={addrData?.state || ""}
                />
                <input
                  name="country"
                  placeholder="Country"
                  defaultValue={addrData?.country || ""}
                />
              </div>
            </section>

            <section>
              <h2 className="section-title">Payment Method</h2>

              <div className="payment-row">
                <label className="payment-card">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    defaultChecked
                  />
                  <img loading="eager" src={onlineOption} />
                  <span>Pay Online</span>
                  <span className="radio"></span>
                </label>

                <label className="payment-card">
                  <input type="radio" name="paymentMethod" value="COD" />
                  <img loading="eager" src={truck} />
                  <span>Cash On Delivery</span>
                  <span className="radio"></span>
                </label>
              </div>
            </section>

            <button className="place-order" onClick={() => handleProceed()}>
              Place Order
            </button>
          </div>

          {/* RIGHT */}
          <div className="checkout-right">
            <div className="checkout-card">
              {productData.map((item) => (
                <div className="checkoutProduct" key={item.id}>
                  <div className="product-img">
                    <img src={item.image?.[0]?.path} alt={item.header} />
                  </div>

                  <div className="product-info">
                    <p>{item.header}</p>
                    <span>
                      {item.count} × ₹{item.price}
                    </span>
                  </div>

                  <div className="product-price">₹{Number(item.price) * item.count}</div>
                </div>
              ))}

              {/* OFFERS */}
              <div className="layerThree">
                <span>offers & rewards</span>

                {!appliedCoupon ? (
                  <div className="couponBox" onClick={() => setShowCoupon(true)}>
                    <img loading="eager" src={tag} />
                    <span>Coupons</span>
                  </div>
                ) : (
                  <div className="appliedCoupon">
                    <div className="appliedCouponLeft">
                      <span className="savedText">
                        You Saved ₹{appliedCoupon.discount}
                      </span>
                      <span className="couponName">With “{appliedCoupon.code}”</span>
                    </div>

                    <span className="removeCoupon" onClick={() => setAppliedCoupon(null)}>
                      REMOVE
                    </span>
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div className="summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping</span>
                  <span>₹0</span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <p className="tax-note">Including all taxes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCart && (
        <div onMouseDown={(e) => e.stopPropagation()}>
          <Cart></Cart>
        </div>
      )}
      {showCoupon && <Cart />}
    </>
  );
}

export { CheckoutPage };
