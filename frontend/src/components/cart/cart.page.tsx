import type { JSX } from "@emotion/react/jsx-runtime";
import "./cart.css";
import cartIcon from "../../assets/shopping-cart.svg";
import cross from "../../assets/cross.svg";
import deleteProduct from "../../assets/deleteProduct.svg";
import plus from "../../assets/plus-black.svg";
import minus from "../../assets/minus-black.svg";
import tag from "../../assets/tag.svg";
import arrowLeft from "../../assets/arrow-left.svg";
import { useCartController } from "./cart.controller";
import { ProductCard } from "../../common/productCard/productCard";

// ====== TYPES ======
export interface CartItem {
  product_id: string;
  product_name: string;
  product_type: string;
  product_image: string;
  quantity: number;
  price: number;
  originalPrice: number;
  total_price: number;
  total_original_price: number;
  size?: string;
}

export interface Cart {
  id: string;
  created_at: string;
  user_id: string | null;
  session_id: string;
  items: CartItem[];
  product_count: number;
  total_price: number;
  total_original_price: number;
}

function Cart(): JSX.Element {
  const {
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
    setShowCart,
    appliedCoupon,
    showBillSummary,
    productData,
    coupon,
    enteredCode,
    setEnteredCode,
  } = useCartController();

  return (
    <>
      <div className="cartBox">
        {!showCoupon && (
          <div className="cart">
            {/* ================= HEADER ================= */}
            <div className="layerOne">
              <img loading="eager" src={cartIcon} alt="cart" />
              <div style={{ flex: 1 }}>
                Your Cart <span>({count} Items)</span>
              </div>
              <img loading="eager"
                src={cross}
                alt="close"
                style={{ cursor: "pointer" }}
                onClick={() => setShowCart(false)}
              />
            </div>

            {/* ================= PRODUCTS ================= */}
            <div className="layerTwo">
              {cart?.items?.length ? (
                cart.items.map((item, i) => (
                  <div key={i} className="cartProduct">
                    <img
                      src={item.product_image || ""}
                      alt={item.product_name || "product"}
                      onError={(e: any) => (e.target.src = "")}
                    />

                    <div className="details">
                      <div>
                        <span>{item.product_name}</span>
                        <img
                          src={deleteProduct}
                          alt="delete"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            updateCartQuantity(
                              item.product_id,
                              -item.quantity,
                              item.size,
                              true,
                            )
                          }
                        />
                      </div>
                      <div>
                        {!item.offer_id && <div className="cartButtons">
                          <img
                            src={minus}
                            alt="-"
                            onClick={() =>
                              updateCartQuantity(
                                item.product_id,
                                -1,
                                item.size
                              )
                            }
                          />
                          <span>{item.quantity}</span>
                          <img
                            src={plus}
                            alt="+"
                            onClick={() =>
                              updateCartQuantity(
                                item.product_id,
                                1,
                                item.size
                              )
                            }
                          />
                        </div>}

                        <div className="cartPrice">
                          <span>₹{item.total_original_price}</span>
                          <span>₹{item.total_price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noItemsMessage">No items in cart</div>
              )}
            </div>

            {/* ================= OFFERS ================= */}
            <div className="layerThree">
              <span>offers & rewards</span>

              {!appliedCoupon ? (
                <div
                  className="couponBox"
                  onClick={() => setShowCoupon(true)}
                >
                  <img loading="eager" src={tag} alt="tag" />
                  <span>Coupons</span>
                </div>
              ) : (
                <div className="appliedCoupon">
                  <div className="appliedCouponLeft">
                    <span className="savedText">
                      You Saved ₹{appliedCoupon.discount}
                    </span>
                    <span className="couponName">
                      With “{appliedCoupon.code}”
                    </span>
                    <span
                      className="viewCoupons"
                      onClick={() => setShowCoupon(true)}
                    >
                      View All Coupons
                    </span>
                  </div>

                  <span
                    className="removeCoupon"
                    onClick={() => setAppliedCoupon(null)}
                  >
                    REMOVE
                  </span>
                </div>
              )}
            </div>

            {/* ================= MOBILE PRODUCTS ================= */}
            {isMobile && (
              <div className="products">
                {productData?.slice(0, 2).map((product) => (
                  <ProductCard
                    key={product.id}
                    count={product.count}
                    name={product.header}
                    description={product.subHeader}
                    price={Number(product.price)}
                    originalPrice={Number(product.originalPrice)}
                    id={product.id}
                    image_urls={[product.image[0].path]}
                    turncate={45}
                    updateCartQuantity={(delta, weightSize, productId) =>
                      updateCartQuantity(productId, delta, weightSize)
                    }
                  />
                ))}
              </div>
            )}

            {/* ================= FOOTER ================= */}
            <div
              className="layerFour"
              style={
                showBillSummary
                  ? { flexDirection: "column", alignItems: "center" }
                  : {}
              }
            >
              {!showBillSummary && (
                <div className="layerPrice">
                  <span>₹{calculatePrice()}</span>
                  <span onClick={handleShowBillSummary}>
                    View Price Details
                  </span>
                </div>
              )}

              {showBillSummary && (
                <div className="billSummary">
                  <div className="billHeader">
                    <span className="billTitle">Bill Summary</span>
                    <span
                      className="closeIcon"
                      onClick={handleShowBillSummary}
                    >
                      ✕
                    </span>
                  </div>

                  <div className="billRow">
                    <span>Subtotal</span>
                    <span>₹{cart?.total_price}</span>
                  </div>

                  <div className="billRow">
                    <span>Discount</span>
                    <span className="discount">
                      −₹{appliedCoupon?.discount || 0}
                    </span>
                  </div>

                  <div className="billRow">
                    <span>Shipping</span>
                    <span>₹0</span>
                  </div>

                  <div className="divider"></div>

                  <div className="billTotal">
                    <span>Total</span>
                    <span>
                      ₹
                      {Math.max(
                        0,
                        (cart?.total_price || 0) -
                        (appliedCoupon?.discount || 0)
                      )}
                    </span>
                  </div>

                  <div className="taxText">Including all taxes</div>
                </div>
              )}

              <div
                className={`checkoutBtn ${count === 0 ? "disabled" : ""}`}
                style={showBillSummary ? { width: "90%" } : {}}
                onClick={count === 0 ? undefined : handleProceed}
              >
                Checkout
              </div>
            </div>
          </div>
        )}

        {/* ================= COUPON SCREEN ================= */}
        {showCoupon && (
          <div className="cart showCoupon">
            <div className="couponHeader">
              <span onClick={() => setShowCoupon(false)}>
                <img loading="eager" src={arrowLeft} alt="back" />
              </span>

              <span>Apply Coupon</span>
            </div>

            <div className="couponInputBox">
              <input
                placeholder="Enter Coupon Code"
                value={enteredCode}
                onChange={(e) =>
                  setEnteredCode(e.target.value.toUpperCase())
                }
              />
              <button>APPLY</button>
            </div>

            <div className="availableOffers">
              <span>AVAILABLE OFFERS</span>

              {coupon?.map((coupon) => (
                <div className="couponCard" key={coupon.id}>
                  <div className="couponLeft">
                    <span className="couponTag">{coupon.title}</span>
                    <span className="couponOff">
                      FLAT {coupon.discount_percent}% OFF
                    </span>
                    <p>{coupon.description}</p>
                  </div>

                  <button
                    className="applyCouponBtn"
                    onClick={() => {
                      setAppliedCoupon({
                        code: coupon.code,
                        discount: Math.round(
                          (coupon.discount_percent / 100) *
                          (cart?.total_price || 0)
                        ),
                      });
                      setShowCoupon(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export { Cart };
