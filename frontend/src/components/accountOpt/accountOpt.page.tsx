// AccountOpt.tsx
import type { JSX } from "@emotion/react/jsx-runtime";
import { Navbar } from "../../common/navbar/navbar";
import { Footer } from "../../common/footer/footer";
import { useAccOptController } from "./account.controller";
import foodLady from "../../assets/foodlady.svg";
import "./accountOpt.css";
import leftArrow from "../../assets/arrow-left.svg";
import pen from "../../assets/pen.svg";
import { Cart } from "../cart/cart.page";
import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

function formatDateLabel(createdAt?: string) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function shortOrderId(id?: string) {
  if (!id) return "";
  return id.slice(0, 8).toUpperCase();
}

function AccountOpt(): JSX.Element {
  const {
    navbarLeft,
    isMobile,
    orders,
    loading,

    showOrderDetails,
    setShowOrderDetails,
    selectedOrder,
    setSelectedOrder,

    toggleOption,
    setToggleOption,

    showEditContact,
    setShowEditContact,
    showAddAddress,
    setShowAddAddress,

    profile,
    setProfile,

    addr,
    setAddr,

    // ✅ NEW
    addresses,
    setEditingAddressId,

    // ✅ NEW: delete (match-by-fields)
    deleteAddress,
    deletingAddressKey,
    makeAddressKey,

    saveProfile,
    saveAddress,
    savingProfile,
    savingAddress,

    showMenu,
    showCart,
    navigate,
    setAboutUs,
    setShowShop,
    setShowMenu,
    setShowPopup,
    isLoginedIn,
    setIsLoginedIn
  } = useAccOptController();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMenu]);

  return (
    <>
      <Navbar navbarLeft={navbarLeft} />

      {showMenu && (
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            gap: 5,
            position: "fixed",
            background: "white",
            top: "56px",
            height: !isLoginedIn ? "28%" : "45%",
            flexDirection: "column",
            zIndex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {navbarLeft.map((item) => {
            const commonStyle = {
              textDecoration: "none",
              color: "black",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            };

            if (item.name === "OUR JOURNEY") {
              return (
                <Box key={item.path}>
                  <span
                    style={commonStyle}
                    onClick={() => {
                      navigate(item.path);
                      setAboutUs(false);
                      setShowShop(false);
                      setShowMenu(false);
                    }}
                  >
                    {item.name}
                  </span>
                </Box>
              );
            }

            if (item.name === "SHOP") {
              return (
                <Box key={item.path}>
                  <span
                    style={commonStyle}
                    onClick={() => {
                      navigate(item.path);
                      setAboutUs(false);
                      setShowPopup(true);
                      setShowMenu(false);
                    }}
                  >
                    {item.name}
                  </span>
                </Box>
              );
            }

            if (item.name === "RECIPES") {
              return (
                <Box key={item.path}>
                  <span
                    style={commonStyle}
                    onClick={() => {
                      setShowMenu(false);
                      setAboutUs(false);
                      setShowPopup(false);
                      navigate(item.path, { state: { index: 1 } });
                    }}
                  >
                    {item.name}
                  </span>
                </Box>
              );
            }

            return null;
          })}

          {/* ✅ SIGN OUT OPTION */}
          {isLoginedIn && (
            <Box>
              <span
                style={{
                  textDecoration: "none",
                  color: "red",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // 🔥 Your logout logic here
                  localStorage.clear()
                  setShowMenu(false);
                  navigate("/");
                  setIsLoginedIn(false)
                  window.location.reload();
                }}
              >
                SIGN OUT
              </span>
            </Box>
          )}
        </Box>
      )}

      <div className="orderProductWrapper">
        <div className="orderProductHeader">
          <div className="orderProductTabs">
            <span
              className={toggleOption.orders ? "active" : ""}
              onClick={() => setToggleOption({ orders: true, profile: false })}
            >
              ORDERS
            </span>
            <span
              className={toggleOption.profile ? "active" : ""}
              onClick={() => setToggleOption({ orders: false, profile: true })}
            >
              PROFILE
            </span>
          </div>
        </div>

        {/* ================= ORDERS TAB ================= */}
        {toggleOption.orders && (
          <>
            {!showOrderDetails && (
              <>
                <h2 className="orderProductTitle">MY ORDERS</h2>

                {loading && <div style={{ textAlign: "center", padding: 20 }}>Loading orders...</div>}
                {!loading && orders.length === 0 && (
                  <div style={{ textAlign: "center", padding: 20 }}>No orders found.</div>
                )}

                {!loading && orders.length !== 0 && (
                  <div className="orderProductList">
                    {orders.map((order) => {
                      const shippingStatus = order.shipping?.status ?? "Processing";
                      const isDelivered = shippingStatus.toLowerCase().includes("delivered");
                      const isOnWay = !isDelivered;
                      const createdLabel = formatDateLabel(order.created_at);

                      return (
                        <div className="orderProductCard" key={order.order_id}>
                          <div className="orderProductTop">
                            <div>
                              <p className="orderProductOrderNo">ORDER NO.</p>

                              <div className="orderStatus">
                                <div>#{shortOrderId(order.order_id)}</div>

                                <span className={`orderProductStatus ${isOnWay ? "onWay" : "delivered"}`}>
                                  {isOnWay ? "ON THE WAY" : "DELIVERED"}
                                </span>
                              </div>

                              <p className="orderProductDate">
                                {order.shipping?.expected_delivery
                                  ? `ARRIVING BY ${order.shipping.expected_delivery}`
                                  : createdLabel
                                    ? `PLACED ON ${createdLabel}`
                                    : ""}
                              </p>

                              {order.shipping?.tracking_number && (
                                <p className="orderProductDate">
                                  TRACKING: {order.shipping.tracking_number} • {order.shipping.location ?? "—"}
                                </p>
                              )}
                            </div>

                            <button
                              className="orderProductBtn"
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowOrderDetails(true);
                              }}
                            >
                              Check Details
                            </button>
                          </div>

                          <div className="orderProductItems">
                            <div>
                              <div className="orderProductItem">
                                <img loading="eager" src={foodLady} alt="product" />
                                <div>
                                  <p>Order Total</p>
                                  <span>
                                    {order.payment?.method ?? "—"} • {order.payment?.status ?? "—"}
                                  </span>
                                </div>
                              </div>

                              <div className="orderProductPrice">₹{Number(order.total_amount ?? 0)}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ================= ORDER DETAILS ================= */}
            {showOrderDetails && selectedOrder && (
              <div className="accOrdDet-wrapper">
                <div className="accOrdDet-header">
                  <img src={leftArrow} alt="back" onClick={() => setShowOrderDetails(false)} />
                  <h2 className="accTxt-orderTitle">ORDER NO. #{shortOrderId(selectedOrder.order_id)}</h2>
                </div>

                <div className="accOrdDet-content">
                  <div className="accOrdDet-left">
                    <div className="accOrdDet-card accOrdDet-highlight accOrdDet-topRow">
                      <div className="accOrdDet-topLeft">
                        <p className="accTxt-header">
                          {selectedOrder.shipping?.expected_delivery
                            ? `ARRIVING BY ${selectedOrder.shipping.expected_delivery}`
                            : "IN TRANSIT"}
                        </p>

                        <p className="accTxt-subHeader accOrdDet-shipLabel">SHIPPING PARTNER</p>
                        <p className="accTxt-orderId">DELHIVERY – {selectedOrder.shipping?.tracking_number ?? "—"}</p>
                      </div>

                      <div className="accOrdDet-topRight">
                        <span className="accOrdDet-status accOrdDet-onWay accTxt-subHeader">
                          {selectedOrder.shipping?.status ?? "Processing"}
                        </span>
                      </div>
                    </div>

                    <div className="accOrdDet-card">
                      <h4 className="accTxt-subHeader">PAYMENT</h4>
                      <p className="accTxt-body">Method: {selectedOrder.payment?.method ?? "—"}</p>
                      <p className="accTxt-body">Status: {selectedOrder.payment?.status ?? "—"}</p>
                      {selectedOrder.payment?.razorpay_payment_id && (
                        <p className="accTxt-body">Razorpay: {selectedOrder.payment.razorpay_payment_id}</p>
                      )}
                    </div>

                    <div className="accOrdDet-card">
                      <h4 className="accTxt-subHeader">TRACKING LOCATION</h4>
                      <p className="accTxt-body">{selectedOrder.shipping?.location ?? "—"}</p>
                    </div>

                    <div className="accOrdDet-card">
                      <h4 className="accTxt-subHeader">ORDER DATE</h4>
                      <p className="accTxt-body">{formatDateLabel(selectedOrder.created_at)}</p>
                    </div>
                  </div>

                  <div className="accOrdDet-right">
                    <div className="accOrdDet-summaryCard">
                      <div className="accOrdDet-summaryItem">
                        <img loading="eager" src={foodLady} alt="product" />
                        <div>
                          <p className="accTxt-body">Order Summary</p>
                          <span className="accTxt-body">Products: {selectedOrder.product_count ?? 0}</span>
                        </div>
                        <strong className="accTxt-body">₹{Number(selectedOrder.total_amount ?? 0)}</strong>
                      </div>

                      <div className="accOrdDet-price">
                        <div className="accOrdDet-total">
                          <span className="accTxt-body">Total</span>
                          <span className="accTxt-body">₹{Number(selectedOrder.total_amount ?? 0)}</span>
                        </div>

                        <p className="accOrdDet-tax accTxt-body">Including all taxes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ================= PROFILE TAB ================= */}
        {toggleOption.profile && (
          <>
            <h2 className="accProfile-title">MY PROFILE</h2>

            <div className="accProfile-card accProfile-basic">
              <div className="accProfile-basicGrid">
                <div>
                  <p className="accProfile-label">NAME</p>
                  <p className="accProfile-value">
                    {profile.firstName || profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`.trim()
                      : "________"}
                  </p>
                </div>

                <div>
                  <p className="accProfile-label">EMAIL</p>
                  <p className="accProfile-value">{profile.email || "________"}</p>
                </div>

                <div>
                  <p className="accProfile-label">MOBILE NUMBER</p>
                  <p className="accProfile-value">{profile.phone || "________"}</p>
                </div>
              </div>

              <img src={pen} alt="edit" onClick={() => setShowEditContact(true)} className="accProfile-editIcon" />
            </div>

            {/* ✅ ALL ADDRESSES */}
            <div className="accProfile-card accProfile-addressWrap">
              <div className="accProfile-addressHeader">
                <p className="accProfile-label">ADDRESSES</p>
                <button
                  className="accProfile-addBtn"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddr({ address: "", locality: "", pincode: "", city: "", state: "", country: "" });
                    setShowAddAddress(true);
                  }}
                >
                  + Add New Address
                </button>
              </div>

              <div className="accProfile-addressGrid">
                {addresses.length === 0 && (
                  <div className="accProfile-addressCard">
                    <p className="accProfile-addressText">
                      ________<br />
                      ________<br />
                      ________<br />
                      ________<br />
                      ________<br />
                      ________
                    </p>
                  </div>
                )}

                {addresses.map((a, idx) => {
                  const key = makeAddressKey(a);
                  const isDeleting = deletingAddressKey === key;

                  return (
                    <div className="accProfile-addressCard" key={a.id || key}>
                      <div
                        className="accProfile-addressTop"
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <p className="accProfile-label">
                          ADDRESS {idx + 1} {a.isDefault ? "(DEFAULT)" : ""}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {/* ✅ DELETE BUTTON (INLINE CSS) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const ok = window.confirm("Delete this address?");
                              if (!ok) return;
                              deleteAddress(a); // ✅ pass whole address (match-by-fields)
                            }}
                            disabled={isDeleting}
                            style={{
                              border: "1px solid #d32f2f",
                              background: "transparent",
                              color: "#d32f2f",
                              padding: "6px 10px",
                              borderRadius: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: isDeleting ? "not-allowed" : "pointer",
                              opacity: isDeleting ? 0.6 : 1,
                            }}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>

                          <img
                            src={pen}
                            alt="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddressId(a.id);
                              setAddr({
                                address: a.address,
                                locality: a.locality,
                                pincode: a.pincode,
                                city: a.city,
                                state: a.state,
                                country: a.country,
                              });
                              setShowAddAddress(true);
                            }}
                          />
                        </div>
                      </div>

                      <p className="accProfile-addressText">
                        {a.address || "________"}
                        <br />
                        {a.locality || "________"}
                        <br />
                        {a.city || "________"} {a.pincode ? `- ${a.pincode}` : ""}
                        <br />
                        {a.state || "________"}
                        <br />
                        {a.country || "________"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ================= MODALS ================= */}
        {showEditContact && (
          <div className="backdrop" onClick={() => setShowEditContact(false)}>
            <div className="accModal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="accModal-title">Contact Information</h3>

              <div className="accModal-grid">
                <div className="accModal-field">
                  <label>First Name</label>
                  <input
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  />
                </div>

                <div className="accModal-field">
                  <label>Last Name</label>
                  <input
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  />
                </div>

                <div className="accModal-field">
                  <label>Email Address</label>
                  <input
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div className="accModal-field accModal-mobile">
                  <label>Mobile Number</label>
                  <input
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))}
                  />
                </div>
              </div>

              <div className="accModal-actions">
                <button className="accModal-cancel" onClick={() => setShowEditContact(false)} disabled={savingProfile}>
                  Cancel
                </button>
                <button className="accModal-save" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddAddress && (
          <div className="backdrop" onClick={() => setShowAddAddress(false)}>
            <div className="accModal-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="accModal-title">Add New Address</h3>

              <div className="accModal-grid">
                <div className="accModal-field full">
                  <label>Address</label>
                  <input
                    placeholder="Enter your Address"
                    value={addr.address}
                    onChange={(e) => setAddr((a) => ({ ...a, address: e.target.value }))}
                  />
                </div>

                <div className="accModal-field">
                  <label>Locality</label>
                  <input
                    value={addr.locality}
                    onChange={(e) => setAddr((a) => ({ ...a, locality: e.target.value }))}
                  />
                </div>

                <div className="accModal-field">
                  <label>Pin code</label>
                  <input
                    value={addr.pincode}
                    onChange={(e) => setAddr((a) => ({ ...a, pincode: e.target.value }))}
                  />
                </div>

                <div className="accModal-field">
                  <label>City</label>
                  <input value={addr.city} onChange={(e) => setAddr((a) => ({ ...a, city: e.target.value }))} />
                </div>

                <div className="accModal-field">
                  <label>State</label>
                  <input value={addr.state} onChange={(e) => setAddr((a) => ({ ...a, state: e.target.value }))} />
                </div>

                <div className="accModal-field">
                  <label>Country</label>
                  <input
                    value={addr.country}
                    onChange={(e) => setAddr((a) => ({ ...a, country: e.target.value }))}
                  />
                </div>
              </div>

              <div className="accModal-actions">
                <button className="accModal-cancel" onClick={() => setShowAddAddress(false)} disabled={savingAddress}>
                  Cancel
                </button>
                <button className="accModal-save" onClick={saveAddress} disabled={savingAddress}>
                  {savingAddress ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCart && <Cart />}
      <Footer isMobile={isMobile} />
    </>
  );
}

export { AccountOpt };
